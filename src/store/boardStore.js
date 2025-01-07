import { defineStore } from 'pinia';

export const useBoardStore = defineStore('boardStore', {
    state: () => {
        let storedLastBoard = 0;
        let storedBoards = [];

        try {
            storedBoards = JSON.parse(localStorage.getItem('boards')) || [];
            storedLastBoard = parseInt(localStorage.getItem('lastBoard')) || 0;
        } catch (error) {
            console.error('Fout bij het parsen van boards uit localStorage:', error);
        }

        return {
            lastBoard: storedLastBoard,
            boards: storedBoards.length
                ? storedBoards
                : [{ id: 0, title: 'Eerste Bord', valid: true, error: '', isFavorite: false, description:"" }],
            dropdownOpen: null,
        };

    },
    actions: {
        addBoard() {
            this.lastBoard++;
            this.boards.push({ id: this.lastBoard, title: '', valid: true, error: '', isFavorite: false, description: "" });
            this.saveBoards();
        },
        deleteBoard(boardId) {
            this.boards = this.boards.filter((board) => board.id !== boardId);
            this.saveBoards();
        },
        updateBoardTitle(boardId, newTitle) {
            const board = this.boards.find((board) => board.id === boardId);
            if (board) {
                board.title = newTitle.trim();
                board.valid = this.validateTitle(newTitle);
                board.error = board.valid ? '' : 'Titel mag niet leeg zijn.';
                this.saveBoards();
            }
        },
        toggleDropdown(boardId) {
            this.dropdownOpen = this.dropdownOpen === boardId ? null : boardId;
        },
        toggleFavorite(boardId) {
            const board = this.boards.find((board) => board.id === boardId);
            if (board) {
                board.isFavorite = !board.isFavorite;
                this.saveBoards();
            }
        },
        reorderBoards(newOrder) {
            this.boards = newOrder;
            this.saveBoards();
        },
        validateTitle(title) {
            return title.trim().length > 0;
        },
        saveBoards() {
            try {
                localStorage.setItem('boards', JSON.stringify(this.boards));
                localStorage.setItem('lastBoard', this.lastBoard.toString());
            } catch (error) {
                console.error('Fout bij het opslaan van data naar localStorage:', error);
            }
        },
        updateBoards(newBoards) {
            this.boards = newBoards;
            localStorage.setItem('boards', JSON.stringify(newBoards));
        },
        updateBoardDescription(boardId, newDescription) {
            const board = this.boards.find((board) => board.id === boardId);
            if (board) {
                board.description = newDescription.trim();
                this.saveBoards();
            }
        },
    },
});

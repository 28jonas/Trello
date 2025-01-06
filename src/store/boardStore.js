import { defineStore } from 'pinia';
export const useBoardStore = defineStore('boardStore', {
    state: () => ({
        lastBoard: 0,
        boards: [
            { id: 0, title: 'Eerste Bord', valid: true, error: '' },
        ],
        dropdownOpen: null, // Houdt bij welk bord de dropdown open heeft
    }),
    actions: {
        addBoard() {
            const newId = ++ this.lastBoard ;
            this.boards.push({ id: newId, title: '', valid: true, error: '' }); // Nieuw bord met lege titel
        },
        deleteBoard(boardId) {
            this.boards = this.boards.filter((board) => board.id !== boardId);
        },
        updateBoardTitle(boardId, newTitle) {
            const board = this.boards.find((board) => board.id === boardId);
            if (board) {
                board.title = newTitle.trim();
                board.valid = this.validateTitle(newTitle);
                board.error = board.valid ? '' : 'Titel mag niet leeg zijn.';
            }
        },
        toggleDropdown(boardId) {
            this.dropdownOpen = this.dropdownOpen === boardId ? null :
                boardId;
        },
        validateTitle(title) {
            // Titel moet minimaal 1 teken bevatten
            return title.trim().length > 0;
        },
    },
});
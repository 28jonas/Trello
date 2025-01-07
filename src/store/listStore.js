import { defineStore } from 'pinia';
import {useBoardStore} from "@/store/boardStore";

export const useListStore = defineStore('listStore', {
    state: () => {
        const storedLists = JSON.parse(localStorage.getItem('lists')) || [];
        const storedLastListId = parseInt(localStorage.getItem('lastListid')) || 0;

        return {
            lastListid: storedLastListId,
            lists: storedLists,
        };
    },
    actions: {
        addList(boardId, listTitle) {
            // Valideer of het board bestaat
            const boardStore = useBoardStore()
            const boardExists = boardStore.boards.some((board) => board.id === boardId);
            if (!boardExists) {
                console.error(`Board met ID ${boardId} bestaat niet.`);
                return;
            }

            const newId = ++this.lastListid;
            this.lists.push({
                id: newId,
                boardId, // Koppeling met het bord
                title: listTitle,
            });
            this.saveLists();
        },
        deleteList(listId) {
            this.lists = this.lists.filter((list) => list.id !== listId);
            this.saveLists();
        },
        getListsByBoard(boardId) {
            return this.lists.filter((list) => list.boardId === boardId);
        },
        saveLists() {
            try {
                localStorage.setItem('lists', JSON.stringify(this.lists));
                localStorage.setItem('lastListid', this.lastListid.toString());
            } catch (error) {
                console.error('Fout bij het opslaan van data naar localStorage:', error);
            }
        },
    },
});

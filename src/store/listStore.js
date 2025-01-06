import { defineStore } from 'pinia';
export const useListStore = defineStore('listStore', {
    state: () => ({
        lastListid: 0,
        lists: [], // Bevat alle lijsten
    }),
    actions: {
        // Voeg een nieuwe lijst toe aan een specifiek bord
        addList(boardId, listTitle) {
            const newId = ++ this.lastListid ;
            this.lists.push({
                id: newId,
                boardId, // Koppeling met het bord
                title: listTitle,
            });
        },
        // Verwijder een lijst op basis van de lijst-id
        deleteList(listId) {
            this.lists = this.lists.filter((list) => list.id !== listId);
        },
        // Haal alle lijsten op die gekoppeld zijn aan een specifiek bord
        getListsByBoard(boardId) {
            return this.lists.filter((list) => list.boardId === boardId);
        },
    },
});
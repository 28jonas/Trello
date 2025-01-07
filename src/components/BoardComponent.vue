<template>
  <div class="p-6">
    <!-- Titel -->
    <h1 class="text-2xl font-bold mb-4">Mijn Borden</h1>
    <!-- Container voor borden -->
    <div >
      <!-- Een individueel bord -->
      <draggable
          v-model="sortedBoards"
          group="element"
          @start="drag=true"
          @end="onDragEnd"
          item-key="id"
          class="grid grid-cols-3 gap-4"
      >
        <template #item="{element}">
          <div
              :key="element.id"
              class="board bg-white p-4 shadow rounded flex flex-col relative"
          >
            <div class="flex items-center justify-between">
              <!-- Titel van het bord -->
              <input
                  type="text"
                  class="border-b-2 focus:outline-none focus:border-blue-500 text-lg font-bold mb-2 w-full"
                  :class="{'border-red-500': !element.valid}"
                  :value="element.title"
                  placeholder="Voer een titel in..."
                  @focus="$nextTick(() => $event.target.select())"
                  @input="updateTitle(element.id, $event.target.value)"
                  @keydown.enter="leaveInput($event)"
              />
              <button @click="toggleFavorite(element.id)">
                <span v-if="element.isFavorite">⭐</span>
                <span v-else>☆</span>
              </button>
              <!-- Dropdown-menu knop -->
              <button
                  class="text-gray-500 hover:text-gray-700 ml-2"
                  @click="toggleDropdown(element.id)">
                &#x22EE;
              </button>
            </div>

            <!-- Foutmelding -->
            <p v-if="element.error" class="text-red-500 text-sm mt-1">
              {{ element.error }}
            </p>

            <!-- Dropdown-menu -->
            <div
                v-if="boardStore.dropdownOpen === element.id"
                class="absolute top-12 right-0 bg-white shadow rounded p-2 flex items-center space-x-2"
            >
              <!-- Verwijderen van bord -->
              <button
                  class="text-red-500 hover:text-red-700 flex items-center"
                  @click="deleteBoard(element.id)"
              >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="w-5 h-5"
                >
                  <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <!-- Lijsten -->
            <div class="mt-4">
              <h3 class="text-lg font-semibold mb-2">Lijsten</h3>
              <!-- Gebruik de ListComponent -->
              <ListComponent
                  v-for="list in getLists(element.id)"
                  :key="list.id"
                  :list="list"
                  @delete="deleteList(list.id)"
              />
              <!-- Invoerveld voor nieuwe lijst -->
              <div v-if="newListBoardId === element.id" class="mb-2">
                <input
                    type="text"
                    class="border-b-2 focus:outline-none focus:border-blue-500 text-lg w-full"
                    placeholder="Nieuwe lijstnaam..."
                    v-model="newListTitle"
                    @keydown.enter="saveNewList(element.id)"
                    @blur="cancelNewList"
                />
              </div>
              <!-- Knop om een nieuwe lijst toe te voegen -->
              <button
                  class="text-blue-500 hover:text-blue-700 mt-2"
                  @click="showNewListInput(element.id)"
              >
                + Nieuwe lijst toevoegen
              </button>
            </div>
          </div>
        </template>

      </draggable>
    </div>
    <!-- Knop om een nieuw bord toe te voegen -->
    <button
        class="mt-6 bg-blue-500 text-white px-4 py-2 rounded shadow"
        @click="addBoard"
    >
      + Nieuw Bord
    </button>
  </div>
</template>
<script>
import {ref, computed, nextTick} from 'vue';
import draggable from "vuedraggable";
import {useBoardStore} from '@/store/boardStore';
import {useListStore} from '@/store/listStore';
import ListComponent from './ListComponent.vue';

export default {
  name: 'BoardComponent',
  components: {
    ListComponent,
    draggable
  },
  setup() {
    // Pinia stores
    const boardStore = useBoardStore();
    const listStore = useListStore();
    // Reactive state
    const newListBoardId = ref(null); // Het bord waar een nieuwe lijst wordt toegevoegd
    const newListTitle = ref(''); // Tijdelijke titel van de nieuwe lijst
    // Computed properties
    const getLists = (boardId) =>
        computed(() => listStore.getListsByBoard(boardId)).value;
    // Methoden
    const addBoard = () => {
      boardStore.addBoard();
    };
    const updateTitle = (boardId, newTitle) => {
      boardStore.updateBoardTitle(boardId, newTitle);
    };
    const toggleDropdown = (boardId) => {
      boardStore.toggleDropdown(boardId);
    };
    const showNewListInput = (boardId) => {
      newListBoardId.value = boardId;
      newListTitle.value = '';
      nextTick(() => {
        const input = document.querySelector(
            'input[placeholder="Nieuwe lijstnaam..."]'
        );
        if (input) input.focus();
      });
    };
    const saveNewList = (boardId) => {
      if (newListTitle.value.trim()) {
        listStore.addList(boardId, newListTitle.value.trim());
      }
      newListBoardId.value = null;
      newListTitle.value = '';
    };
    const cancelNewList = () => {
      newListBoardId.value = null;
      newListTitle.value = '';
    };
    const deleteBoard = (boardId) => {
      boardStore.deleteBoard(boardId);
    };
    const deleteList = (listId) => {
      listStore.deleteList(listId);
    };
    const leaveInput = (event) => {
      const boardId = event.target.closest('.board').getAttribute('data-id');
      if (boardId) {
        const board = boardStore.boards.find((b) => b.id === parseInt(boardId));
        if (board && !board.valid) {
          board.error = 'Titel mag niet leeg zijn.';
        }
      }
      event.target.blur();
    };

    /*Draggable*/
    const drag = ref(false);

    /*Favorite*/
    function toggleFavorite(boardId) {
      boardStore.toggleFavorite(boardId)
    }

    return {
      boardStore,
      listStore,
      addBoard,
      updateTitle,
      toggleDropdown,
      showNewListInput,
      saveNewList,
      cancelNewList,
      deleteBoard,
      deleteList,
      leaveInput,
      getLists,
      newListBoardId,
      newListTitle,

      /*drag and drop*/
      drag,

      /*favorite*/
      toggleFavorite
    };
  },
  methods:{
    onDragEnd(){
      this.boardStore.reorderBoards(this.boardStore.boards)
    }
  },
  computed: {
    sortedBoards: {
      get() {
        if (!this.boardStore.boards || !Array.isArray(this.boardStore.boards)) {
          return [];
        }
        return [...this.boardStore.boards].sort((a, b) => {
          if (a.isFavorite && !b.isFavorite) return -1;
          if (!a.isFavorite && b.isFavorite) return 1;
          return 0;
        });
      },
      set(value) {
        this.boardStore.updateBoards(value);
      }
    }
},
};
</script>
<style scoped>
.board {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
}
</style>
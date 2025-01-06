<template>
  <div class="p-2 bg-gray-100 rounded mb-2 flex justify-between
items-center">
    <!-- Titel van de lijst -->
    <span>{{ list.title }}</span>
    <!-- Verwijderknop -->
    <button
        class="text-red-500 hover:text-red-700"
        @click="deleteList"
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
</template>
<script>
import { defineComponent } from 'vue';
import { useListStore } from '@/store/listStore';
export default defineComponent({
  name: 'ListComponent',
  props: {
    list: {
      type: Object,
      required: true,
    },
  },
  setup(props, { emit }) {
    const listStore = useListStore();
    const deleteList = () => {
      listStore.deleteList(props.list.id);
      emit('delete', props.list.id); // Event naar de parent-component
    };
    return {
      deleteList,
    };
  },
});
</script>
<style scoped>
/* Styling voor een lijst */
</style>
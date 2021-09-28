<template>
  <div class='q-pa-lg flex flex-center'>
    <QPagination
      v-if='lastpage>0'
      v-model='current'
      :max='lastpage'
      active-color='blue'
      boundary-links
      color='black'
      direction-links
    />
  </div>
</template>

<script lang='ts'>
import { computed, defineComponent, onMounted, ref, watch } from 'vue';
import { api } from 'boot/axios';

export default defineComponent({
  name: 'BackendPagination',
  props: {
    endpoint: {
      type: String,
      default: '/test'
    },
    data: {
      type: [Array, Object]
    },
    perPage: {
      type: [Array, Object, String, Number]
    }
  },
  setup(props, { emit }) {

    let lastpage = ref(0);
    let _data = computed({
      get: () => props.data,
      set: (value) => emit('update:data', value)
    }).value;

    let current = ref(1);


    onMounted(() => {
      getData(props.endpoint);
    });


    watch(current, (next) => {
      getData(props.endpoint, Number(next));
    });
    let _perPage = computed({
      get: () => {
        return props.perPage;
      },
      set: (value) => emit('update:perPage', value)
    }).value;

    function getData(endpoint = '', page = 1) {
      void api.get(endpoint + '?page=' + String(page)).then(({ data }) => {
        const paginationContext = data.data;
        emit('update:data', paginationContext);
        lastpage.value = paginationContext.last_page;
        console.log(paginationContext);
      });
    }

    return {
      current,
      lastpage,
      _perPage
    };
  }
});
</script>

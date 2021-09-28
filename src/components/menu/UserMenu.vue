<template>

  <q-btn no-caps flat color='primary' :label='title'>
    <q-menu>
      <q-list style='min-width: 100px'>
        <q-item class='text-black' v-for='(item,index) in mytabs' :key='index' clickable v-close-popup
                @click='toRoute(item.routeName)'>
          <q-item-section>{{ item.title }}</q-item-section>
        </q-item>
      </q-list>
    </q-menu>
  </q-btn>
</template>

<script lang='ts'>

import { defineComponent, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'UserMenu',
  props: {
    title: {
      type: String
    },
    tabs: {
      type: [Object, Array]
    }
  },
  setup(props) {

    const router = useRouter();

    let mytabs: any = ref(props.tabs);
    let myArray = ref([]);

    function toRoute(name) {
      void router.push({ name });
    }

    onMounted(() => {
      // mytabs.value.forEach((value) => {
      //   console.log(value.title);
      // });

    });


    return {
      myArray,
      mytabs,
      toRoute
    };
  }
});
</script>

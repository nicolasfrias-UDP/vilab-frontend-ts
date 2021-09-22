<template>

  <div class='text-black' v-for='(item,index) in myArray' :key='index'>
    {{item.title}}
  </div>
</template>

<script lang='ts'>

import { defineComponent, onMounted, ref } from 'vue';
import axios from 'axios';

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
    let mytabs: any = ref(props.tabs);

    let myArray= ref([])

    onMounted(() => {
      mytabs.value.forEach((value) => {
        console.log(value.title);
      });

      axios.get('/item/get')
        .then((msg) => {
          myArray.value=msg.data.data
          console.log(myArray.value);
        })
        .catch((err) => {
          console.log(err);
        });
    });


    return {
      myArray,
      mytabs
    };
  }
});
</script>

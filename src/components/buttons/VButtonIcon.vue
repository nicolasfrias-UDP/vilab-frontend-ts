<template>
  <QBtn ref='button' :round='round' :push='round' :icon='iconName' no-caps :label='text'
        class='btn-default q-mr-xs q-mb-xs bg-secondary text-white' :size='size'
        @click='doAction'
  >
    <q-tooltip v-if='tooltip' transition-duration='100'>{{ tooltip }}</q-tooltip>
  </QBtn>
</template>

<script lang='ts'>
import { defineComponent, onMounted, ref } from 'vue';
import { QBtn } from 'quasar';

export default defineComponent({
  name: 'VButton',
  props: {
    text: {
      type: String,
      required: false
    },
    iconName: {
      type: String,
      required:true
    },
    propClass: {
      type: String
    },
    round: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: 'sm'
    },
    tooltip: {
      type: String,
      default:null
    }
  },
  components: {
    QBtn
  },

  emits: ['action'],
  setup(props: any, { emit }) {
    void props;

    const button=ref();
    function doAction() {
      emit('action');
    }

    onMounted(()=>{
      // if (props.iconName) button.value.classList.add('icon')
      // console.log(button.value.icon);
    })

    return { doAction,button };
  }
});
</script>

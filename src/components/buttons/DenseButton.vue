<template>
  <QBtn v-if='iconName' :label='text' class='btn-default' dense @click='doAction'
        :icon='iconName'
  />
  <QBtn v-else :label='text' class='btn-default' dense @click='doAction'/>
</template>

<script lang='ts'>
import { defineComponent } from 'vue'
import { QBtn } from 'quasar'

export default defineComponent({
  name: 'DenseButton',
  props: {
    text: {
      type: String,
      required: true
    },
    action: {
      type: Function
    },
    iconName: {
      type: String,
      default: null
    }
  },
  extends: QBtn,
  emits: ['click'],

  setup (props: any) {
    function doAction () {
      props.action()
    }

    return { doAction }
  }
})
</script>

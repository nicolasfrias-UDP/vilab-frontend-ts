<template>
  <QBtn v-if='iconName' :icon='iconName' :label='text' class='btn-default bg-primary text-white' size='sm'
        @click='doAction'

  />
  <QBtn v-else :label='text' class='btn-default bg-primary text-white' size='md' @click='doAction'></QBtn>
</template>

<script lang='ts'>
import { defineComponent } from 'vue'
import { QBtn } from 'quasar'

export default defineComponent({
  name: 'GenericButton',
  props: {
    text: {
      type: String,
      required: true
    },
    iconName: {
      type: String,
      default: null
    }
  },
  components: {
    QBtn
  },

  emits: ['action'],
  setup (props: any, { emit }) {
    function doAction () {
      emit('action')
    }

    return { doAction }
  }
})
</script>

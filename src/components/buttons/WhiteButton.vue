<template>
  <QBtn class='bg-white text-grey-7' outlined
        size='md'
        style="border: 1px solid #DADAED" unelevated @click='doAction'
  >
    {{ text }}
    <QIcon v-if='iconName' :name="iconName"></QIcon>
  </QBtn>

</template>

<script lang='ts'>
import { defineComponent } from 'vue'
import { QBtn } from 'quasar'

export default defineComponent({
  name: 'WhiteButton',
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
  components: {
    QBtn
  },

  setup (props: any) {
    function doAction () {
      props.action()
    }

    return { doAction }
  }
})
</script>

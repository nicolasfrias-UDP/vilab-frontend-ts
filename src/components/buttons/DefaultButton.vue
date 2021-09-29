<template>
  <q-btn :label="textInput" unelevated class="btn-default" size="md" @click="action"/>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'

export default defineComponent({
  name: 'DefaultButton',
  props: {
    text: {
      type: String,
      required: true
    },
    action: {
      type: Function
    }
  },
  setup (props, { emit }) {
    let textInput = computed({
      get: () => props.text,
      set: (value) => emit('update:text', value)
    })

    return { textInput }
  }
})
</script>

<template>
  <q-input dense v-model='dateModel'  label='Periodo' title='Periodo'>
    <template v-slot:append>
      <q-icon name='event' class='cursor-pointer'>
        <q-popup-proxy ref='qDateProxy'  transition-show='scale' transition-hide='scale' title='Periodo'>
          <q-date v-model='dateModel' :options='optionsModel' years-in-month-view mask="DD/MM/YYYY"  emit-immediately>
            <div class='row items-center justify-end'>
              <q-btn v-close-popup label='Ok' color='primary' flat />
            </div>
          </q-date>
        </q-popup-proxy>
      </q-icon>
    </template>
  </q-input>
</template>

<script lang='ts'>
import { computed, defineComponent } from 'vue';

export default defineComponent({
  name: 'VButtonDate',
  props: {
    date: {
      required: true,
      type: String
    },
    options:{
      required:false,
      type:Array
    }
  },
  setup(props, { emit }) {
    const dateModel = computed({
      get() {
        return props.date;
      },
      set(value) {
        emit('update:date', value);
      }
    });
    const optionsModel = computed({
      get() {
        return props.options;
      },
      set(value) {
        emit('update:options', value);
      }
    });

    return { dateModel,optionsModel };
  }
});
</script>

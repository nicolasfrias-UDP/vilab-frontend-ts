<template>
  <q-page padding>
    <q-form ref='myform' class='q-mb-md' @submit='submit'>
      <span class='text-h5'>Crear predio</span>
      <div class='row q-col-gutter-xs '>
        <div class='col-12 col-md-5 col-sm-12'>
          <q-input rounded outlined v-model='title' label='Nombre de predio' />
        </div>
        <div class='col-12 col-md-5 col-sm-12 '>
          <q-input rounded outlined v-model='route' label='Tipo de cultivo' />
        </div>
        <div class='col-12 col-md-5 col-sm-12'>
          <q-input rounded outlined v-model='title' label='Variedades' />
        </div>
        <div class='col-12 col-md-5 col-sm-12'>
          <q-input rounded outlined v-model='route' label='Area (m2)' type='number' />
        </div>
        <div class='col-12 col-md-5 col-sm-12'>
          <q-select rounded outlined v-model='title' label='Estación metereológica' />
        </div>
        <div class='col-12 col-md-5 col-sm-12 '>

          <q-input rounded outlined v-model='route' label='Escala' type='number' />
        </div>
        <div class='col-12 col-md-5 col-sm-12 '>
          <q-select rounded outlined v-model='title' label='Comuna' />
        </div>
        <div class='col-12 col-md-5 col-sm-12'>

          <q-input rounded outlined v-model='route' label='Región' />
        </div>
        <div class='col-12 col-md-5 col-sm-12 '>
          <q-select rounded outlined v-model='route' label='Estado' :options='["activo","inactivo"]' />
        </div>

        <div class='col-12 col-md-5 col-sm-12'>
          <q-select rounded outlined v-model='route' label='Tamaño' type='number' />
        </div>
        <div class='col-12 col-md-5 col-sm-12 '>
          <q-select rounded outlined v-model='route' label='Lote' />
        </div>
      </div>
      <div class='row q-col-gutter-xs q-mt-xs'>

        <div class='col-12 col-md-5 col-sm-12 '>
          <q-input rounded outlined :rules="['date']" label='División'>
            <template v-slot:append>
              <q-icon name='event' class='cursor-pointer'>
                <q-popup-proxy ref='qDateProxy' transition-show='scale' transition-hide='scale'>
                  <q-date v-model='date'>
                    <div class='row items-center justify-end'>
                      <q-btn v-close-popup label='Close' color='primary' flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>
        <div class='col-12 col-md-5 col-sm-12'>
          <q-input rounded outlined :rules="['date']" label='Fecha de plantación'>
            <template v-slot:append>
              <q-icon name='event' class='cursor-pointer'>
                <q-popup-proxy ref='qDateProxy' transition-show='scale' transition-hide='scale'>
                  <q-date v-model='date'>
                    <div class='row items-center justify-end'>
                      <q-btn v-close-popup label='Close' color='primary' flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>
      </div>
      <q-btn type='submit' color='secondary' icon='far fa-save' label='Guardar' rounded />


    </q-form>
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  // name: 'PageName'
})
</script>

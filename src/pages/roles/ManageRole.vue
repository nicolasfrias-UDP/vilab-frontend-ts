<template>
  <q-page class='q-pa-md'>

    <q-form ref='myform' class='q-gutter-md' @submit='submit'>
      <span class='text-h5'>Crear item</span>
      <div class='row'>
        <div class='col-12 col-md-5 col-sm-12 q-mr-md q-mt-md'>
          <q-input rounded outlined v-model='title' label='Titulo' />
        </div>
        <div class='col-12 col-md-5 col-sm-12 q-mr-md q-mt-md'>

          <q-input rounded outlined v-model='route' label='Ruta' />
        </div>
      </div>

      <div class='row'>
        <div class='col-12 col-md-5 col-sm-12'>
          <q-select rounded outlined v-model='icon' label='Icono' />
        </div>
      </div>
      <q-btn type='submit' color='secondary' icon='far fa-save' label='Guardar' rounded />


    </q-form>
    <br>
    <q-separator />
    <br>
    <q-form ref='createRoleForm' class='q-gutter-md'>
      <span class='text-h5'>Crear rol</span>
      <div class='row'>

        <div class='col-12 col-md-5 col-sm-12 q-mr-md q-mt-md'>
          <q-input rounded outlined v-model='title' label='Inserte nombre' />
        </div>

      </div>
      <q-btn color='secondary' icon='mail' label='Guardar' rounded />
    </q-form>
    <br>

    <q-separator />
    <br>

    <GenericTableBackend
      :columns='columns'
      endpoint='http://localhost:8083/rest/item/get'
      :edit='edit'
      :remove='remove'
    />
    <br>

  </q-page>
</template>

<script lang='ts'>
import { defineComponent, ref } from 'vue';
import GenericTableBackend from 'components/tables/GenericTableBackend.vue';
import { api } from 'boot/axios';


const columns = [
  // {name: 'id', align: 'center', label: 'ID', field: 'id', sortable: true},
  { name: 'title', align: 'center', label: 'Titulo', field: 'title', sortable: true },
  { name: 'icon', align: 'center', label: 'Icono', field: 'icon', sortable: true },
  { name: 'route', align: 'center', label: 'Ruta', field: 'route', sortable: true },
  { name: 'actions', align: 'center', label: 'Acciones', field: 'actions', sortable: false }
];

const rows = [
  {
    title: 'Frozen Yogurt',
    icon: 'eeeeeee',
    route: 'aea'
  },
  {
    title: 'gaaaaaaaaaa',
    icon: 'eeeeeee',
    route: 'aea'
  }, {
    title: 'Faeaeat',
    icon: 'eeeeeee',
    route: 'aea'
  }
];
export default defineComponent({
  components: { GenericTableBackend },
  // name: 'PageName'
  setup() {

    const title = ref('');
    const route = ref('');
    const icon = ref('');
    const myform = ref('');

    function view(id: any) {
      console.log(id);
    }

    function edit(row) {
      console.log(row);
    }

    function remove(row){
      console.log(row);
      return new Promise((resolve)=>{
        resolve('remove')
      })
    }
    function submit(evt) {
      console.log(myform.value);
      void api.post('rest/item/save', {
        title: title.value,
        route: route.value,
        icon: icon.value
      }).then((res) => {
        console.log(res);
      });
      evt.target.submit();
    }

    return {
      myform,
      title,
      route,
      icon,
      rows,
      columns,
      view,
      submit,
      edit,
      remove
    };
  }
});
</script>

cd <template>
  <q-page class='q-pa-md'>
    <!-- content -->

    <q-form ref='myform' class='q-gutter-md' @submit='submit'>
      <span class='text-h5'>Ingresar usuario</span>
      <div class='row'>
        <div class='col-12 col-md-5 col-sm-12 q-mr-md q-mt-md'>
          <q-input rounded outlined v-model='Id' label='Id' />
        </div>
        <div class='col-12 col-md-5 col-sm-12 q-mr-md q-mt-md'>

          <q-input rounded outlined v-model='Mail' label='Mail' />
        </div>
      </div>

      <div class='row'>
        <div class='col-12 col-md-5 col-sm-12'>
          <q-input rounded outlined v-model='password' label='Password' />
        </div>
      </div>
      <q-btn @click="submit"  color='secondary' icon='far fa-save' label='Guardar' rounded />


    </q-form>
      <GenericTableBackend
        :columns='columns'
        endpoint='http://[::1]/app_vilab/index.php/Nicolas/get_users_axios'
        :filter-enable='true'
        filter-search-placeholder='Ingresar busqueda'
        :filter-search-criteria='["usu_mail"]'
        :edit='edit'
        :remove='remove'
      />


  </q-page>
  <q-form ref='myformedit' class='q-gutter-md' @submit='submit'>
  <q-dialog v-model="prompt" persistent>
        <q-card style="min-width: 350px">
          <q-card-section>
            <div class="text-h6">editar usuario</div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <q-input rounded outlined v-model="usuario" autofocus @keyup.enter="prompt = false" label="mail usuario" />
            <q-input rounded outlined v-model="password" autofocus @keyup.enter="prompt = false" label="contraseña usuario"/>
          </q-card-section>

          <q-card-actions align="right" class="text-primary">
            <q-btn flat label="Cancel" v-close-popup />
            <q-btn flat label="Editar" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>
  </q-form>  
</template>


<script lang='ts'>
import {ref, onMounted} from 'vue'
import GenericTableBackend from 'components/tables/GenericTableBackend.vue';
import { api } from 'boot/axios';
export default {
  name:'user_table',
  components: { GenericTableBackend },
  setup (){
    const id = ref('');
    const mail = ref('');
    const password = ref('');
    const myform = ref('');
    const info = ref([]);
    const filter = ref('');
    const loading = ref(false);
    const pagination = ref({
    sortBy: 'desc',
    descending: false,
    page: 1,
    rowsPerPage: 10,
    rowsNumber: 10
  });
  function edit(row) {
    console.log(row);
  }
  function remove(usu_id) {
    console.log(usu_id);
  }
  function submit(usu_id) {
    console.log(usu_id);
  }
  /*function onrequest(props){
    const { page, rowsPerPage, sortBy, descending } = props.pagination
    //const filter = props.filter
    loading.value = true
    const startRow = (page - 1) * rowsPerPage
    api.post('http://[::1]/app_vilab/index.php/Nicolas/get_users_axios',{
      start:startRow,
      rows:rowsPerPage,
      sortBy:sortBy,
      descending:descending
    })
      .then( function(response) {
        info.value = response.data
        console.log(response)
      })
      .catch(err => (console.log(err)
    ))
  }
  onMounted(()=>{
    //let vue = this;
    onrequest({
      pagination: pagination.value,
      filter: undefined
    })

  })
*/

    return {
      info,
      filter,
      loading,
      pagination,
      columns:[
        { name: 'actions', align: 'center', label: 'Acciones', field: 'actions', sortable: false},
        { name:'usu_id', label:'user id', field:'usu_id', align:'left', sortable:true,},
        {name:'usu_mail',  label:'user mail',  field:'usu_mail',  align:'left'},
        {name:'usu_pass',  label:'user password',  field:'usu_pass',  align:'left'},
        ],
      edit,
      remove,
      submit,
      prompt: ref(false),
      address: ref(''),
  //onrequest,
    };
  },

}
</script>

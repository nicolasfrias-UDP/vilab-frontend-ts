import { useRouter } from 'vue-router';


export default function(){
  const router=useRouter()


  function toRoute(name:string,params:any=''){

    void router.push({name,params})
  }

  return {toRoute}
}

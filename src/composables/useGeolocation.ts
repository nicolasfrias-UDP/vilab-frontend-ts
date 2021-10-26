import { ref } from 'vue';

export default function(){


  const geolocation= ref<any>(null)
  function initGeolocationProcess(){

    navigator.geolocation.watchPosition((location)=>{
      geolocation.value=location.coords
    })
  }

  return {geolocation,initGeolocationProcess}
}

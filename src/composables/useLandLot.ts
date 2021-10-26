import IFeatureGeoJson from 'src/interfaces/IFeatureGeoJson';
import { Ref, ref } from 'vue';

export default function() {

  const landLot= ref<IFeatureGeoJson>()

  function saveLandLot(landLotArg:IFeatureGeoJson){
      landLot.value=landLotArg
  }
  return {
    saveLandLot,
    landLot}
}

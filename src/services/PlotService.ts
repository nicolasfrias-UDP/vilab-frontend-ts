import { api } from 'boot/axios';
import { reactive, ref, Ref } from 'vue';
import { IPlotResponse } from 'src/interfaces/IPlotResponse';
import IFeatureCollectionGeoJson from 'src/interfaces/IFeatureCollectionGeoJson';

export default class PlotService {

  private plot: Ref<IPlotResponse>
  // private plots: Ref<Array<any>>;

  constructor() {
    this.plot = reactive<any>({});
  }


  getAllPlot() {
    console.log();
  }

  async getList() {
    const {data}=await api.get('predios')
    this.plot.value=data

  }

  getPlotFeatureCollection():IFeatureCollectionGeoJson  {
   return this.plot.value?.geojson_predios
  }

  getPlotResponse(){
    return this.plot
  }
  findByName() {

    console.log();
  }

}

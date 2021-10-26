import { api } from 'boot/axios';
import { reactive, Ref } from 'vue';
import { IPlotResponse } from 'src/interfaces/IPlotResponse';
import IFeatureCollectionGeoJson from 'src/interfaces/IFeatureCollectionGeoJson';
import { IPlotPaginateResponse } from 'src/interfaces/IPlotPaginateResponse';
import qs from 'qs';
import { IProjectIndexImage } from 'src/interfaces/IProjectIndexImage';

export default class useProjects {

  protected plot: Ref<IPlotResponse>;
  protected plotPaginate: Ref<IPlotPaginateResponse>;
  protected projectIndexImage: Ref<IProjectIndexImage>;
  protected projectKml: Ref<any>;

  // private plots: Ref<Array<any>>;

  constructor() {
    this.plot = reactive<any>({});
    this.plotPaginate = reactive<any>({});
    this.projectIndexImage = reactive<any>({});
    this.projectKml = reactive<any>({});
  }


  async getList() {
    const { data } = await api.get('predios');
    this.plot.value = data;

  }

  getPlotFeatureCollection(): IFeatureCollectionGeoJson {
    return this.plot.value?.geojson_predios;
  }

  getPlotResponse() {
    return this.plot;
  }

  async fetchProjectListPaginate(length, start, order_column, order_dir, search_value) {
    const { data } = await api.post('predios/predios_ajax', qs.stringify({
      length,
      start,
      order_column,
      order_dir,
      search_value
    }));
    this.plotPaginate.value = data;
  }

  async fetchProjectKml(project_id) {
    if (project_id) {
      const { data } = await api.post('predios/encontrar_kml_predio', qs.stringify({
        pre_id: project_id
      }));
      this.projectKml.value = data.predio_kml;
      return data.predio_kml;
    }
  }
  getProjectKml(){
    return this.projectKml.value
  }

}

/* eslint-disable prefer-const */
import { reactive, ref } from 'vue';
import { api } from 'boot/axios';
import qs from 'qs';
import { useStore } from 'src/store';

export default function() {

  let indexImage = reactive({ png: '', bounds: {} });
  const indicatorLandPlotLegend = ref();
  const store = useStore();

  async function fetchIndexImage(landplot_id, index, firstDate, secondDate, thirdDate) {
    if (landplot_id && index && firstDate && secondDate && thirdDate) {
      const { data } = await api.post('predios/indice_png', qs.stringify({
        pre_id: landplot_id,
        indice: index,
        fecha1: firstDate,
        fecha2: secondDate,
        fecha3: thirdDate
      }));
      if (data){
        Object.assign(indexImage, {
          // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
          png: 'data:image/png;base64,' + data.png,
          bounds: [[data.bounds.ymin, data.bounds.xmin], [data.bounds.ymax, data.bounds.xmax]]
        });
        store.commit('project/setProjectIndexImage', indexImage);
      }
    }
  }

  async function fetchIndexImageLegend(landplot_id, index, firstDate, secondDate, thirdDate) {
    if (landplot_id && index && firstDate && secondDate && thirdDate) {
      const { data } = await api.post('predios/indice_png_leyenda', qs.stringify({
        pre_id: landplot_id,
        indice: index,
        fecha1: firstDate,
        fecha2: secondDate,
        fecha3: thirdDate
      }));
      indicatorLandPlotLegend.value = data;
    }
  }


  return {
    indicatorLandPlotLegend, indexImage,
    fetchIndexImage, fetchIndexImageLegend,
  };
}

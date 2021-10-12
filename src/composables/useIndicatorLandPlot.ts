import { ref } from 'vue';
import { api } from 'boot/axios';
import qs from 'qs';

export default function() {


  const indicatorLandPlot = ref();
  const indicatorLandPlotLegend = ref();

  async function getIndicators(landplot_id, index, firstDate, secondDate, thirdDate) {
    const { data } = await api.post('predios/indice_png', qs.stringify({
      pre_id: landplot_id,
      indice: index,
      fecha1: firstDate,
      fecha2: secondDate,
      fecha3: thirdDate
    }));

    console.log(data);
    indicatorLandPlot.value = data;
  }

  async function getIndicatorsLegend(landplot_id, index, firstDate, secondDate, thirdDate) {
    const { data } = await api.post('predios/indice_png_leyenda', qs.stringify({
      pre_id: landplot_id,
      indice: index,
      fecha1: firstDate,
      fecha2: secondDate,
      fecha3: thirdDate
    }));
    console.log(data);

    indicatorLandPlotLegend.value = data;
  }

  return {
    indicatorLandPlotLegend, indicatorLandPlot,
    getIndicators, getIndicatorsLegend
  };
}

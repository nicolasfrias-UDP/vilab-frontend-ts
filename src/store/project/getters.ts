import { GetterTree } from 'vuex';
import { StateInterface } from '../index';
import { ExampleStateInterface } from './state';

const getters: GetterTree<ExampleStateInterface, StateInterface> = {

  getProjectIndexImage: (state) => state.project_index_image,


  getFirstPeriodUtc: (state) => {
    return state.selected_period_utc.firstDate;
  },
  getSecondPeriodUtc: (state) => {
    return state.selected_period_utc.secondDate;
  },
  getThirdPeriodUtc: (state) => {
    return state.selected_period_utc.thirdDate;
  },
  getPeriodAvg: (state)=> {
    return state.selected_period_utc.avg;
  }
};

export default getters;

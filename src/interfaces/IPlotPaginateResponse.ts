

export interface IPlotPaginateResponse {

  draw?: number;
  recordsTotal?: number;
  recordsFiltered?:number;
  aux_busqueda?:string;
  data?:Array<Record<any, any>>
}

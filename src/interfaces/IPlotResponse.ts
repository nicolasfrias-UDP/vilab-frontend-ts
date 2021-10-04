import IFeatureCollectionGeoJson from 'src/interfaces/IFeatureCollectionGeoJson';
import IFeatureGeoJson from 'src/interfaces/IFeatureGeoJson';


export interface IPlotResponse {
  page:string,
  geojson_predios:IFeatureCollectionGeoJson,
  predio: IFeatureGeoJson,
  predio_fechas_json:Array<any>
}

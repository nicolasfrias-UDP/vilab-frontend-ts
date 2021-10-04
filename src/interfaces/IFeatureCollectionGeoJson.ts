import IFeatureGeoJson from 'src/interfaces/IFeatureGeoJson';

export default interface IFeatureCollectionGeoJson {

  type?: string,
  crs?: Record<string, any>,
  features?: Array<IFeatureGeoJson>
}

export default interface IFeatureGeoJson {

  type?: string,
  properties?: Record<string, any>,
  geometry?: Array<{ type, coordinates }>
}

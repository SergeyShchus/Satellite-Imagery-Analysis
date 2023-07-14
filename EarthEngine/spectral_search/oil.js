/* download images 2020-2021 years, filter clouds and set visualisation params*/

var start='2020-04-01'
var end='2021-07-01'

var bands = ['B2', 'B3', 'B4','B5','B6','B7','B8', 'B8A','B11','B12']

var sentinel = ee.ImageCollection('COPERNICUS/S2_SR')
                  .filter(ee.Filter.date(start, end))
                  .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 10))
                  .mean()
                  .select(bands)

var s_rgb = {
  min: 0.0,
  max: 3000,
  bands:['B4', 'B3', 'B2'],
  opacity:1
};

/*filter satellite bands and create variable spectral index*/

var ndvi=sentinel.normalizedDifference(['B8','B4'])
                  .select(['nd'],['ndvi'])

var ndwi=sentinel.normalizedDifference(['B3','B8'])
                  .select(['nd'],['ndwi'])

/*filter water and trees with NDVI and NDWI index. NDVI>0,2 and NDWI>0.3*/


var image=sentinel.updateMask(ndwi.lt(0.3))
                  .updateMask(ndvi.lt(0.2))
                  .addBands(ndvi)
                  .select(bands)

/*Generated label data layers
oil, agriculture, urban
*/

/*taking random samples of points from within these polygons with randomPoints function
*/

var oil_points=ee.FeatureCollection.randomPoints(oil, 3000).map(function(i){
  return i.set({'class': 0})})
  
var urban_points=ee.FeatureCollection.randomPoints(urban, 1000).map(function(i){
  return i.set({'class': 1})})
  
var agriculture_points=ee.FeatureCollection.randomPoints(agriculture, 2000).map(function(i){
  return i.set({'class': 2})})


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

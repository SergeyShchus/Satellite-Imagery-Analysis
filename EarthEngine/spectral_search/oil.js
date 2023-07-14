/*Resourse - https://oballinger.github.io/projects/makeshift_refineries/RojavaRefineries.html*/

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

/*create one feature collection called “sample”, which will contain all three sets of points.*/

var sample=ee.FeatureCollection([oil_points,
                                  urban_points,
                                  agriculture_points
                                  ])
                                  .flatten()
                                  .randomColumn();

/*split featureCollection into two: one used for training the model, and one used for validation. We’ll use a 70-30 split.*/

var split=0.7
var training_sample = sample.filter(ee.Filter.lt('random', split));
var validation_sample = sample.filter(ee.Filter.gte('random', split));

/*assign a the band values from an image as properties to feature collection*/

var training = image.sampleRegions({
  collection: training_sample,
  properties: ['class'],
  scale: 10,
});

var validation = image.sampleRegions({
  collection: validation_sample,
  properties: ['class'],
  scale: 10
});

/*Train model
Random forest - 500 trees*/

var model = ee.Classifier.smileRandomForest(500)
                          .train(training, 'class');

/*Prediction*/

var prediction = image.classify(model)

/*prediction is a raster which contains one of three values (0: oil, 1: urban, 2: agriculture).
Isolate the regions in this raster that have a value of 0, and add them in red to the map */

var oil_prediction=prediction.updateMask(prediction.eq(0))

Map.addLayer(oil_prediction, {palette:'red'}, 'Predicted Oil Conamination')

/*Validation
take the validation featureCollection containing our labeled points, and have our model classify it */

var validated = validation.classify(model);

/*Now the validated variable is a featureCollection which contains both manual labels and predicted labels from our model. 
Compare the manual labels to the predicted output to get a sense of how well our model is performing. This is called a Confusion Matrix (or an Error Matrix)*/

var testAccuracy = validated.errorMatrix('class', 'classification');

print('Confusion Matrix ', testAccuracy);

/*model’s overall accuracy*/

print('Validation overall accuracy: ', testAccuracy.accuracy())

/*convert our raster into a series of points using the reduceToVectors function*/

var vectors = oil_prediction.reduceToVectors({
  geometry: AOI,
  scale: 10,
  geometryType: 'centroid',
  eightConnected: true,
  labelProperty: 'classification',
  maxPixels:1653602926
  }).filterBounds(AOI)

Map.addLayer(vectors.style({color: 'black', fillColor: '#00f2ff', pointSize:5}),{},'Oil Contamination Points',false)

var table = ee.FeatureCollection(
  'projects/ee-kandelsubarna56/assets/shapefile'
);

var chitwan = table.filter(
  ee.Filter.eq('DISTRICT', 'CHITWAN')
);

print('Chitwan:', chitwan);
print('Number of Chitwan features:', chitwan.size());

Map.centerObject(chitwan, 10);
Map.addLayer(chitwan, {color: 'red'}, 'Chitwan');

var s2 = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
  .filterBounds(chitwan)
  .filterDate('2024-01-01', '2026-01-01')
  .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 30));

print('Number of Sentinel-2 images:', s2.size());

function maskClouds(image) {
  var scl = image.select('SCL');

  var mask = scl.eq(4)
    .or(scl.eq(5))
    .or(scl.eq(6))
    .or(scl.eq(7));

  return image.updateMask(mask);
}

var composite = s2
  .map(maskClouds)
  .median()
  .clip(chitwan);

var ndvi = composite
  .normalizedDifference(['B8', 'B4'])
  .rename('NDVI');

Map.addLayer(
  ndvi,
  {
    min: -1,
    max: 1,
    palette: [
      'blue',
      'white',
      'yellow',
      'lightgreen',
      'green',
      'darkgreen'
    ]
  },
  'Chitwan NDVI'
);

var stats = ndvi.reduceRegion({
  reducer: ee.Reducer.mean()
    .combine({
      reducer2: ee.Reducer.minMax(),
      sharedInputs: true
    }),
  geometry: chitwan.geometry(),
  scale: 10,
  maxPixels: 1e13
});

print('NDVI statistics:', stats);

var statisticsTable = ee.FeatureCollection([
  ee.Feature(null, {
    statistic: 'Mean NDVI',
    value: stats.get('NDVI_mean')
  }),
  ee.Feature(null, {
    statistic: 'Minimum NDVI',
    value: stats.get('NDVI_min')
  }),
  ee.Feature(null, {
    statistic: 'Maximum NDVI',
    value: stats.get('NDVI_max')
  })
]);

Export.image.toDrive({
  image: ndvi,
  description: 'Chitwan_NDVI_2024_2025',
  folder: 'GEE',
  fileNamePrefix: 'Chitwan_NDVI_2024_2025',
  region: chitwan.geometry(),
  scale: 10,
  maxPixels: 1e13,
  fileFormat: 'GeoTIFF'
});

Export.table.toDrive({
  collection: statisticsTable,
  description: 'Chitwan_NDVI_Statistics',
  folder: 'GEE',
  fileNamePrefix: 'Chitwan_NDVI_Statistics',
  fileFormat: 'CSV'
});

Export.table.toDrive({
  collection: chitwan,
  description: 'Chitwan_Boundary',
  folder: 'GEE',
  fileNamePrefix: 'Chitwan_Boundary',
  fileFormat: 'GeoJSON'
});
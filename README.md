# Chitwan District NDVI Analysis

## Overview

This project calculates and maps the Normalized Difference Vegetation Index (NDVI) for Chitwan District, Nepal using Sentinel-2 satellite imagery and Google Earth Engine.

The workflow includes administrative boundary extraction, Sentinel-2 image filtering, cloud masking, image compositing, NDVI calculation, statistical analysis, and data export.

## Study Area

**Chitwan District, Nepal**

The Chitwan boundary was extracted from a Nepal administrative boundary dataset using the `DISTRICT` attribute.

## Objectives

- Extract Chitwan District from the administrative boundary dataset
- Process Sentinel-2 satellite imagery
- Remove clouds and unwanted pixels
- Create a median satellite image composite
- Calculate NDVI
- Calculate NDVI statistics
- Export the NDVI raster and related datasets

## Data

| Dataset | Description |
|---|---|
| Satellite | Sentinel-2 |
| Dataset | Sentinel-2 Surface Reflectance Harmonized |
| Period | 2024–2025 |
| Spatial Resolution | 10 m |
| Study Area | Chitwan District, Nepal |
| Platform | Google Earth Engine |

## Methodology

The workflow follows these steps:

1. Load the Nepal administrative boundary dataset.
2. Select Chitwan District using the `DISTRICT` field.
3. Retrieve Sentinel-2 imagery covering Chitwan.
4. Filter images based on cloud percentage.
5. Apply cloud masking using the Sentinel-2 Scene Classification Layer (SCL).
6. Create a median image composite.
7. Calculate NDVI using Sentinel-2 bands B8 and B4.
8. Calculate mean, minimum, and maximum NDVI.
9. Export the NDVI raster as GeoTIFF.
10. Export NDVI statistics as CSV.
11. Export the Chitwan boundary as GeoJSON.

## NDVI Calculation

NDVI is calculated using:

```text
NDVI = (NIR - Red) / (NIR + Red)
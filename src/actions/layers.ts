import * as actions from '../consts/action-types';
import * as layerType from "../consts/layer-types";

// ADD RASTER
export const addRaster = (world: string, name: string, href: string) => ({
    type: actions.ADD_RASTER,
    name: name.trim(),
    id: `${world.trim()}:${name.trim()}`,
    href: href.trim(),
    fileType: layerType.LAYER_RASTER,
    fileFormat: 'GeoTIFF'
});

// ADD VECTOR
export const addVector = (world: string, name: string) => ({
    type: actions.ADD_VECTOR,
    name: name.trim(),
    id: `${world.trim()}:${name.trim()}`,
    fileType: layerType.LAYER_VECTOR,
    fileFormat: 'shp'
});

// TOGGLE
export const toggleFavorite = (id: string) => ({
  type: actions.TOGGLE_FAVORITE,
  id
});


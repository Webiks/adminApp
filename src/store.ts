import { createStore } from 'redux';
import reducer from './reducers/root';
import * as layerType from './consts/layer-types';

/*let workspace = 'tb';*/

const defineFormatbyType = (type: string) => {
    type === layerType.LAYER_RASTER ? 'GeoTIFF' : 'shp';
}

const initialState = {
    worlds: [
        {
            name: 'tb',
            layers: [
                {
                    name: 'SugarCane',
                    href: `http://localhost:8080/geoserver/rest/workspaces/tb/layers/SugarCane.json`,
                    id: `tb:SugarCane`,
                    type: layerType.LAYER_RASTER,
                    format: defineFormatbyType(layerType.LAYER_RASTER)
                }
            ]
        }
    ]
};

const store = createStore(reducer, initialState);

window.store = store;

export default store;


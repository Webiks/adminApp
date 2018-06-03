/*
import { createStore } from 'redux';
import reducer from './reducers/root';
import { LAYER_TYPES } from "./consts/layer-types";
import * as interfaces from "./models/modelInterfaces";

const defineFormatbyType = (type: string) => type === LAYER_TYPES.LAYER_RASTER ? 'GeoTIFF' : 'shp';

export interface IAppState {
    worlds: interfaces.Worlds[];
}

const initialState: AppState = {
    worlds: [
        {
            name: 'tb',
            layers: [
                {
                    name: 'SugarCane',
                    href: `http://localhost:8080/geoserver/rest/workspaces/tb/layers/SugarCane.json`,
                    id: `tb:SugarCane`,
                    type: LAYER_TYPES.LAYER_RASTER,
                    format: defineFormatbyType(LAYER_TYPES.LAYER_RASTER)
                }
            ]
        }
    ]
};

const store = createStore(reducer, initialState);

window.store = store;

export default store;*/


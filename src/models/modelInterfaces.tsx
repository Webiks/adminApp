import { LAYER_TYPES } from "../consts/layer-types";

export interface IWorldLayer {
    name: string;
    href: string;
    id: string;
    type: LAYER_TYPES,
    format: 'GeoTIFF' | 'shp'
}

export interface IWorlds {
    name: string;
    layers: IWorldLayer [];
}
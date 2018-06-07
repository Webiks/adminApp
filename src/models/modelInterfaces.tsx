import { LAYER_TYPES } from "../consts/layer-types";

export interface IWorldLayer {
    name: string;
    id: string;
    type: LAYER_TYPES,
    resourceUrl: string
}

export interface IWorld {
    name: string;
    layers: IWorldLayer[];
}
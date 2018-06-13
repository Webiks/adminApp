import { IWorldLayer } from "./IWorldLayer";

export interface IWorld {
    name: string;
    layers: IWorldLayer[];
}
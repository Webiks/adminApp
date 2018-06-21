import { IWorld } from './IWorld';
import { ITBAction } from '../consts/action-types';

export interface IPropsLayers {
    worldName: string,
    world: IWorld,
    updateWorld: (worlds: IWorld) => ITBAction
}
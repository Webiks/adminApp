import { IWorld } from './IWorld';
import { ITBAction } from '../consts/action-types';

export interface IPropsLayers {
    world: IWorld,
    updateWorld: (worlds: Partial<IWorld>) => ITBAction
}
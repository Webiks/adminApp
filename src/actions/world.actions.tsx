import { ActionTypes, ITBAction } from "../consts/action-types";
import { IWorld } from "../interfaces/IWorld";

export const SetWorldsAction = (worlds: IWorld[]): ITBAction => ({
    type: ActionTypes.SET_WORLDS,
    payload: worlds
});

export const UpdateWorldAction = (world: Partial<IWorld>): ITBAction => ({
    type: ActionTypes.UPDATE_WORLD,
    payload: world
});

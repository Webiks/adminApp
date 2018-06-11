import { ActionTypes, ITBAction } from "../consts/action-types";
import { IWorld } from "../interfaces/IWorld";

export const UpdateWorldAction = (world: Partial<IWorld>): ITBAction => ({
    type: ActionTypes.UPDATE_WORLD,
    payload: world
});

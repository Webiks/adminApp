import { ActionTypes, ITBAction } from "../consts/action-types";
import { IWorld } from "../models/modelInterfaces";

export const UpdateWorldAction = (world: Partial<IWorld>): ITBAction => ({
    type: ActionTypes.UPDATE_WORLD,
    payload: world
});

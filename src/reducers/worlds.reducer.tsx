import { IWorld } from "../models/modelInterfaces";
import { ActionTypes, ITBAction } from "../consts/action-types";

export interface IWorldsState {
    list: IWorld[];
}

const initialState: IWorldsState  = {
    list: [
        { name: 'tb', layers: [] },
        { name: 'tata', layers: [] },
        { name: 'rara', layers: [] }
    ]
};

const reducer = (state: IWorldsState = initialState, action: ITBAction) => {
    switch (action.type) {
        case ActionTypes.UPDATE_WORLD:
            const list = state.list.map((world) => {
                if (world.name === action.payload.name) {
                   return { ...world, ...action.payload }
                }
                return world;
            });
            return { ...state, list };
        default:
            return state;
    }
};

export default reducer;

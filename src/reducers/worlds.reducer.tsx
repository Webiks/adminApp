import { IWorld } from "../interfaces/IWorld";
import { ActionTypes, ITBAction } from "../consts/action-types";
// import { WorldService } from "../services/WorldService";

export interface IWorldsState {
    list: IWorld[];
}

/*
const initialState: IWorldsState = {
    list: []
}*/

const initialState: IWorldsState  = {
    list: [
        { name: 'tb', layers: [] },
        { name: 'sf', layers: [] },
        { name: 'topp', layers: [] }
    ]
}

const reducer = (state: IWorldsState = initialState, action: ITBAction) => {
    // getWorlds();
    console.log("reducer state: " + JSON.stringify(initialState));
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

/*
const getWorlds = () => {
    console.log("reducer: start the getWorlds function...");
    WorldService.getWorlds()
        .then ((worlds: IWorld[]) => {
            initialState.list = worlds;
            console.log("reducer initialState: " + JSON.stringify(initialState.list));
            return initialState;
        })
        .catch(error => console.log(error));
}*/

export default reducer;

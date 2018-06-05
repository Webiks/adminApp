export enum ActionTypes {
    TOGGLE_FAVORITE = 'TOGGLE_FAVORITE',
    ADD_RASTER = 'ADD_RASTER',
    ADD_VECTOR = 'ADD_VECTOR',
    ADD_WORLD = 'ADD_WORLD',
    DELETE_FILE = 'DELETE_FILE',
    DELETE_WORLD = 'DELETE_WORLD',
    UPDATE_RASTER = 'UPDATE_RASTER',
    UPDATE_VECTOR = 'UPDATE_VECTOR',
    UPDATE_WORLD = 'UPDATE_WORLD',
}

export interface ITBAction {
    type: ActionTypes;
    payload: any;
}

export interface IWorldsState {
    list: any[];
}

const initialState: IWorldsState  = {
    list: [{ name: 'TB' }, { name: 'tata' }, { name: 'rara' }]
};

const reducer = (state: any = initialState, action: any) => {
    switch (action.type) {
        default:
            return state;
    }
};

export default reducer;

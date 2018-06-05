import { routerMiddleware, routerReducer as router, RouterState } from "react-router-redux";
import { applyMiddleware, combineReducers, createStore, Reducer } from "redux";
import createHistory from "history/createBrowserHistory";
import worlds, { IWorldsState } from "./reducers/worlds.reducer";

export const history = createHistory();
const middleware = routerMiddleware(history);

export interface IState {
    router: RouterState;
    worlds: IWorldsState;
}

const reducers: Reducer<IState> = combineReducers<IState>({ router, worlds });

const store = createStore(
    reducers,
    applyMiddleware(middleware)
);

export default store;

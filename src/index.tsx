import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { createStore, combineReducers, applyMiddleware, Reducer } from 'redux';
import { Provider } from 'react-redux';
import createHistory from 'history/createBrowserHistory';
import { ConnectedRouter, routerReducer as router, routerMiddleware, RouterState } from 'react-router-redux';
import App from './App';
import worlds, { IWorldsState } from './reducers/worlds.reducer';
import './index.css'

const history = createHistory();
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

ReactDOM.render(
    <Provider store={store}>
        { /* ConnectedRouter will use the store from Provider automatically */ }
        <ConnectedRouter history={history}>
            <App/>
        </ConnectedRouter>
    </Provider>,
    document.getElementById('root')
);


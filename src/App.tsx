import * as React from 'react';
import './App.css';
import { Route, Switch } from 'react-router';
import World from './components/World/World';
import Worlds from './components/Worlds/Worlds';
import Layer from './components/Layer';

const App = () => (

        <div className="App">

            <header className="App-header">
                <h1 className="App-title">TB Admin App</h1>
            </header>
            <Switch>
                <Route exact={true} path="/" component={Worlds}/>
                <Route exact={true} path="/:worldId" component={World}/>
                <Route path="/:worldId/:layerId" component={Layer}/>
            </Switch>

        </div>
);

export default App;


import * as React from 'react';
import './App.css';
import { Route } from 'react-router';
import World from './components/World/World';
import Worlds from './components/Worlds/Worlds';

class App extends React.Component {
    public render() {
        return (
            <div className="App">

                <header className="App-header">
                    <h1 className="App-title">Tb Admin App</h1>
                </header>

                <Route exact={true} path="/" component={Worlds}/>
                <Route path="/:worldId" component={World}/>
            </div>
        );
    }
}

export default App;

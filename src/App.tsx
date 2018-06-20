import * as React from 'react';
import './App.css';
import { Route } from 'react-router';
import World from './components/World/World';
import Worlds from './components/Worlds/Worlds';
import LayerDetailsForm from './components/LayerDetailsForm';

class App extends React.Component {
    public render() {
        return (
            <div className="App">

                <header className="App-header">
                    <h1 className="App-title">TB Admin App</h1>
                </header>

                <Route exact={true} path="/" component={Worlds}/>
                <Route path="/:worldId" component={World}/>
                <Route path="/:worldId/:layerId" component={LayerDetailsForm}/>
            </div>
        );
    }
}

export default App;

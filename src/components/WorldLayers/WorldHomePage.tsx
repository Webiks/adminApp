import * as React from 'react';

import { connect } from "react-redux";
import { IState } from "../../store";
import { IWorld } from "../../interfaces/IWorld";
import { IWorldLayer } from "../../interfaces/IWorldLayer";
import { IPropsLayers } from '../../interfaces/IPropsLayers';
import { ITBAction } from '../../consts/action-types';
import { LayerService } from "../../services/LayerService";
import { WorldsActions } from '../../actions/world.actions';
import LayersDataTable from './LayersDataTable';
import { AFFILIATION_TYPES } from '../../consts/layer-types';

/* Prime React components */
import 'primereact/resources/themes/omega/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'font-awesome/css/font-awesome.css';

export interface IStateWorld {
    layers: IWorldLayer[]
}

class WorldHomePage extends React.Component {
    props: IPropsLayers;

    state: IStateWorld = { layers: this.props.world.layers };

    // GET: get the world's layers on startUp
    componentWillMount() {
        this.setStateWorld();
        this.getAllLayersData();
    };

    // set state to initial state
    setStateWorld = () => this.setState({ layers: this.props.world.layers } );

    getAllLayersData = (): void  => {
        console.log("World Home Page: getAllLayersData...");
        LayerService.getAllLayersData(this.props.worldName)
            .then(layers => {
                // get the input Data for all the world's layers (from the App store)
                let layersInput;
                console.warn("getAllLayersData props layer: " + JSON.stringify(this.props.world.layers));
                if (!layers) {
                    console.warn("can't find any layer in that world");
                    this.refresh([]);                              // return an empty array of the layers

                } else {
                    if (this.state.layers && (this.state.layers.length > 0)){
                        layersInput = this.state.layers.map( (layer: IWorldLayer) => this.getInputData(layer));
                    } else {
                        layersInput = layers.map( (layer: IWorldLayer) => this.getInputData(layer));
                    }
                    console.warn("World Home Page layersInput: " + layersInput);
                    this.refresh([...layersInput]);               // update the App store
                }
            })
            .catch(error => this.refresh([]));
    };

    // get the input Data of the layer from the App store
    getInputData = (layer: IWorldLayer): IWorldLayer => {
        console.warn("getInputData: " + JSON.stringify(layer.inputData));
        const inputData = layer.inputData ? layer.inputData :
            {
                affiliation: AFFILIATION_TYPES.AFFILIATION_UNKNOWN,
                GSD: 0,
                sensor: {
                    maker: '',
                    name: '',
                    bands: []
                },
                flightAltitude: 0,
                cloudCoveragePercentage: 0,
                zoom: 14
            };
        layer.inputData = inputData;
        console.warn("getAllLayersData after inputData: " + JSON.stringify(inputData));
        return { ...layer };
    };

    // update the App store and refresh the page
    refresh = (layers: IWorldLayer[]) => {
        console.log("World Home Page: REFRESH...");
        const name = this.props.worldName;
        this.props.updateWorld({ name, layers });
        this.setStateWorld();
    };

    render() {
        return (
            <div>
                {this.state.layers && <div>
                    <LayersDataTable worldName={ this.props.world.name }
                                     layers={ this.state.layers }
                                     getAllLayersData={this.getAllLayersData}
                                     setStateWorld={this.setStateWorld}/>
                </div>}
            </div>

        );
    };
}

const mapStateToProps = (state: IState, { worldName }: any) => {
    return {
        world: state.worlds.list.find(({ name, layers }: IWorld) => worldName === name),
        worldName
    }
};

const mapDispatchToProps = (dispatch: any) => ({
    updateWorld: (payload: IWorld) => dispatch(WorldsActions.updateWorldAction(payload))
});

export default connect(mapStateToProps, mapDispatchToProps)(WorldHomePage);

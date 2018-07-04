import * as React from 'react';

import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import { Route } from 'react-router';
import { IState } from "../../store";
import { IWorld } from "../../interfaces/IWorld";
import { IWorldLayer } from "../../interfaces/IWorldLayer";
import { LayerService } from "../../services/LayerService";
import { WorldsActions } from '../../actions/world.actions';
import LayersDataTable from './LayersDataTable';
import { AFFILIATION_TYPES } from '../../consts/layer-types';

/* Prime React components */
import 'primereact/resources/themes/omega/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'font-awesome/css/font-awesome.css';
import Layer from '../Layer/Layer';
import { ITBAction } from '../../consts/action-types';

export interface IPropsLayers {
    router: any,
    worldName: string,
    world: IWorld,
    updateWorld: (worlds: IWorld) => ITBAction
}

export interface IStateWorld {
    layers: IWorldLayer[]
}

class WorldLayers extends React.Component {
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
                const layersInput = layers.map((layer: IWorldLayer) => this.getInputData(layer));
                this.refresh([...layersInput]);               // update the App store
                })
            .catch(error => this.refresh([]));
    };

    // get the input Data of the layer from the App store
    getInputData = (layer: IWorldLayer): IWorldLayer => {
        console.warn("getInputData: " + JSON.stringify(layer.inputData));
        const inputData = layer.inputData
            ? layer.inputData
            :   {
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
                { console.warn("RENDER: router: " + JSON.stringify(this.props.router)) }
                <Route path="/world/:worldName/layer/:layerName" component={Layer}/>
                {
                    this.props.router.location.pathname.indexOf('layer') === -1
                        ? this.props.world.layers &&
                        <div>
                            {this.state.layers && <div>
                                <LayersDataTable worldName={this.props.world.name}
                                                 layers={this.state.layers}
                                                 getAllLayersData={this.getAllLayersData}
                                                 setStateWorld={this.setStateWorld}/>
                            </div>}
                        </div>
                        : null
                }
            </div>
        );
    };
}

const mapStateToProps = (state: IState, { worldName }: any) => (
    {
        worldName,
        router: state.router,
        world: state.worlds.list.find(({ name, layers }: IWorld) => worldName === name)
    }
);

const mapDispatchToProps = (dispatch: any) => bindActionCreators({ updateWorld: WorldsActions.updateWorldAction }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(WorldLayers);

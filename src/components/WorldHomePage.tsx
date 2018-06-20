import * as React from 'react';

import { LayerService } from "../services/LayerService";
import { IWorld } from "../interfaces/IWorld";
import { IWorldLayer } from "../interfaces/IWorldLayer";
import { IState } from "../store";
import { IPropsLayers } from '../interfaces/IPropsLayers';
import { connect } from "react-redux";
import { LAYER_TYPES } from "../consts/layer-types";
import { WorldsActions } from '../actions/world.actions';

/* Prime React components */
import 'primereact/resources/primereact.min.css';
import 'primereact/resources/themes/omega/theme.css';
import 'font-awesome/css/font-awesome.css';
import LayersDataTable from './DataTable/LayersDataTable';
import { WorldService } from '../services/WorldService';

export interface IStateWorldPage {
    displayDialog: boolean,
    displayProgressBar: boolean,
    value1: number
}

class WorldHomePage extends React.Component {
    props: IPropsLayers;
    newLayer: boolean;
    worldName: string;
    selectedLayer: any;

    selectedLayerType = {
        srs: '',
        nativeBoundingBox: {
            minx: 0,
            maxx: 0,
            miny: 0,
            maxy: 0
        }
    };

    state: IStateWorldPage = {
        displayDialog: false,
        displayProgressBar: false,
        value1: 0
    };

    layerSelectTypes = [
        {label: LAYER_TYPES.LAYER_RASTER, value: LAYER_TYPES.LAYER_RASTER},
        {label: LAYER_TYPES.LAYER_VECTOR, value: LAYER_TYPES.LAYER_VECTOR}
    ];

    // GET: get the world's layers on startUp
    componentDidMount() {
        this.worldName = this.props.world.name;
        this.getAllLayersData();
    };

    zeroSelectedLayer = () => {
        this.selectedLayer = {
            name:'',
            layer: {
                id: '',
                name: '',
                type: ''
            },
            data: ''
        };
        this.selectedLayerType.srs = '';
        this.selectedLayerType.nativeBoundingBox.minx = 0;
        this.selectedLayerType.nativeBoundingBox.maxx = 0;
        this.selectedLayerType.nativeBoundingBox.miny = 0;
        this.selectedLayerType.nativeBoundingBox.maxy = 0;
    };

    setToInitState = () => {
        this.setState({
            displayDialog: false,
            displayProgressBar: false
        });
    };

    findSelectedLayerByName = () => {
        return this.props.world.layers.filter((layer: IWorldLayer) => layer.layer.name === this.selectedLayer.name);
    };

    // ============
    // CRUD Actions
    // ============

    // GET: get the world's layers
    getAllLayersData = (): void  => {
        console.log("World Home Page: getAllLayersData...");
        LayerService.getAllLayersData(this.worldName)
            .then(layers => this.updateLayers(layers || []))
            .catch(error => this.updateLayers([]));
    };

    // GET: get the layer's Meta DATA (by demand - On Layer Select)
    onLayerSelect = (e: any): void  => {
        this.newLayer = false;
        this.selectedLayer = e.data;
        console.log("onLayerSelect: selected layer: " + JSON.stringify(this.selectedLayer));
        LayerService.getLayerDetails(this.worldName, this.selectedLayer)
            .then((layer: IWorldLayer) => {
                console.log("onLayerSelect layer: " + JSON.stringify(layer));
                // update the data field according to the layer type
                if (this.selectedLayer.layer.type === 'RASTER'){
                    this.selectedLayerType = this.selectedLayer.data.coverage;
                }
                else if (this.selectedLayer.layer.type === 'VECTOR'){
                    this.selectedLayerType = this.selectedLayer.data.featureType;
                }
                else{
                    console.error("Can't get the layer type");
                }
                console.log("onLayerSelect: selected Layer TYPE: " + JSON.stringify(this.selectedLayerType));

                this.update(layer);
                this.setState({
                    displayDialog: true
                });
                console.log("onLayerSelect layers: " + JSON.stringify(this.props.world.layers));
            })
            .catch(error => console.log(error));
    };

    // PUT: Update and save
    update = (layer: IWorldLayer) => {
        const layers = [...this.props.world.layers];
        console.log("update: " + JSON.stringify(this.selectedLayer));
        layers[this.selectedLayer] = layer;
        this.updateLayers(layers);
    };

    updateLayers = (layers: IWorldLayer[]) => {
        console.log("World Home Page: updateLayers...");
        const name = this.worldName;
        this.props.updateWorld({ name, layers });
        this.setToInitState();
    };

    save = () => {
        const layers = [...this.props.world.layers];
        if (this.newLayer){
            layers.push(this.selectedLayer);
        }
        else{
            console.log("save: " + JSON.stringify(this.findSelectedLayerByName()));
            layers[this.selectedLayer] = this.selectedLayer;
        }
        this.updateLayers(layers);
        this.setToInitState();
    };

    updateProperty = (property: string, value: any) => {
        const layer = this.selectedLayer;
        layer[property] = value;
        this.update(layer);
    };

    // DELETE
    delete = () => {
        LayerService.deleteLayerById(this.worldName, this.selectedLayer)
        // LayerService.deleteLayerById(this.worldName, this.state.layer.name)
            .then (res => {
                if (res !== 'error'){
                    const layers = this.props.world.layers.filter((layer: IWorldLayer) =>
                        layer.layer.name !== this.selectedLayer.name);
                    this.updateLayers(layers);
                    this.setToInitState();
                }
                else{
                    console.error("error: " + res.message);
                }
            })
            .catch(error => console.log(error.response));
    };

    render() {

        return (
            <div>
                <div className="content-section implementation">
                    <LayersDataTable worldName={ this.props.world.name } updateWorld={this.props.updateWorld}/>
                </div>
            </div>
        );
    };
}

const mapStateToProps = (state: IState, { worldName }: any) => {
    return {
        world: state.worlds.list.find(({ name, layers }: IWorld) => worldName === name)
    }
};

const mapDispatchToProps = (dispatch: any) => ({
    updateWorld: (payload: IWorld) => dispatch(WorldsActions.updateWorldAction(payload))
});

export default connect(mapStateToProps, mapDispatchToProps)(WorldHomePage);

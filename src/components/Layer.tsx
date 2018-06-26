import { connect } from 'react-redux';
import { IState } from '../store';
import { WorldService } from '../services/WorldService';
import { IWorld } from '../interfaces/IWorld';
import * as React from 'react';
import { WorldsActions } from '../actions/world.actions';
import { ITBAction } from '../consts/action-types';
import { push } from 'react-router-redux';
import { IWorldLayer } from '../interfaces/IWorldLayer';
import { LayerService } from '../services/LayerService';
import LayerEditor from './LayerEditor/LayerEditor';

export interface ILayerComponentProps  {
    backToWorlds: () => void,
    setWorlds: (worlds: IWorld[]) => ITBAction,
    updateWorld: (worlds: Partial<IWorld>) => ITBAction,
    match: any,
    worlds: IWorld[]
}

export interface ILayerComponentState {
    selectedLayer?: IWorldLayer
}

export class Layer extends React.Component {
    props: ILayerComponentProps;
    worldName: string;
    layerName: string;
    selectedWorld: IWorld;
    state: ILayerComponentState = {};

    componentDidMount() {
        this.worldName = this.props.match.params.worldId;
        this.layerName = this.props.match.params.layerId;
        // 1. get all worlds - in case the state world list is empty
        if ((this.props.worlds).length === 0){
            this.getWorldList()
                .then( worlds => this.getInfo(worlds))
                .catch ( error => console.error("LAYER: no such world! " + error));
        }
        else {
            this.getInfo(this.props.worlds);
        }
    };

    // get all the info
    getInfo = (worlds) => {
        // 2. check if the world exist in the worlds list
        this.selectedWorld = this.findSelectedWorld(worlds);
        // 3. get all the layers of the world - in case the layers list is empty
        if ((this.selectedWorld.layers).length === 0){
            this.getLayerList()
            .then( layers => {
                // 4. check if the layer exist in the world layers list
                this.selectedWorld.layers = layers;
                const selectedLayer = this.findSelectedLayer(layers);
                this.setState( { selectedLayer });
            })
            .catch ( error => console.error("LAYER: no such layer! " + error));
        }
        else{
            // 4. check if the layer exist in the world layers list
            const selectedLayer = this.findSelectedLayer(this.selectedWorld.layers);
            this.setState( { selectedLayer });
        }
    };

    // get the world's list
    getWorldList = (): Promise<any>  => {
        console.log("LAYER: start to get all worlds...");
        return WorldService.getWorlds()
            .then((worlds: IWorld[]) => {
                this.props.setWorlds(worlds || []);
                return worlds;
            })
            .catch(error => {
                const worlds = [];
                this.props.setWorlds(worlds);
                return worlds;
            });
    };

    // get the layer's list
    getLayerList = (): Promise<any> => {
        const name = this.worldName;
        return LayerService.getAllLayersData(this.worldName)
            .then((layers: IWorldLayer[]) => {
                this.props.updateWorld({ name, layers });
                return layers;
            })
            .catch(error => {
                const layers = [];
                this.props.updateWorld({ name, layers });
                return layers;
            });
    };

    // find the selected world
    findSelectedWorld = (worlds): any => this.props.worlds.find(({ name }: IWorld) => name === this.worldName);

    // find the selected layer
    findSelectedLayer = (layers): any =>
        this.selectedWorld.layers.find((layer: IWorldLayer) => layer.layer.name === this.layerName);

    render() {
        return <div>
            <h1>
                {this.state.selectedLayer ? `Layer '${this.props.match.params.layerId}' in '${this.props.match.params.worldId}' world` :
                    <div>
                        <span style={{ color: 'gold' }}> ⚠ </span>
                        <span>Layer '{this.props.match.params.layerId}' doesn't exist in '{this.props.match.params.worldId}' world!</span>
                    </div>}
            </h1>

            { this.state.selectedLayer && <LayerEditor worldName={this.props.match.params.worldId} layer={this.state.selectedLayer}/> }

            <button onClick={this.props.backToWorlds}>Back to worlds</button>

        </div>
    }
}

const mapStateToProps = (state: IState) => {
    return {
        worlds: state.worlds.list
    }
};

const mapDispatchToProps = (dispatch: any) => ({
    setWorlds: (payload: IWorld[]) => dispatch(WorldsActions.setWorldsAction(payload)),
    updateWorld: (payload: IWorld) => dispatch(WorldsActions.updateWorldAction(payload)),
    backToWorlds: () => dispatch(push('/'))
});

export default connect(mapStateToProps, mapDispatchToProps)(Layer);
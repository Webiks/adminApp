import { connect } from 'react-redux';
import { IState } from '../store';
import { WorldService } from '../services/WorldService';
import { IWorld } from '../interfaces/IWorld';
import * as React from 'react';
import { WorldsActions } from '../actions/world.actions';
import { ITBAction } from '../consts/action-types';
import { push } from 'react-router-redux';
import { IWorldLayer } from '../interfaces/IWorldLayer';
import LayerDetailsForm from './LayerDetailsForm';
import { LayerService } from '../services/LayerService';

export interface ILayerComponentProps  {
    backToWorlds: () => void,
    setWorlds: (worlds: IWorld[]) => ITBAction,
    updateWorld: (worlds: Partial<IWorld>) => ITBAction,
    match: any,
    worlds?: IWorld[],
    world: IWorld
}

export interface ILayerComponentState {
    world?: IWorld,
    layer?: IWorldLayer
}

export class Layer extends React.Component {
    props: ILayerComponentProps;
    state: ILayerComponentState = {};
    worldName: string;
    layerName: string;

    componentDidMount() {
        console.log("start the Layer Component... " + this.props.match.params.worldId);
        this.worldName = this.props.match.params.worldId;
        this.layerName = this.props.match.params.layerId;
        // get all world's layers - in case the state layer list is empty
        if (!(this.props.world)){
            this.getLayerList();
        }
        else {
            this.findSelectedLayer();
        }
    };

    // get the world's list
    getLayerList = () => {
        console.log("start to get all worlds...");
        LayerService.getAllLayersData(this.worldName)
            .then((worlds: IWorld[]) => {
                this.props.setWorlds(worlds || []);
                this.findSelectedLayer();
            })
            .catch(error => this.props.setWorlds([]));
    };

    // find and define the selected layer
    findSelectedLayer = () => {
        const selectedLayer = this.props.world.layers.find(({ name }: IWorldLayer) => this.layerName === name);
        this.setState( { layer : selectedLayer });
        console.log("Layer Component - layer: " + JSON.stringify(this.state.layer));
    };

    render() {
        return <div>
            <h1>
                {this.state.world ? `${this.state.world.name} World` :
                    <div>
                        <span style={{ color: 'gold' }}> ⚠ </span>
                        <span>World {this.props.match.params.worldId} doesn't exist!</span>
                    </div>}
            </h1>

            { this.state.world && <LayerDetailsForm worldName={this.state.world.name}/> }

            <button onClick={this.props.backToWorlds}>Back to worlds</button>

        </div>
    }
}

const mapStateToProps = (state: IState, { worldName }: any) => {
    return {
        world: state.worlds.list.find(({ name, layers }: IWorld) => worldName === name)
    }
};

const mapDispatchToProps = (dispatch: any) => ({
    setWorlds: (payload: IWorld[]) => dispatch(WorldsActions.setWorldsAction(payload)),
    updateWorld: (payload: IWorld) => dispatch(WorldsActions.updateWorldAction(payload)),
    backToWorlds: () => dispatch(push('/'))
});

export default connect(mapStateToProps, mapDispatchToProps)(Layer);
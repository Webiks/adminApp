import * as React from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import WorldHomePage from "../WorldHomePage";
import { IState } from "../../store";
import { IWorld } from '../../interfaces/IWorld';
import { WorldsActions } from '../../actions/world.actions';
import { WorldService } from '../../services/WorldService';
import { ITBAction } from '../../consts/action-types';

export interface IWorldComponentProps  {
    setWorlds: (world: IWorld[]) => ITBAction
    backToWorlds: () => void;
    match: any;
    worlds: any;
}

export interface IWorldComponentState {
    world?: any;
}

export class World extends React.Component {
    props: IWorldComponentProps;
    state: IWorldComponentState = {};
    worldName: string;

    componentDidMount() {
        console.log("start the World Component... " + this.props.match.params.worldId);
        this.worldName = this.props.match.params.worldId;
        console.log("World Name: " + JSON.stringify(this.worldName));
        console.log("Worlds list: " + JSON.stringify(this.props.worlds));

        // get all worlds - in case the state world list is empty
        if ((this.props.worlds).length === 0){
            console.log("start to get all worlds...");
            WorldService.getWorlds()
                .then((worlds: IWorld[]) => {
                    this.props.setWorlds(worlds || []);
                    this.findSelectedWorld();
                })
                .catch(error => this.props.setWorlds([]));
        }
        else {
            this.findSelectedWorld();
        }

    };

    // find and define the selected world
    findSelectedWorld = () => {
        const selectedWorld = this.props.worlds.find(({ name, layers }: IWorld) => this.worldName === name);
        this.setState( { world : selectedWorld });
        console.log("World Component - world: " + JSON.stringify(this.state.world));
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

            { this.state.world && <WorldHomePage worldName={this.state.world.name}/> }

            <button onClick={this.props.backToWorlds}>Back to worlds</button>

        </div>
    }
}

const mapStateToProps = (state: IState) => {
    console.log("World state: " + JSON.stringify(state));
    return {
        worlds: state.worlds.list
    }
};

/*
const mapStateToProps = (state: IState, { worldName }: any) => {
    console.log("World state: " + JSON.stringify(state));
    return {
        world: state.worlds.list.find(({ name, layers }: IWorld) => worldName === name)
    }
};*/

const mapDispatchToProps = (dispatch: any) => ({
    setWorlds: (payload: IWorld[]) => dispatch(WorldsActions.setWorldsAction(payload)),
    backToWorlds: () => dispatch(push('/'))
});

export default connect(mapStateToProps, mapDispatchToProps)(World);
import * as React from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import WorldHomePage from "../WorldHomePage";
import { IState } from "../../store";
import { IWorld } from '../../interfaces/IWorld';
import { WorldsActions } from '../../actions/world.actions';

const World = ({ world, backToWorlds }: any) => (
    <div>
        <h1> { world.name } world !</h1>

        <WorldHomePage worldName={ world.name }/>

        <button onClick={backToWorlds}>Back to worlds</button>

    </div>

);

const mapStateToProps = (state: IState, props: any) => ({
    world: state.worlds.list.find(({ name }) => {
        console.log("WORLD: world name = " + props.match.params.worldId);
        return name === props.match.params.worldId
    } )
});

const mapDispatchToProps = (dispatch: any) => ({
    setWorlds: (payload: IWorld[]) => {
        const action = WorldsActions.setWorldsAction(payload);
        console.log(action);
        return dispatch('action', action);
    },
    backToWorlds: () => dispatch(push('/'))
});

export default connect(mapStateToProps, mapDispatchToProps)(World);
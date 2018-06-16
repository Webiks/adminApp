import * as React from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import LayersDataTable from "../LayersDataTable";
import { IState } from "../../store";
import { IWorld } from '../../interfaces/IWorld';
import { SetWorldsAction } from '../../actions/world.actions';

const World = ({ world, backToWorlds }: any) => (
    <div>
        <h1>
            { world.name } world !
        </h1>
        <LayersDataTable worldName={ world.name }/>
        <button onClick={backToWorlds}>Back to worlds</button>
    </div>
);

const mapStateToProps = (state: IState, props: any) => ({
    world: state.worlds.list.find(({ name }) => name === props.match.params.worldId )
});

const mapDispatchToProps = (dispatch: any) => ({
    setWorlds: (payload: IWorld[]) => dispatch(SetWorldsAction(payload)),
    backToWorlds: () => dispatch(push('/'))
});

export default connect(mapStateToProps, mapDispatchToProps)(World);
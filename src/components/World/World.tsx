import * as React from 'react';
import { IState } from '../../index';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

const World = ({ world, backToWorlds }: any) => (
    <div>
        <h1>
            { world.name } world !
        </h1>

        <button onClick={backToWorlds}>Back to worlds</button>

    </div>
);

const mapStateToProps = (state: IState, props: any) => ({
    world: state.worlds.list.find(({ name }) => name === props.match.params.worldId )
});

const mapDispatchToProps = (dispatch: any) => ({
    backToWorlds: () => dispatch(push('/'))
});

export default connect(mapStateToProps, mapDispatchToProps)(World);
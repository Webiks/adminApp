import * as React from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import WorldHomePage from '../WorldLayers/WorldHomePage';
import { IState } from '../../store';
import { IWorld } from '../../interfaces/IWorld';
import { WorldsActions } from '../../actions/world.actions';
import { bindActionCreators } from 'redux';

export interface IWorldComponentProps {
    world: IWorld;
    worldName: string;
    push: (path: string) => {}
}

export interface IWorldComponentState {
    world?: IWorld
}

const World = ({ worldName, world, push }: IWorldComponentProps | any) => (
    <div>
        <h1>
            {
                world ? `${world.name} World` :
                    <div>
                        <span style={{ color: 'gold' }}> ⚠ </span>
                        <span>World {worldName} doesn't exist!</span>
                    </div>}
        </h1>
        <div>
            {world && <WorldHomePage worldName={world.name}/>}
        </div>
        <button onClick={() => push('/')}>Back to worlds</button>
    </div>
);

const mapStateToProps = (state: IState, { match }) => ({
        world: state.worlds.list.find(({ name, layers }: IWorld) => match.params.worldName === name),
        worldName: match.params.worldName
});

const mapDispatchToProps = (dispatch: any) => bindActionCreators({ push }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(World);
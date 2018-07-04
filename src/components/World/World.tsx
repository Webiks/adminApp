import * as React from 'react';

import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import WorldHomePage from '../WorldLayers/WorldLayers';
import { IState } from '../../store';
import { IWorld } from '../../interfaces/IWorld';
import { bindActionCreators } from 'redux';

export interface IWorldComponentProps {
    world: IWorld;
    worldName: string;
    push: (path: string) => {}
}

// check if the world exist in the GeoServer Workspaces and navigate to its home page
const World = ({ worldName, world, push }: IWorldComponentProps | any) => (
    <div>
        <h1>
            {
                world ? `${worldName} World` :
                    <div>
                        <span style={{ color: 'gold' }}> ⚠ </span>
                        <span>World {worldName} doesn't exist!</span>
                    </div>
            }
        </h1>
        <div>
            { world && <WorldHomePage worldName={worldName}/> }
        </div>
        <button onClick={() => push('/')}>Back to worlds</button>
    </div>
);

const mapStateToProps = (state: IState, { match }: any) => ({
        world: state.worlds.list.find(({ name, layers }: IWorld) => match.params.worldName === name),
        worldName: match.params.worldName
});

const mapDispatchToProps = (dispatch: any) => bindActionCreators({ push }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(World);
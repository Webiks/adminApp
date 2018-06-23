import * as React from 'react';
import { connect } from 'react-redux';
import { IState } from '../store';
import { IPropsLayers } from '../interfaces/IPropsLayers';
import config from '../config/config';
import { IWorld } from '../interfaces/IWorld';
import { WorldsActions } from '../actions/world.actions';
import { push } from 'react-router-redux';

class DisplayLayer extends React.Component {
    props: IPropsLayers;
    url: string;

    componentDidMount() {
        // get Capabilities
        this.url = `${config.baseUrlApi}/upload/${this.props.worldName}`;
        console.error("Display: get Capabilities...");
    };





}

const mapStateToProps = (state: IState, { worldName, LayerName }: any) => {
    return {
        world: state.worlds.list.find(({ name, layers }: IWorld) => worldName === name),
        worldName, LayerName
    }
};

const mapDispatchToProps = (dispatch: any) => ({
    updateWorld: (payload: IWorld) => dispatch(WorldsActions.updateWorldAction(payload))
});

export default connect(mapStateToProps, mapDispatchToProps)(DisplayLayer);

import * as React from 'react';

import { LayerService } from "../services/LayerService";
import { IWorld } from "../interfaces/IWorld";
import { IWorldLayer } from "../interfaces/IWorldLayer";
import { IState } from "../store";
import { IPropsLayers } from '../interfaces/IPropsLayers';
import { connect } from "react-redux";
import { WorldsActions } from '../actions/world.actions';

/* Prime React components */
import 'primereact/resources/primereact.min.css';
import 'primereact/resources/themes/omega/theme.css';
import 'font-awesome/css/font-awesome.css';
import LayersDataTable from './DataTable/LayersDataTable';

export interface IStateWorldPage {
    displayDialog: boolean,
    displayProgressBar: boolean,
    value1: number
}

class WorldHomePage extends React.Component {
    props: IPropsLayers;

    // GET: get the world's layers on startUp
    componentDidMount() {
        this.getAllLayersData();
    };

    getAllLayersData = (): void  => {
        console.log("World Home Page: getAllLayersData...");
        LayerService.getAllLayersData(this.props.worldName)
            .then(layers => this.refresh(layers || []))
            .catch(error => this.refresh([]));
    };

    // update the App store and refresh the page
    refresh = (layers: IWorldLayer[]) => {
        console.log("World Home Page: updateLayers...");
        const name = this.props.worldName;
        this.props.updateWorld({ name, layers });
    };

    render() {
        return (
            <div>
                <LayersDataTable worldName={ this.props.world.name }/>
            </div>

        );
    };
}

const mapStateToProps = (state: IState, { worldName }: any) => {
    return {
        world: state.worlds.list.find(({ name, layers }: IWorld) => worldName === name),
        worldName
    }
};

const mapDispatchToProps = (dispatch: any) => ({
    updateWorld: (payload: IWorld) => dispatch(WorldsActions.updateWorldAction(payload))
});

export default connect(mapStateToProps, mapDispatchToProps)(WorldHomePage);

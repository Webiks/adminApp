import * as React from 'react';

import config from "../config/config";
import { IWorld } from "../interfaces/IWorld";
import { IWorldLayer } from '../interfaces/IWorldLayer';
import { WorldsActions } from '../actions/world.actions';
import { connect } from "react-redux";
import { IState } from "../store";
import { IPropsLayers } from '../interfaces/IPropsLayers';

import { FileUpload } from 'primereact/components/fileupload/FileUpload';
import { LayerService } from '../services/LayerService';

/* Prime React components */
import 'primereact/resources/primereact.min.css';
import 'primereact/resources/themes/omega/theme.css';
import 'font-awesome/css/font-awesome.css';

export interface IStateUpload {
    displayProgressBar: boolean
}

class UploadFile extends React.Component {
    props: IPropsLayers;
    state: IStateUpload = {
        displayProgressBar: false
    };
    worldName: string;
    layers: IWorldLayer[];
    url: string;

    componentDidMount() {
        this.worldName = this.props.world.name;
        this.layers = this.props.world.layers;
        this.url = `${config.baseUrlApi}/upload/${this.worldName}`;
    };

    // get all the world's layer again after adding the new layer
    onUpload = (e: any) => {
        console.log("On Upload...");
        LayerService.getLayers(this.props.world.name)
            .then(layers => this.updateLayers(layers))
            .catch(error => console.log(error.response));
    };

    onError = (e: any) => {
        console.log("error: " + e.data);
    };

    updateLayers = (layers: IWorldLayer[]) => {
        console.log("upload: updateLayers...");
        const name = this.worldName;
        this.props.updateWorld({ name, layers });
        this.setState({ displayProgressBar: false});
    };

    render() {
        return (
            <div>
                <div className="content-section implementation">
                    <FileUpload mode="advanced" name="uploads" multiple={true} url={this.url}
                                accept="image/tiff, .shp,.shx, .dbf,.prj, .qix, .xml, .sbn, .sbx, .zip"
                                maxFileSize={config.maxFileSize} auto={true}
                                chooseLabel="add"
                                onUpload={this.onUpload}/>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state: IState, { worldName }: any) => {
    return {
        world: state.worlds.list.find(({ name, layers }: IWorld) => worldName === name)
    }
};

const mapDispatchToProps = (dispatch: any) => ({
    updateWorld: (payload: IWorld) => dispatch(WorldsActions.updateWorldAction(payload))
});

export default connect(mapStateToProps, mapDispatchToProps)(UploadFile);
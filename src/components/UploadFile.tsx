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

class UploadFile extends React.Component {
    props: IPropsLayers;
    url: string;

    componentDidMount() {
        this.url = `${config.baseUrlApi}/upload/${this.props.worldName}`;
        console.error("UPLOAD - url: " + this.url);
    };

    // get all the world's layer again after adding the new layer
    onUpload = () => {
        console.log("On Upload...");
        // update the layers' list
        LayerService.getAllLayersData(this.props.worldName)
            .then(layers => this.updateLayers(layers))
            .catch(error => console.log(error.response));
    };

    updateLayers = (layers: IWorldLayer[]) => {
        console.log("upload: updateLayers...");
        const name = this.props.worldName;
        this.props.updateWorld({ name, layers });
    };

    onError = (e: any) => {
        console.log("error: " + e.data);
    };

    render() {
        return (
            <div>
                <div className="content-section implementation">
                    <FileUpload mode="advanced" name="uploads" multiple={true} url={this.url}
                                accept="image/tiff, .shp,.shx, .dbf,.prj, .qix, .xml, .sbn, .sbx, .zip"
                                maxFileSize={config.maxFileSize} auto={false}
                                chooseLabel="add"
                                onUpload={(e: any) => this.onUpload}/>
                </div>
            </div>
        )
    }
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

export default connect(mapStateToProps, mapDispatchToProps)(UploadFile);
import * as React from 'react';

import config from "../config/config";
import { IWorld } from "../interfaces/IWorld";
import { IWorldLayer } from '../interfaces/IWorldLayer';
import { UpdateWorldAction } from "../actions/world.actions";
import { connect } from "react-redux";
import { IState } from "../store";

import { FileUpload } from 'primereact/components/fileupload/FileUpload';
import { LayerService } from '../services/LayerService';

/* Prime React components */
import 'primereact/resources/primereact.min.css';
import 'primereact/resources/themes/omega/theme.css';
import 'font-awesome/css/font-awesome.css';

class UploadFile extends React.Component {
    props: any;
    state: any  = {};
    worldName: string;
    layers: IWorldLayer[];
    url: string;
    urlRaster: string;
    urlVector: string;
    urlBase: string = `http://${config.ipAddress}${config.serverPort}/api/upload`;

    componentDidMount() {
        this.worldName = this.props.worldName;
        this.layers = this.props.layers;
        this.url = `${this.urlBase}/${this.worldName}`;
        // this.urlRaster = `${this.urlBase}/raster/${this.worldName}`;
        // this.urlVector = `${this.urlBase}/vector/${this.worldName}`;
        // console.log("urlRaster: " + this.urlRaster);
        // console.log("urlVector: " + this.urlVector);
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
                                accept="image/tiff, .shp,.shx, .dbf,.prj, .qix .xml .sbn .sbx"
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
    updateWorld: (payload: Partial<IWorld>) => dispatch(UpdateWorldAction(payload))
});

export default connect(mapStateToProps, mapDispatchToProps)(UploadFile);

// withCredentials={true}
// type="file" webkitdirectory={true} mozdirectory={true}
// <FileUpload mode="advanced" name="uploadVectors" multiple={true} url={this.urlVector}
//                                 accept="image/shp, image/shx, image/dbf, image/prj, image/qix"
//                                 maxFileSize={config.maxFileSize} chooseLabel="Add Vector" auto={true}
//                                 onUpload={this.onUpload}/>
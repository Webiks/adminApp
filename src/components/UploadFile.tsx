import * as React from 'react';

import config from "../config/config";
import { IWorld } from "../interfaces/IWorld";
import { UpdateWorldAction } from "../actions/world.actions";
import { connect } from "react-redux";
import { IState } from "../store";
/* Prime React components */
import 'primereact/resources/primereact.min.css';
import 'primereact/resources/themes/omega/theme.css';
import 'font-awesome/css/font-awesome.css';
import { FileUpload } from 'primereact/components/fileupload/FileUpload';
import { UploadFileService } from '../services/UploadFileService';

class UploadFile extends React.Component {
    props: any;
    worldName: string;
    url: string;
    urlRaster: string;
    urlVector: string;
    urlBase: string = `http://${config.ipAddress}${config.serverPort}/api/upload/`;

    componentDidMount() {
        this.worldName = this.props.worldName;
        this.url = `${this.urlBase}${this.worldName}`;
        this.urlRaster = `${this.url}/rasters`;
        this.urlVector = `${this.url}/vectors`;
        console.log("props: " + JSON.stringify(this.props));
    }

    onUpload = (e: any) => {
        console.log("start to upload...");
        console.log("event data: " + e.data);
        UploadFileService.upload(this.props.world.name, e.data.file)
            .then(success => console.log("the upload succeed!"))
            .catch(error => console.log(error));
    };

    onError = (e: any) => {
        console.log("error: " + e.data);
    }

    render() {
        return (
            <div>
                <div className="content-section implementation">
                    <FileUpload mode="basic" name="uploadRaster" multiple={true} url={this.urlRaster}
                                accept="image/tiff" maxFileSize={config.maxFileSize} auto={true}
                                chooseLabel="Add Raster" onUpload={this.onUpload}
                                onSelect={(e: any) => {
                                    console.log("event data: " + JSON.stringify(e.file));
                                }}/>

                    <FileUpload mode="basic" name="uploadVector" multiple={true} url={this.urlVector}
                                accept="image/shp, image/shx, image/dbf, image/prj, image/qix, image/zip"
                                maxFileSize={config.maxFileSize} onUpload={this.onUpload} auto={true}
                                chooseLabel="Add Vector"/>

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

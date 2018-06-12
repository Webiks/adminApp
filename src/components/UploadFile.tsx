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
// import { Link } from 'react-router-dom';
// import { Growl } from 'primereact/components/growl/Growl';
import { FileUpload } from 'primereact/components/fileupload/FileUpload';
// import { TabView,TabPanel } from 'primereact/components/tabview/TabView';
// import { CodeHighlight } from 'primereact/codehighlight/CodeHighlight';


class UploadFile extends React.Component {
    props: any;
    urlRaster = `C:/dev/Terrabiks/tb-admin-app/src/upload/rasters`;
    urlVector = `C:/dev/Terrabiks/tb-admin-app/src/upload/vectors`;
    // fileUpload = new FileUpload(this.props);

    onUpload = (event: any) => {
        console.log("start to upload...");
    }

    render() {
        return (
            <div>
                <div className="content-section implementation">
                    <FileUpload mode="basic" name="uploadRaster[]" url={this.urlRaster} multiple={true}
                                accept="image/tif"
                                maxFileSize={config.maxFileSize} onUpload={this.onUpload} auto={true}
                                chooseLabel="Add Raster"/>

                    <FileUpload mode="basic" name="uploadVector[]" url={this.urlVector} multiple={true}
                                accept="image/shp, image/shx, image/dbf, image/prj, image/qix, image/zip"
                                maxFileSize={config.maxFileSize} onUpload={this.onUpload} auto={true}
                                chooseLabel="Add Vector"/>

                </div>
            </div>
        )
    }
}


/*
class UploadFile extends React.Component {
    props: any;
    growl: any;


    onBeforeUpload = (event.xhr: XmlHttpRequest, event.formData: FormData ) => {

    }

    onUpload = (event: any) => {
        this.growl.show({severity: 'info', summary: 'Success', detail: 'File Uploaded'});
    }

    render() {
        return (
            <div>
                <div className="content-section implementation">
                    <FileUpload mode="basic" name="uploadRaster[]" url="./upload/rasters" multiple={true} accept="image/tif"
                                maxFileSize={config.maxFileSize} onUpload={this.onUpload} auto={true} chooseLabel="Browse" />

                    <FileUpload mode="basic" name="uploadVector[]" url="./upload/rasters" multiple={true} accept="image/shp, image/shx, image/dbf, image/prj, image/qix, image/zip"
                                maxFileSize={config.maxFileSize} onUpload={this.onUpload} auto={true} chooseLabel="Browse" />

                    <Growl ref={(el) => { this.growl = el; }}/>
                </div>
            </div>
        )
    }
}*/

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

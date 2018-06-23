import * as React from 'react';
import { IWorld } from '../../interfaces/IWorld';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { IState } from '../../store';
import { WorldsActions } from '../../actions/world.actions';
import { IWorldLayer } from '../../interfaces/IWorldLayer';
import { ITBAction } from '../../consts/action-types';
import { LayerService } from '../../services/LayerService';
import { ILayer } from '../../interfaces/ILayer';
import UploadFile from '../UploadFile';
import Header from './Header';
import ol from 'openlayers'

/* Prime React components */
import 'primereact/resources/primereact.min.css';
import 'primereact/resources/themes/omega/theme.css';
import 'font-awesome/css/font-awesome.css';
import { DataTable } from 'primereact/components/datatable/DataTable';
import { Column } from 'primereact/components/column/Column';
import { Button } from 'primereact/components/button/Button';
import { Dialog } from 'primereact/components/dialog/Dialog';
import Footer from './Footer';

export interface IPropsLayers {
    worldName: string,
    world: IWorld,
    updateWorld: (worlds: IWorld) => ITBAction,
    navigateTo: (layerName: string) => void
}

export interface IStateTable {
    selectedLayer: any,
    displayDialog: boolean,
    displayFooter: boolean
}

class LayersDataTable extends React.Component {

    props: IPropsLayers;

    state: IStateTable = {
        selectedLayer: this.props.world.layers[0],
        displayDialog: false,
        displayFooter: true
    };

    displayLayer = (layer: IWorldLayer) => {
        const center = [layer.data.latLonBoundingBox.minx,layer.data.latLonBoundingBox.maxy];
        const parser = new ol.format.WMTSCapabilities();
        const projection = layer.data.latLonBoundingBox.crs;
        const olProjection = 'EPSG:3857';
        let map;
        // layer.inputData.zoom = 14;

        // get the Capabilities XML file in JSON format
        // 1. get the Capabilities XML file
        LayerService.getCapabilities(this.props.worldName, layer.layer.name)
            .then( xml => {
                console.log("1. get capabilities XML");
                // 2. convert the xml data to json
                const json = parser.read(xml);
                console.log("2. convert to JSON");
                // 3. define the map options
                const options = ol.source.WMTS.optionsFromCapabilities(json,
                    {
                        projection: layer.data.srs,
                        layer: layer.layer.name,
                        matrixSet: projection
                    });
                console.log("3. finished to define the options");

                // draw the map
                console.error("4. start new OL Map...");
                map = new ol.Map({
                    layers: [
                        new ol.layer.Tile({
                            source: new ol.source.OSM(),
                            opacity: 0.7
                        }),
                        new ol.layer.Tile({
                            opacity: 1,
                            source: new ol.source.WMTS(options)
                        })
                    ],
                    target: 'map',
                    view: new ol.View({
                        projection: olProjection,
                        center: ol.proj.transform(center, projection, olProjection),
                        zoom: 14
                    })
                });
            })
            .catch(error => { throw new Error(error) });
    };

    editLayer = (layer: IWorldLayer) => {
        console.log(`navigate to layer:${layer.name} form page`);
        this.props.navigateTo(`${this.props.worldName}/${layer.layer.name}`);
    };

    deleteLayer = (layer: ILayer) => {
        console.error("start delete layer: " + layer.name);
        confirm(`Are sure you want to DELETE ${layer.name}?`);
        LayerService.deleteLayerById(this.props.worldName, layer)
            .then(layers => {
                console.error("LAYER DATA TABLE: delete layer - getAllLayersData...");
                // get the new layers' list
                LayerService.getAllLayersData(this.props.worldName)
                    .then(layers => this.refresh(layers || []))
                    .catch(error => this.refresh([]));
            })
            .catch(error => this.refresh([]));
    };

    // set state to initial state
    setInitState = () =>
        this.setState({
                selectedLayer: null,
                displayDialog: false,
                displayFooter: true
        });

    // update the App store and refresh the page
    refresh = (layers: IWorldLayer[]) => {
        console.log("Layer Data Table: updateLayers...");
        const name = this.props.worldName;
        this.props.updateWorld({ name, layers });
        this.setInitState();
    };

    actionTemplate = (rowData: any, column: any) => {
        return (
            <div className="ui-button-icon ui-helper-clearfix">
                <Button type="button" icon="fa-search" className="ui-button-success"
                        onClick={() => {
                            this.setState({selectedLayer: rowData, displayDialog: true});
                            this.displayLayer(rowData);
                        }}/>
                <Button type="button" icon="fa-edit" className="ui-button-warning"
                        onClick={() => {
                            this.setState({selectedLayer: rowData, displayDialog: false});
                            this.editLayer(rowData)
                        }}/>
                <Button type="button" icon="fa-close"
                        onClick={() => {
                            this.setState({selectedLayer: rowData, displayDialog: false});
                            this.deleteLayer(rowData.layer)
                        }}/>
            </div>
        );
    };

    render(){
        return  (
            <div className="content-section implementation">
                <DataTable  value={this.props.world.layers} paginator={true} rows={10} responsive={false}
                            resizableColumns={true} autoLayout={true} style={{margin:'4px 10px'}}
                            header={<Header worldName={this.props.worldName} tableType={`layers`}/>}
                            footer={<Footer worldName={this.props.worldName} />}
                            selectionMode="single" selection={this.state.selectedLayer}
                            onSelectionChange={(e: any)=>{this.setState({selectedLayer: e.data});}}>
                        <Column field="layer.name" header="Name" sortable={true}/>
                        <Column field="store.type" header="Type" sortable={true}/>
                        <Column field="store.format" header="Format" sortable={true}/>
                        <Column field="layer.fileExtension" header="Extension" sortable={true}/>
                        <Column field="''"  header="Date Created" sortable={true}/>
                        <Column field="''" header="Date Modified" sortable={true}/>
                        <Column header="Actions" body={this.actionTemplate} style={{textAlign:'center', width: '6em'}}/>
                </DataTable>

                {this.state.selectedLayer && <div>
                    <Dialog visible={this.state.displayDialog} modal={true}
                            header={`Layer '${this.state.selectedLayer.layer.name}' map preview`}
                            onHide={() => this.refresh(this.props.world.layers)}>
                        <div className="ui-grid ui-grid-responsive ui-fluid">
                            <div id="map" className="map" style={{height:'400px', width:'100%'}}/>
                        </div>
                    </Dialog>
                </div>}

            </div>
        );
    }
}

const mapStateToProps = (state: IState, { worldName }: any) => {
    return {
        world: state.worlds.list.find(({ name, layers }: IWorld) => worldName === name),
        worldName
    }
};

const mapDispatchToProps = (dispatch: any) => ({
    updateWorld: (payload: IWorld) => dispatch(WorldsActions.updateWorldAction(payload)),
    navigateTo: (location: string) => dispatch(push(location))
});

export default connect(mapStateToProps, mapDispatchToProps)(LayersDataTable);

// onRowSelect={(e: any)=>{this.setState({selectedLayer: e.data});}}>
// <Column field="imageData.file.dateCreated"  header="Date Created" sortable={true}/>
// <Column field="imageData.file.dateModified" header="Date Modified" sortable={true}/>
// <Column field="inputData.affiliation" header="File Affiliation" sortable={false}/>

// table-layout="auto"
// tableStyle="width:auto"
// tableStyle="table-layout:auto"
// autoLayout={true}
// columnResizeMode="expand"

// map.zoomToMaxExtent();



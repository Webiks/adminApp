import * as React from 'react';

import { LayerService } from "../services/LayerService";
import { IWorld } from "../interfaces/IWorld";
import { IWorldLayer } from "../interfaces/IWorldLayer";
import { IState } from "../store";
import { connect } from "react-redux";
import { UpdateWorldAction } from "../actions/world.actions";
import { LAYER_TYPES } from "../consts/layer-types";

/* Prime React components */
import 'primereact/resources/primereact.min.css';
import 'primereact/resources/themes/omega/theme.css';
import 'font-awesome/css/font-awesome.css';
import { DataTable } from "primereact/components/datatable/DataTable";
import { Column } from "primereact/components/column/Column";
import { Button } from "primereact/components/button/Button";
import { Dialog } from "primereact/components/dialog/Dialog";
import { InputText } from "primereact/components/inputtext/InputText";
import { Dropdown } from "primereact/components/dropdown/Dropdown";
import UploadFile from './UploadFile';

class LayersDataTable extends React.Component {
    props: any;
    newLayer: boolean;
    worldName: string;
    selectedLayer: any;

    selectedLayerType = {
        srs: '',
        nativeBoundingBox: {
            minx: 0,
            maxx: 0,
            miny: 0,
            maxy: 0
        }
    };

    state: any  = {};

    layerSelectTypes = [
        {label: LAYER_TYPES.LAYER_RASTER, value: LAYER_TYPES.LAYER_RASTER},
        {label: LAYER_TYPES.LAYER_VECTOR, value: LAYER_TYPES.LAYER_VECTOR}
    ];

    // GET: get the world's layers on startUp
    componentDidMount() {
        this.worldName = this.props.world.name;
        LayerService.getLayers(this.worldName)
            .then(layers => this.updateLayers(layers))
            .catch(error => console.log(error.response));
    };

    zeroSelectedLayer = () => {
        this.selectedLayer = {
            name:'',
            layer: {
                id: '',
                name: '',
                type: ''
            },
            data: ''
        };
        this.selectedLayerType.srs = '';
        this.selectedLayerType.nativeBoundingBox.minx = 0;
        this.selectedLayerType.nativeBoundingBox.maxx = 0;
        this.selectedLayerType.nativeBoundingBox.miny = 0;
        this.selectedLayerType.nativeBoundingBox.maxy = 0;
    };

    setToInitState = () => {
        this.setState({
            displayDialog: false
        });
    };

    findSelectedLayerByName() {
        return this.props.world.layers.filter((layer: IWorldLayer) => layer.layer.name === this.selectedLayer.name);
    };

    // ============
    // CRUD Actions
    // ============

    // GET: get the layer's Meta DATA (by demand - On Layer Select)
    onLayerSelect = (e: any): void  => {
        this.newLayer = false;
        this.selectedLayer = e.data;
        console.log("onLayerSelect: selected layer: " + JSON.stringify(this.selectedLayer));
        LayerService.getLayerDetails(this.worldName, this.selectedLayer)
            .then((layer: IWorldLayer) => {
                console.log("onLayerSelect layer: " + JSON.stringify(layer));
                // update the data field according to the layer type
                if (this.selectedLayer.layer.type === 'RASTER'){
                    this.selectedLayerType = this.selectedLayer.data.coverage;
                }
                else if (this.selectedLayer.layer.type === 'VECTOR'){
                    this.selectedLayerType = this.selectedLayer.data.featureType;
                }
                else{
                    console.error("Can't get the layer type");
                }
                console.log("onLayerSelect: selected Layer TYPE: " + JSON.stringify(this.selectedLayerType));

                this.update(layer);
                this.setState({
                    displayDialog: true
                });
                console.log("onLayerSelect layers: " + JSON.stringify(this.props.world.layers));
            })
            .catch(error => console.log(error));
    };

    // PUT: Update and save
    update = (layer: IWorldLayer) => {
        const layers = [...this.props.world.layers];
        console.log("update: " + JSON.stringify(this.findSelectedLayerByName()));
        layers[this.findSelectedLayerByName()] = layer;
        this.updateLayers(layers);
    };

    updateLayers = (layers: IWorldLayer[]) => {
        const name = this.worldName;
        this.props.updateWorld({ name, layers });
    };

    save = () => {
        const layers = [...this.props.world.layers];
        if (this.newLayer){
            layers.push(this.selectedLayer);
        }
        else{
            console.log("save: " + JSON.stringify(this.findSelectedLayerByName()));
            layers[this.findSelectedLayerByName()] = this.selectedLayer;
        }
        this.updateLayers(layers);
        this.setToInitState();
    };

    updateProperty = (property: string, value: any) => {
        const layer = this.selectedLayer;
        layer[property] = value;
        this.update(layer);
    };

    // DELETE
    delete = () => {
        LayerService.deleteLayerById(this.worldName, this.state.layer)
        // LayerService.deleteLayerById(this.worldName, this.state.layer.name)
            .then (res => {
                if (res !== 'error'){
                    const layers = this.props.world.layers.filter((layer: IWorldLayer) =>
                        layer.layer.name !== this.selectedLayer.name);
                    this.updateLayers(layers);
                    this.setToInitState();
                }
                else{
                    console.error("error: " + res.message);
                }
            })
            .catch(error => console.log(error.response));
    };

    // ADD New layer
    addNew = () => {
        this.newLayer = true;
        this.zeroSelectedLayer();
        this.setState({
            displayDialog: true
        });
    };

    render() {
        const header = <div className="ui-helper-clearfix" style={{ lineHeight: '1.87em' }}>The Layers List </div>;
        const uploader = <div className="ui-fileupload" style={{ width: '100%'}}>
            <UploadFile/>
        </div>;

        const dialogFooter = <div className="ui-dialog-buttonpane ui-helper-clearfix">
            <Button icon="fa-close" label="Delete" onClick={this.delete}/>
            <Button label="Save" icon="fa-check" onClick={this.save}/>
        </div>;

        return (
            <div>

                <div className="content-section implementation">
                    <DataTable value={this.props.world.layers} paginator={true} rows={15} header={header} footer={uploader}
                               selectionMode="single" selection={this.selectedLayer}
                               onSelectionChange={ (e: any) => this.selectedLayer = e.data}
                               onRowSelect={this.onLayerSelect}>
                        <Column field="name" header="Name" sortable={true}/>
                        <Column field="layer.type" header="Type" sortable={true}/>
                    </DataTable>

                    <Dialog visible={this.state.displayDialog} header="Layer's Details" modal={true} footer={dialogFooter} onHide={() => this.setState({displayDialog: false})}>
                        {this.selectedLayer && <div className="ui-grid ui-grid-responsive ui-fluid">
                            <div className="ui-grid-row">
                                <div className="ui-grid-col-4" style={{padding:'4px 10px'}}><label htmlFor="id">ID</label></div>
                                <div className="ui-grid-col-8" style={{padding:'4px 10px'}}>
                                    <InputText id="id" value={this.selectedLayer.layer.id}/>
                                </div>
                            </div>
                            <div className="ui-grid-row">
                                <div className="ui-grid-col-4" style={{padding:'4px 10px'}}><label htmlFor="name">Name</label></div>
                                <div className="ui-grid-col-8" style={{padding:'4px 10px'}}>
                                    <InputText id="name" onChange={(e: any) => {this.updateProperty('name', e.target.value)}} value={this.selectedLayer.name}/>
                                </div>
                            </div>
                            <div className="ui-grid-row">
                                <div className="ui-grid-col-4" style={{padding:'4px 10px'}}><label htmlFor="type">Type</label></div>
                                <div className="ui-grid-col-8" style={{padding:'4px 10px'}}>
                                    <Dropdown  id="type"  value={this.selectedLayer.layer.type} options={this.layerSelectTypes}
                                               onChange={(e: any) => {this.updateProperty('layer.type', e.value)}} style={{width:'150px'}} placeholder="Select a Type"/>
                                </div>
                            </div>
                            <div className="ui-grid-row">
                                <div className="ui-grid-col-4" style={{padding:'4px 10px'}}><label htmlFor="srs">Projection</label></div>
                                <div className="ui-grid-col-8" style={{padding:'4px 10px'}}>
                                    <InputText id="srs" value={this.selectedLayerType.srs}/>
                                </div>
                            </div>
                            <div className="ui-grid-row">
                                <div className="ui-grid-col-4" style={{padding:'4px 10px'}}><label htmlFor="id">Bounding Box</label></div>
                                <div className="ui-grid-col-8" style={{padding:'4px 10px'}}>
                                    <InputText id="nativeBoundingBoxminX" value={this.selectedLayerType.nativeBoundingBox.minx}/>
                                    <InputText id="nativeBoundingBoxminX" value={this.selectedLayerType.nativeBoundingBox.maxx}/>
                                    <InputText id="nativeBoundingBoxmaxY" value={this.selectedLayerType.nativeBoundingBox.miny}/>
                                    <InputText id="nativeBoundingBoxminY" value={this.selectedLayerType.nativeBoundingBox.maxy}/>
                                </div>
                            </div>

                        </div>}
                    </Dialog>

                </div>
            </div>
        );
    };
}

const mapStateToProps = (state: IState, { worldName }: any) => {
    return {
        world: state.worlds.list.find(({ name, layers }: IWorld) => worldName === name)
    }
};

const mapDispatchToProps = (dispatch: any) => ({
    updateWorld: (payload: Partial<IWorld>) => dispatch(UpdateWorldAction(payload))
});

export default connect(mapStateToProps, mapDispatchToProps)(LayersDataTable);

// const footer = <div className="ui-helper-clearfix" style={{ width: '100%' }}>
//      <Button style={{ float: 'left' }} icon="fa-plus" label="Add" onClick={this.addNew}/>
// </div>
// onSelectionChange={ (e: any) => this.selectedLayer = e.data}
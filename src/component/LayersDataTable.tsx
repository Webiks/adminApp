import * as React from 'react';

import { IWorld, IWorldLayer } from "../models/modelInterfaces";
import { connect } from "react-redux";
import { UpdateWorldAction } from "../actions/world.actions";

/* Prime React components */
import 'primereact/resources/primereact.min.css';
import 'primereact/resources/themes/omega/theme.css';
import 'font-awesome/css/font-awesome.css';
import { DataTable } from "primereact/components/datatable/DataTable";
import { Column } from "primereact/components/column/Column";
import { LayerService } from "./LayerService";
import { IState } from "../store";
import { Button } from "primereact/components/button/Button";
import { Dialog } from "primereact/components/dialog/Dialog";
import { InputText } from "primereact/components/inputtext/InputText";
import { LAYER_TYPES } from "../consts/layer-types";
import { Dropdown } from "primereact/components/dropdown/Dropdown";

class LayersDataTable extends React.Component {
    props: any;
    newLayer: boolean;
    worldName: string;

    state: any  = {};

    layerSelectTypes = [
        {label: LAYER_TYPES.LAYER_RASTER, value: LAYER_TYPES.LAYER_RASTER},
        {label: LAYER_TYPES.LAYER_VECTOR, value: LAYER_TYPES.LAYER_VECTOR}
    ];

    componentDidMount() {
        this.worldName = this.props.world.name;
        LayerService.getLayers(this.worldName)
            .then(layers => this.updateLayers(layers));
    };

    update = (layer: IWorldLayer) => {
        this.setState({ layer });
        const layers = [...this.props.world.layers];
        console.log("update: " + JSON.stringify(this.findSelectedLayerByName()));
        layers[this.findSelectedLayerByName()] = layer;
        // layers[this.findSelectedLayerIndex()] = layer;
        this.updateLayers(layers);
    };

    setToInitState = () => {
        this.setState({
            displayDialog: false
        });
    };

    updateLayers = (layers: IWorldLayer[]) => {
        this.setState({ layers });
        const name = this.worldName;
        this.props.updateWorld({ name, layers });
    };

    save = () => {
        const layers = [...this.props.world.layers];
        if (this.newLayer){
            layers.push(this.state.layer);
        }
        else{
            console.log("save: " + JSON.stringify(this.findSelectedLayerByName()));
            layers[this.findSelectedLayerByName()] = this.state.layer;
        }
        this.updateLayers(layers);
        this.setToInitState();
    };

    /*
    save = () => {
        const layers = [...this.props.world.layers];
        if (this.newLayer){
            layers.push(this.state.layer);
        }
        else{
            layers[this.findSelectedLayerIndex()] = this.state.layer;
        }
        this.updateLayers(layers);
        this.setToInitState();
    };

    findSelectedLayerIndex() {
        console.log("find selected layer's index: " + JSON.stringify(this.state.selectedLayer));
        return this.props.world.layers.indexOf(this.state.selectedLayer);
    };*/

    delete = () => {
        console.log("delete selected layer: " + JSON.stringify(this.state.selectedLayer));
        const selectedLayer = this.state.selectedLayer;
        console.log("delete layer: " + selectedLayer.name);
        const layers = this.props.world.layers.filter((layer: IWorldLayer) => layer.name !== selectedLayer.name);
        this.updateLayers(layers);
        this.setToInitState();
    };

    findSelectedLayerByName() {
        const selectedLayer = this.state.selectedLayer;
        return this.props.world.layers.filter((layer: IWorldLayer) => layer.name === selectedLayer.name);
    };

    updateProperty = (property: string, value: any) => {
        const layer = this.state.layer;
        layer[property] = value;
        this.setState({ layer });
    };

    onLayerSelect = (e: any): void  => {
        this.newLayer = false;
        LayerService.getLayerDetails(this.worldName, e.data)
            .then((layer: IWorldLayer) => {
                // console.log("onLayerSelect layer: " + JSON.stringify(layer));
                this.update(layer);
                this.setState({
                    // selectedLayer: Object.assign({}, e.data ),
                    displayDialog: true
                });
                console.log("onLayerSelect layers: " + JSON.stringify(this.props.world.layers));
            }).catch(error => console.log(error.message));
    };

    addNew = () => {
        this.newLayer = true;
        this.setState({
            layer: {
                id: `${this.worldName}:`,
                name: '',
                type: '' ,
                projection: '',
                boundingBox: {
                    minX: 0,
                    maxX: 0,
                    minY: 0,
                    maxY: 0
                }
            },
            displayDialog: true
        });
    };

    render() {
        const header = <div className="ui-helper-clearfix" style={{ lineHeight: '1.87em' }}>The Layers List </div>;
        const footer = <div className="ui-helper-clearfix" style={{ width: '100%' }}>
            <Button style={{ float: 'left' }} icon="fa-plus" label="Add" onClick={this.addNew}/>
        </div>;

        const dialogFooter = <div className="ui-dialog-buttonpane ui-helper-clearfix">
            <Button icon="fa-close" label="Delete" onClick={this.delete}/>
            <Button label="Save" icon="fa-check" onClick={this.save}/>
        </div>;

// onRowSelect={this.onLayerSelect}
        return (
            <div>

                <div className="content-section implementation">
                    <DataTable value={this.props.world.layers} paginator={true} rows={15} header={header} footer={footer}
                               selectionMode="single" selection={this.state.selectedLayer} onSelectionChange={ (e: any) => {
                                                this.setState({ selectedLayer: e.data }); }}
                               onRowSelect={this.onLayerSelect}>
                        <Column field="name" header="Name" sortable={true}/>
                        <Column field="type" header="Type" sortable={true}/>
                    </DataTable>

                    <Dialog visible={this.state.displayDialog} header="Layer's Details" modal={true} footer={dialogFooter} onHide={() => this.setState({displayDialog: false})}>
                        {this.state.layer && <div className="ui-grid ui-grid-responsive ui-fluid">
                            <div className="ui-grid-row">
                                <div className="ui-grid-col-4" style={{padding:'4px 10px'}}><label htmlFor="id">ID</label></div>
                                <div className="ui-grid-col-8" style={{padding:'4px 10px'}}>
                                    <InputText id="id" onChange={(e: any) => {this.updateProperty('id', e.target.value)}} value={this.state.layer.id}/>
                                </div>
                            </div>
                            <div className="ui-grid-row">
                                <div className="ui-grid-col-4" style={{padding:'4px 10px'}}><label htmlFor="name">Name</label></div>
                                <div className="ui-grid-col-8" style={{padding:'4px 10px'}}>
                                    <InputText id="name" onChange={(e: any) => {this.updateProperty('name', e.target.value)}} value={this.state.layer.name}/>
                                </div>
                            </div>
                            <div className="ui-grid-row">
                                <div className="ui-grid-col-4" style={{padding:'4px 10px'}}><label htmlFor="type">Type</label></div>
                                <div className="ui-grid-col-8" style={{padding:'4px 10px'}}>
                                    <Dropdown  id="type"  value={this.state.layer.type} options={this.layerSelectTypes}
                                               onChange={(e: any) => {this.updateProperty('type', e.value)}} style={{width:'150px'}} placeholder="Select a Type"/>
                                </div>
                            </div>
                            <div className="ui-grid-row">
                                <div className="ui-grid-col-4" style={{padding:'4px 10px'}}><label htmlFor="resourceUrl">Projection</label></div>
                                <div className="ui-grid-col-8" style={{padding:'4px 10px'}}>
                                    <InputText id="projection" onChange={(e: any) => {this.updateProperty('projection', e.target.value)}} value={this.state.layer.projection}/>
                                </div>
                            </div>
                            <div className="ui-grid-row">
                                <div className="ui-grid-col-4" style={{padding:'4px 10px'}}><label htmlFor="id">Bounding Box</label></div>
                                <div className="ui-grid-col-8" style={{padding:'4px 10px'}}>
                                    <InputText id="boundingBoxMinX" onChange={(e: any) => {this.updateProperty('boundingBox.minX', e.target.value)}} value={this.state.layer.boundingBox.minX}/>
                                    <InputText id="boundingBoxMaxX" onChange={(e: any) => {this.updateProperty('boundingBox.maxX', e.target.value)}} value={this.state.layer.boundingBox.maxX}/>
                                    <InputText id="boundingBoxMinY" onChange={(e: any) => {this.updateProperty('boundingBox.minY', e.target.value)}} value={this.state.layer.boundingBox.minY}/>
                                    <InputText id="boundingBoxMaxY" onChange={(e: any) => {this.updateProperty('boundingBox.maxY', e.target.value)}} value={this.state.layer.boundingBox.maxY}/>
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
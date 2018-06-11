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

class LayersDataTable extends React.Component {
    props: any;
    newLayer: boolean;
    worldName: string;

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

    setToInitState = () => {
        this.setState({
            displayDialog: false
        });
    };

    findSelectedLayerByName() {
        const selectedLayer = this.state.selectedLayer;
        return this.props.world.layers.filter((layer: IWorldLayer) => layer.layer.name === selectedLayer.name);
    };

    // ============
    // CRUD Actions
    // ============

    // GET: get the layer's Meta DATA (by demand)
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
            })
            .catch(error => console.log(error.response));
    };

    // PUT: Update and save
    update = (layer: IWorldLayer) => {
        this.setState({ layer });
        const layers = [...this.props.world.layers];
        console.log("update: " + JSON.stringify(this.findSelectedLayerByName()));
        layers[this.findSelectedLayerByName()] = layer;
        this.updateLayers(layers);
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

    updateProperty = (property: string, value: any) => {
        const layer = this.state.layer;
        layer[property] = value;
        this.setState({ layer });
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

    // DELETE
    delete = () => {
        LayerService.deleteLayerById(this.worldName, this.state.layer)
        // LayerService.deleteLayerById(this.worldName, this.state.layer.name)
            .then (res => {
                if (res !== 'error'){
                    const layers = this.props.world.layers.filter((layer: IWorldLayer) =>
                        layer.layer.name !== this.state.layer.name);
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
        this.setState({
            layer: {
                id: `${this.worldName}:`,
                name: '',
                type: '' ,
                srs: '',
                nativeBoundingBox: {
                    minx: 0,
                    maxx: 0,
                    miny: 0,
                    maxy: 0
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
                                <div className="ui-grid-col-4" style={{padding:'4px 10px'}}><label htmlFor="srs">Projection</label></div>
                                <div className="ui-grid-col-8" style={{padding:'4px 10px'}}>
                                    <InputText id="srs" onChange={(e: any) => {this.updateProperty('srs', e.target.value)}} value={this.state.layer.srs}/>
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

/*
<div className="ui-grid-row">
    <div className="ui-grid-col-4" style={{padding:'4px 10px'}}><label htmlFor="id">Bounding Box</label></div>
    <div className="ui-grid-col-8" style={{padding:'4px 10px'}}>
        <InputText id="nativeBoundingBoxminX" onChange={(e: any) => {this.updateProperty('nativeBoundingBox.minx', e.target.value)}} value={this.state.layer.nativeBoundingBox.minx}/>
        <InputText id="nativeBoundingBoxminX" onChange={(e: any) => {this.updateProperty('nativeBoundingBox.maxx', e.target.value)}} value={this.state.layer.nativeBoundingBox.maxx}/>
        <InputText id="nativeBoundingBoxmaxY" onChange={(e: any) => {this.updateProperty('nativeBoundingBox.miny', e.target.value)}} value={this.state.layer.nativeBoundingBox.miny}/>
        <InputText id="nativeBoundingBoxminY" onChange={(e: any) => {this.updateProperty('nativeBoundingBox.maxy', e.target.value)}} value={this.state.layer.nativeBoundingBox.maxy}/>
    </div>
</div>*/

export default connect(mapStateToProps, mapDispatchToProps)(LayersDataTable);
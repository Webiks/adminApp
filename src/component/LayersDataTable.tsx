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

    getLayerDetails(layer: IWorldLayer) {
        LayerService.getLayerDetails(this.worldName, layer)
            .then((layer: IWorldLayer) => {
                console.log("getLayerMetaData: " + JSON.stringify(layer));
                this.setState({ layer: Object.assign({}, layer ) });
            }).catch(error => console.log(error.message));
    };

    setToInitState() {
        this.setState({
            displayDialog: false
        });
    };

    updateLayers(layers: IWorldLayer[]) {
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
            layers[this.findSelectedLayerIndex()] = this.state.layer;
        }
        this.updateLayers(layers);
        this.setToInitState();
    };

    delete = () => {
        const index: number = this.findSelectedLayerIndex();
        const layers = this.props.world.layers.filter((val: IWorldLayer, i: number) => i !== index);
        this.updateLayers(layers);
        this.setToInitState();
    };

    findSelectedLayerIndex() {
        return this.props.world.layers.indexOf(this.state.selectedLayer);
    };

    updateProperty(property: string, value: any) {
        const layer = this.state.layer;
        layer[property] = value;
        this.setState({ layer });
    };

    onLayerSelect = (e: any): void  => {
        this.newLayer = false;
        this.getLayerDetails(e.data);
        this.setState({
            selectedLayer: Object.assign({}, e.data ),
            layer: Object.assign({}, e.data ),
            displayDialog: true
        });
    };

    /*onLayerSelect = (e: any): void  => {
        this.newLayer = false;
        this.setState({
            displayDialog: true,
            layer: Object.assign({}, e.data)
        });
    };*/

    addNew = () => {
        this.newLayer = true;
        this.setState({
            layer: { name: '', type: '' , resourceUrl: '', id: ''},
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
                                <div className="ui-grid-col-4" style={{padding:'4px 10px'}}><label htmlFor="resourceUrl">URL</label></div>
                                <div className="ui-grid-col-8" style={{padding:'4px 10px'}}>
                                    <InputText id="resourceUrl" onChange={(e: any) => {this.updateProperty('resourceUrl', e.target.value)}} value={this.state.layer.resourceUrl}/>
                                </div>
                            </div>
                            <div className="ui-grid-row">
                                <div className="ui-grid-col-4" style={{padding:'4px 10px'}}><label htmlFor="id">ID</label></div>
                                <div className="ui-grid-col-8" style={{padding:'4px 10px'}}>
                                    <InputText id="id" onChange={(e: any) => {this.updateProperty('id', e.target.value)}} value={this.state.layer.id}/>
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
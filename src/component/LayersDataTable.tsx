import * as React from 'react';

/* Prime React components */
import { DataTable } from 'primereact/components/datatable/DataTable';
import { Column } from 'primereact/components/column/Column';
import { Button } from 'primereact/components/button/Button';
import 'primereact/resources/primereact.min.css';
import 'primereact/resources/themes/omega/theme.css';
import 'font-awesome/css/font-awesome.css';

import { LayerService } from "./LayerService";

interface AppProps {
    world: string;
}

/*
interface AppState {
    layers: Layer[];
}
interface Layer {
    name: string;
    type: string
    format: string;
}*/

export class LayersDataTable extends React.Component {

    constructor(props: AppProps) {
        super(props);
        this.state = {};
        this.layerService = new LayerService(props.world);
        this.save = this.save.bind(this);
        this.delete = this.delete.bind(this);
        this.onLayerSelect = this.onLayerSelect.bind(this);
        this.addNew = this.addNew.bind(this);

    }

    componentDidMount() {
        this.layerService.getLayers(this.props.projectName).then(data => this.setState({ layers: data }));
    }

    save() {
        let layers = [...this.state.layers];
        if (this.newLayer)
            layers.push(this.state.layer);
        else
            layers[this.findSelectedLayerIndex()] = this.state.layer;

        this.setState({ layers: layers, selectedLayer: null, layer: null, displayDialog: false });
    }

    delete() {
        let index = this.findSelectedLayerIndex();
        this.setState({
            cars: this.state.layers.filter((val, i) => i !== index),
            selectedLayer: null,
            car: null,
            displayDialog: false
        });
    }

    findSelectedLayerIndex() {
        return this.state.layers.indexOf(this.state.selectedLayer);
    }

    updateProperty(property, value) {
        let layer = this.state.layer;
        layer[property] = value;
        this.setState({ layer: layer });
    }

    onLayerSelect(e) {
        this.newLayer = false;
        this.setState({
            displayDialog: true,
            layer: Object.assign({}, e.data)
        });
    }

    addNew() {
        this.newLayer = true;
        this.setState({
            layer: { name: '', type: '', format: '' },
            displayDialog: true
        });
    }

    render() {
        let header = <div className="ui-helper-clearfix" style={{ lineHeight: '1.87em' }}>The Layers List </div>;
        let footer = <div className="ui-helper-clearfix" style={{ width: '100%' }}>
            <Button style={{ float: 'left' }} icon="fa-plus" label="Add" onClick={this.addNew}/>
        </div>;

        let dialogFooter = <div className="ui-dialog-buttonpane ui-helper-clearfix">
            <Button icon="fa-close" label="Delete" onClick={this.delete}/>
            <Button label="Save" icon="fa-check" onClick={this.save}/>
        </div>;

        return (
            <div>
                <DataTableSubmenu/>
                <div className="content-section introduction">
                    <div className="feature-intro">
                        <h1>DataTable</h1>
                    </div>
                </div>

                <div className="content-section implementation">
                    <DataTable value={this.state.layers} paginator={true} rows={15} header={header} footer={footer}
                               selectionMode="single" selection={this.state.selectedLayer} onSelectionChange={(e) => {
                        this.setState({ selectedLayer: e.data });
                    }}
                               onRowSelect={this.onLayerSelect}>
                        <Column field="name" header="Name" sortable={true}/>
                        <Column field="type" header="Type" sortable={true}/>
                        <Column field="format" header="Format" sortable={true}/>
                    </DataTable>

                    <Dialog visible={this.state.displayDialog} header="Layer Details" modal={true} footer={dialogFooter}
                            onHide={() => this.setState({ displayDialog: false })}>
                        {this.state.layer && <div className="ui-grid ui-grid-responsive ui-fluid">

                            <div className="ui-grid-row">

                                <div className="ui-grid-col-4" style={{ padding: '4px 10px' }}><label
                                    htmlFor="vin">Name</label></div>

                                <div className="ui-grid-col-8" style={{ padding: '4px 10px' }}>
                                    <InputText id="layerName" onChange={(e) => {
                                        this.updateProperty('name', e.target.value)
                                    }} value={this.state.layer.name}/>
                                </div>

                            </div>
                            <div className="ui-grid-row">
                                <div className="ui-grid-col-4" style={{ padding: '4px 10px' }}><label
                                    htmlFor="year">Year</label></div>
                                <div className="ui-grid-col-8" style={{ padding: '4px 10px' }}>
                                    <InputText id="year" onChange={(e) => {
                                        this.updateProperty('year', e.target.value)
                                    }} value={this.state.layer.year}/>
                                </div>
                            </div>

                            <div className="ui-grid-row">
                                <div className="ui-grid-col-4" style={{ padding: '4px 10px' }}><label
                                    htmlFor="brand">Brand</label></div>
                                <div className="ui-grid-col-8" style={{ padding: '4px 10px' }}>
                                    <InputText id="brand" onChange={(e) => {
                                        this.updateProperty('brand', e.target.value)
                                    }} value={this.state.layer.brand}/>
                                </div>
                            </div>

                            <div className="ui-grid-row">
                                <div className="ui-grid-col-4" style={{ padding: '4px 10px' }}><label
                                    htmlFor="color">Color</label></div>
                                <div className="ui-grid-col-8" style={{ padding: '4px 10px' }}>
                                    <InputText id="color" onChange={(e) => {
                                        this.updateProperty('color', e.target.value)
                                    }} value={this.state.layer.color}/>
                                </div>
                            </div>
                        </div>}
                    </Dialog>
                </div>

                <DataTableCrudDoc/>

            </div>
        );
    }
}
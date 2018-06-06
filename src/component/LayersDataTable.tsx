import * as React from 'react';
/* Prime React components */
import 'primereact/resources/primereact.min.css';
import 'primereact/resources/themes/omega/theme.css';
import 'font-awesome/css/font-awesome.css';
import { IWorld, IWorldLayer } from "../models/modelInterfaces";
import { connect } from "react-redux";
import { UpdateWorldAction } from "../actions/world.actions";
import { DataTable } from "primereact/components/datatable/DataTable";
import { Column } from "primereact/components/column/Column";
import { LayerService } from "./LayerService";
import { IState } from "../store";
import { Button } from "primereact/components/button/Button";
import { Dialog } from "primereact/components/dialog/Dialog";
import { InputText } from "primereact/components/inputtext/InputText";

class LayersDataTable extends React.Component {
    props: any;
    newLayer: boolean;

    state: any = {
        layers: this.props.world.layers,
        selectedLayer: null,
        layer: null,
        displayDialog: false
    };

    constructor(props: any) {
        super(props);

        this.save = this.save.bind(this);
        this.delete = this.delete.bind(this);
        this.onLayerSelect = this.onLayerSelect.bind(this);
        this.addNew = this.addNew.bind(this);
    }

    componentDidMount() {
        LayerService.getLayers(this.props.world.name)
            .then(layers => this.updateLayers(layers));
    }

    updateLayers(layers: IWorldLayer[]){
        // update the local state
        this.setState({
            layers,
            selectedLayer: null,
            car: null,
            displayDialog: false
        });
        // update the global store
        const name = this.props.world.name;
        this.props.updateWorld({ name, layers });
    }

    save() {
        const layers = [...this.props.world.layers];
        if (this.newLayer){
            layers.push(this.state.layer);
        }
        else{
            layers[this.findSelectedLayerIndex()] = this.state.layer;
        }
        this.updateLayers(layers);
    }

    delete() {
        const index: number = this.findSelectedLayerIndex();
        const layers = this.state.layers.filter((val: IWorldLayer, i: number) => i !== index);
        this.updateLayers(layers);
    }

    findSelectedLayerIndex() {
        return this.state.layers.indexOf(this.state.selectedLayer);
    }

    updateProperty(property: string, value: any) {
        const layer = this.state.layer;
        layer[property] = value;
        this.setState({ layer });
    }

    // React.FormEvent<HTMLInputElement>

    onLayerSelect(e: any): void {
        this.newLayer = false;
        this.setState({
            displayDialog: true,
            layer: Object.assign({}, e.data)
        });
    }

    addNew() {
        this.newLayer = true;
        this.setState({
            layer: { name: '', type: '' },
            displayDialog: true
        });
    }


    render() {
        const header = <div className="ui-helper-clearfix" style={{ lineHeight: '1.87em' }}>The Layers List </div>;
        const footer = <div className="ui-helper-clearfix" style={{ width: '100%' }}>
            <Button style={{ float: 'left' }} icon="fa-plus" label="Add" onClick={this.addNew}/>
        </div>;

        const dialogFooter = <div className="ui-dialog-buttonpane ui-helper-clearfix">
            <Button icon="fa-close" label="Delete" onClick={this.delete}/>
            <Button label="Save" icon="fa-check" onClick={this.save}/>
        </div>;


        return (
            <div>

                <div className="content-section implementation">
                    <DataTable value={this.state.layers} paginator={true} rows={15} header={header} footer={footer}
                               selectionMode="single" selection={this.state.selectedLayer} onSelectionChange={(e) => {
                        this.setState({ selectedLayer: e.data });
                    }}
                               onRowSelect={this.onLayerSelect}>
                        <Column field="name" header="Name" sortable={true}/>
                        <Column field="type" header="Type" sortable={true}/>
                    </DataTable>

                    <Dialog visible={this.state.displayDialog} header="Car Details" modal={true} footer={dialogFooter} onHide={() => this.setState({displayDialog: false})}>
                        {this.state.car && <div className="ui-grid ui-grid-responsive ui-fluid">
                            <div className="ui-grid-row">
                                <div className="ui-grid-col-4" style={{padding:'4px 10px'}}><label htmlFor="vin">Vin</label></div>
                                <div className="ui-grid-col-8" style={{padding:'4px 10px'}}>
                                    <InputText id="vin" onChange={(e: any) => {this.updateProperty('vin', e.target.value)}} value={this.state.car.vin}/>
                                </div>
                            </div>
                            <div className="ui-grid-row">
                                <div className="ui-grid-col-4" style={{padding:'4px 10px'}}><label htmlFor="year">Year</label></div>
                                <div className="ui-grid-col-8" style={{padding:'4px 10px'}}>
                                    <InputText id="year" onChange={(e: any) => {this.updateProperty('year', e.target.value)}} value={this.state.car.year}/>
                                </div>
                            </div>
                            <div className="ui-grid-row">
                                <div className="ui-grid-col-4" style={{padding:'4px 10px'}}><label htmlFor="brand">Brand</label></div>
                                <div className="ui-grid-col-8" style={{padding:'4px 10px'}}>
                                    <InputText id="brand" onChange={(e: any) => {this.updateProperty('brand', e.target.value)}} value={this.state.car.brand}/>
                                </div>
                            </div>
                            <div className="ui-grid-row">
                                <div className="ui-grid-col-4" style={{padding:'4px 10px'}}><label htmlFor="color">Color</label></div>
                                <div className="ui-grid-col-8" style={{padding:'4px 10px'}}>
                                    <InputText id="color" onChange={(e: any) => {this.updateProperty('color', e.target.value)}} value={this.state.car.color}/>
                                </div>
                            </div>
                        </div>}
                    </Dialog>

                </div>
            </div>
        );
    }

    /*
    render() {
        const layerTableData = this.props.world.layers.map( (tableLyaer: any) => this.parseTableLayer(this.props.world.name, tableLyaer));
        console.log("layerTableData: " + JSON.stringify(layerTableData));

        const cols = [
            {field: 'name', header: 'Name'},
            {field: 'type', header: 'Type'}
        ];

        const dynamicColumns = cols.map((col,i) => {
            console.log("dynamicColumns: " + col.field.valueOf());
            return <Column key={col.field} field={col.field} header={col.header} />;
        });

        return (
            <DataTable value={layerTableData}>
                {dynamicColumns}
            </DataTable>
        );
    }

    private parseTableLayer(worldName: string, dataLayer: any): Partial<IWorldLayer> {
        return {
            name: dataLayer.name,
            type: dataLayer.type
        };
    }*/
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
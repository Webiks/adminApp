import * as React from 'react';
import { IWorld } from '../interfaces/IWorld';
import { connect } from 'react-redux';
import { IState } from '../store';
import { InputText } from 'primereact/components/inputtext/InputText';
import { WorldsActions } from '../actions/world.actions';
import { ITBAction } from '../consts/action-types';
import { IWorldLayer } from '../interfaces/IWorldLayer';

/* Prime React components */
import 'primereact/resources/primereact.min.css';
import 'primereact/resources/themes/omega/theme.css';
import 'font-awesome/css/font-awesome.css';
import { Button } from 'primereact/components/button/Button';
import { DataTable } from 'primereact/components/datatable/DataTable';
import { Column } from 'primereact/components/column/Column';
import Header from './DataTable/Header';
import { AFFILIATION_TYPES } from '../consts/layer-types';
import { Dropdown } from 'primereact/components/dropdown/Dropdown';

export interface IPropsLayer {
    layerName: string,
    worldName: string,
    world: IWorld,
    updateWorld: (worlds: Partial<IWorld>) => ITBAction,
    updateLayers: (layers: IWorldLayer[]) => void
}

export interface ILayerDetailsState {
    layer: IWorldLayer
}

export interface IPropertiesList {
    label: string,
    value: any
}

class LayerEditor extends React.Component {

    props: IPropsLayer;
    newLayer: boolean;
    state: ILayerDetailsState;
    selectedLayer: any ;
    layerIndex: number;

    layerAffiliationTypes = [
        {label: AFFILIATION_TYPES.AFFILIATION_INPUT, value: AFFILIATION_TYPES.AFFILIATION_INPUT},
        {label: AFFILIATION_TYPES.AFFILIATION_OUTPUT, value: AFFILIATION_TYPES.AFFILIATION_OUTPUT},
        {label: AFFILIATION_TYPES.AFFILIATION_UNKNOWN, value: AFFILIATION_TYPES.AFFILIATION_UNKNOWN}
    ];

    propertiesList: IPropertiesList[];

    componentDidMount() {
        this.selectedLayer = this.findSelectedLayerByName();
        this.layerIndex = this.findSelectedLayerIndex();
        console.error("DETAILS: selected Layer: " + this.selectedLayer.layer.name);
        console.error("DETAILS: Layer Index: " + this.layerIndex);
        this.setState( { layer: this.selectedLayer });

        // set the table rows
        this.propertiesList = [
            {label: 'world name', value: this.props.worldName},
            {label: 'file name', value: <div className="ui-grid-row">
                    <div className="ui-grid-col-8" style={{padding:'4px 10px'}}>
                        <InputText id="name" onChange={(e: any) => {this.updateProperty('name', e.target.value)}}
                                   value={this.props.layerName}/>
                    </div>
                </div>},
            {label: 'file type', value: this.selectedLayer.layer.type},
            {label: 'file format', value: `${this.selectedLayer.store.format}: (${this.selectedLayer.layer.fileExtension})`},
            {label: 'folder path', value: this.selectedLayer.layer.filePath},
            {label: 'image date taken', value: null},
            {label: 'image date modified', value: null},
            {label: 'GPS (center point)', value: `${this.selectedLayer.data.center[0]} , ${this.selectedLayer.data.center[1]}`},
            {label: 'GSD (cm)', value: <div className="ui-grid-row">
                    <div className="ui-grid-col-8" style={{padding:'4px 10px'}}>
                        <InputText id="gsd" onChange={(e: any) => {this.updateProperty('gsd', e.target.value)}}
                                   value={0}/>
                    </div>
                </div>},
            {label: 'flight altitude (m)', value: <div className="ui-grid-row">
                    <div className="ui-grid-col-8" style={{padding:'4px 10px'}}>
                        <InputText id="flightAltitude" onChange={(e: any) => {this.updateProperty('flightAltitude', e.target.value)}}
                                   value={0}/>
                    </div>
                </div>},
            {label: 'cloud coverage (%)', value: <div className="ui-grid-row">
                    <div className="ui-grid-col-8" style={{padding:'4px 10px'}}>
                        <InputText id="cloudCoveragePercentage" onChange={(e: any) => {this.updateProperty('cloudCoveragePercentage', e.target.value)}}
                                   value={0}/>
                    </div>
                </div>},
            {label: 'sensor maker', value: <div className="ui-grid-row">
                    <div className="ui-grid-col-8" style={{padding:'4px 10px'}}>
                        <InputText id="sensorMaker" onChange={(e: any) => {this.updateProperty('sensorMaker', e.target.value)}}
                                   value={''}/>
                    </div>
                </div>},
            {label: 'sensor name', value: <div className="ui-grid-row">
                    <div className="ui-grid-col-8" style={{padding:'4px 10px'}}>
                        <InputText id="sensorName" onChange={(e: any) => {this.updateProperty('sensorName', e.target.value)}}
                                   value={''}  />
                    </div>
                </div>},
            {label: 'sensor bands', value: <div className="ui-grid-row">
                    <div className="ui-grid-col-8" style={{padding:'4px 10px'}}>
                        <InputText id="sensorBands1" placeholder={'1'}
                                   onChange={(e: any) => {this.updateProperty('sensorBands1', e.target.value)}}
                                   value={''}/>
                        <InputText id="sensorBands2" placeholder={'2'}
                                   onChange={(e: any) => {this.updateProperty('sensorBands2', e.target.value)}}
                                   value={''}/>
                        <InputText id="sensorBands3" placeholder={'3'}
                                   onChange={(e: any) => {this.updateProperty('sensorBands3', e.target.value)}}
                                   value={''}/>
                        <InputText id="sensorBands4" placeholder={'4'}
                                   onChange={(e: any) => {this.updateProperty('sensorBands4', e.target.value)}}
                                   value={''}/>
                    </div>
                </div>},
            {label: 'file affiliation', value: <div className="ui-grid-row">
                    <div className="ui-grid-col-8" style={{padding:'4px 10px'}}>
                        <Dropdown id="affiliation" options={this.layerAffiliationTypes}
                                  onChange={(e: any) => {this.updateProperty('affiliation', e.target.value)}}
                                  value={AFFILIATION_TYPES.AFFILIATION_UNKNOWN}  />
                    </div>
                </div>}
        ];
    };

    findSelectedLayerByName = () => {
        return this.props.world.layers.find((layer: IWorldLayer) => layer.layer.name === this.props.layerName);
    };

    findSelectedLayerIndex() {
        return this.props.world.layers.indexOf(this.selectedLayer);
    }

    // PUT: Update and save
    update = (layer: IWorldLayer) => {
        const layers = [...this.props.world.layers];
        console.log("update: " + JSON.stringify(layer));
        layers[this.layerIndex] = layer;
        this.refresh(layers);
    };

    save = () => {
        const layers = [...this.props.world.layers];
        if (this.newLayer){
            layers.push(this.selectedLayer);
        }
        else{
            console.log("save: " + JSON.stringify(this.findSelectedLayerByName()));
            layers[this.layerIndex] = this.selectedLayer;
        }
        this.props.updateLayers(layers);
        this.refresh(layers);
    };

    updateProperty = (property: string, value: any) => {
        const layer = this.selectedLayer;
        layer[property] = value;
        this.update(layer);
    };

    // update the store and refresh the page
    refresh = (layers: IWorldLayer[]) => {
        console.log("Layer Details: updateLayers...");
        const name = this.props.worldName;
        this.props.updateWorld({ name, layers });
        this.setState( { layer: this.selectedLayer });
    };

    cancel = () => {
        console.log("cancel");
    };

    render(){

        const editorFooter =
            <div className="ui-dialog-buttonpane ui-helper-clearfix">
                <Button label="Save" icon="fa-check" onClick={this.save}/>
                <Button icon="fa-close" label="Cancel" onClick={this.cancel}/>
            </div>;

        return  (
            <div>
                { this.selectedLayer && <div className="content-section implementation" style={{textAlign: 'left', width: '70%', margin: 'auto'}}>
                    <DataTable  value={this.propertiesList} paginator={true} rows={10} responsive={false}
                                header={<Header worldName={this.props.worldName} tableType={`editor`}/>}
                                footer={editorFooter}>
                        <Column field="label" header="Propery" sortable={true}/>
                        <Column field="value" header="Value" sortable={false}/>
                    </DataTable>
                </div> }
            </div>
        )
    }
}

const mapStateToProps = (state: IState, { worldName, layerName }: any) => {
    return {
        world: state.worlds.list.find(({ name, layers }: IWorld) => worldName === name),
        worldName, layerName
    }
};

const mapDispatchToProps = (dispatch: any) => ({
    updateWorld: (payload: IWorld) => dispatch(WorldsActions.updateWorldAction(payload))
});

export default connect(mapStateToProps, mapDispatchToProps)(LayerEditor);

//  {label: 'image date taken', value: this.selectedLayer.image.dateCreated},
//  {label: 'image date modified', value: this.selectedLayer.image.dateModified},

// value={this.state.layer.inputData.GDS ? this.state.layer.inputData.GDS : 0 }/>
// value={this.state.layer.inputData.flightAltitude ? this.state.layer.inputData.flightAltitude : 0 }/>
// value={this.state.layer.inputData.cloudCoveragePercentage ? this.state.layer.inputData.cloudCoveragePercentage : 0 }/>
// value={this.state.layer.inputData.sensor.maker ? this.state.layer.inputData.sensor.maker : ''}/>
// value={this.state.layer.inputData.sensor.name ? this.state.layer.inputData.sensor.name : ''}  />
// value={this.state.layer.inputData.sensor.bands[0] ? this.state.layer.inputData.sensor.bands[0] : ''}/>
// value={this.state.layer.inputData.affiliation ? this.state.layer.inputData.affiliation : AFFILIATION_TYPES.AFFILIATION_UNKNOWN}  />


import * as React from 'react';
import { IWorld } from '../../interfaces/IWorld';
import { connect } from 'react-redux';
import { IState } from '../../store';
import { WorldsActions } from '../../actions/world.actions';
import { IWorldLayer } from '../../interfaces/IWorldLayer';
import UploadFile from '../UploadFile';
import { push } from 'react-router-redux';
import Header from './Header';

/* Prime React components */
import 'primereact/resources/primereact.min.css';
import 'primereact/resources/themes/omega/theme.css';
import 'font-awesome/css/font-awesome.css';
import { DataTable } from 'primereact/components/datatable/DataTable';
import { Column } from 'primereact/components/column/Column';
import { Button } from 'primereact/components/button/Button';
import { ITBAction } from '../../consts/action-types';
import { LayerService } from '../../services/LayerService';
import { ILayer } from '../../interfaces/ILayer';

export interface IPropsLayers {
    worldName: string,
    world: IWorld,
    updateWorld: (worlds: IWorld) => ITBAction,
    navigateTo: (layerName: string) => void
}

export interface IStateTable {
    selectedLayer: any
}

class LayersDataTable extends React.Component {

    props: IPropsLayers;

    state: IStateTable = {
        selectedLayer: this.props.world.layers[0]
    };

    viewLayer = (layer: IWorldLayer) => {
        console.log("start view layer: " + layer.name);
    };

    editLayer = (layer: IWorldLayer) => {
        console.log(`navigate to layer:${layer.name} form page`);
        this.props.navigateTo(`${this.props.worldName}/${layer.name}`);
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

    // update the App store and refresh the page
    refresh = (layers: IWorldLayer[]) => {
        console.log("Layer Data Table: updateLayers...");
        const name = this.props.worldName;
        this.props.updateWorld({ name, layers });
    };

    // DELETE
    /*
    delete = () => {
        LayerService.deleteLayerById(this.worldName, this.selectedLayer)
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
    };*/

    actionTemplate = (rowData: any, column: any) => {
        return (
            <div className="ui-button-icon ui-helper-clearfix">
                <Button type="button" icon="fa-search" className="ui-button-success"
                        onClick={() => this.viewLayer(rowData.layer)}/>
                <Button type="button" icon="fa-edit" className="ui-button-warning"
                        onClick={() => this.editLayer(rowData.layer) }/>
                <Button type="button" icon="fa-close"
                        onClick={() => this.deleteLayer(rowData.layer)}/>
            </div>
        );
    };

    render(){
        return  (
            <DataTable  value={this.props.world.layers} paginator={true} rows={10} responsive={false}
                        resizableColumns={true} autoLayout={true} style={{margin:'4px 10px'}}
                        header={<Header worldName={this.props.worldName} tableType={`layers`}/>}
                        footer={<UploadFile worldName={this.props.worldName} />}
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

// <div className="ui-dialog-buttonpane ui-helper-clearfix">
//                 <Button type="button" icon="fa-search" label="view" className="ui-button-success" onClick={(e: any) => this.viewLayer(this.state.selectedLayer)}/>
//                 <Button type="button" icon="fa-edit" label="edit" className="ui-button-warning" onClick={(e: any) => this.editLayer(this.state.selectedLayer)}/>
//                 <Button type="button" icon="fa-close" label="delete" onClick={(e: any) => this.deleteLayer(this.state.selectedLayer)}/>
//             </div>
// table-layout="auto"
// tableStyle="width:auto"
// tableStyle="table-layout:auto"
// autoLayout={true}
// columnResizeMode="expand"
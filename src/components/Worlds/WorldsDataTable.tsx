import * as React from 'react';
import { IWorld } from '../../interfaces/IWorld';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { IState } from '../../store';
import { WorldsActions } from '../../actions/world.actions';
import { ITBAction } from '../../consts/action-types';

import Header from '../DataTable/Header';
import { cloneDeep, get } from 'lodash';

/* Prime React components */
import 'primereact/resources/themes/omega/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'font-awesome/css/font-awesome.css';
import { DataTable } from 'primereact/components/datatable/DataTable';
import { Column } from 'primereact/components/column/Column';
import { Button } from 'primereact/components/button/Button';
import { Dialog } from 'primereact/components/dialog/Dialog';
import { InputText } from 'primereact/components/inputtext/InputText';
import { WorldService } from '../../services/WorldService';
import WorldEditor from '../World/WorldEditor';
import { IStateTable } from '../WorldLayers/LayersDataTable';


export interface IPropsLayers {
    worldsList: IWorld[],
    setWorlds: (worlds: IWorld[]) => ITBAction
    navigateTo: (layerName: string) => void
}

export interface IStateWorldsTable {
    selectedWorld: any,
    displayDialog: boolean
}

class WorldsDataTable extends React.Component {

    props: IPropsLayers;
    state: IStateWorldsTable = {
        selectedWorld: null,
        displayDialog: false
    };

    editWorld = (rowData) => {
        this.setState({
            displayDialog: true,
            selectedWorld: {...rowData}});
    };

    findSelectedWorldIndex = (rowData) => {
        return this.props.worldsList.indexOf(rowData);
    };

    goToSelectedWorld = (e) => {
        this.setState({
            selectedWorld: e.data,
            displayDialog: false});
        this.props.navigateTo(`/${e.data.name}`);
    };

    deleteWorld = (rowData) => {
        confirm(`Are sure you want to DELETE ${rowData.name}?`);
        const index = this.findSelectedWorldIndex(rowData);
        console.warn("deleteWorld index: " + index);
        this.setState({
            worlds: this.props.worldsList.filter((val,i) => i !== index),
            selectedWorld: null,
            displayDialog: false});
        this.refresh();
        /*
        WorldService.deleteWorldByName(world)
            .then(response => {
                console.log("LAYER DATA TABLE: delete layer - getAllLayersData...");
                // get the new layers' list
                LayerService.getAllLayersData(this.props.worldName)
                    .then(layers => this.refresh(layers || []))
                    .catch(error => this.refresh([]));
            })
            .catch(error => this.refresh([]));*/
    };

    // set state to initial state
    setInitState = () =>
        this.setState({
            selectedWorld: null,
            displayDialog: false
        });

    // update the App store and refresh the page
    refresh = () => {
        const worlds = [...this.props.worldsList];
        worlds[this.findSelectedWorldIndex(this.state.selectedWorld)] = this.state.selectedWorld;
        this.props.setWorlds([...worlds]);
        this.setInitState();
        console.log("Worlds Home Page: REFRESH..." + JSON.stringify([...worlds]));
    };

    addNew = () => {
        this.setState({
            selectedWorld: {
                name: 'new'
            },
            displayDialog: true
        });
    };

    actionsButtons = (rowData: any, column: any) => {
        return (
            <div className="ui-button-icon ui-helper-clearfix" onClick={($event) => $event.stopPropagation()}>
                <Button type="button" icon="fa fa-edit" className="ui-button-warning" style={{margin: '3px 7px'}}
                        onClick={() => this.editWorld(rowData)}/>
                <Button type="button" icon="fa fa-close" style={{margin: '3px 7px'}}
                        onClick={() => this.deleteWorld(rowData)}/>
            </div>
        );
    };

    render(){

        console.log("World Data Table (render): selected world :" + JSON.stringify(this.state.selectedWorld));
        console.log("World Data Table: RENDER Data Table" + JSON.stringify(this.props.worldsList));

        const footer = <div className="ui-helper-clearfix" style={{width:'100%'}}>
            <Button icon="fa fa-plus" label="Add" onClick={this.addNew} style={{margin:'auto'}}/>
        </div>;

        return  (
            <div className="content-section implementation">
                {this.props.worldsList && <div>
                    <DataTable  value={this.props.worldsList} paginator={true} rows={10} responsive={true}
                                resizableColumns={true} autoLayout={true} style={{margin:'10px 20px'}}
                                header={<Header worldName={'worlds'} tableType={'worlds'}/>}
                                footer={footer}
                                selectionMode="single" selection={this.state.selectedWorld}
                                onSelectionChange={(e: any)=> this.setState({selectedLayer: e.data})}
                                onRowSelect={this.goToSelectedWorld}>
                        <Column field="name" header="Name" sortable={true} style={{textAlign:'left', padding:'7px 20px', width: '20%'}}/>
                        <Column field="country" header="Country" sortable={true} style={{width: '15%'}}/>
                        <Column field="desc" header="Description" sortable={false}/>
                        <Column header="Actions" body={this.actionsButtons} style={{width: '12%'}} />
                    </DataTable>
                </div>}

                {this.state.selectedWorld && <div>
                    <Dialog visible={this.state.displayDialog} modal={true}
                            header={`${this.state.selectedWorld.name} World Details`}
                            responsive={true} style={{width:'50%'}}
                            onHide={() => this.refresh()}>
                        <div className="ui-grid ui-grid-responsive ui-fluid">
                            <WorldEditor worldName={this.state.selectedWorld.name}/>
                        </div>
                    </Dialog>
                </div>}

            </div>
        );
    }
}

const mapStateToProps = (state: IState) => {
    return {
        worldsList: state.worlds.list
    }
};

const mapDispatchToProps = (dispatch: any) => ({
    setWorlds: (payload: IWorld[]) => dispatch(WorldsActions.setWorldsAction(payload)),
    updateWorld: (payload: IWorld) => dispatch(WorldsActions.updateWorldAction(payload)),
    navigateTo: (location: string) => dispatch(push(location))
});

export default connect(mapStateToProps, mapDispatchToProps)(WorldsDataTable);



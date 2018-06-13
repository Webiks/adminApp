/*import * as React from "react";

import { UpdateWorldAction } from "../actions/world.actions";
import { IState } from "../store";
import { IWorld } from "../interfaces/IWorld";
import { connect } from "react-redux";*/

/* Prime React components */
/*import 'primereact/resources/primereact.min.css';
import 'primereact/resources/themes/omega/theme.css';
import 'font-awesome/css/font-awesome.css';
import { Dialog } from "primereact/components/dialog/Dialog";
import { InputText } from "primereact/components/inputtext/InputText";
import { Dropdown } from "primereact/components/dropdown/Dropdown";

const DialogComponent =
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

const mapStateToProps = (state: IState, { worldName }: any) => {
    return {
        world: state.worlds.list.find(({ name, layers }: IWorld) => worldName === name)
    }
};

const mapDispatchToProps = (dispatch: any) => ({
    updateWorld: (payload: Partial<IWorld>) => dispatch(UpdateWorldAction(payload))
});

export default connect(mapStateToProps, mapDispatchToProps)(DialogComponent);*/
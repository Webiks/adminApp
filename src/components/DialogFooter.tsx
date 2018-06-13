/*import * as React from "react";

import { UpdateWorldAction } from "../actions/world.actions";
import { IState } from "../store";
import { IWorld } from "../interfaces/IWorld";
import { connect } from "react-redux";*/

/* Prime React components */
/*import 'primereact/resources/primereact.min.css';
import 'primereact/resources/themes/omega/theme.css';
import 'font-awesome/css/font-awesome.css';
import { Button } from "primereact/components/button/Button";
import LayersDataTable from "./LayersDataTable";

// =============================================================================================================

const props: any;

const crudTable = new LayersDataTable(props);

const dialogFooter =
    <div className="ui-dialog-buttonpane ui-helper-clearfix">
        <Button icon="fa-close" label="Delete" onClick={crudTable.delete}/>
        <Button label="Save" icon="fa-check" onClick={crudTable.save}/>
    </div>;

// =============================================================================================================
const mapStateToProps = (state: IState, { worldName }: any) => {
    return {
        world: state.worlds.list.find(({ name, layers }: IWorld) => worldName === name)
    }
};

const mapDispatchToProps = (dispatch: any) => ({
    updateWorld: (payload: Partial<IWorld>) => dispatch(UpdateWorldAction(payload))
});

export default connect(mapStateToProps, mapDispatchToProps)(dialogFooter);*/
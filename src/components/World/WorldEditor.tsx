import * as React from 'react';
import { IWorld } from '../../interfaces/IWorld';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { IState } from '../../store';
import { ITBAction } from '../../consts/action-types';
import { IWorldLayer } from '../../interfaces/IWorldLayer';
import { WorldsActions } from '../../actions/world.actions';
import { AFFILIATION_TYPES } from '../../consts/layer-types';
import Header from '../DataTable/Header';
import { cloneDeep, get } from 'lodash';
import WorldPropertiesList from './WorldPropertiesList';

/* Prime React components */
import 'primereact/resources/themes/omega/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'font-awesome/css/font-awesome.css';
import { Button } from 'primereact/components/button/Button';
import { DataTable } from 'primereact/components/datatable/DataTable';
import { Column } from 'primereact/components/column/Column';
import { InputText } from 'primereact/components/inputtext/InputText';
import { Dropdown } from 'primereact/components/dropdown/Dropdown';

export interface IPropsWorld {
    worldList: IWorld[],
    worldName: string,
    world: IWorld,
    setWorlds: (worlds: IWorld[]) => ITBAction
    updateWorld: (worlds: Partial<IWorld>) => ITBAction,
    navigateTo: (layerName: string) => void
}

export interface IStateDetails {
    world: IWorld,
    worldName: string;
    globalFilter?: any;
}

class WorldEditor extends React.Component {
    props: IPropsWorld;
    state: IStateDetails;

    componentWillMount() {
        this.setState({ world: cloneDeep(this.props.world), worldName: this.props.worldName });
    }

    findSelectedWorldIndex() {
        return this.props.worldList.indexOf(this.props.world);
    };

    // save the changes in the App store
    save = () => {
        const worlds = [...this.props.worldList];
        console.log('save: ' + this.state.worldName);
        worlds[this.findSelectedWorldIndex()] = this.state.world;
        this.refresh(worlds);
    };

    // update the App store and refresh the page
    refresh = (worlds: IWorld[]) => {
        console.log('World Details: refresh...');
        const layers = this.props.world.layers;
        const name = this.props.worldName;
        this.props.updateWorld({ name, layers });
    };

    onEditorValueChange = (props, value) => {
        console.log("onEditorValueChange props: " + JSON.stringify(props));
        const updatedWorld = [...props.value];
        const world = {...this.state.world};
        updatedWorld[props.rowIndex][props.field] = value;
        this.setState({world : updatedWorld} );
    };

    inputTextEditor(props, field) {
        return <InputText type="text" value={props.rowData[field]}
                          onChange={(e: any) => this.onEditorValueChange(props, e.target.value)}/>;
    };

    edit = (props) => this.inputTextEditor(props, props.rowData.field);

    render() {
        const editorFooter =
            <div className="ui-dialog-buttonpane ui-helper-clearfix">
                <Button label="Reset" icon="fa fa-undo" onClick={this.componentWillMount.bind(this)} style={{ padding: '5px 10px', width: '20%' }}/>
                <Button label="Save" icon="fa fa-check" onClick={this.save} style={{ padding: '5px 10px', width: '20%' }}/>
            </div>;

        return (
            <div>
                {this.state.world && <div className="content-section implementation"
                                               style={{ textAlign: 'left', width: '70%', margin: 'auto' }}>
                    <DataTable value={WorldPropertiesList} paginator={false} rows={10} responsive={false}
                               footer={editorFooter} style={{ margin: '10px 20px' }}>
                        <Column field="label" header="Property" sortable={true}
                                style={{ padding: '5px 20px', width: '35%' }}/>
                        <Column field="field" header="Value" sortable={false} style={{ padding: '5px 20px' }}
                                editor={this.edit}/>
                    </DataTable>
                </div>}
            </div>
        )
    }

}

const mapStateToProps = (state: IState, { worldName }: any) => {
    return {
        worldsList: state.worlds.list,
        world: state.worlds.list.find(({ name, layers }: IWorld) => worldName === name)
    }
};

const mapDispatchToProps = (dispatch: any) => ({
    setWorlds: (payload: IWorld[]) => dispatch(WorldsActions.setWorldsAction(payload)),
    updateWorld: (payload: IWorld) => dispatch(WorldsActions.updateWorldAction(payload)),
    navigateTo:  (location: string) => dispatch(push(location))
});

export default connect(mapStateToProps, mapDispatchToProps)(WorldEditor);

//  body={(rowData) => this.inputTextEditor(rowData)}
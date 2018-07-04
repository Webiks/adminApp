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
import { WorldService } from '../../services/WorldService';
import { Dialog } from 'primereact/components/dialog/Dialog';

export interface IPropsWorld {
    worldsList: IWorld[],
    worldName: string,
    world: IWorld,
    setWorlds: (worlds: IWorld[]) => ITBAction
    updateWorld: (worlds: Partial<IWorld>) => ITBAction,
    navigateTo: (layerName: string) => void
}

export interface IStateDetails {
    displayDialog: boolean,
    worldsList: IWorld[],
    world: IWorld,
    worldName: string;
    globalFilter?: any;
}

class WorldEditorOld extends React.Component {
    props: IPropsWorld;
    state: IStateDetails;
    newWorld: boolean;

    componentWillMount() {
        if (this.props.worldName === 'new'){
            this.newWorld = true;
            this.setState({
                displayDialog: true,
                world: {
                    name: 'new',
                    desc: '',
                    country: '',
                    directory: '',
                    layers: []
                }
            });
        } else {
            this.newWorld = false;
            this.setState({
                displayDialog: true,
                world: cloneDeep(this.props.world),
                worldName: this.props.worldName,
                worldsList: this.props.worldsList });
        }
        console.warn("World EDITOR: componentWillMount: props world list: " + JSON.stringify(this.props.worldsList));
    }

    componentDidMount() {
        this.setState({ displayDialog: true });
    }


    findSelectedWorldIndex() {
        return this.props.worldsList.indexOf(this.props.world);
    };

    // save the App state when the field's value is been changed
    onEditorValueChange = (props, value) => {
        const world = {...this.state.world};
        world[props.rowData.field] = value;
        this.setState({world : {...world}} );
    };

    inputTextEditor(props, field) {
        return <InputText type="text" value={props.rowData[field]} placeholder={props.rowData[field]}
                          onChange={(e: any) => this.onEditorValueChange(props, e.target.value)}/>;
    };

    edit = (props) => this.inputTextEditor(props, props.rowData.field);

    // save the changes in the App store
    save = () => {
        console.log('SAVE: world list: ' + JSON.stringify(this.props.worldsList));
        const worlds = [...this.props.worldsList];
        if (this.newWorld){
            WorldService.createWorld(this.state.world.name)
                .then (res => {
                    // WorldService.getWorlds();
                    worlds.push(this.state.world);
                });
        } else {
            worlds[this.findSelectedWorldIndex()] = this.state.world;
        }
        console.warn('save: update worlds' + JSON.stringify(worlds));
        this.refresh(worlds);
    };

    // update the App store World's list and refresh the page
    refresh = (worlds: IWorld[]) => {
        console.log('World Details: refresh the world list...');
        this.setState( { worldsList: worlds,
                               displayDialog: false});
        this.props.setWorlds(worlds);
    };

    render() {

        console.warn("World Editor: RENDER Dialog box: " + JSON.stringify(this.state.world));

        const editorFooter =
            <div className="ui-dialog-buttonpane ui-helper-clearfix">
                <Button label="Reset" icon="fa fa-undo" onClick={this.componentWillMount.bind(this)} style={{ padding: '5px 10px', width: '15%', float: 'left' }}/>
                <Button label="Save" icon="fa fa-check" onClick={this.save} style={{ padding: '5px 10px', width: '15%'}}/>
            </div>;

        return (
            <Dialog visible={this.state.displayDialog} modal={true}
                    header={`${this.props.worldName} World Details`}
                    responsive={true} style={{width:'50%'}}
                    onHide={() => {
                        console.warn("on Hide: worlds list: " + JSON.stringify(this.props.worldsList));
                        this.refresh(this.props.worldsList);
                    }}>
                {this.state.world && <div className="content-section implementation"
                                               style={{ textAlign: 'left', width: '100%', margin: 'auto' }}>
                    <DataTable value={WorldPropertiesList} paginator={false} rows={10} responsive={false}
                               footer={editorFooter}>
                        <Column field="label" header="Property" sortable={true}
                                style={{ padding: '5px 20px', width: '35%' }}/>
                        <Column field="field" header="Value" sortable={false} style={{ padding: '5px 20px' }}
                                editor={this.edit}
                                body={(rowData) => this.state.world[rowData.field]}/>
                    </DataTable>
                </div>}
            </Dialog>
        )
    }

}

const mapStateToProps = (state: IState, { worldName }: any) => {
    return {
        worldsList: state.worlds.list,
        world: state.worlds.list.find(({ name, layers }: IWorld) => worldName === name),
        worldName
    }
};

const mapDispatchToProps = (dispatch: any) => ({
    setWorlds: (payload: IWorld[]) => dispatch(WorldsActions.setWorldsAction(payload)),
    updateWorld: (payload: IWorld) => dispatch(WorldsActions.updateWorldAction(payload)),
    navigateTo:  (location: string) => dispatch(push(location))
});

export default connect(mapStateToProps, mapDispatchToProps)(WorldEditorOld);

//  worldsList: state.worlds.list,
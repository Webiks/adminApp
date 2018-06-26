import * as React from 'react';
import { IWorld } from '../../interfaces/IWorld';
import { connect } from 'react-redux';
import { IState } from '../../store';
import { ITBAction } from '../../consts/action-types';
import { IWorldLayer } from '../../interfaces/IWorldLayer';
import { WorldsActions } from '../../actions/world.actions';
import { AFFILIATION_TYPES } from '../../consts/layer-types';
import Header from '../DataTable/Header';
import propertiesList from './LayerPropertiesList';

/* Prime React components */
import 'primereact/resources/themes/omega/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'font-awesome/css/font-awesome.css';
import { Button } from 'primereact/components/button/Button';
import { DataTable } from 'primereact/components/datatable/DataTable';
import { Column } from 'primereact/components/column/Column';
import { InputText } from 'primereact/components/inputtext/InputText';
import { cloneDeep, get } from 'lodash';
import { Dropdown } from 'primereact/components/dropdown/Dropdown';
import { push } from 'react-router-redux';


export interface IPropsLayer {
    worldName: string,
    layer: IWorldLayer,
    world: IWorld,
    updateWorld: (worlds: Partial<IWorld>) => ITBAction,
    navigateTo: (layerName: string) => void
}

export interface IStateDetails {
    worldLayer: IWorldLayer,
    worldName: string;
    globalFilter?: any;
}

class LayerEditor extends React.Component {
    props: IPropsLayer;
    state: IStateDetails;

    layerAffiliationTypes = [
        { label: AFFILIATION_TYPES.AFFILIATION_INPUT, value: AFFILIATION_TYPES.AFFILIATION_INPUT },
        { label: AFFILIATION_TYPES.AFFILIATION_OUTPUT, value: AFFILIATION_TYPES.AFFILIATION_OUTPUT },
        { label: AFFILIATION_TYPES.AFFILIATION_UNKNOWN, value: AFFILIATION_TYPES.AFFILIATION_UNKNOWN }
    ];

    componentWillMount() {
        this.setState({ worldLayer: cloneDeep(this.props.layer), worldName: this.props.worldName });
    }

    findSelectedLayerIndex() {
        return this.props.world.layers.indexOf(this.props.layer);
    };

    // save the changes in the App store
    save = () => {
        const layers = [...this.props.world.layers];
        console.log('save: ' + this.state.worldLayer.layer.name);
        layers[this.findSelectedLayerIndex()] = this.state.worldLayer;
        this.refresh(layers);
        this.backToWorldPage();
    };

    // update the App store and refresh the page
    refresh = (layers: IWorldLayer[]) => {
        console.log('Layer Details: refresh...');
        console.error('zoom value: ' + this.state.worldLayer.inputData.zoom);
        const name = this.props.worldName;
        this.props.updateWorld({ name, layers });
        console.error('layer (from layers) inputData: ' + JSON.stringify(layers[this.findSelectedLayerIndex()].inputData));
    };

    backToWorldPage = () => this.props.navigateTo('./');

    onEditorValueChange = (props, value) => {
        console.log("onEditorValueChange props: " + JSON.stringify(props));
        const split = props.path.split('.');
        const field = split[1];
        let property = split[2];

        switch(field){
            case ('layer'):
                const layer = {...this.state.worldLayer};
                layer.layer[property] = value;
                this.setState({worldLayer : { ...layer}} );
            case ('inputData'):
                const inputData = {...this.state.worldLayer};
                if (property === 'sensor'){
                    property = split[3];
                    const index = props.path.indexOf('[');
                    if (index > -1){
                        const bandsIndex = parseInt(props.path.substr(index + 1, 1),10);
                        inputData.inputData.sensor.bands[bandsIndex] = (value);
                    } else{
                        inputData.inputData.sensor[property] = value;
                    }
                } else{
                    inputData.inputData[property] = value;
                }
                this.setState({worldLayer : {...inputData}} );
        }
    };

    inputTextEditor(props) {
        switch(props.rowData.type){
            case ('text'):
                return <InputText type="text" value={get(this.state, props.rowData.path)}
                                  onChange={(e: any) => this.onEditorValueChange(props.rowData, e.target.value)}/>;
            case ('number'):
                return <InputText type="number" min={props.rowData.min}
                                  value={get(this.state, props.rowData.path)}
                                  onChange={(e: any) => this.onEditorValueChange(props.rowData, e.target.value)}/>;
            case ('dropdown'):
                return <Dropdown id="affiliation" options={this.layerAffiliationTypes}
                                 value={this.state.worldLayer.inputData.affiliation ? this.state.worldLayer.inputData.affiliation : AFFILIATION_TYPES.AFFILIATION_UNKNOWN }
                                 onChange={(e: any) => this.onEditorValueChange(props.rowData, e.value)}/>;
            default:
                return <InputText type="text" value={get(this.state, props.rowData.path)}
                                  onChange={(e: any) => this.onEditorValueChange(props.rowData, e.target.value)}/>;
        }
    };

    getFieldValue = (rowData) => {
        if (rowData.path === 'worldLayer.data.center') {
            const value0 = (this.state.worldLayer.data.center[0]).toFixed(2);
            const value1 = (this.state.worldLayer.data.center[1]).toFixed(2);
            return value0 + ", " + value1;
        }
        else{
            return get(this.state, rowData.path)
        }
    };

    edit = (props) => {
        if (!props.rowData.readonly){
            return this.inputTextEditor(props);
        } else {
            return this.getFieldValue(props.rowData);
        }
    };

    render() {
        const editorFooter =
            <div className="ui-dialog-buttonpane ui-helper-clearfix">
                <Button label="Save" icon="fa fa-check" onClick={this.save}/>
                <Button label="Reset" icon="fa fa-undo" onClick={this.componentWillMount.bind(this)}/>
                <Button label="Cancel" icon="fa fa-close"  onClick={this.backToWorldPage}/>
            </div>;

        return (
            <div>
                {this.state.worldLayer && <div className="content-section implementation"
                                               style={{ textAlign: 'left', width: '70%', margin: 'auto' }}>
                    <DataTable value={propertiesList} paginator={true} rows={10} responsive={false}
                               header={<Header worldName={this.state.worldName} tableType={`editor`}/>}
                               globalFilter={this.state.globalFilter}
                               footer={editorFooter} style={{ margin: '10px 20px' }}>
                        <Column field="label" header="Property" sortable={true}
                                style={{ padding: '5px 20px', width: '35%' }}/>
                        <Column field="path" header="Value" sortable={false} style={{ padding: '5px 20px' }}
                                editor={this.edit}
                                body={(rowData) => this.getFieldValue(rowData)}/>
                    </DataTable>
                </div>}
            </div>
        )
    }

}

const mapStateToProps = (state: IState, { worldName }: any) => {
    return {
        world: state.worlds.list.find(({ name, layers }: IWorld) => worldName === name)
    }
};

const mapDispatchToProps = (dispatch: any) => ({
    updateWorld: (payload: IWorld) => dispatch(WorldsActions.updateWorldAction(payload)),
    navigateTo:  (location: string) => dispatch(push(location))
});

export default connect(mapStateToProps, mapDispatchToProps)(LayerEditor);

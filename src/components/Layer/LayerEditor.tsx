import * as React from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { IState } from '../../store';
import { ITBAction } from '../../consts/action-types';
import { IWorld } from '../../interfaces/IWorld';
import { IWorldLayer } from '../../interfaces/IWorldLayer';
import { WorldsActions } from '../../actions/world.actions';
import { AFFILIATION_TYPES } from '../../consts/layer-types';
import DataTableHeader from '../DataTable/DataTableHeader';
import { cloneDeep, get } from 'lodash';
import LayerPropertiesList from './LayerPropertiesList';

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

export interface IPropsLayer {
    worldName: string,
    layer: IWorldLayer,
    world: IWorld,
    updateWorld: (worlds: Partial<IWorld>) => ITBAction
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

    onEditorValueChange = (props, value) => {
        console.log('onEditorValueChange props: ' + JSON.stringify(props));
        const split = props.path.split('.');
        const field = split[1];
        let property = split[2];

        switch (field) {
            case ('layer'):
                const layer = { ...this.state.worldLayer };
                layer.layer[property] = value;
                this.setState({ worldLayer: { ...layer } });
            case ('inputData'):
                const inputData = { ...this.state.worldLayer };
                if (property === 'sensor') {
                    property = split[3];
                    const index = props.path.indexOf('[');
                    if (index > -1) {
                        const bandsIndex = parseInt(props.path.substr(index + 1, 1), 10);
                        inputData.inputData.sensor.bands[bandsIndex] = (value);
                    } else {
                        inputData.inputData.sensor[property] = value;
                    }
                } else {
                    inputData.inputData[property] = value;
                }
                this.setState({ worldLayer: { ...inputData } });
        }
    };

    inputTextEditor(props) {
        switch (props.rowData.type) {
            case ('text'):
                return <InputText type="text" value={get(this.state, props.rowData.path)}
                                  onChange={(e: any) => this.onEditorValueChange(props.rowData, e.target.value)}/>;
            case ('number'):
                return <InputText type="number" min={props.rowData.min}
                                  value={get(this.state, props.rowData.path)}
                                  onChange={(e: any) => this.onEditorValueChange(props.rowData, e.target.value)}/>;
            case ('dropdown'):
                return <Dropdown id="affiliation" options={this.layerAffiliationTypes}
                                 value={this.state.worldLayer.inputData.affiliation ? this.state.worldLayer.inputData.affiliation : AFFILIATION_TYPES.AFFILIATION_UNKNOWN}
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
            return value0 + ', ' + value1;
        }
        else {
            return get(this.state, rowData.path)
        }
    };

    edit = (props) => {
        if (!props.rowData.readonly) {
            return this.inputTextEditor(props);
        } else {
            return this.getFieldValue(props.rowData);
        }
    };

    backToWorldPage = () => {
        window.history.back();
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
        const name = this.props.worldName;
        this.props.updateWorld({ name, layers });
        console.warn('layer (from layers) inputData: ' + JSON.stringify(layers[this.findSelectedLayerIndex()].inputData));
    };

    render() {
        const editorFooter =
            <div className="ui-dialog-buttonpane ui-helper-clearfix">
                <Button label="Save" icon="fa fa-check" onClick={this.save}/>
                <Button label="Reset" icon="fa fa-undo" onClick={this.componentWillMount.bind(this)}/>
                <Button label="Cancel" icon="fa fa-close" onClick={this.backToWorldPage}/>
            </div>;

        return (
            <div>
                {
                    this.state.worldLayer && <div className="content-section implementation"
                                                  style={{ textAlign: 'left', width: '70%', margin: 'auto' }}>
                        <DataTable value={LayerPropertiesList} paginator={true} rows={10} responsive={false}
                                   header={<DataTableHeader title={`File Editor`}/>}
                                   globalFilter={this.state.globalFilter}
                                   footer={editorFooter} style={{ margin: '10px 20px' }}>
                            <Column field="label" header="Property" sortable={true}
                                    style={{ padding: '5px 20px', width: '35%' }}/>
                            <Column field="path" header="Value" sortable={false} style={{ padding: '5px 20px' }}
                                    editor={this.edit}
                                    body={(rowData) => this.getFieldValue(rowData)}/>
                        </DataTable>
                    </div>
                }
            </div>
        )
    }

}

const mapStateToProps = (state: IState, { worldName, layer }: any) => ({
    worldName,
    layer,
    world: state.worlds.list.find(({ name, layers }: IWorld) => worldName === name)
});

const mapDispatchToProps = (dispatch: any) => bindActionCreators({ updateWorld: WorldsActions.updateWorldAction }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(LayerEditor);

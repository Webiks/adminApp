import * as React from 'react';
import { IWorld } from '../../interfaces/IWorld';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { IState } from '../../store';
import { WorldsActions } from '../../actions/world.actions';
import { IWorldLayer } from '../../interfaces/IWorldLayer';
import { ITBAction } from '../../consts/action-types';
import { LayerService } from '../../services/LayerService';
import { ILayer } from '../../interfaces/ILayer';
import UploadFile from './UploadFile';
import Header from '../DataTable/Header';
import ol from 'openlayers'

/* Prime React components */
import 'primereact/resources/themes/omega/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'font-awesome/css/font-awesome.css';
import { DataTable } from 'primereact/components/datatable/DataTable';
import { Column } from 'primereact/components/column/Column';
import { Button } from 'primereact/components/button/Button';
import { Dialog } from 'primereact/components/dialog/Dialog';
import Footer from '../DataTable/Footer';

export interface IPropsLayers {
    rowData: any,
    worldName: string,
    world: IWorld,
    updateWorld: (worlds: IWorld) => ITBAction,
    navigateTo: (layerName: string) => void
}

export interface IStateTable {
    selectedLayer: any,
    displayDialog: boolean
}

class LayersActionsButtons extends React.Component {

    props: IPropsLayers;

    state: IStateTable = {
        selectedLayer: null,
        displayDialog: false
    };

    displayLayer = (layer: IWorldLayer) => {
        const center = layer.data.center;
        const parser = new ol.format.WMTSCapabilities();
        const projection = layer.data.latLonBoundingBox.crs;
        const olProjection = 'EPSG:3857';
        let map;
        const zoom = layer.inputData.zoom === 0 ? 14 : layer.inputData.zoom;

        // get the Capabilities XML file in JSON format
        // 1. get the Capabilities XML file
        LayerService.getCapabilities(this.props.worldName, layer.layer.name)
            .then( xml => {
                console.log("1. get capabilities XML");
                // 2. convert the xml data to json
                const json = parser.read(xml);
                console.log("2. convert to JSON");
                // 3. define the map options
                const options = ol.source.WMTS.optionsFromCapabilities(json,
                    {
                        projection: layer.data.srs,
                        layer: layer.layer.name,
                        matrixSet: projection
                    });
                console.log("3. finished to define the options");

                // draw the map
                console.error("4. start new OL Map...");
                map = new ol.Map({
                    layers: [
                        new ol.layer.Tile({
                            source: new ol.source.OSM(),
                            opacity: 0.7
                        }),
                        new ol.layer.Tile({
                            opacity: 1,
                            source: new ol.source.WMTS(options)
                        })
                    ],
                    target: 'map',
                    view: new ol.View({
                        projection: olProjection,
                        center: ol.proj.transform(center, projection, olProjection),
                        zoom
                    })
                });
            })
            .catch(error => { throw new Error(error) });
    };

    editLayer = (layer: IWorldLayer) => {
        this.props.navigateTo(`${this.props.worldName}/${layer.layer.name}`);
    };

    deleteLayer = (layer: ILayer) => {
        confirm(`Are sure you want to DELETE ${layer.name}?`);
        LayerService.deleteLayerById(this.props.worldName, layer)
            .then(response => {
                console.log("LAYER DATA TABLE: delete layer - getAllLayersData...");
                // get the new layers' list
                LayerService.getAllLayersData(this.props.worldName)
                    .then(layers => this.refresh(layers || []))
                    .catch(error => this.refresh([]));
            })
            .catch(error => this.refresh([]));
    };

    // set state to initial state
    setInitState = () =>
        this.setState({
            rowData: null,
            displayDialog: false
        });

    // update the App store and refresh the page
    refresh = (layers: IWorldLayer[]) => {
        console.log("Layer Data Table: updateLayers...");
        const name = this.props.worldName;
        this.props.updateWorld({ name, layers });
        this.setInitState();
    };

    render(){
        return  (
            <div className="ui-button-icon ui-helper-clearfix">
                <Button type="button" icon="fa fa-search" className="ui-button-success" style={{margin: '3px 7px'}}
                        onClick={() => {
                            this.setState({selectedLayer: this.props.rowData, displayDialog: true});
                            this.displayLayer(this.props.rowData);
                        }}/>
                <Button type="button" icon="fa fa-edit" className="ui-button-warning" style={{margin: '3px 7px'}}
                        onClick={() => {
                            this.setState({selectedLayer: this.props.rowData, displayDialog: false});
                            this.editLayer(this.props.rowData)
                        }}/>
                <Button type="button" icon="fa fa-close" style={{margin: '3px 7px'}}
                        onClick={() => {
                            this.setState({selectedLayer: this.props.rowData, displayDialog: false});
                            this.deleteLayer(this.props.rowData.layer)
                        }}/>
            </div>
        );
    }
}

const mapStateToProps = (state: IState, { worldName, rowData }: any) => {
    return {
        world: state.worlds.list.find(({ name, layers }: IWorld) => worldName === name),
        worldName, rowData
    }
};

const mapDispatchToProps = (dispatch: any) => ({
    updateWorld: (payload: IWorld) => dispatch(WorldsActions.updateWorldAction(payload)),
    navigateTo: (location: string) => dispatch(push(location))
});

export default connect(mapStateToProps, mapDispatchToProps)(LayersActionsButtons);



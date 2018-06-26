import * as React from 'react';
import { IWorld } from '../interfaces/IWorld';
import { connect } from 'react-redux';
import { IState } from '../store';

/* Prime React components */
import 'primereact/resources/themes/omega/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { Button } from 'primereact/components/button/Button';
import { InputText } from 'primereact/components/inputtext/InputText';
import { WorldsActions } from '../actions/world.actions';
import { ITBAction } from '../consts/action-types';
import { IWorldLayer } from '../interfaces/IWorldLayer';

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

class LayerDetailsForm extends React.Component {

    props: IPropsLayer;
    newLayer: boolean;
    state: ILayerDetailsState;
    selectedLayer: any ;
    layerIndex: number;

    componentDidMount() {
        this.selectedLayer = this.findSelectedLayerByName();
        this.layerIndex = this.findSelectedLayerIndex();
        console.error("DETAILS: selected Layer: " + this.selectedLayer.layer.name);
        console.error("DETAILS: Layer Index: " + this.layerIndex);
        this.setState( { layer: this.selectedLayer });
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
        const dialogFooter =
            <div className="ui-dialog-buttonpane ui-helper-clearfix">
                <Button label="Save" icon="fa-check" onClick={this.save}/>
                <Button icon="fa-close" label="Cancel" onClick={this.cancel}/>
            </div>;

        return  (
            <form>
                { this.state.layer && <div>
                    <div className="ui-grid ui-grid-responsive ui-fluid">
                        <div className="ui-grid-row">
                            <div className="ui-grid-col-4" style={{padding:'4px 10px'}}><label htmlFor="id">ID</label></div>
                            <div className="ui-grid-col-8" style={{padding:'4px 10px'}}>
                                <InputText id="id" value={this.state.layer.layer.id} readOnly={true}/>
                            </div>
                        </div>
                        <div className="ui-grid-row">
                            <div className="ui-grid-col-4" style={{padding:'4px 10px'}}><label htmlFor="name">Name</label></div>
                            <div className="ui-grid-col-8" style={{padding:'4px 10px'}}>
                                <InputText id="name" onChange={(e: any) => {this.updateProperty('name', e.target.value)}} value={this.state.layer.layer.name}/>
                            </div>
                        </div>
                        <div className="ui-grid-row">
                            <div className="ui-grid-col-4" style={{padding:'4px 10px'}}><label htmlFor="type">Type</label></div>
                            <div className="ui-grid-col-8" style={{padding:'4px 10px'}}>
                                <InputText  id="type"  value={this.state.layer.layer.type} readOnly={true}/>
                            </div>
                        </div>
                        <div className="ui-grid-row">
                            <div className="ui-grid-col-4" style={{padding:'4px 10px'}}><label htmlFor="format">Type</label></div>
                            <div className="ui-grid-col-8" style={{padding:'4px 10px'}}>
                                <InputText  id="format"  value={this.state.layer.store.format} readOnly={true}/>
                            </div>
                        </div>
                        <div className="ui-grid-row">
                            <div className="ui-grid-col-4" style={{padding:'4px 10px'}}><label htmlFor="srs">Projection</label></div>
                            <div className="ui-grid-col-8" style={{padding:'4px 10px'}}>
                                <InputText id="srs" value={this.state.layer.data.srs} readOnly={true}/>
                            </div>
                        </div>
                        <div className="ui-grid-row">
                            <div className="ui-grid-col-4" style={{padding:'4px 10px'}}><label htmlFor="id">Bounding Box</label></div>
                            <div className="ui-grid-col-8" style={{padding:'4px 10px'}}>
                                <InputText id="nativeBoundingBoxminX" value={this.state.layer.data.nativeBoundingBox.minx} readOnly={true}/>
                                <InputText id="nativeBoundingBoxminX" value={this.state.layer.data.nativeBoundingBox.maxx} readOnly={true}/>
                                <InputText id="nativeBoundingBoxmaxY" value={this.state.layer.data.nativeBoundingBox.miny} readOnly={true}/>
                                <InputText id="nativeBoundingBoxminY" value={this.state.layer.data.nativeBoundingBox.maxy} readOnly={true}/>
                            </div>
                        </div>

                    </div>
                </div> }
            </form>
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

export default connect(mapStateToProps, mapDispatchToProps)(LayerDetailsForm);





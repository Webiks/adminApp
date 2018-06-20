import * as React from 'react';
import { IWorld } from '../interfaces/IWorld';
import { connect } from 'react-redux';
import { IState } from '../store';

/* Prime React components */
import 'primereact/resources/primereact.min.css';
import 'primereact/resources/themes/omega/theme.css';
import 'font-awesome/css/font-awesome.css';
import { Button } from 'primereact/components/button/Button';
import { InputText } from 'primereact/components/inputtext/InputText';
import { Dropdown } from 'primereact/components/dropdown/Dropdown';
import { WorldsActions } from '../actions/world.actions';
import { ITBAction } from '../consts/action-types';
import { IWorldLayer } from '../interfaces/IWorldLayer';

export interface IPropsLayer {
    layer: IWorldLayer,
    world: IWorld,
    updateWorld: (worlds: Partial<IWorld>) => ITBAction
    updateLayers: (layers: IWorldLayer[]) => void
}

class LayerDetailsForm extends React.Component {

    props: IPropsLayer;
    newLayer: boolean;
    worldName: string;
    layer: any;

    componentDidMount() {
        this.worldName = this.props.world.name;
        this.layer = this.props.layer;
    };

    findSelectedLayerByName = () => {
        return this.props.world.layers.filter((layer: IWorldLayer) => layer.layer.name === this.layer.name);
    };

    // PUT: Update and save
    update = (layer: IWorldLayer) => {
        const layers = [...this.props.world.layers];
        console.log("update: " + JSON.stringify(layer));
        layers[this.layer] = layer;
    };

    save = () => {
        const layers = [...this.props.world.layers];
        if (this.newLayer){
            layers.push(this.layer);
        }
        else{
            console.log("save: " + JSON.stringify(this.findSelectedLayerByName()));
            layers[this.layer] = this.layer;
        }
        this.props.updateLayers(layers);
    };

    updateProperty = (property: string, value: any) => {
        const layer = this.props.layer;
        layer[property] = value;
        this.update(layer);
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
                <div className="ui-grid ui-grid-responsive ui-fluid">
                    <div className="ui-grid-row">
                        <div className="ui-grid-col-4" style={{padding:'4px 10px'}}><label htmlFor="id">ID</label></div>
                        <div className="ui-grid-col-8" style={{padding:'4px 10px'}}>
                            <InputText id="id" value={this.layer.layer.id} readOnly={true}/>
                        </div>
                    </div>
                    <div className="ui-grid-row">
                        <div className="ui-grid-col-4" style={{padding:'4px 10px'}}><label htmlFor="name">Name</label></div>
                        <div className="ui-grid-col-8" style={{padding:'4px 10px'}}>
                            <InputText id="name" onChange={(e: any) => {this.updateProperty('name', e.target.value)}} value={this.layer.name}/>
                        </div>
                    </div>
                    <div className="ui-grid-row">
                        <div className="ui-grid-col-4" style={{padding:'4px 10px'}}><label htmlFor="type">Type</label></div>
                        <div className="ui-grid-col-8" style={{padding:'4px 10px'}}>
                            <InputText  id="type"  value={this.layer.layer.type} readOnly={true}/>
                        </div>
                    </div>
                    <div className="ui-grid-row">
                        <div className="ui-grid-col-4" style={{padding:'4px 10px'}}><label htmlFor="format">Type</label></div>
                        <div className="ui-grid-col-8" style={{padding:'4px 10px'}}>
                            <InputText  id="format"  value={this.layer.store.format} readOnly={true}/>
                        </div>
                    </div>
                    <div className="ui-grid-row">
                        <div className="ui-grid-col-4" style={{padding:'4px 10px'}}><label htmlFor="srs">Projection</label></div>
                        <div className="ui-grid-col-8" style={{padding:'4px 10px'}}>
                            <InputText id="srs" value={this.layer.data.srs} readOnly={true}/>
                        </div>
                    </div>
                    <div className="ui-grid-row">
                        <div className="ui-grid-col-4" style={{padding:'4px 10px'}}><label htmlFor="id">Bounding Box</label></div>
                        <div className="ui-grid-col-8" style={{padding:'4px 10px'}}>
                            <InputText id="nativeBoundingBoxminX" value={this.layer.data.nativeBoundingBox.minx} readOnly={true}/>
                            <InputText id="nativeBoundingBoxminX" value={this.layer.data.nativeBoundingBox.maxx} readOnly={true}/>
                            <InputText id="nativeBoundingBoxmaxY" value={this.layer.data.nativeBoundingBox.miny} readOnly={true}/>
                            <InputText id="nativeBoundingBoxminY" value={this.layer.data.nativeBoundingBox.maxy} readOnly={true}/>
                        </div>
                    </div>

                </div>
            </form>

        )


    }
}

const mapStateToProps = (state: IState, { worldName }: any) => {
    return {
        world: state.worlds.list.find(({ name, layers }: IWorld) => worldName === name)
    }
};

const mapDispatchToProps = (dispatch: any) => ({
    updateWorld: (payload: IWorld) => dispatch(WorldsActions.updateWorldAction(payload))
});

export default connect(mapStateToProps, mapDispatchToProps)(LayerDetailsForm);





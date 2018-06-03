import * as React from 'react';
import { connect } from 'react-redux';
import LayerComponent from './LayerComponent';
import { IWorldLayer } from "../models/modelInterfaces";

export interface ILayersProps {
    layers: IWorldLayer[];
}

const Layers = ({ layers }: ILayersProps ) => (
    <ul>
        { layers.map(layer => <LayerComponent key={ layer.id } layer={ layer } />) }
    </ul>
);

const mapStateToProps = (state: any) => ({
    layers: state.layers
});

export default connect(mapStateToProps)(Layers);
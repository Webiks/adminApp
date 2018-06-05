import * as React from 'react';
import { IWorldLayer } from "../models/modelInterfaces";

export interface ILayerProps {
    layer: IWorldLayer;
}

const LayerComponent = ({ layer }: ILayerProps) => (
    <li>
        {layer.id} ({layer.href})
    </li>
);

export default LayerComponent;
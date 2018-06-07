/* primeReact CSS */
import 'primereact/resources/primereact.min.css';
import 'primereact/resources/themes/omega/theme.css';
import 'font-awesome/css/font-awesome.css';

import axios from 'axios';
import config from "../config/config";
import { IWorldLayer } from "../models/modelInterfaces";
import { LAYER_TYPES } from "../consts/layer-types";

export class LayerService {

    static getLayers(worldName: string): Promise<any> {
        return axios
            .get(`http://localhost:${config.serverPort}/api/layers/${worldName}`)
            .then(res => res.data.layers.layer)
            .then(data => Promise.all(data.map((dataLayer: any) => this.parseWorldLayer(worldName, dataLayer))))
            .then( layers =>  {
                console.log("get layers: " + JSON.stringify(layers));
                return layers;
            });
    }

    static getLayerById(worldName: string, layerName: string): Promise<any> {
        return axios
            .get(`http://localhost:${config.serverPort}/api/layers/${worldName}/${layerName}`)
            .then(res => res.data.layer);
    }

    static getLayerDetails(worldName: string, layer: Partial<IWorldLayer>): Promise<any> {
        console.log("start the getLayerDetails service...");
        let layerDetails: any;
        return axios
            .get(`http://localhost:${config.serverPort}/api/layers/${worldName}/${layer.name}/details`)
            .then(res => {
                console.log("LayerService: getLayerMetaData: " + JSON.stringify(res));
                switch (layer.type) {
                    case (LAYER_TYPES.LAYER_RASTER):
                        layerDetails = this.parseRasterDetails(res.data.coverage);
                        break;
                    case (LAYER_TYPES.LAYER_VECTOR):
                        layerDetails = this.parseVectorDetails(res.data.featureType);
                        break;
                };

                return { ...layer, ...layerDetails};
            }).catch(error => console.log(error.message));
    }

    private static parseWorldLayer(worldName: string, dataLayer: any) {

        // get the current data from the "getLayers" request
        const layerData: Partial<IWorldLayer> = {
            name: dataLayer.name,
            id: `${worldName}:${dataLayer.name}`,
            type: LAYER_TYPES.LAYER_UNKNOWN,
            resourceUrl: ''
        };

        // get the 'type' and the 'resourceUrl' from the "getLayerById" request
        return this.getLayerById(worldName, dataLayer.name)
            .then(layer => {
                layerData.type = this.defineType(layer.type);
                layerData.resourceUrl = layer.resource.href;
                return layerData;
        });
    }

    private static parseRasterDetails(dataLayer: any) {
        console.log(dataLayer);
    }

    private static parseVectorDetails(dataLayer: any) {
        console.log(dataLayer);
    }

    private static defineType(type: string): LAYER_TYPES {
        let layerType: LAYER_TYPES;

        switch (type){
            case ('RASTER'):
                layerType = LAYER_TYPES.LAYER_RASTER;
                break;

            case ('VECTOR'):
                layerType = LAYER_TYPES.LAYER_VECTOR;
                break;

            default:
                layerType = LAYER_TYPES.LAYER_UNKNOWN;

        }
        return layerType;

    }

}



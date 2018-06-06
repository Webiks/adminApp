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
            .then( layers =>  layers);
    }

    static getLayerById(worldName: string, layerName: string): Promise<any> {
        return axios
            .get(`http://localhost:${config.serverPort}/api/layers/${worldName}/${layerName}`)
            .then(res => res.data.layer);
    }

    static getRaster(worldName: string, layerName: string): Promise<any> {
        return axios
            .get(`http://admin:geoserver@localhost:8080/geoserver/rest/workspaces/${worldName}/coverages/${layerName}.json`)
            .then(res => res.data.data);
    }

    private static parseWorldLayer(worldName: string, dataLayer: any) {

        // get the current data from the "getLayers" request
        const layerData: IWorldLayer = {
            name: dataLayer.name,
            layerHref: dataLayer.href,
            id: `${worldName}:${dataLayer.name}`,
            type: LAYER_TYPES.LAYER_UNKNOWN,
            resourceUrl: ''
        };

        // get the 'type' and the 'resourceUrl' from the "getLayerById" request
        return this.getLayerById(worldName, dataLayer.name)
                .then(layers => {
                    layerData.type = this.defineType(layers.type);
                    layerData.resourceUrl = layers.resource.href;
                    return layerData;
        });
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

    /*
    setLayersData(data: any){


    }*/

}



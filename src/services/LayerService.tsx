import axios from 'axios';
import config from "../config/config";
import { ILayerDetails } from "../interfaces/ILayerDetails";
import { IWorldLayer } from "../interfaces/IWorldLayer";

export class LayerService {

    static baseUrl: string = `${config.baseUrlApi}/layers/`;

    // ==============
    //  GET Requests
    // ==============
    // get all layers of the world (including the ILayer's fields)
    static getLayers(worldName: string): Promise<any> {
        console.log("start the getLayers service...");
        return axios
            .get(`${this.baseUrl}${worldName}`)
            .then(res => res.data.layers.layer)
            .then(data => Promise.all(data.map((dataLayer: any) => this.parseWorldLayer(worldName, dataLayer))))
            .catch(error => console.log(error));
    }

    // get layer's more data (filed "layer" - type ILayer)
    static getLayerByName(worldName: string, layerName: string): Promise<any> {
        console.log("start the getLayerByName service...");
        return axios
            .get(`${this.baseUrl}${worldName}/${layerName}`)
            .then(res => res.data.layer)
            .catch(error => console.log(error));
    }

    // get layer's details (field "data" - type ILayerDetails)
    static getLayerDetails(worldName: string, layer: IWorldLayer): Promise<any> {
        console.log("start the getLayerDetails service...");
        const layerDetails: ILayerDetails = {};
        return axios
            .get(`${this.baseUrl}${worldName}/${layer.layer.name}/details`)
            .then(res => {
                // get the right data according to the type of the layer
                switch (layer.layer.type) {
                    case ('RASTER'):
                        layerDetails.coverage = res.data.coverage;
                        break;
                    case ('VECTOR'):
                        layerDetails.featureType = res.data.featureType;
                        break;
                }
                layer.data = layerDetails;
                return { ...layer};
            })
            .catch(error => console.log(error));
    }

    // ==============
    // DELETE Request
    // ==============
    // static deleteLayerById(layerId: string): Promise<any> {
    static deleteLayerById(worldName: string, layer: IWorldLayer): Promise<any> {
        return axios
            .delete(`${this.baseUrl}${worldName}:${layer.layer.name}/${layer.layer.type}`)
            .then(res => res.data)
            .catch(error => console.log(error));
    }

    // ====================================== Private Functions ==============================================

    private static parseWorldLayer(worldName: string, dataLayer: any) {
        // get more data about the layer ('type' and the 'resourceUrl' from the "getLayerByName" request)
        return this.getLayerByName(worldName, dataLayer.name)
            .then(layer => {
                // set the layer id
                layer.id = layer.resource.name;
                // update the layer field
                dataLayer.layer = layer;
                return { ...dataLayer};
            })
            .catch(error => console.log(error));
    }
}



import axios from 'axios';
import config from "../config/config";
import { ILayer } from "../interfaces/ILayer";
import { ILayerDetails } from "../interfaces/ILayerDetails";

export class LayerService {

    static urlBase: string = `http://${config.ipAddress}${config.serverPort}/api/layers/`;

    // ==============
    //  GET Requests
    // ==============
    // get all layers of the world (including the ILayer's fields)
    static getLayers(worldName: string): Promise<any> {
        console.log("start the getLayers service...");
        return axios
            .get(`${this.urlBase}${worldName}`)
            .then(res => res.data.layers.layer)
            .then(data => Promise.all(data.map((dataLayer: any) => this.parseWorldLayer(worldName, dataLayer))))
            .catch(error => console.log(error.response));
    }

    // get layer's more data (filed "layer" - type ILayer)
    static getLayerByName(worldName: string, layerName: string): Promise<any> {
        console.log("start the getLayerByName service...");
        return axios
            .get(`${this.urlBase}${worldName}/${layerName}`)
            .then(res => res.data.layer)
            .catch(error => console.log(error.response));
    }

    // get layer's details (field "data" - type ILayerDetails)
    static getLayerDetails(worldName: string, layer: Partial<ILayer>): Promise<any> {
        console.log("start the getLayerDetails service...");
        const layerDetails: ILayerDetails = {};
        return axios
            .get(`${this.urlBase}${worldName}/${layer.name}/details`)
            .then(res => {
                // get the right data according to the type of the layer
                switch (layer.type) {
                    case ('RASTER'):
                        layerDetails.coverage = res.data.coverage;
                        break;
                    case ('VECTOR'):
                        layerDetails.featureType = res.data.featureType;
                        break;
                }
                console.log("LayerService: getLayerDetails: " + JSON.stringify({ ...layer, ...layerDetails}));
                return { ...layer, ...layerDetails};
            })
            .catch(error => console.log(error.response));
    }

    // ==============
    // DELETE Request
    // ==============
    // static deleteLayerById(layerId: string): Promise<any> {
    static deleteLayerById(worldName: string, layer: Partial<ILayer>): Promise<any> {
        return axios
            .delete(`${this.urlBase}${worldName}:${layer.name}/${layer.type}`)
            .then(res => res.data)
            .catch(error => console.log(error.response));
    }

    // ====================================== Private Functions ==============================================

    private static parseWorldLayer(worldName: string, dataLayer: any) {
        // set the layer id
        const layerData: Partial<ILayer> = {
            id: `${worldName}:${dataLayer.name}`
        };

        // get more data about the layer ('type' and the 'resourceUrl' from the "getLayerByName" request)
        return this.getLayerByName(worldName, dataLayer.name)
            .then(layer => {
                return {...layer, ...layerData};
            })
            .catch(error => console.log(error.response));
    }
}



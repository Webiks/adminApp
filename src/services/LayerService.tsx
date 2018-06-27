import axios from 'axios';
import config from "../config/config";
import { IWorldLayer } from "../interfaces/IWorldLayer";
import { ILayer } from '../interfaces/ILayer';
import { AFFILIATION_TYPES } from '../consts/layer-types';

export class LayerService {

    static baseUrl: string = `${config.baseUrlApi}/layers`;

    // ==============
    //  GET Requests
    // ==============
    // get all layers of the world (including the ILayer's fields)
    static getAllLayersData(worldName: string): Promise<any> {
        console.log("start the getAllLayersData service...");
            // A. get an Array of all the world's layers
        return this.getWorldLayers(worldName)
            // B. get all the data of each layer:
            .then(data =>
                Promise.all(data.map((worldLayer: any) => this.getLayerByName(worldName, worldLayer.name)))
            )
            .catch(error => {
                console.error("getAllLayersData ERROR!" + error.message);
                throw new Error(error)
            });
    }

    // A. get all layers of the world (including the ILayer's fields)
    static getWorldLayers(worldName: string): Promise<any> {
        console.log("start the GET LAYERS service...");
        console.log("parameters: world name = " + worldName);
        return axios
            .get(`${this.baseUrl}/${worldName}`)
            .then(layers => {
                console.log("GET LAYERS: " + JSON.stringify(layers.data.layers.layer));
                return layers.data.layers.layer;
            })
            .catch(error => {
                console.error("getLayers ERROR!" + error.message);
                throw new Error(error)
            });
    }

    // B. get all layer's Data by name
    static getLayerByName (worldName: string, layerName: string): Promise<any> {
        // 1. get the layer type & resource info
        return this.getLayerInfo(worldName, layerName)
            // 2. get the layer's details data according to the layer's type
            .then( layerInfo => {
                console.log("CALL the GET LAYER INFO service...layerInfo: " + layerInfo);
                return this.getLayerDetails(worldName, layerInfo)
            })
            // 3. get the layer's store data according to the layer's type
            .then( layerData => {
                console.log("CALL the GET STORE DATA service... layerData: " + layerData);
                return this.getStoreData(worldName, layerData)
            })
            .catch(error => {
                console.error("getLayer ERROR!" + error.message);
                throw new Error(error)
            });
    };

    // 1. get the layer type & resource info
    static getLayerInfo(worldName: string, layerName: string): Promise<any> {
        console.log("start the GET LAYER INFO service..." + JSON.stringify(`${this.baseUrl}${worldName}/${layerName}`));
        return axios
            .get(`${this.baseUrl}/layer/${worldName}/${layerName}`)
            .then(layerInfo => {
                const layer = layerInfo.data;
                layer.layer.id = layerInfo.data.layer.resource.name;                   // set the layer id
                return {...layer};
            })
            .catch(error => {
                console.error("getLayerInfo ERROR!" + error.message);
                throw new Error(error)
            });
    }

    // 2. get layer's details ("data" field - type IRaster or IVector)
    static getLayerDetails(worldName: string, layer: IWorldLayer): Promise<any> {
        console.log("start the GET LAYER DETAILS service..." + JSON.stringify(`${this.baseUrl}${worldName}/${layer.layer.name}/details`));
        return axios
            .get(`${this.baseUrl}/details/${worldName}/${layer.layer.name}`)
            .then(layerDetails => {
                // get the layer details data according to the layer's type
                let storeId;
                switch (layer.layer.type) {
                    case ('RASTER'):
                        layer.data = layerDetails.data.coverage;
                        storeId = layerDetails.data.coverage.store.name;                        // set the store id
                        layer.data.center =                                                     // set the data center point
                            [layerDetails.data.coverage.latLonBoundingBox.minx, layerDetails.data.coverage.latLonBoundingBox.maxy] ;
                        break;
                    case ('VECTOR'):
                        layer.data = layerDetails.data.featureType;
                        storeId = layerDetails.data.featureType.store.name;                     // set the store id
                        layer.data.center =                                                     // set the data center point
                            [layerDetails.data.featureType.latLonBoundingBox.minx, layerDetails.data.featureType.latLonBoundingBox.maxy] ;
                        break;
                }
                layer.layer.storeName = this.splitString(storeId,":")[1];            // set the store name
                console.log("GET LAYER DETAILS storeName: " + layer.layer.storeName);
                return { ...layer};
            })
            .catch(error => {
                console.error("getLayerDetails ERROR!" + error.message);
                throw new Error(error)
            });
    }

    // 3. get the layer's store data (for the format) according to the layer's type and the layer title (in the layer's details)
    static getStoreData(worldName: string, layer: IWorldLayer): Promise<any> {
        console.log("start the GET STORE DATA service..." + JSON.stringify(`${this.baseUrl}${worldName}/${layer.layer.storeName}/${layer.layer.type}`));
        return axios
            .get(`${this.baseUrl}/store/${worldName}/${layer.layer.storeName}/${layer.layer.type}`)
            .then(store => {
                // get the store data according to the layer's type
                switch (layer.layer.type) {
                    case ('RASTER'):
                        layer.store = store.data.coverageStore;
                        layer.store.format = store.data.coverageStore.type;             // set the store format
                        layer.layer.filePath = store.data.coverageStore.url;            // set the file path
                        break;
                    case ('VECTOR'):
                        layer.store = store.data.dataStore;
                        layer.store.format = store.data.dataStore.type;                 // set the store format
                        layer.layer.filePath = this.getVectorUrl(store.data.dataStore.connectionParameters.entry);    // set the file path
                        console.error("VECTOR FILE PATH: " + JSON.stringify(layer.layer.filePath));
                        break;
                }
                layer.store.name = layer.layer.storeName;
                layer.store.type = layer.layer.type;
                layer.layer.fileName = this.getSubstring(layer.layer.filePath, layer.store.name);   // set the file name
                layer.layer.fileExtension = this.getSubstring(layer.layer.filePath, ".");           // set the file name

                return { ...layer};
            })
            .catch(error => {
                console.error("getStoreData ERROR!" + error.message);
                throw new Error(error)
            });
    }

    // get Capabilities
    static getCapabilities (worldName: string, layerName: string): Promise<any> {
        console.log("start the GET CAPABILITIES service...");
        return axios
            .get(`${this.baseUrl}/wmts/${worldName}/${layerName}`)
            .then(xml => xml.data )
            .catch(error => { throw new Error(error) });
    }

// return convert.xmlDataToJSON(xml.data);

    // ==============
    // DELETE Request
    // ==============

    // delete layer from geoserver
    static deleteLayerById(worldName: string, layer: ILayer): Promise<any> {
        console.log("start the DELETE LAYER service for layer: " + layer.id);
        // 1. delete the layer from the store - using the resource url (raster or vector)
        return this.deleteLayerFromStroe(worldName, layer.name)
            .then ( response => {
                console.log("DELETE LAYER FROM STORE response: " + response);
                // 2. delete the store
                return this.deleteStroe(worldName, layer.storeName, layer.type);
            })
            .then ( response => {
                console.log("DELETE STORE response: " + response);
                // 3. delete the layer from the layers' list
                return this.deleteLayer(layer.id);
            })
            .catch(error => {
                console.error("LAYER SERVICE: deleteLayer ERROR!" + error.message);
                throw new Error(error)
            });
    }

    // 1. delete the layer from the store by using the resource url (raster or vector)
    static deleteLayerFromStroe(worldName: string, layerName: string): Promise<any> {
        return axios.delete(`${this.baseUrl}/${worldName}/${layerName}`)
            .then(res => res.data)
            .catch(error => { throw new Error(error) });
    }

    // 2. delete the store
    static deleteStroe(worldName: string, storeName: string, storeType: string): Promise<any> {
        return axios.delete(`${this.baseUrl}/store/${worldName}/${storeName}/${storeType}`)
            .then(res => res.data)
            .catch(error => { throw new Error(error) });
    }

    // 3. delete the layer from the layers' list
    static deleteLayer(layerId: string): Promise<any> {
        return axios.delete(`${this.baseUrl}/${layerId}`)
            .then(res => res.data)
            .catch(error => { throw new Error(error) });
    }

    // ====================================== Private Functions ==============================================

    // get the url from a Vector file
    private static getVectorUrl = (entries) : string => (entries.find( entry => ( entry["@key"] === 'url')).$);

    // split String into array
    private static splitString = (id: string, splitSign: string): string[] => id.split(splitSign);

    // get a substring from giving string by giving word or sign
    private static getSubstring = (path: string, name: string): string => path.substring(path.lastIndexOf(name));

}

/*
// delete layer without a specific order (using Promise.all())
    // delete layer from geoserver
    static deleteLayerById(worldName: string, layer: ILayer): Promise<any> {
        console.log("start the DELETE LAYER service for layer: " + layer.id);
        const promises = [
            // 1. delete the layer from the store - using the resource url (raster or vector)
            this.deleteLayerFromStroe(worldName, layer.name),
            // 2. delete the store
            this.deleteStroe(worldName, layer.storeName, layer.type),
            // 3. delete the layer from the layers' list
            this.deleteLayer(layer.id)
        ];

        return Promise.all(promises)
            .then( data => data)
            .catch ( error => error);
    }
*/


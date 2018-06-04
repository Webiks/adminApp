/* primeReact CSS */
import 'primereact/resources/primereact.min.css';
import 'primereact/resources/themes/omega/theme.css';
import 'font-awesome/css/font-awesome.css';

import axios from 'axios';
import config from "../config/config";

import { IWorldLayer } from "../models/modelInterfaces";
// import Layers from "./Layers";
// import { LAYER_TYPES } from "../consts/layer-types";

export class LayerService {

    worldName: string;
    layers: IWorldLayer[];
    layerFromData: {
        name: string;
        href: string;
        id: string;
    }

    constructor(workspace: string){
        this.worldName = workspace;
    }

    getCoverageStores() {
        return axios.get(`http://admin:geoserver@localhost:8080/geoserver/rest/workspaces/${this.worldName}/coveragestores.json`)
            .then(res => console.log(res.data.data));
    }

    getLayers() {
        return axios.get(`http://localhost:${config.serverPort}/api/layers/${this.worldName}`)
            .then(res => {
                console.log(`the world name is: ${this.worldName}`);
                console.log(`the requestURL is: http://localhost:4000/api/layers/${this.worldName}`);
                const data = res.data.layers.layer;
                console.log("type of data is: " + typeof (data));
                console.log("the data result is: " + JSON.stringify(data));
                console.log("data[0] name is: " + data[0].name);
                // this.setLayersData(data);
                /*
                name: string;
                href: string;
                id: string;
                type: LAYER_TYPES,
                format: 'GeoTIFF' | 'shp'*/

                data.map( (dataLayer: any) => {
                    console.log(dataLayer);
                    console.log("name: " + dataLayer.name);
                    console.log("href: " + dataLayer.href);
                    this.layerFromData = {
                        name:  dataLayer.name,
                        href:  dataLayer.href,
                        id: `${this.worldName}:${dataLayer.name}`
                    }
                    console.log("name: " + this.layerFromData.name);
                    console.log("href: " + this.layerFromData.href);
                    console.log("id: " + this.layerFromData.id);

                    this.layers.push(this.layerFromData);

                    console.log(`layer ${dataLayer.name} href: ${dataLayer.href} `);
                });

                return this.layers;
            });
    }

    getLayerById(layerId: string) {
        return axios.get(`http://admin:geoserver@localhost:8080/geoserver/rest/workspaces/${this.worldName}/coverages/${layerId}.json`)
            .then(res => res.data.data);
    }

    /*
    setLayersData(data: any){


    }*/

}



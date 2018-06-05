/* primeReact CSS */
import 'primereact/resources/primereact.min.css';
import 'primereact/resources/themes/omega/theme.css';
import 'font-awesome/css/font-awesome.css';

import axios from 'axios';
import config from "../config/config";

export class LayerService {

    static getCoverageStores(worldName: string) {
        return axios.get(`http://admin:geoserver@localhost:8080/geoserver/rest/workspaces/${worldName}/coveragestores.json`)
            .then(res => console.log(res.data.data));
    }

    static getLayers(worldName: string): Promise<any> {
        return axios
            .get(`http://localhost:${config.serverPort}/api/layers/${worldName}`)
            .then((res) => res.data.layers.layer)
            .then(data => data.map((dataLayer: any) => LayerService.parseWorldLayer(worldName, dataLayer)));
    }

    static getLayerById(worldName: string, layerId: string): Promise<any> {
        return axios
            .get(`http://admin:geoserver@localhost:8080/geoserver/rest/workspaces/${worldName}/coverages/${layerId}.json`)
            .then(res => res.data.data);
    }

    static parseWorldLayer(worldName: string, dataLayer: any) {
        return {
            name: dataLayer.name,
            href: dataLayer.href,
            id: `${worldName}:${dataLayer.name}`
        };
    }

    /*
    setLayersData(data: any){


    }*/

}



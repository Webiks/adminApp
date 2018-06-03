/* primeReact CSS */
import 'primereact/resources/primereact.min.css';
import 'primereact/resources/themes/omega/theme.css';
import 'font-awesome/css/font-awesome.css';

import axios from 'axios';

let worldName: string;

export class LayerService {

    constructor(workspace: string){
        worldName = workspace;
    }

    getCoverageStores() {
        return axios.get(`http://localhost:8080/geoserver/rest/workspaces/${worldName}/coveragestores.json`)
            .then(res => console.log(res.data.data));
    }

    getLayers() {
        return axios.get(`http://localhost:8080/geoserver/rest/workspaces/${worldName}/layers.json`)
            .then(res => {
                console.log(res.data.data);
                res.data.data
            });
    }

    getLayerByName(LayerName: string) {
        return axios.get(`http://localhost:8080/geoserver/rest/workspaces/${worldName}/coverages/${LayerName}.json`)
            .then(res => res.data.data);
    }

    /*
    getLayerById(id: number) {
        return axios.get('showcase/resources/demo/data/cars-large.json')
            .then(res => res.data.data);
    }*/

}

const layerSrevice = new LayerService('tb');
layerSrevice.getLayers();



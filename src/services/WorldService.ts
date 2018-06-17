import axios from 'axios';
import config from "../config/config";

export class WorldService {

    static baseUrl: string = `${config.baseUrlApi}/worlds`;

    // ==============
    //  GET Requests
    // ==============
    // get all layers of the world (including the ILayer's fields)
    static getWorlds(): Promise<any> {
        console.log("start the getWorlds service..." + this.baseUrl);
        return axios
            .get(this.baseUrl)
            .then(res => res.data.workspaces.workspace)
            .then(data => data.map((world: any) => {
                console.log("worldService: world name: " + world.name);
                return {
                    name: world.name,
                    layers: [],
                }
            }))
    }

}
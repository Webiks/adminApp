import axios from 'axios';
import config from "../config/config";

export class WorldService {

    static urlBase: string = `http://${config.ipAddress}${config.serverPort}/api/worlds`;

    // ==============
    //  GET Requests
    // ==============
    // get all layers of the world (including the ILayer's fields)
    static getWorlds(): Promise<any> {
        console.log("start the getWorlds service...");
        return axios
            .get(this.urlBase)
            .then(res => res.data.workspaces.workspace)
            .then(data => data.map((world: any) => {
                console.log("worldService: world name: " + world.name);
                return {
                    name: world.name,
                    layers: [],
                }
            }))
            .catch(error => console.log(error.response));
    }

}
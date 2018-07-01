import axios from 'axios';
import config from "../config/config";
import { ILayer } from '../interfaces/ILayer';
import { IWorld } from '../interfaces/IWorld';

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
                    // layers: [],
                }
            }))
    }

    static getWorld(name: string): Promise<any> {
        return axios
            .get(`${this.baseUrl}/${name}`)
            .then(res => {
                console.log("worldService: world name: " + res.data.workspace.name);
                return {
                    name: res.data.workspace.name,
                    // layers: [],
                }
            })
            .catch(() => undefined);
    }

    // ====================
    //  CREATE a new World
    // ====================
    // get all layers of the world (including the ILayer's fields)
    static createWorld(name: string): Promise<any> {
        console.log("start the Create Worlds service..." + this.baseUrl);
        return axios
            .get(`${this.baseUrl}/${name}/new`)
            .then(res => {
                console.log("WORLD SERVICE: SUCCEED to create new World: " + name);
                return res;
            })
            .catch(error => console.error("WORLD SERVICE: FAILED to create new World: " + error));
    }

    // ==============
    // DELETE Request
    // ==============

    // delete world(workspace) from geoserver
    static deleteWorldByName(name: string): Promise<any> {
        console.log("start the DELETE WORLD service for layer: " + name);

        return axios
            .get(`${this.baseUrl}/${name}/delete`)
            .then(res => {
                console.log("WORLD SERVICE: SUCCEED to delete World: " + name);
                return res;
            })
            .catch(error => console.error("WORLD SERVICE: FAILED to delete World: " + name + " error: " + error));
    }

}
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

    // ==============
    // DELETE Request
    // ==============

    // delete world(workspace) from geoserver
    static deleteWorldByName(world: IWorld) {
        console.log("start the DELETE WORLD service for layer: " + world.name);
        // 1. delete the layer from the store - using the resource url (raster or vector)
        /*
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
            });*/
    }

}
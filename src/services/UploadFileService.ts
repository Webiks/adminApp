import axios from 'axios';
import config from "../config/config";

export class UploadFileService {

    static urlBase: string = `http://${config.ipAddress}${config.serverPort}/api/upload/`;

    // ==============
    //  UPLOAD files
    // ==============
    // get all layers of the world (including the ILayer's fields)
    static upload(worldName: string, file: File): Promise<any> {
        console.log("start the upload file service...");
        return axios
            .post(`${this.urlBase}${worldName}`, file)
            .then(res => console.log("the upload succeed!"))
            .catch(error => console.log(error));
    }
}
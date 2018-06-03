/*
import React, {Component} from 'react';
import { render } from 'react-dom';
import './index.css';
import { Provider } from 'react-redux';
import store from './store';

const startUrl: string = 'http://localhost:8080/geoserver/';
const endUrl: string = '/gwc/service/wmts?SERVICE=wmts&REQUEST=getcapabilities&VERSION=1%2E0%2E0';

/*export class DisplayRaster extends Component{*/
/*export class DisplayRaster{

    projectName: string;
    storeName: string;

    constructor(workspace: string , storeName: string){
       this.projectName = workspace;
       this.storeName = storeName;

    }*/

    /* method to display the raster in openlayers */
    /*getCapabilities(layer: string, center: number[], url: string) {

        const parser = new ol.format.WMTSCapabilities();
        const map = {};

        fetch(url).then(function(response) {
            console.log("1: resopnse: " + response.toString());
            return response.text();
        }).then(function(text) {
            console.log("2: text: " + text.toString());
            var result = parser.read(text);
            console.log("3: result: " + result.toString());
            var options = ol.source.WMTS.optionsFromCapabilities(result, {
                projection: 'EPSG:4326', //HERE IS THE DATA SOURCE PROJECTION
                layer: this.layer,
                matrixSet: 'EPSG:4326'
            });
            console.log("4: options: " + options);

            this.map = new ol.Map({
                layers: [
                    new ol.layer.Tile({
                        source: new ol.source.OSM(),
                        opacity: 0.7
                    }),
                    new ol.layer.Tile({
                        opacity: 1,
                        source: new ol.source.WMTS(/** @type {!olx.source.WMTSOptions} *//* (options))
                    })
                ],
                target: 'map',
                view: new ol.View({
                    projection: 'EPSG:3857', //HERE IS THE VIEW PROJECTION
                    center:  ol.proj.transform(center, 'EPSG:4326', 'EPSG:3857'),
                    zoom: 15
                })
            });
        }).catch(function(e) {
            console.log(e)});
    }*/

    // const capabilitiesUrl = 'http://localhost:8080/geoserver/terra/SugarCane_geoTiff/gwc/service/wmts?SERVICE=wmts&REQUEST=getcapabilities&VERSION=1%2E0%2E0';
    /* capabilitiesUrl = `${startUrl}${this.projectName}${this.storeName}${endUrl}`;

    layer : string = this.storeName;
    center : number[] = [-50.571, -22.7677];

    this.getCapabilities(this.layer, this.center, this.capabilitiesUrl);

}
*/
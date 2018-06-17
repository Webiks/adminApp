import { IVector } from "./IVector";
import { IRaster } from "./IRaster";

export interface ILayerDetails {
    coverage?: IRaster,
    featureType?: IVector
}

export interface INameSpace {
    name: string,
    href: string
}

export interface IStrings {
    string: string[]
}

export interface INativeBoundingBox {
    minx: number,
    maxx: number,
    miny: number,
    maxy: number,
    crs?: string | ICrs
}

export interface ILatLonBoundingBox {
    minx: number,
    maxx: number,
    miny: number,
    maxy: number,
    crs: string
}

export interface ICrs {
    class?: string,
    $: string
}

export interface IMetaData {
    entry: IEntry | IEntry[]
}

export interface IEntry {
    key: string,
    $: any
}

export interface IStore {
    class: string,
    name: string
    href: string
}




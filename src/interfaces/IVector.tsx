import { ICrs, ILatLonBoundingBox, IMetaData, INameSpace, INativeBoundingBox, IStore, IStrings } from "./ILayerDetails";

export interface IVector {
    name: string,
    nativeName?: string,
    nameSpace?: INameSpace,
    title?: string,
    description?: string,
    keyword?: IStrings,
    nativeCRS?: string | ICrs
    srs: string,
    nativeBoundingBox: INativeBoundingBox,
    latLonBoundingBox: ILatLonBoundingBox,
    projectionPolicy?: string,
    enabled?: boolean,
    metadata?: IMetaData,
    store: IStore,
    maxFeatures: number,
    numDecimals: number,
    overridingServiceSRS: boolean,
    skipNumberMatched: boolean,
    circularArcPresent: boolean,
    attributes: IAttributes
}

export interface IAttributes {
    attribute: IAttribute[]
}

export interface IAttribute {

    name: string,
    minOccurs: number,
    maxOccurs: number,
    nillable: boolean,
    binding: string
}
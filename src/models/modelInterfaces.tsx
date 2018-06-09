import { LAYER_TYPES } from "../consts/layer-types";

export interface IWorld {
    name: string;
    layers: IWorldLayer[];
}

export interface IWorldLayer {
    name: string;
    id: string;
    type: LAYER_TYPES,
    resourceUrl: string,
    projection: string,
    boundingBox: {
        minX: number,
        maxX: number,
        minY: number,
        maxY: number
    },
    latLonBoundingBox: {
        minX: number,
        maxX: number,
        minY: number,
        maxY: number,
        crs: string
    },
    raster: IRaster,
    vector: IVector
}

export interface IRaster {
    format: string,
    bands: [
        {
            name: string,
            range: {
                min: string | number,
                max: string | number
            }
            nullValues: {
                double: number[]
            }
            unit: string
        }
    ]
}

export interface IVector {
    metadata: {
        entry: [
            {
            key: string,
            value: number
            }
        ]
    },
    attributes: {
        attribute: [
            {
              name: string,
              minOccurs: number,
              maxOccurs: number,
              nillable: boolean,
              binding: string
            }
        ]
    },
    maxFeatures: number,
    numDecimals: number,
    overridingServiceSRS: boolean,
    skipNumberMatched: boolean,
    circularArcPresent: boolean
}


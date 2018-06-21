import { AFFILIATION_TYPES } from '../consts/layer-types';

export interface IInputdata {
    affiliation: AFFILIATION_TYPES,
    GDS: number,                        // units: cm (raster only)
    sensor: ISensor,
    flightAltitude: number,             // units: meters
    cloudCoveragePercentage: number     // units: %  raster only)
}

export interface ISensor {
    name: string,
    maker: string,
    bands: string | string[]
}


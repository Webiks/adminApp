import { ILayerDetails } from "./ILayerDetails";
import { IAttribution, IDefaultStyle, ILayer, IResource } from "./ILayer";

export interface IWorldLayer {
    name: string,
    layer: ILayer,
    data: ILayerDetails
}

export interface IDefaultStyle {
    name: string,
    href: string
}

export interface IResource {
    class: string
    name: string,
    href: string
}

export interface IAttribution {
    logoWidth: number,
    logoHeight: number
}

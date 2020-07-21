import { IRenderer } from "./IRenderer";
import { HandlebarsRender } from "./HandlebarsRenderer";

export function getRenderer(type: string): IRenderer {
    var renderer = new HandlebarsRender();
    return renderer;
}
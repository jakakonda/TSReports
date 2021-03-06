import { Stream } from "stream";
import { IExporter } from "./IExporter";

export interface IPdfExporter extends IExporter {
    render(html: any, path: string, options?: object): Promise<Stream>;
}
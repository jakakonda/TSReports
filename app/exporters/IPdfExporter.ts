import { Stream } from "stream";

export interface IPdfExporter {
    render(html: any, path: string, options?: object): Promise<Stream>;
}
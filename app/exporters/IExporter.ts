import { Stream } from "stream";

export interface IExporter {
    render(html: any, path: string, options?: object): Promise<Stream>;
}

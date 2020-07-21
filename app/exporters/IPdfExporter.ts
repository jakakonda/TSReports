import { Stream } from "stream";

export interface IPdfExporter {
    render(html: any, options: object|null): Promise<Stream>;
}
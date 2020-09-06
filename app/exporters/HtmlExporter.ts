import { IPdfExporter } from './IPdfExporter';
import { Stream, Readable } from 'stream';

export class HtmlExporter implements IPdfExporter {
    render(html: any, path: string, options: object = {}): Promise<Stream> {
        return new Promise<Stream>((res, err) => {
            const readable = Readable.from([html]);
            res(readable);
        });
    }
}

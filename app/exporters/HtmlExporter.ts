import { IPdfExporter } from './IPdfExporter';
import { Stream, Readable } from 'stream';
import { JSDOM } from 'jsdom';
import * as path from 'path';

export class HtmlExporter implements IPdfExporter {
    render(html: any, fullPath: string, options: object = {}): Promise<Stream> {
        return new Promise<Stream>((res, err) => {
            const doc = new JSDOM(html);
            const dir = path.basename(fullPath);
            console.log("AAA");
            console.log(dir);
            const document = doc.window.document;

            const head = document.querySelector('head');
            const base = document.createElement('base');
            base.setAttribute('href', `/templates/${dir}/`);
            // head.appendChild(base);
            head.insertBefore(base, head.firstChild);

            const readable = Readable.from([doc.serialize()]);
            res(readable);
        });
    }
}

import { IPdfExporter } from './IPdfExporter';
import { Stream } from 'stream';
import * as pdf from 'html-pdf';
import * as path from 'path';

export class PhantomPdfExporter implements IPdfExporter {
    render(html: any, options: object|null = null): Promise<Stream> {
        return new Promise<Stream>((res, err) => {
            pdf.create(html, {
                format: 'A4',
                border: {
                    top: '24.4mm',
                    bottom: '24.4mm',
                    left: '31.7mm',
                    right: '31.7mm',
                },
                ...options
            }).toStream((error, stream) => {
                if (error)
                    return err(error);
                return res(stream);
            });
        });
    }
}

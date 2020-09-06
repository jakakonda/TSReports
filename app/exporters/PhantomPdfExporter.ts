import { IPdfExporter } from './IPdfExporter';
import { Stream } from 'stream';
import * as pdf from 'html-pdf';
import fileUrl from 'file-url';

export class PhantomPdfExporter implements IPdfExporter {
    render(html: any, path: string, options: object = {}): Promise<Stream> {
        return new Promise<Stream>((res, err) => {
            let filePath = fileUrl(path);
            if (filePath.charAt(filePath.length - 1) != '/')
                filePath += '/';
            (<any>options).base = filePath;
            pdf.create(html, {
                format: 'A4',
                border: {
                    top: '20mm',
                    bottom: '20mm',
                    left: '20mm',
                    right: '20mm',
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

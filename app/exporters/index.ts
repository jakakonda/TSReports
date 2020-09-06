import { getPdfExporter } from './PdfExporter';
import { IExporter } from "./IExporter";
import { HtmlExporter } from './HtmlExporter';

enum ExportType {
    PDF = 'pdf',
    HTML = 'html'
}

export function getExporter(type: string, subtype: string): IExporter {
    switch(type) {
        case ExportType.PDF:
            return getPdfExporter(subtype);
        case ExportType.HTML:
            return new HtmlExporter();
    }

    throw new Error('Unknown exporter type');
}
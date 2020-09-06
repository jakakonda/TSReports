import { IPdfExporter } from "./IPdfExporter";
import { IExporter } from "./IExporter";
import { PhantomPdfExporter } from "./PhantomPdfExporter";

export function getPdfExporter(type: string): IPdfExporter {
    return new PhantomPdfExporter();
}
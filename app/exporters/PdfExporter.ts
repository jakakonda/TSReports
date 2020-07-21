import { IPdfExporter } from "./IPdfExporter";
import { PhantomPdfExporter } from "./PhantomPdfExporter";

export function getPdfExporter(type: string): IPdfExporter {
    return new PhantomPdfExporter();
}
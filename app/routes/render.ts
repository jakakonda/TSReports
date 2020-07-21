import * as express from 'express';
import * as fs from 'fs';
import * as path from 'path';
import { getRenderer } from '../renderers/Renderer';
import { getPdfExporter } from '../exporters/PdfExporter';
import { loadTranslations } from '../utils/translations';
import { IReportRequest } from '../data/ReportRequest';

const router = express.Router();

function getTplPath(tpl: string) {
    return path.join(path.dirname(require?.main?.filename), '..', process?.env?.templates_dir, tpl);
}

async function render(tpl: string|null, data: IReportRequest, res: express.Response) {
    tpl = data.template && data.template.name || tpl;
    if (!tpl) {
        res.status(404).send();
        return;
    }

    // Check if template exists
    const tplPath = path.join(path.dirname(require?.main?.filename), '..', process?.env?.templates_dir, tpl);
    if (!fs.existsSync(tplPath)) {
        res.status(404).send();
        return;
    }

    try {
        const lang = loadTranslations(tplPath, data?.template?.language);

        const renderer = getRenderer('hb');
        const html = await renderer.render(tplPath, {
            $t: lang, 
            ...data.data
        });
        
        const exporter =  getPdfExporter('phantom');
        const stream = await exporter.render(html, {});
        stream.pipe(res);
    } catch(e) {
        console.error(e);
        res.status(500).send();
    }
}

router.get('/', async (req, res, next) => {
    const tpl = <string>req.query.template;
    if (!tpl) {
        res.status(404).send();
        return;
    }

    const demoDataPath = path.join(getTplPath(tpl), 'data.json');
    if (!fs.existsSync(demoDataPath)) {
        res.status(404).send();
        return;
    }

    const data = {
        data: require(demoDataPath)
    };

    await render(tpl, <IReportRequest>data, res);
});

router.post('/', async (req, res, next) => {
    await render(null, <IReportRequest>req.body, res);
});

export default router;
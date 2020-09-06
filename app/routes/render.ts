import * as express from 'express';
import * as fs from 'fs';
import * as path from 'path';
import { getRenderer } from '../renderers/Renderer';
import { getPdfExporter } from '../exporters/PdfExporter';
import { loadTranslations } from '../utils/translations';
import { IReportRequest } from '../data/ReportRequest';
import { Stream } from 'stream';

const router = express.Router();

function getTplPath(tpl: string) {
    return path.join(path.dirname(require?.main?.filename), '..', process?.env?.templates_dir, tpl);
}

async function render(data: IReportRequest, res: express.Response) {
    const tpl = data.template.name;
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

        if (data.template.type == 'html') {
            res.send(html);
        }
        else {
            const stream = await exporter.render(html, tplPath, {});
            stream.pipe(res);
        }
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

    const data: IReportRequest = {
        data: require(demoDataPath),
        template: {
            name: tpl,
            language: <string>req.query.lang,
            type: <string>req.query.type,
        }
    };
    console.log(data);

    await render(data, res);
});

router.post('/', async (req, res, next) => {
    console.log(JSON.stringify(req.body));
    await render(<IReportRequest>req.body, res);
});

export default router;
import * as express from 'express';
import * as fs from 'fs';
import * as path from 'path';
import { getRenderer } from '../renderers/Renderer';
import { loadTranslations } from '../utils/translations';
import { IReportRequest } from '../data/ReportRequest';
import { getExporter } from '../exporters';

const router = express.Router();

function getTplPath(tpl: string) {
    const dir =  process?.env?.templates_dir;
    if (dir && dir.startsWith('\\\\'))
        return path.join( process?.env?.templates_dir, tpl);
    return path.join(path.dirname(require?.main?.filename), '..', process?.env?.templates_dir, tpl);
}

async function render(data: IReportRequest, res: express.Response) {
    const tpl = data.template.name;
    if (!tpl) {
        res.status(404).send();
        return;
    }

    // Check if template exists
    const tplPath = getTplPath(tpl);
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
        
        const exporter = getExporter(data.template.type || 'pdf', undefined);
        const stream = await exporter.render(html, tplPath, {});
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

    const data: IReportRequest = {
        data: require(demoDataPath),
        template: {
            name: tpl,
            language: <string>req.query.lang,
            type: <string>req.query.type,
        }
    };

    await render(data, res);
});

router.post('/', async (req, res, next) => {
    await render(<IReportRequest>req.body, res);
});

export default router;
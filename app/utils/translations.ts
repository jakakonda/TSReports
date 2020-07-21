import * as path from 'path';
import * as fs from 'fs';

export function loadTranslations(dir: string, lang: string): object {
    let base = {};
    let filename = path.join(dir, 'lang.json');
    if (fs.existsSync(filename))
        base = require(filename);

    let local = {};
    filename = path.join(dir,  `lang.${lang}.json`);;
    if (fs.existsSync(filename))
        local = require(filename);

    return {
        ...base,
        ...local
    };
}
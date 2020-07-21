import { IRenderer } from './IRenderer';
import * as fs from 'fs';
import * as path from 'path';
import handlebars from 'handlebars';
import { JSDOM } from 'jsdom';
import { embedFiles } from './helpers';

export class HandlebarsRender implements IRenderer {
    public render(directory: string, data: object): Promise<string> {
        return new Promise<string>((resolve, err) => {
            this.loadFunctions(directory);
            
            const source = fs.readFileSync(path.join(directory, 'index.hbs'), 'utf8');
            const template = handlebars.compile(source);
            let html = template(data);   
            html = embedFiles(html, directory);
            
            resolve(html);
        });
    }

    public loadFunctions(dir: string) {
        // Get the helpers functions
        const funcPath = path.join(dir, 'functions.js');
        if (fs.existsSync(funcPath)) {
            const helpers = require(funcPath);
            handlebars.registerHelper(helpers);
        }
    }
}
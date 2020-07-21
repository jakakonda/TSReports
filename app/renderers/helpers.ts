import { JSDOM } from 'jsdom';
import * as fs from 'fs';
import * as path from 'path';

function base64_encode(file: string): string {
    return `data:image;base64,${fs.readFileSync(file, { encoding: 'base64' })}`;
}

function isNetworkPath(path: string): boolean {
    return path.startsWith('//') ||
            path.startsWith('http://') ||
            path.startsWith('https://');
}

export function embedFiles(html: string, rootDir: string): string {
    const doc = new JSDOM(html);
    const document = doc.window.document;
    const images = document.querySelectorAll('img');
    images.forEach(node => {
        const filePath = node.getAttribute('src');
        if (!filePath || filePath.startsWith('data:image') || isNetworkPath(filePath))
            return;

        node.setAttribute('src', base64_encode(path.join(rootDir , filePath)));
    });

    const links = document.querySelectorAll('link');
    links.forEach(node => {
        const filePath = node.getAttribute('href');
        if (!filePath || isNetworkPath(filePath))
            return;

        const style = document.createElement('style');
        style.innerHTML = fs.readFileSync(path.join(rootDir, filePath), 'utf8');
        node.replaceWith(style);
    });

    return doc.serialize();
}
import { Service } from 'egg';
import { exec } from 'child_process';
import * as fs from 'fs';

/**
 * Test Service
 */
export default class Linux extends Service {
    public exec(command: string) {
        return new Promise((resolve, reject) => {
            exec(command, {
                maxBuffer: 1024 * 1024 * 1024,
            }, err => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    public listDir(path) {
        return fs.readdirSync(path).map((itm, _index) => fs.statSync(path + itm));
    }

    public pathInfo(path) {
        return fs.statSync(path);
    }
}

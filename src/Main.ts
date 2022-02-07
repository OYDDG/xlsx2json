const confJson = require("../Config.json");
import * as NodeXlsx from "node-xlsx";
import fs from 'fs';
import path from "path";

export class Main {
    public run() {
        fs.readdir(confJson.xlsxDir, (err, files: string[]) => {
            for (let v of files) {
                let url = path.resolve(confJson.xlsxDir, v);
                let result = NodeXlsx.parse(url);
                debugger
            }
        });
    }
}

new Main().run();
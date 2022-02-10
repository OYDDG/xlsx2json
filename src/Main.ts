const confJson = require("../Config.json");
import NFs from 'fs';
import NodeXlsx from "node-xlsx";
import NPath from "path";
import { TableData } from "./TableData";

export class Main {
    public allTable: TableData[] = [];
    public run() {
        NFs.readdir(confJson.xlsxDir, (err, files: string[]) => {
            for (let fileName of files) {
                let url = NPath.resolve(confJson.xlsxDir, fileName);
                let result = NodeXlsx.parse(url);
                this.parseFiles(fileName, result);
            }
            this.out2Json();
        });
    }

    private parseFiles(fileName: string, data: { name: string, data: unknown[] }[]): void {
        for (let v of data) {
            /**sheet名为空或者包含#号为不导出 */
            if (v.name === "" || v.name.includes("#")) continue;
            let tableName = this.getTableName(v.data[0] as string[]);
            let keyNum = this.getKeyNum(v.data[1] as unknown[]);
            let tb = new TableData(fileName, v.name, tableName, keyNum, v.data[3] as string[], v.data[4] as string[], v.data.slice(5) as []);
            this.allTable.push(tb);
        }
    }

    private getTableName(data: string[]): string {
        for (let v of data) {
            if (!v) continue;
            if (!v.includes("#")) return v;
        }
        return '';
    }

    private getKeyNum(data: unknown[]): number {
        for (let v of data) {
            if (typeof v === "number") return v;
        }
        return 0;
    }

    private out2Json() {
        NFs.stat(confJson.out2JsonDir, (err, stats: NFs.Stats) => {
            if (err) {
                NFs.mkdirSync(NPath.resolve(confJson.out2JsonDir), { recursive: true });
            }
            for (let v of this.allTable) {
                v.write2Json(confJson.out2JsonDir);
            }
        });
    }
}

new Main().run();
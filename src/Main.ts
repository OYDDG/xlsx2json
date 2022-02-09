const confJson = require("../Config.json");
import NodeXlsx from "node-xlsx";
import NFs from 'fs';
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
                debugger
            }
        });
    }

    private parseFiles(fileName: string, data: { name: string, data: unknown[] }[]): void {
        for (let v of data) {
            /**sheet名为空或者包含#号为不导出 */
            if (v.name === "" || v.name.includes("#")) continue;
            let tableName = this.getTableName(v.data[0] as string[]);
            let keyNum = this.getKeyNum(v.data[1] as unknown[]);
            let tb = new TableData(fileName, v.name, "1", keyNum, v.data[3] as string[], v.data[4] as string[], v.data.slice(5) as []);
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
}

new Main().run();
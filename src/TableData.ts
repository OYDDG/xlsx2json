enum FiledType {
    string = "string",
    number = "number",
    boolean = "boolean",
}

export class TableData {
    public fileName: string;
    public sheetName: string;
    /**表名() */
    public tableName: string;
    /**键数 */
    public keyNum: number;
    /**字段名和类型 */
    public fieldsAndType: Map<string, string> = new Map();
    /**数据源 */
    public srcData: [][];

    public constructor(fileName: string, sheetName: string, tableName: string, keyNum: number, fields: string[], types: string[], srcData: [][]) {
        this.fileName = fileName;
        this.sheetName = sheetName;
        let reg = /^[a-zA-Z]\w*/;
        this.tableName = tableName;
        if (!tableName || !reg.test(tableName)) {
            this.throwTableError("表名格式错误!");
        }
        if (keyNum < 1) {
            this.throwTableError("键数错误至少有一个键!");
        }
        this.keyNum = keyNum;
        this.parseFieldsAndType(fields, types);
        this.srcData = srcData;
    }

    private parseFieldsAndType(fields: string[], types: string[]): void {
        for (let index = 0; index < fields.length; index++) {
            const element = fields[index];
            if (this.fieldsAndType.get(element)) {
                this.throwTableError("重复字段,字段名:" + element);
            }
            this.fieldsAndType.set(element, types[index]);
        }
    }

    private throwTableError(msg: string): void {
        console.error('表格格式出错，请检查！');
        console.error(`文件：${this.fileName}  所属sheet：${this.sheetName}`);
        console.error('错误原因:' + msg);
        process.exit(1);
    }
}
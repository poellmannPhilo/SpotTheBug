import { readFileSync } from "fs";

export default class FileReader {
  _filepath: string;

  constructor(filepath?: string) {
    this._filepath = filepath ? filepath : "";
  }

  public syncReadFile() {
    try {
      const contents = readFileSync(this._filepath, "utf-8");
      return contents;
    } catch (err) {
      console.warn(err);
    }
  }

  public set filepath(filepath: string) {
    this._filepath = filepath;
  }
}

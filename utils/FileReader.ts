import { readFileSync } from "fs";
import path from 'path';

export default class FileReader {
  _filepath: string;

  constructor(filepath?: string) {
    this._filepath = filepath ? filepath : "";
  }

  public syncReadFile() {
    try {
      const dir = path.join(process.cwd(), 'resources');
      const contents = readFileSync(dir + this._filepath, "utf-8");
      return contents;
    } catch (err) {
      console.warn(err);
    }
  }

  public set filepath(filepath: string) {
    this._filepath = filepath;
  }
}

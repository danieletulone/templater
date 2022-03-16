import Template from "./template";
import fs from 'fs';
import path from 'path';

export default abstract class TemplateFile<R extends { [k: string]: string }> extends Template<R> {
  protected _path: string = '';

  setPath(path: string): this {
    this._path = path;
    return this;
  }

  write(callback: fs.NoParamCallback = () => {}): void {
    fs.writeFile(
      path.join(this._path, this.name),
      this.compiled,
      callback
    )
  }

  writeSync(): void {
    fs.writeFileSync(
      path.join(this._path, this.name),
      this.compiled
    )
  }
}

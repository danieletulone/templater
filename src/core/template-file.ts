import Template from "./template";
import fs from 'fs';
import path from 'path';

export default abstract class TemplateFile<R extends { [key: string]: unknown }> extends Template<R> {
  protected _path: string = '';

  private _deduceFromConstructorName() {
    const segments = this.constructor.name
      .replace('Template', '')
      .split(/(?=[A-Z])/);

    let extension = ''

    if (segments.length > 1) {
      extension = segments.pop()?.toLowerCase() as string;
    }

    return {
      name: segments.map((s) => s.toLowerCase()).join('-'),
      extension: extension
    }
  }

  /**
   * Name of file to generate.
   */
  get name (): string {
    return this._deduceFromConstructorName().name
  }

  get extension (): string {
    return this._deduceFromConstructorName().extension
  }

  get fullName () {
    return `${this.name}.${this.extension}`;
  }

  setPath(path: string): this {
    this._path = path;
    return this;
  }

  write(callback: fs.NoParamCallback = () => {}): void {
    fs.writeFile(
      path.join(this._path, this.fullName),
      this.compiled,
      callback
    );
  }

  writeSync(): void {
    fs.writeFileSync(
      path.join(this._path, this.fullName),
      this.compiled
    );
  }
}

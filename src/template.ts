import { Replacer } from './common/interfaces/replacer.interface';
import { ReplacerValue } from './common/types/replacer-value.type';
import { Replacers } from './common/types/replacers.type';
import { format } from './utils';

export default abstract class Template<R extends Replacers> {
  /**
   * Name of file to generate.
   */
  get name (): string {
    const nameSegments = this.constructor.name
      .replace('Template', '')
      .split(/(?=[A-Z])/);

    let extension = ''

    if (nameSegments.length > 1) {
      extension = nameSegments.pop()?.toLowerCase() as string;
    }

    return nameSegments
      .map((s) => s.toLowerCase())
      .map((s) => this.nameFilter(s))
      .join('-')
      .concat(
        extension ? '.' + extension : ''
      );
  };

  /**
   * Replacers bag.
   */
  private _replacers: Record<string, Replacer<R[keyof R]>> = {};

  /**
   * Symbol to use for wrap replacers.
   */
  private _keyWrapper = '__'

  /**
   * Template compiled.
   */
  protected compiled = ''

  nameFilter (s: string): string {
    return s
  }

  /**
   * Get a replacer.
   *
   * If transform function is provider,
   * the value to replace will be transform before to be placed.
   *
   * If replacer value will be different from string
   * the transform parameter will be always mandatory.
   *
   * @param keyName
   * @param transform
   * @returns
   */
  getReplacer(keyName: keyof R & string, transform?: ReplacerValue<R[keyof R]>): string {
    const keyComposed = this._keyWrapper + keyName + this._keyWrapper;

    if (!this._replacers[keyName]) {
      throw new Error("You must provide replacer for " + keyName);
    }

    this._replacers[keyName].transform = transform;

    return keyComposed;
  }

  /**
   * Content of template.
   */
  abstract content(): string;

  /**
   * Provide a replacer.
   *
   * @param key Key of replacer.
   * @param value Value of replacer.
   * @returns
   */
  provideReplacer(key: keyof R & string, value: R[keyof R]): this {
    this._replacers[key] = {
      value: value
    }

    const transform = this._replacers[key].transform;

    if (transform && typeof value !== 'string') {
      throw new Error("Cannot provide replacer. First, generate a key.");
    }

    let valueAsString = ''

    if (transform) {
      valueAsString = transform(value);
    } else {
      valueAsString = value
    }

    this._replacers[key].value = valueAsString

    return this;
  }

  /**
   * Compile template using provided replacers.
   *
   * @returns
   */
  compile(): this {
    let content = format(this.content());

    Object.entries(this._replacers).forEach(([replacerKey, replacer]) => {
      if (!replacer.value) {
        throw new Error(replacerKey + ' has not value.');
      }

      content = content.replaceAll(
        this._keyWrapper + replacerKey + this._keyWrapper,
        replacer.transform ? replacer.transform(replacer.value) : replacer.value
      );
    })

    this.compiled = content

    return this
  }
}

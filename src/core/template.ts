import { format } from '../utils';
import { Replacers } from '../common/types/replacers.type'

export default abstract class Template<R extends { [key: string]: unknown }> {
  /**
   * Replacers bag.
   */
  protected _replacers: Partial<Replacers<R>> = {};

  /**
   * Symbol to use for wrap replacers.
   */
  protected _keyWrapper = '__'

  /**
   * Template compiled.
   */
  protected compiled = ''

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
  getReplacer<P extends keyof R>(key: P, transform?: Replacers<R>[P]['transform']) {
    const keyComposed = this._keyWrapper + key + this._keyWrapper;
    const replacerObj = this._replacers[key]

    if (replacerObj === undefined) {
      throw new Error("You must provide replacer for " + key);
    }

    replacerObj.transform = transform;

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
  provideReplacer<P extends keyof R>(key: P, value: R[P]): this {
    const replacerObj = this._replacers[key]

    if (replacerObj !== undefined) {
      throw new Error("Value for " + key + " is already provided.");
    }

    this._replacers[key] = {
      value: value
    }

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

  toString() {
    return this.compiled;
  }
}

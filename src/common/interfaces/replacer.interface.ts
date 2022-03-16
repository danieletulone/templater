import { ReplacerValue } from "../types/replacer-value.type";

export interface Replacer<V> {
  transform?: ReplacerValue<V>;
  value?: string;
}

export type Replacer<T> = {
  value: T,
  transform?: (value: T) => string;
}

export type Replacers<Type extends { [key: string]: unknown }> = {
  [Property in keyof Type]: Replacer<Type[Property]>;
};

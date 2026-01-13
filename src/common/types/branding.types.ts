// TODO: add eslint rule to enforce controllers' return type to include __publicBrand
declare const __publicBrand: unique symbol;
export type Public<T> = T & { readonly [__publicBrand]: true };

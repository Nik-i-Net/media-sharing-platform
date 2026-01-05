type CamelToSnakeCase<S extends string> =
  S extends `${infer T}${infer U}` ?
  `${T extends Capitalize<T> ? "_" : ""}${Lowercase<T>}${CamelToSnakeCase<U>}` :
  S;

type CamelToSnake<T> = {
  [K in keyof T as CamelToSnakeCase<string & K>]: T[K];
};

function camelToSnake<T>(obj: T): CamelToSnake<T> {
  const newObj: Record<string, any> = {};
  for (const key in obj) {
    const snakeKey = key.replace(/[A-Z]/g, c => "_" + c.toLowerCase());
    newObj[snakeKey] = obj[key];
  }
  return newObj as CamelToSnake<T>;
}

type SnakeToCamelCase<S extends string> =
  S extends `${infer T}_${infer U}` ?
  `${T}${Capitalize<SnakeToCamelCase<U>>}` :
  S;

type SnakeToCamel<T> = {
  [K in keyof T as SnakeToCamelCase<string & K>]: T[K];
};

function snakeToCamel<T>(obj: T): SnakeToCamel<T> {
  const newObj: Record<string, any> = {};
  for (const key in obj) {
    const camelKey = key.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
    newObj[camelKey] = obj[key];
  }
  return newObj as SnakeToCamel<T>;
}

export type { CamelToSnake, SnakeToCamel };
export { camelToSnake, snakeToCamel };


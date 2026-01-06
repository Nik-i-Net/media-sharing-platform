// https://www.typescriptlang.org/play?#code/C4TwDgpgBAygdgQwNYQCoHsDCCC2EA22AzhADwxQQAewEcAJkVEcAE4CWcA5gHxQC8AKCixKNOoygADACQBvTgDMIrKKgC+AfXlKVUAKrqpUAPzDp8jfOxh2wBPnYAvMvGRosuAsTL6ePIygALnMYQUFQSChsPHwMNxQfcjFaBiYWDm4+IREKalTJWQU4ZVUrYtKDQLMRItQUiSYbOwdnMlQ+EygAIk1u4J7u9XkAGXQAdxUAYwQSUg7huRiCeMRE2d8A4xDc8MjoZbj0AAVZmcIN5PzG5jZOXgFohFt7RxdyHgjwaFOic4xDkk8uI0rdMg9+AY4DMXq13jBPvsoL9-ugEhAgQ1QRl7tknrFVu4kvpoc8Wm9XP4vlF0RgUQ5MddsXcso9mq82uQ1h5AZcEZ9qdBUABGYWPWmeWJJboACwI+HQ3T4AHplT05fgFd1BWphQAmcXcgFeC5zWXy9CacboVj4ehKqCq9UWgDqNrt2qRIoAzIb3MapZdzZrLcAiFb3faVWrgwrUEQ3bb7TqRQAWP0oAPeIMahURpP9AA+PUU6EtACMEKwHU7Y+hEx6oMXuqX0AAhKue766gCsGZ5JqSONZTuHXB1ADlHqm9SnhQA2ftZ01kKTAOWaBBwIiTViadjh+QTozRnrriAAQW3u4AkkQZ-0ABRIqeQmcASj23dQerFkMOhLrGauaKqedZdlEP4Gv+JqARiOaupGNYxiB+Yeimeq+jBBJoty0ogfGDZRo6KEWpoYZocmKben++IrCcZwMghIZKtR0F0Uc9IrqQdZEaxXrelhHF0ox3F1oRSECl6qa0RKXH4Ra-HfjOS4MX8THAWR1oFoiylCXJokKSG5HhtpHpSd+Pa0Vxy7SgAEopumQT27E2ZK2Zmg5IZ8U5Qo9kJbm8p5FoSTpX6QfO1miXB9mOSm86udFuFEkGXkKj58UBUl6KxSGoXmeF0A3nAYAAK7AKg3aQnI5hENymgzCQmgoCAmjCkEUBwKVODlioAA0tX1Y1EDNRArV6h1Y4DeohVQAA8uVZUVVVUByFAADaADSUCcFALXoIoUDFUtlVRLMsBGu53GbTwAC6HXHeVp0QFtt1QDNyoAFTmEiC3ACdK01SIwPMHhGybWN7Wdd1vWsAA3OYIN1SlJAQyAE1gvcCMiDNn3KuEX3fVAn1QMIJMAKIgkQ7DoHAHWYLTABuKjAJ1EAsBA9BQGArDoJArDAOw7Nk6TxP40ij3LZAE7s7QXPVYN7gNRso2tVDQPA8jKDK01LVtVDY6I6DSvDarbUY4bOMDSIWsjabesWyyXDTbNEpBRAMsc-Q8x4vUTKSOg5YAFYQFMrNdBrW07XAe1jQdahQOdbuDpc20AGSY1k90Xf6V0+J7cvzK9nzqAMqCzX9APS7LnOqe7Bec6QkvPQ39A8EAA
type CamelToSnakeCase<S extends string> = S extends `${infer T}${infer U}`
  ? `${T extends Capitalize<T> ? '_' : ''}${Lowercase<T>}${CamelToSnakeCase<U>}`
  : S;

type CamelToSnake<T> = {
  [K in keyof T as CamelToSnakeCase<string & K>]: T[K];
};

function camelToSnake<T>(obj: T): CamelToSnake<T> {
  const newObj: Record<string, unknown> = {};
  for (const key in obj) {
    const snakeKey = key.replace(/[A-Z]/g, (c) => '_' + c.toLowerCase());
    newObj[snakeKey] = obj[key];
  }
  return newObj as CamelToSnake<T>;
}

type SnakeToCamelCase<S extends string> = S extends `${infer T}_${infer U}`
  ? `${T}${Capitalize<SnakeToCamelCase<U>>}`
  : S;

type SnakeToCamel<T> = {
  [K in keyof T as SnakeToCamelCase<string & K>]: T[K];
};

function snakeToCamel<T>(obj: T): SnakeToCamel<T> {
  const newObj: Record<string, unknown> = {};
  for (const key in obj) {
    const camelKey = key.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
    newObj[camelKey] = obj[key];
  }
  return newObj as SnakeToCamel<T>;
}

export type { CamelToSnake, SnakeToCamel };
export { camelToSnake, snakeToCamel };

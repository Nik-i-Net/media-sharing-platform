import fs from 'node:fs';

const privateKeyPath = process.env.JWT_PRIVATE_KEY_PATH;
const publicKeyPath = process.env.JWT_PUBLIC_KEY_PATH;

if (!privateKeyPath || !publicKeyPath) {
  console.error(`JWT_PRIVATE_KEY_PATH or JWT_PUBLIC_KEY_PATH environment variable wasn't provided.`);
  process.exit(1);
}

let PRIVATE_KEY;
let PUBLIC_KEY;

try {
  PRIVATE_KEY = fs.readFileSync(privateKeyPath, 'utf-8');
  PUBLIC_KEY = fs.readFileSync(publicKeyPath, 'utf-8');
} catch (err) {
  console.log(err);
  console.error('Unable to read JWT keys.\n' + `Check ${privateKeyPath} and ${publicKeyPath}`);
  process.exit(1);
}

export { PRIVATE_KEY, PUBLIC_KEY };

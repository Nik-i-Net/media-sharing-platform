import fs from 'node:fs';
import type { PrivateKey, PublicKey } from 'jsonwebtoken';

function loadJwtKeys(
  privateKeyPath: string | undefined,
  publicKeyPath: string | undefined,
): { privateKey: PrivateKey; publicKey: PublicKey } {
  if (!privateKeyPath || !publicKeyPath) {
    throw new Error('JWT privateKeyPath or publicKeyPath is missing');
  }

  try {
    const privateKey = fs.readFileSync(privateKeyPath, 'utf-8');
    const publicKey = fs.readFileSync(publicKeyPath, 'utf-8');
    return { privateKey, publicKey };
  } catch (err) {
    const errMessage = err instanceof Error ? err.message : 'unknown error';
    throw new Error(`Failed to load JWT keys: ${errMessage}`);
  }
}

export { loadJwtKeys };

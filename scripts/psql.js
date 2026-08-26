import { spawn } from 'child_process';

const { POSTGRES_USER, POSTGRES_DB } = process.env;
const CONTAINER_NAME = 'postgres-dev';

if (!POSTGRES_USER || !POSTGRES_DB) {
  console.error('Error: env variables POSTGRES_USER and POSTGRES_DB are required');
  process.exit(1);
}

const psql = spawn(
  'docker',
  ['exec', '-it', CONTAINER_NAME, 'psql', '-U', POSTGRES_USER, '-d', POSTGRES_DB],
  {
    stdio: 'inherit',
  },
);

psql.on('exit', (code) => {
  process.exit(code);
});

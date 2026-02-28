import { spawn } from 'child_process';

const { POSTGRES_USER, POSTGRES_DB } = process.env;
const CONTAINER_NAME = 'postgres';

if (!POSTGRES_USER || !POSTGRES_DB) {
  console.error('Error: POSTGRES_USER or POSTGRES_DB not found in .env');
  process.exit(1);
}

// docker exec -it <name> psql -U <user> -d <db>
const psql = spawn('docker', ['exec', '-it', CONTAINER_NAME, 'psql', '-U', POSTGRES_USER, '-d', POSTGRES_DB], {
  stdio: 'inherit',
});

psql.on('exit', (code) => {
  process.exit(code);
});

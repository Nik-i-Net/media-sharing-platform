import { spawn } from 'child_process';

const CONTAINER_NAME = 'redis';

const redisCli = spawn('docker', ['exec', '-it', CONTAINER_NAME, 'redis-cli'], {
  stdio: 'inherit',
});

redisCli.on('exit', (code) => {
  process.exit(code);
});

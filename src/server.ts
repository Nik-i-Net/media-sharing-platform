import { app } from './app/app';
import { ENV } from './shared/env.loader';

const port = Number(ENV.PORT);
const server = app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

process.on('SIGTERM', () => {
  server.close(() => {
    process.exit(0);
  });
});

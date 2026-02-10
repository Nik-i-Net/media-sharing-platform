import { env } from '@config/env.loader';
import { app } from './presentation/app';

const port = Number(env.PORT);
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

// TODO:
// - check if db is available during startup

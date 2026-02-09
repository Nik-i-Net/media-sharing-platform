import { app } from './presentation/express.app';
import { env } from '@config/env.loader';

const port = Number(env.PORT);
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

// TODO:
// - check if db is available during startup

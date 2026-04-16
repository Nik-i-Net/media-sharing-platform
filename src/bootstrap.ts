import { app } from './app';
import { ENV } from './config/env.loader';

const port = Number(ENV.PORT);
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

// TODO:
// - check if db is available during startup

import { app } from './app/app';
import { ENV } from './shared/env.loader';

const port = Number(ENV.PORT);
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

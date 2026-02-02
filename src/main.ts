import { app } from './presentation/express.app';

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

// TODO:
// - check if db is available during startup

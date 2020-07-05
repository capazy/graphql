const app = require('./app');

const PORT = app.get('PORT');

app.listen(PORT, () => {
  if (process.env.NODE_ENV !== 'test') {
    console.log(`Listening on port ${PORT}`);
  }
});

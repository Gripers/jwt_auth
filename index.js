const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRouter = require('./routers/authRouter');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/auth', authRouter);

const port = 8080;

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const start = async () => {
  try {
    await mongoose
      .connect('mongodb+srv://riot:riot@cluster0.tmnqkwu.mongodb.net/users')
      .then(() => console.log(`DB connection: ok`))
      .catch(() => console.log(`DB connection: bad`));

    app.listen(port, () => console.log(`Server: ${port}`));
  } catch (e) {
    console.log(e);
  }
};

start();

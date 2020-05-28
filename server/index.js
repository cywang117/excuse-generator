const path = require('path');
const express = require('express');
const app = express();
const router = express.Router();

const { listAll } = require('./db/index');
const { excuseMarkovChain } = require('./utils/markovChain');

app.use(express.json());
app.use('/api', router);
app.use(express.static(path.resolve(__dirname, '..', 'client')));

router.get('/excuse', async (req, res) => {
  try {
    await excuseMarkovChain.processData();
    let randomExcuse = excuseMarkovChain.generate();
    res.status(200).json(randomExcuse);
  } catch(e) {
    console.error(e);
    res.sendStatus(500);
  }
});

const PORT = 3000;
app.listen(process.env.PORT || PORT, () => {
  console.log(`Server listening on port ${process.env.PORT || PORT}`);
});


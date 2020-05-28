const path = require('path');
const express = require('express');
const app = express();
const router = express.Router();

const { listAll } = require('./db/index');
const { excuseMarkovChain } = require('./utils/markovChain');

excuseMarkovChain.processData().then(() => {
  console.log('Graph edge list: ', excuseMarkovChain.edgeList);
  console.log('Graph phraseBeginnings: ', excuseMarkovChain.phraseBeginnings);
  console.log('MarkovChain.prototype.generate: ', excuseMarkovChain.generate());
});

app.use(express.json());
app.use('/api', router);
app.use(express.static(path.resolve(__dirname, '..', 'client')));

router.get('/excuse', (req, res) => {
  let randomExcuse = excuseMarkovChain.generate();
  res.status(200).send(randomExcuse);
});

const PORT = 3000;
app.listen(process.env.PORT || PORT, () => {
  console.log(`Server listening on port ${process.env.PORT || PORT}`);
});


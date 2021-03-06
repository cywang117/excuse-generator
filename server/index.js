const path = require('path');
const fs = require('fs');
const cookieSession = require('cookie-session');
const express = require('express');
const app = express();
const router = express.Router();

const { listTopN, incrementLikes, decrementLikes, getExcuseId } = require('./db/index');
const { excuseMarkovChain } = require('./utils/markovChain');

app.use(cookieSession({
  name: 'excuseWizard',
  secret: 'abracadabra',
  maxAge: 24 * 60 * 60 * 1000,
}));

app.use(express.json());
app.use('/api', router);
app.use(express.static(path.resolve(__dirname, '..', 'client', 'dist')));

// Get a randomly generated excuse
router.get('/excuse', async (req, res) => {
  try {
    await excuseMarkovChain.processData();
    let randomExcuse = excuseMarkovChain.generate();
    let idIfExists = await getExcuseId(randomExcuse);
    while (idIfExists) {
      randomExcuse = excuseMarkovChain.generate();
      idIfExists = await getExcuseId(randomExcuse);
    }
    res.status(200).json(randomExcuse);
  } catch(e) {
    console.error(e);
    res.sendStatus(500);
  }
});

// Post a user-generated excuse to be added to the Markov Chain data corpus
router.post('/excuse', async (req, res) => {
  let isValid = await excuseMarkovChain.checkAddedExcuseValidity(req.body.excuse);
  if (isValid) {
    // TODO
    res.status(201).json({ message: 'Excuse successfully added' });
  } else {
    res.status(400).json({ error: 'Invalid excuse' });
  }
});

// Get top ten likes, sorted secondarily by updateTime
router.get('/likes', async (req, res) => {
  try {
    let top10 = await listTopN(10);
    res.status(200).json(top10);
  } catch(e) {
    console.error(e);
    res.sendStatus(500);
  }
});

// Get likes by _id of current session user
router.get('/likes/session', (req, res) => {
  if (!req.session.likes) {
    req.session.likes = {};
  }
  res.status(200).json({ ...req.session.likes });
});

// Post a new or existing excuse to be liked, then update session
router.post('/like', async (req, res) => {
  let { excuse } = req.body;

  if (!req.session.likes) {
    req.session.likes = {};
  }

  let _id;
  try {
    _id = await getExcuseId(excuse);
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }

  if (!_id || (_id && !req.session.likes[_id])) {
    _id = await incrementLikes(_id, excuse);
    req.session.likes[_id] = true;
    res.status(201).json({ message: 'Post successfully liked', _id });
  } else {
    res.status(400).json({ error: 'Post is already liked' });
  }
});

// Post an existing (NOT new) excuse to be unliked, then update session
router.post('/unlike', async (req, res) => {
  let { excuse } = req.body;

  if (!req.session.likes) {
    req.session.likes = {};
  }

  let _id;
  try {
    _id = await getExcuseId(excuse);
  } catch(e) {
    console.error(e);
    res.sendStatus(500);
  }

  if (!_id) {
    res.status(400).json({ error: 'Post does not exist' });
    return;
  } else if (!req.session.likes[_id]) {
    res.status(400).json({ error: 'Post is already unliked' });
    return;
  }

  try {
    _id = await decrementLikes(_id, excuse);
  } catch(e) {
    console.error(e);
    res.sendStatus(500);
  }

  if (_id) {
    delete req.session.likes[_id];
    res.status(200).json({ message: 'Post successfully unliked', _id });
  } else {
    console.log('Really hope you don\'t get here');
    res.sendStatus(500);
  }
});

// Ensure static html asset is served with all React-Router routes
app.get('*', (req, res) => {
  res.sendFile('index.html', { root: path.resolve(__dirname, '..', 'client', 'dist')});
});

const PORT = 3000;
app.listen(process.env.PORT || PORT, () => {
  console.log(`Server listening on port ${process.env.PORT || PORT}`);
});


const path = require('path');
const cookieSession = require('cookie-session');
const express = require('express');
const app = express();
const router = express.Router();

const { listTopN, incrementLikes, decrementLikes } = require('./db/index');
const { excuseMarkovChain } = require('./utils/markovChain');

app.use(cookieSession({
  name: 'excuseWizard',
  secret: 'abracadabra',
  maxAge: 24 * 60 * 60 * 1000,
}));

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

router.get('/likes', async (req, res) => {
  try {
    let top10 = await listTopN(10);
    res.status(200).json(top10);
  } catch(e) {
    res.sendStatus(500);
  }
});

router.get('/likes/session', (req, res) => {
  if (!req.session.likes) {
    req.session.likes = {};
  }
  res.status(200).json({ ...req.session.likes });
});

router.post('/like', async (req, res) => {
  let { _id, excuse } = req.body;
  if (!req.session.likes) {
    req.session.likes = {};
  }
  if (!req.session.likes[_id]) {
    let newIdIfNotExists = await incrementLikes({ excuse });
    if (newIdIfNotExists) {
      req.session.likes[newIdIfNotExists] = true;
    } else {
      req.session.likes[_id] = true;
    }
    res.status(201).json({ message: 'Post successfully liked' });
  } else {
    res.status(400).json({ error: 'Post is already liked' });
  }

});

router.post('/unlike', async (req, res) => {
  let { _id } = req.body;
  if (!req.session.likes) {
    req.session.likes = {};
  }
  if (req.session.likes[_id ]) {
    delete req.session.likes[_id ];
    await decrementLikes({ _id  });
    res.status(200).json({ message: 'Post successfully unliked' });
  } else {
    res.status(400).json({ error: 'Post is already unliked' });
  }
});

const PORT = 3000;
app.listen(process.env.PORT || PORT, () => {
  console.log(`Server listening on port ${process.env.PORT || PORT}`);
});


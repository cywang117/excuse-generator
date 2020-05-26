import React, { useState } from 'react';
import { Box, Button, Container, Typography, Divider } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  label: {
    textTransform: 'none'
  },
  root: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    height: 'calc(100vh - 64px)'
  }
}));

let sampleIdeas = [
  'A dating app for dog owners',
  'A calendar app that lists fake events so you look busy',
  'An app that adds an Apple Watch to a photo of the user',
  'An app that texts your friends "Where r u?" every 30 minutes',
  'An app that allows users to donate pizzas to other users',
  'An app that counts the number of curse words in a movie',
  'A language learning app for learning bad words',
  'A pen pal app that pairs you with someone who doesn\'t speak your language'
];
const generateIdea = () => {
  return sampleIdeas[Math.floor(Math.random() * sampleIdeas.length)];
};

const Generator = () => {
  const classes = useStyles();

  let [idea, setIdea] = useState(generateIdea());

  const handleClick = () => {
    setIdea(generateIdea());
  };

  return (
    <Container className={classes.root}>
      <Box pb={10}>
        <Typography variant="h3" align="center" color="secondary" gutterBottom={true}>
          Your next million dollar idea:
        </Typography>
        <Divider />
      </Box>
      <Box pb={5} px={10} height="175px">
        <Typography variant="h4" align="center">
          {idea}
        </Typography>
      </Box>

      <Button variant="contained" color="secondary" onClick={handleClick} className={classes.label}>Another idea, squire!</Button>
    </Container>
  );
};

export default Generator;
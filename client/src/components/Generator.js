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

let sampleExcuses = [
  'I\'ve got to water my garbanzo beans',
  'I have an appointment to get my ringworm checked',
  'I\'ve got a conference call',
  'My cat is having an abortion',
  'I\'m suffering from horrible diarrhea',
  'I have to return some video tapes',
  'My mom said no',
  'My water broke'
];
const generateExcuse = () => {
  return sampleExcuses[Math.floor(Math.random() * sampleExcuses.length)];
};

const Generator = () => {
  const classes = useStyles();

  let [excuse, setExcuse] = useState(generateExcuse());

  const handleClick = () => {
    setExcuse(generateExcuse());
  };

  return (
    <Container className={classes.root}>
      <Box pb={10}>
        <Typography variant="h3" align="center" color="secondary" gutterBottom={true}>
          Your excuse:
        </Typography>
        <Divider />
      </Box>
      <Box pb={5} px={10} height="175px">
        <Typography variant="h4" align="center">
          {excuse}
        </Typography>
      </Box>

      <Button variant="contained" color="secondary" onClick={handleClick} className={classes.label}>Generate Another Excuse</Button>
    </Container>
  );
};

export default Generator;
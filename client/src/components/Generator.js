import React, { useState, useEffect } from 'react';
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
  },
  excuseBox: {
    paddingBottom: theme.spacing(5),
    [theme.breakpoints.down('sm')]: {
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1)
    },
    [theme.breakpoints.up('md')]: {
      paddingLeft: theme.spacing(10),
      paddingRight: theme.spacing(10)
    }
  }
}));

const Generator = () => {
  const classes = useStyles();
  let [excuse, setExcuse] = useState('');

  useEffect(() => {
    getExcuse();
  }, []);

  const getExcuse = () => {
    fetch('/api/excuse')
      .then(response => response.json())
      .then(text => setExcuse(text))
      .catch(console.error);
  };

  return (
    <Container className={classes.root}>
      <Box pb={10}>
        <Typography variant="h3" align="center" color="secondary" gutterBottom={true}>
          Your excuse:
        </Typography>
        <Divider />
      </Box>
      <Box className={classes.excuseBox} height="175px">
        <Typography variant="h4" align="center">
          {excuse}
        </Typography>
      </Box>

      <Button variant="contained" color="secondary" onClick={getExcuse} className={classes.label}>Generate Another Excuse</Button>
    </Container>
  );
};

export default Generator;
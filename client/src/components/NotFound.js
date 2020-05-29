import React from 'react';
import { Container, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'left',
    flexDirection: 'column',
    height: 'calc(100vh - 64px)',
    [theme.breakpoints.up('md')]: {
      paddingRight: theme.spacing(35)
    }
  },
}));

const NotFoundPage = () => {
  const classes = useStyles();
  return (
    <Container className={classes.root}>
      <Typography variant="h3" color="secondary" gutterBottom={true}>
        Oops!
      </Typography>
      <Typography variant="subtitle1" color="secondary">
        The page you're looking for doesn't exist.
      </Typography>
    </Container>
  )
};

export default NotFoundPage;
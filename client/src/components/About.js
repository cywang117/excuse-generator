import React from 'react';
import { Container, Typography, Link, Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    height: 'calc(100vh - 64px)',
    [theme.breakpoints.up('md')]: {
      paddingRight: theme.spacing(35)
    }
  },
  responsiveBox: {
    [theme.breakpoints.up('md')]: {
      padding: theme.spacing(3, 15)
    },
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(3, 10)
    },
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing(3, 2)
    }
  }
}));

const About = () => {
  const classes = useStyles();

  return (
    <Container className={classes.root}>
      <Typography
        variant="h3"
        color="secondary"
        gutterBottom={true}
      >
        About Excuse Wizard
      </Typography>
      <Box className={classes.responsiveBox}>
        <Box pb={1}>
          <Typography variant="h5" gutterBottom={true} color="primary">
            So, Excuse Wizard seems to generate a lot of nonsense. Why?
          </Typography>
        </Box>
        <Typography gutterBottom={true} color="primary">
          It's a probability-based generator! Excuse Wizard was created using the Markov Chain Monte Carlo (MCMC) method, a class of algorithms for sampling from a probability distribution. In the context of text generation, sentences from a dataset are broken down into individual words, and the probability of a word being the next one is determined using a directed, weighted graph. Read more about MCMC
          <span>&nbsp;
            <Link
              href="https://machinelearningmastery.com/markov-chain-monte-carlo-for-probability/"
              target="_blank"
              color="secondary"
            >
              here
            </Link>
          </span>.
        </Typography>
        <Typography gutterBottom={true} color="primary">
          This means that the MCMC algorithm, and Excuse Wizard by extension, only understands probabilities. What it uses to generate excuses is a large dataset, which is processed into a directed, weighted graph. (In this case, a base dataset of n = 312 was used.) This means, the larger the dataset, the less nonsensical Excuse Wizard will sound. Help Excuse Wizard become smarter
          <span>&nbsp;
            <Link
              href="/add"
              color="secondary"
            >
              here
            </Link>
          </span>!
        </Typography>
      </Box>
    </Container>
  );
};

export default About;
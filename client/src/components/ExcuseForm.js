import React, { useState } from 'react';
import { Container, Typography, Box, Link, TextField, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { ArrowDropDown } from '@material-ui/icons';

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
  },
  formRoot: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: '50ch'
    }
  }
}));

const ExcuseForm = ({ addExcuse }) => {
  const classes = useStyles();
  const [excuse, setExcuse] = useState('');

  const handleChange = (event) => {
    setExcuse(event.target.value);
  };

  const handleSubmit = () => {
    addExcuse(excuse);
    setExcuse('');
  };

  return (
    <Container className={classes.root}>
      <Typography variant="h3" color="secondary" gutterBottom={true}>
        Add An Excuse
      </Typography>
      <Box className={classes.responsiveBox}>
        <Box pb={1}>
          <Typography variant="h5" align="center">
            Excuse Wizard needs your help to become smarter!
          </Typography>
        </Box>

        <Typography>
          Type a silly or serious PG-13 excuse below to help Excuse Wizard along his enlightenment journey. Read about why
          <span>&nbsp;
            <Link
              href="/about"
              color="secondary"
            >
              here
            </Link>
          </span>.
        </Typography>
      </Box>

      <form className={classes.formRoot} autoComplete="off" noValidate>
        <TextField
          //error
          id="outlined-error-helper-text"
          label="Excuse"
          value={excuse}
          onChange={handleChange}
          variant="outlined"
          color="secondary"
        />
      </form>
      <Box pt={2}>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleSubmit}
        >
          Submit
        </Button>
      </Box>
    </Container>
  );
};

export default ExcuseForm;
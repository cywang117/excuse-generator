import React from 'react';
import { AppBar, ToolBar, Link, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import WizardIcon from './WizardIcon';
import { GitHub as GitHubIcon } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  toolBar: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  inlineDiv: {
    display: 'flex',
    '& svg': {
      marginRight: theme.spacing(2)
    }
  },
  ghLink: {
    display: 'flex'
  },
  ghIcon: {
    marginLeft: theme.spacing(2),
  }
}));

const Nav = () => {
  const classes = useStyles();

  return (
    <AppBar position="sticky">
      <ToolBar className={classes.toolBar}>
        <div className={classes.inlineDiv}>
          <WizardIcon fontSize="large" />
          <Typography variant="h5">
            App Merlin
            </Typography>
        </div>
        <Link className={classes.ghLink} href="https://github.com/cywang117" color="inherit" target="_blank" rel="noopener">
          More Apps on <GitHubIcon className={classes.ghIcon} />
        </Link>
      </ToolBar>
    </AppBar>
  );
};

export default Nav;
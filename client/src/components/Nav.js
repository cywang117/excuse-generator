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
    display: 'flex',
    alignItems: 'center'
  },
  ghIcon: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1)
  },
  smallFont: {
    fontSize: '2rem'
  }
}));

const Nav = () => {
  const classes = useStyles();

  return (
    <AppBar position="sticky" color="transparent" elevation={0}>
      <ToolBar className={classes.toolBar}>
        <div className={classes.inlineDiv}>
          <WizardIcon fontSize="large" color="secondary" />
          <Typography variant="h3" color="secondary" className={classes.smallFont}>
            Excuse Wizard
          </Typography>
        </div>
        <Link className={classes.ghLink} href="https://github.com/cywang117" color="secondary" target="_blank" rel="noopener">
          More on <GitHubIcon className={classes.ghIcon}/> !
        </Link>
      </ToolBar>
    </AppBar>
  );
};

export default Nav;
import React from 'react';
import { Box, Link } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { GitHub as GitHubIcon } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  absoluteBox: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    padding: theme.spacing(2)
  },
  ghLink: {
    display: 'flex',
    alignItems: 'center'
  },
  ghIcon: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1)
  }
}));

const GitHubLink = () => {
  const classes = useStyles();

  return (
    <Box className={classes.absoluteBox}>
      <Link className={classes.ghLink} href="https://github.com/cywang117" color="secondary" target="_blank" rel="noopener">
        More on <GitHubIcon className={classes.ghIcon} />
      </Link>
    </Box>
  );
};

export default GitHubLink;
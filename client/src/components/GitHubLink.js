import React, { useState } from 'react';
import { Box, Link, Typography, Button, Divider } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { GitHub as GitHubIcon, ArrowForwardIos as Arrow } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  absoluteBox: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    padding: theme.spacing(2),
    display: 'flex',
    alignItems: 'center'
  },
  ghLink: {
    display: 'flex',
    alignItems: 'center'
  },
  ghIcon: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1)
  },
  flexDisplay: {
    display: 'flex',
    alignItems: 'center'
  },
  noTransform: {
    textTransform: 'none'
  }
}));

const GitHubLink = () => {
  const classes = useStyles();
  let [expanded, setExpanded] = useState(false);

  return (
    <Box className={classes.absoluteBox}>
      <Box mr={1}>
        <Link
          className={classes.ghLink}
          href="https://github.com/cywang117"
          color="secondary"
          target="_blank"
          rel="noopener"
        >
          More on <GitHubIcon className={classes.ghIcon} />
        </Link>
      </Box>
      <Divider orientation="vertical" flexItem />
      <Box ml={1} className={classes.flexDisplay}>
        <Button
          className={classes.noTransform}
          onClick={() => { setExpanded(!expanded)}}
        >
          <Box className={classes.flexDisplay}>
            <Typography variant="subtitle2" color="textSecondary">
              Libraries used:&nbsp;
            </Typography>
            <Arrow color="disabled" fontSize="small" />
          </Box>
        </Button>
        {expanded ?
          <Typography variant="subtitle2" color="textSecondary">
            React &middot; Material-UI &middot; React-Router &middot; Redux &middot; Express &middot; MongoDB
          </Typography> :
          ''
        }
      </Box>
    </Box>
  );
};

export default GitHubLink;
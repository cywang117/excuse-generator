import React, { useEffect } from 'react';
import { Box, Button, Link, Container, Typography, Divider, Tooltip, IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { GitHub as GitHubIcon, FavoriteBorder as EmptyHeartIcon, Favorite as FilledHeartIcon } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  label: {
    textTransform: 'none'
  },
  root: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    height: 'calc(100vh - 64px)',
    [theme.breakpoints.up('md')]: {
      paddingRight: theme.spacing(30)
    }
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
  },
  likeButton: {
    marginLeft: theme.spacing(2)
  },
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

const Generator = ({ excuse, isLiked, id, generateExcuse, updateExcuseStatus }) => {
  const classes = useStyles();

  useEffect(() => {
    generateExcuse();
  }, []);

  const handleHeartClick = () => {
    updateExcuseStatus(excuse, isLiked, id);
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

      <Box>
        <Button
          variant="contained"
          color="secondary"
          onClick={generateExcuse}
          className={classes.label}
        >
          Generate Another Excuse
        </Button>
        <Tooltip
          title="Like this excuse!"
          arrow
          interactive
          leaveDelay={200}
        >
          <IconButton
            aria-label="like excuse"
            className={classes.likeButton}
            onClick={handleHeartClick}
          >
            {isLiked ?
              <FilledHeartIcon color="secondary" fontSize="large" /> :
              <EmptyHeartIcon color="secondary" fontSize="large" />}
          </IconButton>
        </Tooltip>
      </Box>


      <Box className={classes.absoluteBox}>
        <Link className={classes.ghLink} href="https://github.com/cywang117" color="secondary" target="_blank" rel="noopener">
          More on <GitHubIcon className={classes.ghIcon} />
        </Link>
      </Box>
    </Container>
  );
};

export default Generator;
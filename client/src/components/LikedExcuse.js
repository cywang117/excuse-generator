import React from 'react';
import { Box, Typography, Divider, IconButton, Tooltip } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Favorite as FilledHeartIcon, FavoriteBorder as EmptyHeartIcon } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  likes: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  leftPad: {
    paddingLeft: theme.spacing(1)
  }
}));

const LikedExcuse = ({ _id, excuse, likes, isLast, isLiked, handleLike, handleUnlike }) => {
  const classes = useStyles();

  const handleClick = () => {
    isLiked ? handleUnlike(_id) : handleLike(_id, excuse);
  }

  return (
    <React.Fragment>
      <Box p={3}>
        <Typography variant="h6">{excuse}</Typography>
        <Box className={classes.likes}>
          <Box className={classes.likes}>
            <FilledHeartIcon color="secondary" fontSize="small" />
            <Typography variant="subtitle2" color="secondary" className={classes.leftPad}>{likes}</Typography>
          </Box>
          <Tooltip
            title="Like this excuse!"
            arrow
            interactive
            leaveDelay={200}
          >
            <IconButton aria-label="like excuse" onClick={handleClick}>
              {isLiked ? <FilledHeartIcon color="secondary" /> : <EmptyHeartIcon color="secondary" />}
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
      {isLast ? '' : <Divider />}
    </React.Fragment>
  );
}

export default LikedExcuse;
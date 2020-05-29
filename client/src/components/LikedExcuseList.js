import React, { useEffect } from 'react';
import { Divider, Typography, Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import LikedExcuse from './LikedExcuse';

const useStyles = makeStyles((theme) => ({
  titleBar: Object.assign({}, theme.mixins.toolbar, { display: 'flex', alignItems: 'center' }),
  cursiveTitle: {
    fontFamily: 'Permanent Marker, cursive',
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  }
}));

const LikedExcuseList = ({ topExcuses, sessionLikes, generatedId, generatedLiked, likeExcuse, unlikeExcuse, getSessionLikes, getTopExcuses, updateGenerated }) => {
  const classes = useStyles();

  useEffect(() => {
    getTopExcuses();
    getSessionLikes();
  }, []);

  const handleLike = (_id, excuse) => {
    if (_id === generatedId) {
      updateGenerated(_id, excuse, generatedLiked);
    } else {
      likeExcuse(_id, excuse);
    }
  };

  const handleUnlike = (_id, excuse) => {
    if (_id === generatedId) {
      updateGenerated(_id, excuse, generatedLiked);
    } else {
      unlikeExcuse(_id, excuse);
    }
  };

  return (
    <React.Fragment>
      <Box className={classes.titleBar} mx="auto">
        <Typography variant="h5" color="secondary" className={classes.cursiveTitle} noWrap>
          Most Liked Excuses:
        </Typography>
      </Box>
      <Divider />
      {
        topExcuses.map((excuse, idx) => (
          <div key={idx}>
            <LikedExcuse
              {...excuse}
              isLast={idx === topExcuses.length - 1}
              handleLike={handleLike}
              handleUnlike={handleUnlike}
              isLiked={sessionLikes[excuse._id]}
            />
          </div>
        ))
      }
    </React.Fragment>
  );
}

export default LikedExcuseList;
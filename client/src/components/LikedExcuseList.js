import React, { useState, useEffect } from 'react';
import { Divider, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import LikedExcuse from './LikedExcuse';

const useStyles = makeStyles((theme) => ({
  titleBar: Object.assign({}, theme.mixins.toolbar, { display: 'flex', alignItems: 'center' }),
  cursiveTitle: {
    fontFamily: 'Permanent Marker, cursive',
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2)
  }
}));

const LikedExcuseList = () => {
  const classes = useStyles();
  let [excuses, setExcuses] = useState([]);
  let [likes, setLikes] = useState({});

  const getTopExcuses = () => {
    fetch('/api/likes')
      .then(res => res.json())
      .then(list => setExcuses(list))
      .catch(console.error);
  };

  const getSessionLikes = () => {
    fetch('/api/likes/session')
      .then(res => res.json())
      .then(sessionLikes => setLikes(sessionLikes))
      .catch(console.error);
  };

  const handleLike = (_id, excuse) => {
    fetch('/api/like', {
      method: 'POST',
      body: JSON.stringify({ _id, excuse }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => res.json())
      .then(message => console.log(message))
      .then(() => {
        getSessionLikes();
        getTopExcuses();
      })
      .catch(console.error);
  };

  const handleUnlike = (_id) => {
    fetch('/api/unlike', {
      method: 'POST',
      body: JSON.stringify({ _id }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => res.json())
      .then(message => console.log(message))
      .then(() => {
        getSessionLikes();
        getTopExcuses();
      })
      .catch(console.error);
  };

  useEffect(() => {
    getTopExcuses();
    getSessionLikes();
  }, []);

  return (
    <React.Fragment>
      <div className={classes.titleBar}>
        <Typography variant="h5" color="secondary" className={classes.cursiveTitle} noWrap>
          Most Liked Excuses:
        </Typography>
      </div>
      <Divider />
      {
        excuses.map((excuse, idx) => (
          <div key={idx}>
            <LikedExcuse
              {...excuse}
              isLast={idx === excuses.length - 1}
              handleLike={handleLike}
              handleUnlike={handleUnlike}
              isLiked={likes[excuse._id]}
            />
          </div>
        ))
      }
    </React.Fragment>
  );
}

export default LikedExcuseList;
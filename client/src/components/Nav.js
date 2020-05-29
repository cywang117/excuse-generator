import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { AppBar, ToolBar, Drawer, Hidden, Typography, IconButton, ListItem } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Menu as MenuIcon } from '@material-ui/icons';
import WizardIcon from './WizardIcon';
import LikedExcuseListContainer from '../containers/LikedExcuseListContainer';

const useStyles = makeStyles((theme) => ({
  flexToolbar: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  drawer: {
    background: '#FAFAFA',
    maxWidth: '300px'
  },
  inlineDiv: {
    display: 'flex',
    '& svg': {
      marginRight: theme.spacing(2)
    }
  },
  smallFont: {
    fontSize: '2rem'
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('md')]: {
      display: 'none'
    }
  },
  cursiveFont: {
    fontFamily: 'Permanent Marker, cursive'
  }
}));

const Nav = () => {
  const classes = useStyles();
  let [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  return (
    <React.Fragment>
      <AppBar position="sticky" color="transparent" elevation={0}>
        <ToolBar className={classes.flexToolbar}>

          <div className={classes.inlineDiv}>

            <ListItem button component={NavLink} to="/" exact>
              <WizardIcon fontSize="large" color="primary" />
              <Typography
                variant="h3"
                color="secondary"
                className={classes.smallFont}
                noWrap
              >
                Excuse Wizard
              </Typography>
            </ListItem>

            <ListItem button component={NavLink} to="/add">
              <Typography
                noWrap
                color="primary"
                className={classes.cursiveFont}
                variant="h6"
              >
                Add Excuse
              </Typography>
            </ListItem>

            <ListItem button component={NavLink} to="/about">
              <Typography
                noWrap
                color="primary"
                className={classes.cursiveFont}
                variant="h6"
              >
                About
              </Typography>
            </ListItem>
          </div>

          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={toggleDrawer}
            className={classes.menuButton}
          >
            <MenuIcon />
          </IconButton>
        </ToolBar>
      </AppBar>
      <nav>
        <Hidden mdUp implementation="css">
          <Drawer
            anchor="right"
            open={isDrawerOpen}
            onClose={toggleDrawer}
            classes={{
              paper: classes.drawer
            }}
          >
            <LikedExcuseListContainer />
          </Drawer>
        </Hidden>
        <Hidden smDown implementation="css">
          <Drawer
            anchor="right"
            variant="permanent"
            classes={{
              paper: classes.drawer
            }}
            open
          >
            <LikedExcuseListContainer />
          </Drawer>
        </Hidden>
      </nav>
    </React.Fragment>

  );
};

export default Nav;
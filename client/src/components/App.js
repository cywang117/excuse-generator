import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { CssBaseline } from '@material-ui/core';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import Nav from './Nav';
import GeneratorContainer from '../containers/GeneratorContainer';
import ExcuseFormContainer from '../containers/ExcuseFormContainer';
import About from './About';
import NotFoundPage from './NotFound';
import GitHubLink from './GitHubLink';

const cursiveFontObj = {
  fontFamily: [
    'Permanent Marker',
    'cursive'
  ].join(',')
}

const theme = createMuiTheme({
  typography: {
    h1: cursiveFontObj,
    h2: cursiveFontObj,
    h3: cursiveFontObj
  },
  palette: {
    primary: {
      main: "#373F51",
      light: "#373F51",
      dark: "#373F51"
    }
  },
  overrides: {
    MuiCssBaseline: {
      '@global': {
        '*::-webkit-scrollbar': {
          width: '11px'
        },
        '*::-webkit-scrollbar-track': {
          background: '#CFD8DC'
        },
        '*::-webkit-scrollbar-thumb': {
          backgroundColor: '#9e9195',
          border: '1px solid #CFD8DC',
          borderRadius: '5px'
        }
      }
    }
  }
});

const App = () => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <Router>
      <Nav />
      <Switch>
        <Route exact path="/">
          <GeneratorContainer />
        </Route>
        <Route path="/add">
          <ExcuseFormContainer />
        </Route>
        <Route path="/about">
          <About />
        </Route>
        <Route path="*">
          <NotFoundPage />
        </Route>
      </Switch>
    </Router>
    <GitHubLink />
  </ThemeProvider>
);
export default App;
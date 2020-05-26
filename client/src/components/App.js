import React from 'react';
import { CssBaseline } from '@material-ui/core';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import Nav from './Nav';
import Generator from './Generator';

const cursiveFontObj = {
  fontFamily: [
    'Permanent Marker',
    'cursive'
  ].join(',')
}

const theme = createMuiTheme({
  palette: {
    primary: {
      light: '#58a5f0',
      main: '#0277bd',
      dark: '#004c8c'
    }
  },
  typography: {
    h1: cursiveFontObj,
    h2: cursiveFontObj,
    h3: cursiveFontObj
  }
});

const App = () => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <Nav />
    <Generator />
  </ThemeProvider>
);

export default App;
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
  typography: {
    h1: cursiveFontObj,
    h2: cursiveFontObj,
    h3: cursiveFontObj
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
    <Nav />
    <Generator />
  </ThemeProvider>
);

export default App;
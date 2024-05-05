import { lime, green } from '@material-ui/core/colors';
import { ThemeProvider, createTheme } from '@material-ui/core';

const theme = createTheme({
  palette: {
    primary: {
      main: lime[500], // Lime color for primary
    },
    secondary: {
      main: green[500], // Green color for secondary
    },

    bgColor : {
      main: lime[200]
    }
  },
  // You can add more customization here
});

export default theme;
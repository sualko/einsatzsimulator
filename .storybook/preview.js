// import { ThemeProvider, createTheme } from '@mui/material/styles';
// import { addDecorator } from '@storybook/react';
// import { withThemes } from '@react-theming/storybook-addon';

// import theme from '../lib/theme';

// const providerFn = ({ theme, children }) => {
//   const muTheme = createTheme(theme);
//   return <ThemeProvider theme={muTheme}>{children}</ThemeProvider>;
// };

// // pass ThemeProvider and array of your themes to decorator
// addDecorator(withThemes(null, [theme], { providerFn }));

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}
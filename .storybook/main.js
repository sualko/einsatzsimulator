module.exports = {
  "stories": [
    "../components/**/*.stories.tsx",
  ],
  "addons": [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-actions",
    // "@react-theming/storybook-addon",
  ],
  "framework": "@storybook/react",
  "staticDirs": ["../public"],
}
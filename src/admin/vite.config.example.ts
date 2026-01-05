const { defineConfig } = require("vite");
const { merge } = require("lodash");

module.exports = (config: any) => {
  // Important: always return the modified config

  // console.log(config, '<<< config')

  let viteConfig = defineConfig({
    server: {
      fs: {
        allow: [
          "/opt/node_modules", // this is the abs path OUTSIDE the project root causing the Vite error
          "/opt/app",
        ],
      },
    },
  });

  let mergedConfig = merge(config, viteConfig);

  // console.log(mergedConfig, '<<< mergedConfig')

  return mergedConfig;
};

module.exports = [
  "strapi::logger",
  "strapi::errors",
  "strapi::cors",
  "strapi::poweredBy",
  "strapi::query",
  "strapi::session",
  "strapi::favicon",
  "strapi::public",
  {
    name: "strapi::body",
    config: {
      formLimit: "256mb", // modify form body
      jsonLimit: "256mb", // modify JSON body
      textLimit: "256mb", // modify text body
      formidable: {
        maxFileSize: 200 * 1024 * 1024, // multipart data, modify here limit of uploaded file size
      },
    },
  },
  {
    name: "strapi::security",
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          "default-src": [
            "'self'",
            `'${process.env.CLIENT_HOST_URL}'`,
            `'${process.env.DEV_HOST_URL}'`,
            "*", //tempory fix remove this soon
          ],
          "script-src": [
            "'self'",
            `'${process.env.CLIENT_HOST_URL}'`,
            `'${process.env.DEV_HOST_URL}'`,
            "*", //tempory fix remove this soon
          ],
          "connect-src": [
            "'self'",
            `'${process.env.CLIENT_HOST_URL}'`,
            `'${process.env.DEV_HOST_URL}'`,
            "*", //tempory fix remove this soon
          ],
          "img-src": [
            "'self'",
            "data:",
            "blob:",
            "strapi.io",
            "market-assets.strapi.io",
            `'${process.env.CLIENT_HOST_URL}'`,
            `'${process.env.DEV_HOST_URL}'`,
            "*",
          ],
          "media-src": [
            "'self'",
            "data:",
            "blob:",
            "strapi.io",
            "market-assets.strapi.io",
            `'${process.env.CLIENT_HOST_URL}'`,
            `'${process.env.DEV_HOST_URL}'`,
            "*",
          ],
          upgradeInsecureRequests: null,
        },
      },
    },
  },
  "global::custom-auth-error", // Add your middleware here
];

export default [
  "strapi::logger",
  "strapi::errors",
  // "strapi::cors",
  {
    name: "strapi::cors",
    config: {
      origin: ["http://localhost:3000"],
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"],
      headers: ["Content-Type", "Authorization", "Origin", "Accept"],
      keepHeaderOnError: true,
      credentials: true,
    },
  },
  "strapi::session",
  "strapi::favicon",
  "strapi::public",
  "strapi::poweredBy",
  "strapi::query",
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
            "aienergyshop-strapi-uploads.syd1.digitaloceanspaces.com",
          ],
          "script-src": [
            "'self'",
            `'${process.env.CLIENT_HOST_URL}'`,
            `'${process.env.DEV_HOST_URL}'`,
            "aienergyshop-strapi-uploads.syd1.digitaloceanspaces.com",
          ],
          "connect-src": [
            "'self'",
            "https:",
            "aienergyshop-strapi-uploads.syd1.digitaloceanspaces.com",
          ],
          "img-src": [
            "'self'",
            "data:",
            "blob:",
            "strapi.io",
            "market-assets.strapi.io",
            `'${process.env.CLIENT_HOST_URL}'`,
            `'${process.env.DEV_HOST_URL}'`,
            "aienergyshop-strapi-uploads.syd1.digitaloceanspaces.com",
            "aienergyshop-strapi-uploads.s3.syd1.amazonaws.com",
          ],
          "media-src": [
            "'self'",
            "data:",
            "blob:",
            "strapi.io",
            "market-assets.strapi.io",
            `'${process.env.CLIENT_HOST_URL}'`,
            `'${process.env.DEV_HOST_URL}'`,
            "aienergyshop-strapi-uploads.syd1.digitaloceanspaces.com",
            "aienergyshop-strapi-uploads.s3.syd1.amazonaws.com",
          ],
          upgradeInsecureRequests: null,
        },
      },
    },
  },
  // {
  //   name: "strapi::cors",
  //   config: {
  //     origin: ["http://localhost:3000"],
  //     methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"],
  //     headers: ["Content-Type", "Authorization", "Origin", "Accept"],
  //     keepHeaderOnError: true,
  //     credentials: true,
  //   },
  // },
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
  "global::custom-auth-error", // Add your middleware here
];

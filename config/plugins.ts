export default ({ env }) => {
  return {
    "users-permissions": {
      config: {
        jwtManagement: "refresh", // Set this to 'refresh'
        sessions: {
          accessTokenLifespan: 3600, // 1 hour in seconds
          maxRefreshTokenLifespan: 2592000, // 30 days in seconds
        },
        register: {
          allowedFields: [
            "name",
            "name.first_name",
            "name.last_name",
            "phone",
            "business_name",
            "business_number",
            "business_type",
            "account_status",
            "user_level",
            "city",
            "country",
            "state",
            "street1",
            "street2",
            "zip_code",
          ],
        },
        // callback: {
        //   validate: (cbUrl, options) => {
        //     // cbUrl is where Strapi is being asked to redirect the auth info
        //     // that was received from the provider to

        //     // in this case, we will only validate that the
        //     // if using a base url, you should always include the trailing slash
        //     // although in real-world usage you should also include the full paths
        //     if (
        //       cbUrl.startsWith("https://myproxy.mysite.com/") ||
        //       cbUrl.startsWith("https://mysite.com/")
        //     ) {
        //       return;
        //     }

        //     // Note that you MUST throw an error to fail validation
        //     // return values are not checked
        //     throw new Error("Invalid callback url");
        //   },
        // },
      },
    },
    email: {
      config: {
        provider: "nodemailer",
        providerOptions: {
          host: env("SMTP_HOST", "smtp.gmail.com"),
          port: env("SMTP_PORT", 465),
          auth: {
            user: env("SMTP_USERNAME"),
            pass: env("SMTP_PASSWORD"),
          },
          // secure: true, // Uncomment if using port 465
        },
        settings: {
          defaultFrom: "accounts@aienergyshop.com.au",
          defaultReplyTo: "",
        },
        ratelimit: {
          enable: true,
          interval: "5",
          max: 3,
          delayAfter: 1,
        },
      },
    },
    upload: {
      config: {
        provider: "aws-s3",
        sizeLimit: 50 * 1024 * 1024, // 50mb in bytes
        providerOptions: {
          rootPath: "strapi-dev",
          s3Options: {
            region: "syd1",
            endpoint: "https://syd1.digitaloceanspaces.com",
            params: {
              ACL: "public-read",
              signedUrlExpires: 15 * 60,
              Bucket: "aienergyshop-strapi-uploads",
            },
            credentials: {
              accessKeyId: env("DO_SPACES_ACCESS_KEY"),
              secretAccessKey: env("DO_SPACES_SECRET_KEY"),
            },
          },
        },
        actionOptions: {
          upload: {},
          uploadStream: {},
          delete: {},
        },
      },
    },
    graphql: {
      config: {
        endpoint: "/graphql",
        depthLimit: 20,
        defaultLimit: 100,
      },
    },
  };
};

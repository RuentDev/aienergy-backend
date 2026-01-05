module.exports = ({ env }) => ({
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
      sizeLimit: 256 * 1024 * 1024, // 256mb in bytes
      providerOptions: {
        baseUrl: process.env.DO_CDN_URL,
        rootPath: process.env.DO_ROOT_PATH,
        s3Options: {
          credentials: {
            accessKeyId: process.env.DO_SPACE_ACCESS_KEY,
            secretAccessKey: process.env.DO_SPACE_SECRET_KEY,
          },
          endpoint: process.env.DO_SPACE_ENDPOINT, // aws-s3 v3 needs a prefixed https:// endpoint
          region: process.env.DO_SPACE_REGION,
          params: {
            Bucket: process.env.DO_SPACE_BUCKET,
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
  "users-permissions": {
    config: {
      register: {
        allowedFields: [
          "name",
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
    },
  },
});

export default ({ env }) => ({
  host: env("HOST", "0.0.0.0"),
  port: env.int("PORT", 1337),
  app: {
    keys: env.array("APP_KEYS"),
  },
  server: {
    httpServer: {
      // Set to 5 minutes (1,800,000 milliseconds) for bulk import
      // Adjust this value based on how long you expect the import to take.
      requestTimeout: 5 * 60 * 1000,
    },
  },
});

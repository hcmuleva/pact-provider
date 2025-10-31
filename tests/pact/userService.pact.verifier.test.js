const { Verifier } = require("@pact-foundation/pact");
const path = require("path");
const app = require("../../src/app");

const PORT = 8080;
let server;

beforeAll((done) => {
  server = app.listen(PORT, () => {
    console.log(`✅ UserService Provider started on port ${PORT}`);
    done();
  });
});

afterAll((done) => {
  server.close(() => {
    console.log("❌ UserService Provider stopped");
    done();
  });
});

describe("Pact Verification", () => {
  test("validates the expectations of ConsumerApp", async () => {
    // Get broker config from environment variables
    const brokerUrl = process.env.PACT_BROKER_BASE_URL;
    const brokerUsername = process.env.PACT_BROKER_USERNAME;
    const brokerPassword = process.env.PACT_BROKER_PASSWORD;

    // Log the configuration (without password)
    console.log("🔧 Broker Configuration:");
    console.log(`  URL: ${brokerUrl || 'NOT SET'}`);
    console.log(`  Username: ${brokerUsername || 'NOT SET'}`);
    console.log(`  Password: ${brokerPassword ? '****' : 'NOT SET'}`);
    console.log(`  CI: ${process.env.CI}`);
    console.log(`  Git Commit: ${process.env.GIT_COMMIT}`);
    console.log(`  Git Branch: ${process.env.GIT_BRANCH}`);

    if (!brokerUrl) {
      throw new Error('PACT_BROKER_BASE_URL environment variable is not set');
    }

    const opts = {
      provider: "UserService",
      providerBaseUrl: `http://localhost:${PORT}`,
      
      // Broker configuration from environment variables
      pactBrokerUrl: brokerUrl,
      pactBrokerUsername: brokerUsername,
      pactBrokerPassword: brokerPassword,
      
      // Consumer version selectors
      consumerVersionSelectors: [
        { latest: true },           // Latest from any branch
        { mainBranch: true },       // Latest from main
        { deployedOrReleased: true }, // Currently deployed
        { branch: "feature/test-pact-flow" } // Specific branch for testing
      ],
      
      // Enable pending pacts (won't fail on first verification)
      enablePending: true,
      includeWipPactsSince: "2024-01-01",
      
      // Publishing results
      publishVerificationResult: process.env.CI === "true",
      providerVersion: process.env.PROVIDER_VERSION || process.env.GIT_COMMIT || "1.0.0-local",
      providerVersionBranch: process.env.GIT_BRANCH || "main",
      
      // State handlers
      stateHandlers: {
        "user with id 1 exists": () => {
          console.log("🔧 Setting up state: user with id 1 exists");
          // TODO: Setup your database/mock with user id 1
          return Promise.resolve();
        },
        "user with id 2 exists": () => {
          console.log("🔧 Setting up state: user with id 2 exists");
          return Promise.resolve();
        },
        "user with id 999 does not exist": () => {
          console.log("🔧 Setting up state: user with id 999 does not exist");
          return Promise.resolve();
        }
      },
      
      logLevel: "info",
      timeout: 30000 // 30 seconds timeout
    };

    console.log("🚀 Starting Pact verification...");

    try {
      const verifier = new Verifier(opts);
      await verifier.verifyProvider();
      console.log("🎉 Pact Verification Complete!");
    } catch (error) {
      console.error("❌ Pact Verification Failed:");
      console.error(error);
      throw error;
    }
  });
});
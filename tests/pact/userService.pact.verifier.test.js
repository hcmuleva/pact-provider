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
    const opts = {
      provider: "UserService",
      providerBaseUrl: `http://localhost:${PORT}`,
      
      // Broker configuration
      pactBrokerUrl: "http://localhost:9292",
      pactBrokerUsername: "admin",
      pactBrokerPassword: "password",
      
      // ⭐ THIS IS THE KEY FIX - Add consumer version selectors
      consumerVersionSelectors: [
        {
          latest: true  // Get the latest version of all consumer pacts
        },
        // Or more specific selectors:
        // { mainBranch: true },           // Latest from main branch
        // { deployed: true },              // Currently deployed versions
        // { matchingBranch: true },        // Matching branch names
        // { branch: "main" },              // Specific branch
        // { tag: "prod" },                 // Specific tag
      ],
      
      // Enable pending pacts (won't fail on new, unverified contracts)
      enablePending: true,
      
      // Include work-in-progress pacts since this date
      includeWipPactsSince: "2024-01-01",
      
      // Publishing results
      publishVerificationResult: process.env.CI === "true", // Only publish in CI
      providerVersion: process.env.GIT_COMMIT || "1.0.0-local",
      providerVersionBranch: process.env.GIT_BRANCH || "local",
      
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
          // TODO: Ensure user 999 doesn't exist in DB
          return Promise.resolve();
        }
      },
      
      logLevel: "info"
    };

    try {
      const verifier = new Verifier(opts);
      await verifier.verifyProvider();
      console.log("🎉 Pact Verification Complete!");
    } catch (error) {
      console.error("❌ Pact Verification Failed:", error);
      throw error;
    }
  });
});
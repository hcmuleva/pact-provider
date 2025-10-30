const { Verifier } = require("@pact-foundation/pact");
const path = require("path");
const app = require("../../src/app");
const { server } = require("http");
const providerStates = require("./providerStates");

const PORT = 8080;
let httpServer;

beforeAll(() => {
  httpServer = app.listen(PORT, () => console.log(`✅ Provider started on ${PORT}`));
});

afterAll(() => {
  httpServer.close();
});

describe("Pact Verification", () => {
  test("validates the expectations of ConsumerApp", async () => {
    const opts = {
      providerBaseUrl: `http://localhost:${PORT}`,
      pactBrokerUrl: process.env.PACT_BROKER_URL,
      pactBrokerToken: process.env.PACT_BROKER_TOKEN,
      provider: "UserService",
      publishVerificationResult: true,
      providerVersion: process.env.GITHUB_SHA || "local",
      stateHandlers: providerStates
    };

    const verifier = new Verifier(opts);
    await verifier.verifyProvider();
    console.log("🎉 Pact Verification Complete!");
  });
});

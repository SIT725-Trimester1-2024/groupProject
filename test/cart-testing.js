// cart.test.js
const chai = require("chai");
const chaiHttp = require("chai-http");
const { expect } = chai;
chai.use(chaiHttp);

const app = require("../index");

describe("Cart Routes", () => {
  let agent = chai.request.agent(app);

  before(async () => {
    // Log in with test user
    const res = await agent
      .post("/login")
      .send({ username: "testuser", password: "testpassword" });
    expect(res.status).to.equal(200);
  });

  // Test for GET route
  it("GET /user/:userId/cart", async () => {
    const res = await agent.get("/user/123/cart");
    expect(res.status).to.equal(200);
  });

  // Test for POST route
  it("POST /user/:id/cart/", async () => {
    const res = await agent.post("/user/123/cart/");
    expect(res.status).to.equal(200);
  });

  // Test for DELETE route
  it("DELETE /user/:userid/cart/:id", async () => {
    const res = await agent.delete("/user/123/cart/456");
    expect(res.status).to.equal(200);
  });

  after(() => {
    // Log out after tests
    agent.close();
  });
});

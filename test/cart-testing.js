// cart.test.js
const chai = require("chai");
const chaiHttp = require("chai-http");
const { expect } = chai;
chai.use(chaiHttp);

const app = require("../index");

describe("Cart Routes", () => {
  // Test for GET route
  it("GET /user/:userId/cart", async () => {
    const res = await chai.request(app).get("/user/123/cart");
    expect(res.status).to.equal(200);
  });

  // Test for POST route
  it("POST /user/:id/cart/", async () => {
    const res = await chai.request(app).post("/user/123/cart/");
    expect(res.status).to.equal(200);
  });

  // Test for DELETE route
  it("DELETE /user/:userid/cart/:id", async () => {
    const res = await chai.request(app).delete("/user/123/cart/456");
    expect(res.status).to.equal(200);
  });
});

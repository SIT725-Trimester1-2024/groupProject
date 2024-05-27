const chai = require("chai");
const chaiHttp = require("chai-http");
const { expect } = chai;
chai.use(chaiHttp);
const app = require("../index");

// Test case for getting a user by ID
describe("GET /user/:id", () => {
  it("should return user data", (done) => {
    chai
      .request(app)
      .get("/user/123")
      .end((err, res) => {
        // Expect the HTTP status to be 200 (OK)
        expect(res).to.have.status(200);
        // Expect the response body to be an object (the user data)
        expect(res.body).to.be.an("object");
        done();
      });
  });
});

// Test case for updating a user by ID
describe("PATCH /user/:id", () => {
  it("should update user data", (done) => {
    chai
      .request(app)
      .patch("/user/123")
      .send({ user: { name: "New Name" } })
      .end((err, res) => {
        // Expect the HTTP status to be 200 (OK)
        expect(res).to.have.status(200);
        // Expect the response body to be an object (the updated user data)
        expect(res.body).to.be.an("object");
        done();
      });
  });
});

// Test case for getting an order by ID
describe("GET /orders/:id", () => {
  it("should return order data", (done) => {
    chai
      .request(app)
      .get("/orders/123")
      .end((err, res) => {
        // Expect the HTTP status to be 200 (OK)
        expect(res).to.have.status(200);
        // Expect the response body to be an object (the order data)
        expect(res.body).to.be.an("object");
        done();
      });
  });
});

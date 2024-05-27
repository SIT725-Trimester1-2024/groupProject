const chai = require("chai");
const chaiHttp = require("chai-http");
const { expect } = chai;
chai.use(chaiHttp);
const app = require("../index");

describe("Payment Routes", () => {
  describe("POST /payment_gateway/stripe", () => {
    it("should process payment", (done) => {
      chai
        .request(app)
        .post("/payment_gateway/stripe")
        .send({
          token:
            "sk_test_51PItrz2LidDOORGRkisEiM5UECjAwKjYRytvVg34wh4SAX1M91xRYmPvanvgxZBE3mP9bfwPW66fK10yr3DyOC0T002L0xZIjI",
        })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("object");
          done();
        });
    });
  });
});

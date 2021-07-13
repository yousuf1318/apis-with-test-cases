const request = require("supertest");
const app = require("../../Bus_Backend/server");
const db = require("../Test/db");
// const User = require("../model/user");

beforeAll(async () => await db.connect());
afterAll(async () => await db.clear());
afterAll(async () => await db.close());

jest.setTimeout(15000);


describe("Test suite for user signup", () => {
    it("it should create a new user and login", async () => {
      let req = {
        name: "yousuf",
        email: "yousuf@gmail.com",
        contact: 8208494020,
        password: "123456"
        
      };
      const res = await request(app).post("/api/user/register").send(req);
      expect(res.status).toBe(200);
      const response = await request(app).post("/api/auth/login").send({
        email: "yousuf@gmail.com",
        password: "123456",
      });
      expect(response.status).toBe(200);
    });
  });
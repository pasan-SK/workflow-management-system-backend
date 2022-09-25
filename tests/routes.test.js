const request = require("supertest")
const app = require("../server")
const mongoose = require('mongoose');

const baseURL = "http://localhost:3500"

beforeEach((done) => {
    mongoose.connect("mongodb://localhost:27017/JestDB",
      { useNewUrlParser: true, useUnifiedTopology: true },
      () => done());
  });
  
  afterEach((done) => {
    mongoose.connection.db.dropDatabase(() => {
      mongoose.connection.close(() => done())
    });
  });

// describe("POST /login", () => {
//     let response;
//     const credentials = {
//       email: "d@d.com",
//       pwd: "d@d.com",
//     }
//     beforeAll(async () => {
//         response = await request(baseURL).post("/login").send(credentials);
//     })
//     afterAll(async () => {
//     //   await request(baseURL).delete(`/todo/${newTodo.id}`)
//     })
//     it("should return 200", async () => {
//     //   const response = await request(baseURL).post("/login").send(credentials);
//       expect(response.statusCode).toBe(200);
//     //   expect(response.body.accessToken).toBe(String)
//     });
//   });


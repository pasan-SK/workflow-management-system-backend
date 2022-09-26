const request = require("supertest")
// const supertest = require("supertest")
const app = require("../server")
const mongoose = require('mongoose');

const baseURL = "http://localhost:3500"

beforeEach((done) => {
    mongoose.connect("mmongodb+srv://admin1:sPX8HNiPl3pbKaDQ@cluster0.tr1rexs.mongodb.net/WorkflowManagementSystemDB-test?retryWrites=true&w=majority",
        { useNewUrlParser: true, useUnifiedTopology: true },
        () => done());
});

afterEach((done) => {
    // mongoose.connection.db.dropDatabase(() => {
    //     mongoose.connection.close(() => done())
    // });
    mongoose.connection.close(() => done())
});

const randomInt = Date.now()
const email = `test@${randomInt}.com`
const pwd = "password1@A"

describe("POST /register", () => {
    describe("given a valid email and password", () => {
        test("should respond with a 201 status code and userID should be returned as json", async () => {

            const credentials = {
                firstname: "test-firstname-1",
                lastname: "test-lastname-1",
                email,
                pwd
            }

            const response = await request(app).post("/register").send(credentials)
            expect(response.statusCode).toBe(201)
            expect(response.headers['content-type']).toEqual(expect.stringContaining("json"))
            expect(response.body.id).toBeDefined()
        })
    })

    describe("when the email and/or password is missing", () => {
        test("should respond with a status code of 400", async () => {

            const bodyData = [
                {
                    firstname: "test-firstname-1",
                    lastname: "test-lastname-1",
                    pwd: "password1@A"
                },
                {
                    firstname: "test-firstname-1",
                    lastname: "test-lastname-1",
                    email: `test@${Date.now()}.com`
                },
                {
                    firstname: "test-firstname-1",
                    lastname: "test-lastname-1"
                }
            ]
            for (const body of bodyData) {
                const response = await request(app).post("/register").send(body)
                expect(response.statusCode).toBe(400)
            }
        })
    })
})

let accessToken;

describe("POST /login", () => {
    describe("given a valid email and password", () => {
        test("should respond with status code 200 and accessToken should be returned as json", async () => {

            const loginCredentials = {
                email,
                pwd
            }

            const response = await request(app).post("/login").send(loginCredentials)
            expect(response.statusCode).toBe(200)
            expect(response.headers['content-type']).toEqual(expect.stringContaining("json"))
            expect(response.body.accessToken).toBeDefined()
            accessToken = response.body.accessToken
        });
    })
    describe("when the email and/or password is missing", () => {
        test("should respond with a status code of 400", async () => {

            const bodyData = [
                { pwd }, 
                { email },
                { }
            ]
            for (const body of bodyData) {
                const response = await request(app).post("/login").send(body)
                expect(response.statusCode).toBe(400)
            }
        })
    })
})


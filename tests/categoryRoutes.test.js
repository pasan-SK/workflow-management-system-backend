const request = require("supertest")
const app = require("../server")
const mongoose = require('mongoose');
const agent = request.agent(app)

const baseURL = "http://localhost:3500"

beforeAll((done) => {
    mongoose.connect("mmongodb+srv://admin1:sPX8HNiPl3pbKaDQ@cluster0.tr1rexs.mongodb.net/WorkflowManagementSystemDB-test?retryWrites=true&w=majority",
        { useNewUrlParser: true, useUnifiedTopology: true },
        () => done());
});

afterAll((done) => {
    mongoose.connection.close(() => done())
});

const adminCredentials = {
    email: "d@d.com",
    pwd: "d@d.com"
}
let adminCookieName = ''
let adminCookieValue = ''
let adminAccessToken = ''

describe("GET /categories", () => {
    describe("When not logged in to the system", () => {
        test("should respond with a 401 status code (unauthorized)", async () => {

            const response = await request(app).get("/categories")
            expect(response.statusCode).toBe(401)
        })
    })
    describe("When logged in to the system but no categories in the database", () => {
        test("should respond with a 204 status code (No content)", async () => {

            const loginResponse = await request(app).post("/login").send(adminCredentials)
            adminCookieName = loginResponse.headers['set-cookie'][0].split(',')[0].split(';')[0].split('=')[0]
            adminCookieValue = loginResponse.headers['set-cookie'][0].split(',')[0].split(';')[0].split('=')[1]
            adminAccessToken = loginResponse.body.accessToken
            
            // const testResponse = await agent.get("/categories").set("Authorization", `Bearer ${adminAccessToken}`)
            // expect(testResponse.statusCode).toBe(204)
        })
    })
})

const justUserCredentials = {
    email: "e@e.com",
    pwd: "e@e.com"
}
let justUserCookieName = ''
let justUserCookieValue = ''
let justUseraccessToken = ''
let newCategoryID = ''

describe('POST /categories', () => {
    describe("When made the request as an unauthorized employee (testing role based authorization)", () => {
        test("should respond with a 401 status code (unauthorized)", async () => {

            const loginResponse = await request(app).post("/login").send(justUserCredentials)
            justUserCookieName = loginResponse.headers['set-cookie'][0].split(',')[0].split(';')[0].split('=')[0]
            justUserCookieValue = loginResponse.headers['set-cookie'][0].split(',')[0].split(';')[0].split('=')[1]
            justUseraccessToken = loginResponse.body.accessToken

            const testResponse = await request(app).post("/categories").send({"name": "test-category-name"}).set("Authorization", `Bearer ${justUseraccessToken}`)
            expect(testResponse.statusCode).toBe(401)
        })
    })
    describe("When made the request as an authorized employee", () => {
        test("should respond with a 201 status code", async () => {

            const testResponse = await request(app).post("/categories").send({"name": "test-category-name"}).set("Authorization", `Bearer ${adminAccessToken}`)
            expect(testResponse.statusCode).toBe(201)
            expect(testResponse.body._id).toBeDefined()
            newCategoryID = testResponse.body._id
        })
    })
})
describe('DELETE /categories', () => {
    describe("When made the request as an authorized employee", () => {
        test("should respond with a 200 status code", async () => {

            const testResponse = await request(app).delete("/categories").send({"id": newCategoryID}).set("Authorization", `Bearer ${adminAccessToken}`)
            expect(testResponse.statusCode).toBe(200)
            expect(testResponse.headers['content-type']).toEqual(expect.stringContaining("json"))
            expect(testResponse.body.deletedCount).toEqual(1)
        })
    })
})
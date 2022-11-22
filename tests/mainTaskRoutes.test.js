const request = require("supertest")
const app = require("../server")
const mongoose = require('mongoose');
const agent = request.agent(app)

beforeAll((done) => {
    mongoose.connect("mmongodb+srv://admin1:sPX8HNiPl3pbKaDQ@cluster0.tr1rexs.mongodb.net/WorkflowManagementSystemDB-test?retryWrites=true&w=majority",
        { useNewUrlParser: true, useUnifiedTopology: true },
        () => done());
});

afterAll((done) => {
    mongoose.connection.close(() => done())
});

const adminCredentials = {
    email: "c@c.com",
    pwd: "c@c.com"
}
let adminCookieName = ''
let adminCookieValue = ''
let adminAccessToken = ''

describe("GET /mainTasks", () => {
    describe("When not logged in to the system", () => {
        test("should respond with a 401 status code (unauthorized)", async () => {

            const response = await request(app).get("/mainTasks")
            expect(response.statusCode).toBe(401)
        }, 60000)
    })
    describe("When logged in to the system but no mainTasks in the database", () => {
        test("should respond with a 204 status code (No content)", async () => {

            const loginResponse = await request(app).post("/login").send(adminCredentials)
            adminCookieName = loginResponse.headers['set-cookie'][0].split(',')[0].split(';')[0].split('=')[0]
            adminCookieValue = loginResponse.headers['set-cookie'][0].split(',')[0].split(';')[0].split('=')[1]
            adminAccessToken = loginResponse.body.accessToken

            // const testResponse = await agent.get("/mainTasks").set("Authorization", `Bearer ${adminAccessToken}`)
            // expect(testResponse.statusCode).toBe(204)
        }, 60000)
    })
})

const justUserCredentials = {
    email: "d@d.com",
    pwd: "d@d.com"
}
let justUserCookieName = ''
let justUserCookieValue = ''
let justUseraccessToken = ''
let newCategoryID = ''
let newMaintaskID = ''

describe('POST /mainTasks', () => {
    describe("When made the request as an unauthorized employee (testing role based authorization)", () => {
        test("should respond with a 401 status code (unauthorized)", async () => {

            const loginResponse = await request(app).post("/login").send(justUserCredentials)
            justUserCookieName = loginResponse.headers['set-cookie'][0].split(',')[0].split(';')[0].split('=')[0]
            justUserCookieValue = loginResponse.headers['set-cookie'][0].split(',')[0].split(';')[0].split('=')[1]
            justUseraccessToken = loginResponse.body.accessToken

            const testResponse = await request(app)
                .post("/mainTasks")
                .send({
                    "category_id": "test-category-id",
                    "description": "test-description"
                })
                .set("Authorization", `Bearer ${justUseraccessToken}`)
            expect(testResponse.statusCode).toBe(401)
        }, 60000)
    })
    describe("When made the request as an authorized employee", () => {
        test("should respond with a 201 status code", async () => {

            const categoryCreationResponse = await request(app)
                .post("/categories")
                .send({
                    "name": "myCategory1"
                })
                .set("Authorization", `Bearer ${adminAccessToken}`)
            expect(categoryCreationResponse.statusCode).toBe(201)
            newCategoryID = categoryCreationResponse.body._id

            const testResponse = await request(app)
                .post("/mainTasks")
                .send({
                    "category_id": newCategoryID,
                    "description": "test-description"
                })
                .set("Authorization", `Bearer ${adminAccessToken}`)
            expect(testResponse.statusCode).toBe(201)
            expect(testResponse.body._id).toBeDefined()
            newMaintaskID = testResponse.body._id
        }, 60000)
    })
})

describe('GET /mainTasks/:id', () => {
    describe("When made the request as an authorized employee", () => {
        test("should respond with a 200 status code", async () => {

            const testResponse = await request(app).get(`/mainTasks/${newMaintaskID}`).set("Authorization", `Bearer ${adminAccessToken}`)
            expect(testResponse.statusCode).toBe(200)
            expect(testResponse.headers['content-type']).toEqual(expect.stringContaining("json"))
            expect(testResponse.body._id).toBeDefined()
        }, 60000)
    })
})

describe('DELETE /mainTasks', () => {
    describe("When made the request as an authorized employee", () => {
        test("should respond with a 200 status code", async () => {

            const categoryResponse = await request(app).delete("/categories").send({ "id": newCategoryID }).set("Authorization", `Bearer ${adminAccessToken}`)
            expect(categoryResponse.statusCode).toBe(200)

            const testResponse = await request(app).delete("/mainTasks").send({ "id": newMaintaskID }).set("Authorization", `Bearer ${adminAccessToken}`)
            expect(testResponse.statusCode).toBe(200)
            expect(testResponse.headers['content-type']).toEqual(expect.stringContaining("json"))
            expect(testResponse.body.deletedCount).toEqual(1)
        }, 60000)
    })
})
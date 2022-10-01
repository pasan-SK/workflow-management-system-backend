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
    email: "d@d.com",
    pwd: "d@d.com"
}
let adminCookieName = ''
let adminCookieValue = ''
let adminAccessToken = ''

describe("GET /subtasks", () => {
    describe("When not logged in to the system", () => {
        test("should respond with a 401 status code (unauthorized)", async () => {

            const response = await request(app).get("/subtasks")
            expect(response.statusCode).toBe(401)
        })
    })
    describe("When logged in to the system but no mainTasks in the database", () => {
        test("should respond with a 204 status code (No content)", async () => {

            const loginResponse = await request(app).post("/login").send(adminCredentials)
            adminCookieName = loginResponse.headers['set-cookie'][0].split(',')[0].split(';')[0].split('=')[0]
            adminCookieValue = loginResponse.headers['set-cookie'][0].split(',')[0].split(';')[0].split('=')[1]
            adminAccessToken = loginResponse.body.accessToken

            const testResponse = await agent.get("/subtasks").set("Authorization", `Bearer ${adminAccessToken}`)
            expect(testResponse.statusCode).toBe(204)
        })
    })
})

const justUserCredentials = {
    email: "e@e.com",
    pwd: "e@e.com"
}
let justUserID = "63327485d1193525822c6612"
let justUserCookieName = ''
let justUserCookieValue = ''
let justUseraccessToken = ''
let newCategoryID = ''
let newMaintaskID = ''
let newSubtaskID = ''

describe('POST /subtasks', () => {
    describe("When made the request as an unauthorized employee (testing role based authorization)", () => {
        test("should respond with a 401 status code (unauthorized)", async () => {

            const loginResponse = await request(app).post("/login").send(justUserCredentials)
            justUserCookieName = loginResponse.headers['set-cookie'][0].split(',')[0].split(';')[0].split('=')[0]
            justUserCookieValue = loginResponse.headers['set-cookie'][0].split(',')[0].split(';')[0].split('=')[1]
            justUseraccessToken = loginResponse.body.accessToken
            
            const testResponse = await request(app)
                .post("/subtasks")
                .send({
                    "maintask_id": "test-maintask_id",
                    "name": "test-name",
                    "assigned_employees": {"test-employee-id": false},
                    "note": "test-note"
                })
                .set("Authorization", `Bearer ${justUseraccessToken}`)
            expect(testResponse.statusCode).toBe(401)
        })
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

            const mainTaskCreationResponse = await request(app)
                .post("/mainTasks")
                .send({
                    "category_id": newCategoryID,
                    "description": "test-description"
                })
                .set("Authorization", `Bearer ${adminAccessToken}`)
            expect(mainTaskCreationResponse.statusCode).toBe(201)
            newMaintaskID = mainTaskCreationResponse.body._id

            const testResponse = await request(app)
                .post("/subtasks")
                .send({
                    "maintask_id": newMaintaskID,
                    "name": "test-subtask-name",
                    "assigned_employees": {justUserID: false},
                    "note": "test-subtask-note"
                })
                .set("Authorization", `Bearer ${adminAccessToken}`)
            expect(testResponse.statusCode).toBe(201)
            expect(testResponse.body._id).toBeDefined()
            newSubtaskID = testResponse.body._id
        })
    })
})

describe('GET /subtasks/:id', () => {
    describe("When made the request as an authorized employee", () => {
        test("should respond with a 200 status code", async () => {

            const testResponse = await request(app).get(`/subtasks/${newSubtaskID}`).set("Authorization", `Bearer ${adminAccessToken}`)
            expect(testResponse.statusCode).toBe(200)
            expect(testResponse.headers['content-type']).toEqual(expect.stringContaining("json"))
            expect(testResponse.body._id).toBeDefined()
        })
    })
})    

describe('GET /subtasks/of-maintask/:id', () => {
    describe("When made the request with wrong maintask id", () => {
        test("should respond with a 400 status code", async () => {

            const testResponse = await request(app).get(`/subtasks/of-maintask/${newSubtaskID}`).set("Authorization", `Bearer ${adminAccessToken}`)
            expect(testResponse.statusCode).toBe(400)
            expect(testResponse.headers['content-type']).toEqual(expect.stringContaining("json"))
            expect(testResponse.body).toBeDefined()
        })
    })
    describe("When made the request with a correct maintask id that has subtasks assigned to it", () => {
        test("should respond with a 200 status code", async () => {

            const testResponse = await request(app).get(`/subtasks/of-maintask/${newMaintaskID}`).set("Authorization", `Bearer ${adminAccessToken}`)
            expect(testResponse.statusCode).toBe(200)
            expect(testResponse.headers['content-type']).toEqual(expect.stringContaining("json"))
            expect(testResponse.body.length !== 0).toBeTruthy()
        })
    })
}) 

describe('DELETE /subtasks', () => {
    describe("When made the request as an authorized employee", () => {
        test("should respond with a 200 status code", async () => {

            const categoryResponse = await request(app).delete("/categories").send({ "id": newCategoryID }).set("Authorization", `Bearer ${adminAccessToken}`)
            expect(categoryResponse.statusCode).toBe(200)

            const maintaskResponse = await request(app).delete("/mainTasks").send({ "id": newMaintaskID }).set("Authorization", `Bearer ${adminAccessToken}`)
            expect(maintaskResponse.statusCode).toBe(200)

            const testResponse = await request(app).delete("/subtasks").send({ "id": newSubtaskID }).set("Authorization", `Bearer ${adminAccessToken}`)
            expect(testResponse.statusCode).toBe(200)
            expect(testResponse.headers['content-type']).toEqual(expect.stringContaining("json"))
            expect(testResponse.body.deletedCount).toEqual(1)
        })
    })
})
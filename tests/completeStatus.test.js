const request = require("supertest")
const app = require("../server")
const mongoose = require('mongoose');
const agent = request.agent(app)

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

const adminCredentials = {
    email: "c@c.com",
    pwd: "c@c.com"
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
    // describe("When logged in to the system but no categories in the database", () => {
    //     test("should respond with a 204 status code (No content)", async () => {

    //         const loginResponse = await request(app).post("/login").send(adminCredentials)
    //         adminCookieName = loginResponse.headers['set-cookie'][0].split(',')[0].split(';')[0].split('=')[0]
    //         adminCookieValue = loginResponse.headers['set-cookie'][0].split(',')[0].split(';')[0].split('=')[1]
    //         adminAccessToken = loginResponse.body.accessToken
            
    //         const testResponse = await agent.get("/categories").set("Authorization", `Bearer ${adminAccessToken}`)
    //         expect(testResponse.statusCode).toBe(204)
    //     })
    // })
})

const justUserCredentials = {
    email: "d@d.com",
    pwd: "d@d.com"
}
let justUserCookieName = ''
let justUserCookieValue = ''
let justUseraccessToken = ''
let newCategoryID = ''



describe('POST /categories', () => {
    describe("When made the request with logged in as unauthorized employee (testing role based authorization)", () => {
        test("should respond with a 401 status code (unauthorized)", async () => {

            const loginResponse = await request(app).post("/login").send(justUserCredentials)
            justUserCookieName = loginResponse.headers['set-cookie'][0].split(',')[0].split(';')[0].split('=')[0]
            justUserCookieValue = loginResponse.headers['set-cookie'][0].split(',')[0].split(';')[0].split('=')[1]
            justUseraccessToken = loginResponse.body.accessToken

            const testResponse = await request(app).post("/categories").send({"name": "test-category-name"}).set("Authorization", `Bearer ${justUseraccessToken}`)
            expect(testResponse.statusCode).toBe(401)
            // expect(testResponse.body._id).toBeDefined()
            // newCategoryID = testResponse.body._id
        })
    })
    describe("When made the request as an authorized employee", () => {
        test("should respond with a 201 status code", async () => {

            const loginResponse = await request(app).post("/login").send(adminCredentials)
            adminCookieName = loginResponse.headers['set-cookie'][0].split(',')[0].split(';')[0].split('=')[0]
            adminCookieValue = loginResponse.headers['set-cookie'][0].split(',')[0].split(';')[0].split('=')[1]
            adminAccessToken = loginResponse.body.accessToken

            const testResponse = await request(app).post("/categories").send({"name": "test-category-name"}).set("Authorization", `Bearer ${adminAccessToken}`)
            expect(testResponse.statusCode).toBe(201)
            expect(testResponse.body._id).toBeDefined()
            newCategoryID = testResponse.body._id
        })
    })
})
const DICredentials = {
    email: "c@c.com",
    pwd: "c@c.com" 
}
let DICookieName = ''
let DICookieValue = ''
let DIaccessToken = ''
let newMainTaskID = ''
let newSubTaskID=''
describe('POST/mainTasks',()=>{
    describe("When made the request as an authorized employee",()=>{
        test("should respond with a 201 status code",async()=>{
            // const loginResponse = await request(app).post("/login").send(DICredentials)
            // DICookieName = loginResponse.headers['set-cookie'][0].split(',')[0].split(';')[0].split('=')[0]
            // DICookieValue = loginResponse.headers['set-cookie'][0].split(',')[0].split(';')[0].split('=')[1]
            // DIaccessToken = loginResponse.body.accessToken

            // const testResponse = await request(app).post("/mainTasks").send({"category_id": newCategoryID ,"description":"test-category-description"}).set("Authorization", `Bearer ${DIaccessToken}`)
            // expect(testResponse.statusCode).toBe(201)
            // expect(testResponse.body._id).toBeDefined()
            // newMainTaskID = testResponse.body._id
        })
    })
})
describe('POST/subtasks',()=>{
    describe("When made the request as an authorized employee",()=>{
        test("should respond with a 201 status code",async()=>{
//             const loginResponse = await request(app).post("/login").send(DICredentials)
//             DICookieName = loginResponse.headers['set-cookie'][0].split(',')[0].split(';')[0].split('=')[0]
//             DICookieValue = loginResponse.headers['set-cookie'][0].split(',')[0].split(';')[0].split('=')[1]
//             DIaccessToken = loginResponse.body.accessToken

//             const testResponse = await request(app).post("/subtasks").send({"maintask_id": newMainTaskID ,"name":"test-sub-category-name","note":"test-sub-category-note","assigned_employees":{
//     '633bab859c752a1fdd32822e':false,
//     '633bab119c752a1fdd32822d':false
// }}).set("Authorization", `Bearer ${DIaccessToken}`)
//             expect(testResponse.statusCode).toBe(201)
//             expect(testResponse.body._id).toBeDefined()
//             newSubTaskID = testResponse.body._id
        })
    })
})

const EACredentials = {
    email: "EA@d.com",
    pwd: "d@d.com" 
}
let EACookieName = ''
let EACookieValue = ''
let EAaccessToken = ''

// describe('PUT/subtasks/:id',()=>{
//     describe("When made the request as an authorized employee",()=>{
//         test("should respond with a 200 status code",async()=>{
//             const loginResponse = await request(app).post("/login").send(EACredentials)
//             EACookieName = loginResponse.headers['set-cookie'][0].split(',')[0].split(';')[0].split('=')[0]
//             EACookieValue = loginResponse.headers['set-cookie'][0].split(',')[0].split(';')[0].split('=')[1]
//             EAaccessToken = loginResponse.body.accessToken
//             const subtaskId=newSubTaskID;
//             const testResponse = await request(app).put(`/subtasks/${subtaskId}`).set("Authorization", `Bearer ${EAaccessToken}`)
//             expect(testResponse.statusCode).toBe(200)
//         })
//     })
// })
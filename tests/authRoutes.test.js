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

const randomInt = Date.now()
const email = `test${randomInt}@gmail.com`
const pwd = "password1@A"
let newUserId = ''

const adminCredential = {
    email: "c@c.com",
    pwd: "c@c.com"
}
let adminAToken = ''

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
            const response2 = await request(app).get(`/public/email/confirm/${response.body.id}`)
            expect(response2.statusCode).toBe(200);

            const loginResponse = await request(app).post("/login").send(adminCredential);
            adminAToken = loginResponse.body.accessToken;
            expect(loginResponse.headers['content-type']).toEqual(expect.stringContaining("json")); 
            const changeStatusResponse = await request(app).put(`/users/changeStatus/${response.body.id}`).send({'newUserStatus':1}).set("Authorization", `Bearer ${adminAToken}`);

            expect(changeStatusResponse.statusCode).toBe(200);
            expect(changeStatusResponse.headers['content-type']).toEqual(expect.stringContaining("json")); 

        }, 60000)
    })

    describe("given an email address", () => {
        test("should respond with a 406 status code if it isn't an existing valid email address", async () => {

            const credentials = {
                firstname: "test-firstname-1",
                lastname: "test-lastname-1",
                email: `test${randomInt}@${randomInt}.com`,
                pwd
            }

            const response = await request(app).post("/register").send(credentials)
            expect(response.statusCode).toBe(406);
        }, 60000)
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
                    email: `test${Date.now()}@gmail.com`
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
        }, 60000)
    })
})

let cookieName = ''
let cookieValue = ''

describe("POST /login", () => {
    describe("given the valid email and password for the user created in previous test", () => {
        test("should respond with status code 200 and accessToken should be returned as json", async () => {

            const loginCredentials = {
                email,
                pwd
            }

            const response = await request(app).post("/login").send(loginCredentials)
            expect(response.statusCode).toBe(200)
            expect(response.headers['content-type']).toEqual(expect.stringContaining("json"))
            expect(response.body.accessToken).toBeDefined()
            cookieName = response.headers['set-cookie'][0].split(',')[0].split(';')[0].split('=')[0]
            cookieValue = response.headers['set-cookie'][0].split(',')[0].split(';')[0].split('=')[1]
        }, 60000);
    })
    describe("when the email and/or password is missing", () => {
        test("should respond with a status code of 400 (bad request)", async () => {

            const bodyData = [
                { pwd },
                { email },
                {}
            ]
            for (const body of bodyData) {
                const response = await request(app).post("/login").send(body)
                expect(response.statusCode).toBe(400)
            }
        }, 60000)
    })
    describe("when an invalid email and/or password is given", () => {
        test("should respond with a status code of 401 (Unauthorized)", async () => {

            const bodyData = [
                {
                    email: "invalid_email@gmail.com",
                    pwd
                },
                {
                    email,
                    pwd: "invalid_password"
                },
                {
                    email: "invalid_email@test.com",
                    pwd: "invalid_password"
                }
            ]
            for (const body of bodyData) {
                const response = await request(app).post("/login").send(body)
                expect(response.statusCode).toBe(401)
            }
        }, 60000)
    })
});

describe("GET /refresh", () => {
    describe("When made the refresh request with the cookie", () => {
        test("should respond with status code 200 and accessToken should be returned as json", async () => {

            const response = await agent.get("/refresh").set('Cookie', [
                `${cookieName}=${cookieValue}`
            ])
            expect(response.statusCode).toBe(200)
            expect(response.body.accessToken).toBeDefined()
        }, 60000)
    });
    
    describe("When made the refresh request without the cookie", () => {
        test("should respond with status code 401 (Unauthorized)", async () => {

            const response = await agent.get("/refresh")
            expect(response.statusCode).toBe(401)
        })
    });
    describe("When made the refresh request with an invalid cookie value", () => {
        test("should respond with status code 403 (Forbidden)", async () => {

            const response = await agent.get("/refresh").set('Cookie', [
                `${cookieName}=some_invalid_cookie_value`
            ])
            expect(response.statusCode).toBe(403)
        })
    });
})

const adminCredentials = {
    email: "c@c.com",
    pwd: "c@c.com"
}
let adminAccessToken = ''

describe("GET /logout", () => {
    describe("When made the logout request", () => {
        test("should respond with status code 204 (No content)", async () => {

            const response = await request(app).get("/logout")
            expect(response.statusCode).toBe(204)
            
            // const loginResponse = await request(app).post("/login").send(adminCredentials)
            // adminAccessToken = loginResponse.body.accessToken
            
            //const deleteResponse = await request(app).delete("/users").send({"id": loginResponse.body.id}).set("Authorization", `Bearer ${adminAccessToken}`)
            //expect(deleteResponse.statusCode).toBe(200)
            //expect(deleteResponse.headers['content-type']).toEqual(expect.stringContaining("json"))
            //expect(deleteResponse.body.deletedCount).toEqual(1)            
        })
    });
})
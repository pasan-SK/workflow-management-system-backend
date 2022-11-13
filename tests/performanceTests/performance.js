import http from 'k6/http'
import { check, sleep } from 'k6'

export let options = {
    insecureSkipTLSVerify: true,
    noConnectionReuse: false,
    vus: 20,
    duration: '10s',
    thresholds: {
        http_req_failed: ['rate<0.01'],
        http_req_duration: ['p(90)<9000'],
    }
}

var count = 0
var accessToken = ''
var jwtCookieValue = ''

export default () => {

    let BASE_URL = "http://localhost:3500"

    if (count === 0) {
        const loginUrl = `${BASE_URL}/login`;
        const loginPayload = JSON.stringify({
            email: 'd@d.com',
            pwd: 'd@d.com',
        });

        const loginParams = {
            headers: {
                'Content-Type': 'application/json',
            },
        };

        const res = http.post(loginUrl, loginPayload, loginParams);
        const loginResponse = JSON.parse(res.body)
        accessToken = loginResponse.accessToken
        jwtCookieValue = res.headers["Set-Cookie"].split(";")[0].split("=")[1]
    }
    count += 1

    const pages = [
        "/categories",
        "/mainTasks",
        "/subtasks",
        "/users"
    ]

    const optionsForRequests = {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    };

    for (const page of pages) {
        const pageResponse = http.get(`${BASE_URL}${page}`, optionsForRequests)

        check(pageResponse, {
            "status was 200": (r) => r.status === 200 
        })
    }
    sleep(1);
}
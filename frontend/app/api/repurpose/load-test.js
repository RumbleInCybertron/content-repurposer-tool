import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
    stages: [
        { duration: '30s', target: 100 }, // Ramp-up to 50 users
        { duration: '1m', target: 100 },  // Stay at 50 users
        { duration: '1m', target: 0 },  // Ramp-down to 0 users
    ],
    thresholds: {
        http_req_duration: ['p(95)<200'] // 95% of requests should complete below 200ms
    },
};

export default function () {
    const url = 'http://localhost:3000/api/repurpose';
    const payload = JSON.stringify({
        content: 'Test content for performance testing.',
        formats: ['twitter', 'linkedin'],
    });

    const params = {
        headers: { 'Content-Type': 'application/json' },
    };

    const res = http.post(url, payload, params);
    
    check(res, {
        'is status 200': (r) => r.status === 200,
        'response time < 200ms': (r) => r.timings.duration < 200,
    })

    sleep(1);
}

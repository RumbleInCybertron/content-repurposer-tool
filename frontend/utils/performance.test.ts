import { performance } from 'perf_hooks';

describe('Performance Tests', () => {
    it('should handle /api/repurpose in under 200ms', async () => {
        const start = performance.now();

        const response = await fetch('http://localhost:3000/api/repurpose', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                content: 'Test performance',
                formats: ['twitter', 'linkedin'],
            }),
        });

        const duration = performance.now() - start;

        expect(response.status).toBe(200);
        expect(duration).toBeLessThan(200); // Ensure it responds in under 200ms
    });
});

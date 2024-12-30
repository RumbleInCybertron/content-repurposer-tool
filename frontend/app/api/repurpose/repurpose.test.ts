import { POST } from './route';

describe('/api/repurpose Endpoint', () => {
  // Mocking a request object
  const requestMock = (content: string, formats: string[]) =>
    ({
      json: jest.fn().mockResolvedValue({ content, formats }),
    } as unknown as Request);

  it('validates content and formats', async () => {
    const req = requestMock('', []);

    const res = await POST(req);

    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({
      error: 'Content is required and must be a string or formats missing',
    });
  });

  it('formats content for selected platforms', async () => {
    const req = requestMock('Sample content for testing', ['twitter', 'email']);

    const res = await POST(req);

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.outputs.twitter).toContain('Sample content for testing');
    expect(data.outputs.email).toContain('Subject:');
  });

  it('handles unsupported formats', async () => {
    const req = requestMock('Sample content', ['unsupported']);

    const res = await POST(req);

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.outputs.unsupported).toBe('Unsupported format');
  });
});

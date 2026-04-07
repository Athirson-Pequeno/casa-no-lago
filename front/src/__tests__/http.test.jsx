import { afterEach, describe, expect, it, vi } from 'vitest';
import { request } from '../services/http';

describe('request', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('transforma resposta 200 nao-json em erro amigavel', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        text: async () => '<html>fallback</html>',
        headers: {
          get: () => 'text/html',
        },
      }),
    );

    await expect(request('/quartos')).rejects.toThrow(/resposta inesperada do servidor/i);
  });
});

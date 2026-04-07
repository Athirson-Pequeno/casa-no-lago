export async function request(url, options = {}) {
  const { headers: extraHeaders, ...requestOptions } = options;
  const response = await fetch(url, {
    ...requestOptions,
    headers: {
      'Content-Type': 'application/json',
      ...extraHeaders,
    },
  });

  const contentType = response.headers?.get?.('content-type') || 'application/json';
  let rawBody = '';

  if (typeof response.text === 'function') {
    rawBody = await response.text();
  } else if (typeof response.json === 'function') {
    const jsonBody = await response.json();
    rawBody = JSON.stringify(jsonBody);
  }
  let data = null;

  if (rawBody) {
    if (contentType.includes('application/json')) {
      try {
        data = JSON.parse(rawBody);
      } catch {
        throw new Error('Resposta JSON invalida recebida do servidor.');
      }
    } else {
      data = rawBody;
    }
  }

  if (!response.ok) {
    throw new Error(data?.erro || data?.msg || data?.message || 'Nao foi possivel concluir a requisicao.');
  }

  if (rawBody && !contentType.includes('application/json')) {
    throw new Error('Resposta inesperada do servidor.');
  }

  return data;
}

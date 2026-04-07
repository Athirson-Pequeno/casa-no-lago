export async function request(url, options = {}) {
  const { headers: extraHeaders, ...requestOptions } = options;
  const response = await fetch(url, {
    ...requestOptions,
    headers: {
      'Content-Type': 'application/json',
      ...extraHeaders,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.erro || data.msg || 'Nao foi possivel concluir a requisicao.');
  }

  return data;
}

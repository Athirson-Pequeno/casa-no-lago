/**
 * Gera um array com todas as datas entre início e fim (inclusive).
 * @param {Date} inicio
 * @param {Date} fim
 * @returns {Date[]}
 */
const gerarIntervalo = (inicio, fim) => {
  const datas = [];
  for (let d = new Date(inicio); d <= fim; d.setDate(d.getDate() + 1)) {
    datas.push(new Date(d));
  }
  return datas;
};

/**
 * Verifica se alguma data do novo período já está ocupada no quarto.
 * @param {Date[]} diasAlugados - datas já reservadas
 * @param {Date[]} novasDatas   - datas da nova reserva
 * @returns {boolean}
 */
const temConflito = (diasAlugados, novasDatas) =>
  diasAlugados.some(dAlugada =>
    novasDatas.some(dNova => dAlugada.toDateString() === dNova.toDateString())
  );

/**
 * Calcula o número de diárias únicas em um intervalo.
 * @param {Date[]} datas
 * @returns {number}
 */
const contarDiarias = (datas) =>
  new Set(datas.map(d => d.toDateString())).size;

module.exports = { gerarIntervalo, temConflito, contarDiarias };

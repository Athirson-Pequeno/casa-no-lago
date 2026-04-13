
/**
 * Valida os campos obrigatórios da reserva.
 * @returns {string|null} mensagem de erro ou null se tudo OK
 */
const validarCamposReserva = ({ quartoId, diaria }) => {
  if (!quartoId)            return 'O campo quartoId é obrigatório.';
  if (!diaria?.dataInicio)  return 'O campo diaria.dataInicio é obrigatório.';
  if (!diaria?.dataFim)     return 'O campo diaria.dataFim é obrigatório.';
  return null;
};

/**
 * Valida se as datas são válidas e coerentes.
 * @returns {{ inicio: Date, fim: Date } | { erro: string }}
 */
const validarDatas = (dataInicio, dataFim) => {
  const inicio = new Date(dataInicio);
  const fim    = new Date(dataFim);

  if (isNaN(inicio.getTime())) return { erro: 'Data de início inválida.' };
  if (isNaN(fim.getTime()))    return { erro: 'Data de fim inválida.' };

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  if (inicio < hoje) return { erro: 'A data de início não pode ser no passado.' };
  if (fim < inicio)  return { erro: 'A data de fim não pode ser anterior à data de início.' };

  return { inicio, fim };
};

module.exports = { validarCamposReserva, validarDatas };

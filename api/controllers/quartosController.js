const Quarto = require('../models/quartosModel');
const { gerarIntervalo } = require('../utils/datas');

// Serializa quarto para o formato esperado pelo front
function serializarQuarto(quarto) {
  const obj = quarto.toObject ? quarto.toObject() : quarto;
  return {
    ...obj,
    nome:       obj.titulo,
    preco:      obj.valorDiaria,
    disponivel: !obj.estaAlugado,
  };
}

// Criar quarto (admin)
const criarQuarto = async (req, res) => {
  try {
    const { titulo, descricao, tipo, capacidade, wifi, cafe, fotos, valorDiaria } = req.body;
    const quarto = await Quarto.create({ titulo, descricao, tipo, capacidade, wifi, cafe, fotos, valorDiaria });
    res.status(201).json(serializarQuarto(quarto));
  } catch (error) {
    res.status(400).json({ erro: 'Não foi possível criar o quarto. Verifique os dados enviados.' });
  }
};

// Listar todos os quartos (público) — suporta filtros: checkin, checkout, tipo
const listarQuartos = async (req, res) => {
  try {
    const { checkin, checkout, tipo } = req.query;

    const filtro = {};
    if (tipo) filtro.tipo = tipo;

    let quartos = await Quarto.find(filtro).populate('tags');

    // Filtra disponibilidade pelo período solicitado
    if (checkin && checkout) {
      const inicio = new Date(checkin);
      const fim    = new Date(checkout);

      if (!isNaN(inicio) && !isNaN(fim) && fim > inicio) {
        const datasDesejadas = gerarIntervalo(inicio, fim).map(d => d.toDateString());

        const resultado = quartos.map(q => {
          const diasOcupados = (q.diasAlugados || []).map(d => new Date(d).toDateString());
          const conflito     = datasDesejadas.some(d => diasOcupados.includes(d));
          const obj          = q.toObject();
          obj.estaAlugado    = conflito;
          return { ...obj, nome: obj.titulo, preco: obj.valorDiaria, disponivel: !conflito };
        });

        return res.json(resultado);
      }
    }

    res.json(quartos.map(serializarQuarto));
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao buscar quartos.' });
  }
};

// Buscar quarto por ID (público)
const buscarQuarto = async (req, res) => {
  try {
    const quarto = await Quarto.findById(req.params.id).populate('tags');
    if (!quarto) return res.status(404).json({ erro: 'Quarto não encontrado.' });
    res.json(serializarQuarto(quarto));
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao buscar quarto.' });
  }
};

// Atualizar quarto (admin)
const atualizarQuarto = async (req, res) => {
  try {
    const campos = ['titulo', 'descricao', 'tipo', 'capacidade', 'wifi', 'cafe', 'fotos', 'valorDiaria'];
    const camposPermitidos = {};
    campos.forEach(c => { if (req.body[c] !== undefined) camposPermitidos[c] = req.body[c]; });

    const quarto = await Quarto.findByIdAndUpdate(req.params.id, camposPermitidos, {
      new: true, runValidators: true,
    });
    if (!quarto) return res.status(404).json({ erro: 'Quarto não encontrado.' });
    res.json(serializarQuarto(quarto));
  } catch (error) {
    res.status(400).json({ erro: 'Não foi possível atualizar o quarto. Verifique os dados enviados.' });
  }
};

// Deletar quarto (admin)
const deletarQuarto = async (req, res) => {
  try {
    const quarto = await Quarto.findByIdAndDelete(req.params.id);
    if (!quarto) return res.status(404).json({ erro: 'Quarto não encontrado.' });
    res.json({ mensagem: 'Quarto deletado com sucesso.' });
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao deletar quarto.' });
  }
};

module.exports = { criarQuarto, listarQuartos, buscarQuarto, atualizarQuarto, deletarQuarto };

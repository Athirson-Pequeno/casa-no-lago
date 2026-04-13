const Tag    = require('../models/tagModel');
const Quarto = require('../models/quartosModel');

// Criar tag (admin)
const criarTag = async (req, res) => {
  try {
    const { nome } = req.body;
    if (!nome) return res.status(400).json({ erro: 'O nome da tag é obrigatório.' });
    const tag = await Tag.create({ nome });
    res.status(201).json(tag);
  } catch (error) {
    res.status(400).json({ erro: 'Não foi possível criar a tag. Verifique os dados enviados.' });
  }
};

// Listar todas as tags (público)
const listarTags = async (req, res) => {
  try {
    const tags = await Tag.find().populate('quartos', 'titulo valorDiaria');
    res.json(tags);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao buscar tags.' });
  }
};

// Adicionar tag a um quarto (admin)
const adicionarTagAoQuarto = async (req, res) => {
  try {
    const { quartoId, tagId } = req.body;
    if (!quartoId || !tagId)
      return res.status(400).json({ erro: 'quartoId e tagId são obrigatórios.' });

    const quarto = await Quarto.findById(quartoId);
    if (!quarto) return res.status(404).json({ erro: 'Quarto não encontrado.' });

    const tag = await Tag.findById(tagId);
    if (!tag) return res.status(404).json({ erro: 'Tag não encontrada.' });

    // Evita duplicatas nos dois lados
    if (!quarto.tags.includes(tagId))
      await Quarto.findByIdAndUpdate(quartoId, { $push: { tags: tagId } });
    if (!tag.quartos.includes(quartoId))
      await Tag.findByIdAndUpdate(tagId, { $push: { quartos: quartoId } });

    res.json({ mensagem: 'Tag adicionada ao quarto com sucesso.' });
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao adicionar tag ao quarto.' });
  }
};

// Remover tag de um quarto (admin)
const removerTagDoQuarto = async (req, res) => {
  try {
    const { quartoId, tagId } = req.body;
    if (!quartoId || !tagId)
      return res.status(400).json({ erro: 'quartoId e tagId são obrigatórios.' });

    await Quarto.findByIdAndUpdate(quartoId, { $pull: { tags: tagId } });
    await Tag.findByIdAndUpdate(tagId, { $pull: { quartos: quartoId } });

    res.json({ mensagem: 'Tag removida do quarto com sucesso.' });
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao remover tag do quarto.' });
  }
};

// Deletar tag (admin) — remove a tag de todos os quartos vinculados
const deletarTag = async (req, res) => {
  try {
    const tag = await Tag.findById(req.params.id);
    if (!tag) return res.status(404).json({ erro: 'Tag não encontrada.' });

    await Quarto.updateMany({ tags: tag._id }, { $pull: { tags: tag._id } });
    await Tag.findByIdAndDelete(req.params.id);

    res.json({ mensagem: 'Tag deletada com sucesso.' });
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao deletar tag.' });
  }
};

// Listar quartos por tag (público)
const listarQuartosPorTag = async (req, res) => {
  try {
    const tag = await Tag.findById(req.params.id);
    if (!tag) return res.status(404).json({ erro: 'Tag não encontrada.' });

    const quartos = await Quarto.find({ tags: req.params.id }).populate('tags');
    res.json(quartos);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao buscar quartos por tag.' });
  }
};

module.exports = { criarTag, listarTags, listarQuartosPorTag, adicionarTagAoQuarto, removerTagDoQuarto, deletarTag };

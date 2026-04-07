function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value || 0);
}

function resolveRoomTimestamp(room) {
  const createdAtTimestamp = Date.parse(room?.createdAt || '');

  if (Number.isFinite(createdAtTimestamp) && createdAtTimestamp > 0) {
    return createdAtTimestamp;
  }

  if (/^[a-f0-9]{24}$/i.test(room?._id || '')) {
    return parseInt(room._id.slice(0, 8), 16) * 1000;
  }

  return 0;
}

function normalizeText(value) {
  return (value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

function mapTag(tag) {
  if (typeof tag === 'string') {
    return tag;
  }

  return tag?.nome || '';
}

function inferRoomType(room, tags) {
  const haystack = [room.titulo, ...tags].map(normalizeText).join(' ');

  if (haystack.includes('suite')) {
    return 'suite';
  }

  if (haystack.includes('luxo') || room.valorDiaria >= 550) {
    return 'luxo';
  }

  return 'standard';
}

function buildDescription(title, type) {
  if (type === 'luxo') {
    return `Uma estadia exclusiva em ${title}, com atmosfera reservada e acabamento acolhedor.`;
  }

  if (type === 'suite') {
    return `${title} combina conforto generoso, silencio e detalhes pensados para descansar melhor.`;
  }

  return `${title} oferece um refugio leve, com clima sereno e ritmo desacelerado a beira do lago.`;
}

export function mapRoomFromApi(room) {
  const tags = Array.isArray(room.tags) ? room.tags.map(mapTag).filter(Boolean) : [];
  const type = inferRoomType(room, tags);
  const available = !Boolean(room.estaAlugado);

  return {
    id: room._id,
    title: room.titulo,
    type,
    description: buildDescription(room.titulo, type),
    dailyRate: room.valorDiaria,
    dailyRateLabel: formatCurrency(room.valorDiaria),
    createdAt: room.createdAt || '',
    sortTimestamp: resolveRoomTimestamp(room),
    isRented: Boolean(room.estaAlugado),
    available,
    bookedDates: Array.isArray(room.diasAlugados) ? room.diasAlugados : [],
    tags,
    amenities: {
      capacity: type === 'standard' ? 2 : 4,
      wifi: true,
      breakfast: room.valorDiaria >= 350 || tags.some((tag) => normalizeText(tag).includes('cafe')),
    },
    imageUrl: room.fotos?.[0] || '',
  };
}

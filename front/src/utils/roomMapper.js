function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value || 0);
}

function mapTag(tag) {
  if (typeof tag === 'string') {
    return tag;
  }

  return tag?.nome || '';
}

export function mapRoomFromApi(room) {
  return {
    id: room._id,
    title: room.titulo,
    dailyRate: room.valorDiaria,
    dailyRateLabel: formatCurrency(room.valorDiaria),
    isRented: Boolean(room.estaAlugado),
    bookedDates: Array.isArray(room.diasAlugados) ? room.diasAlugados : [],
    tags: Array.isArray(room.tags) ? room.tags.map(mapTag).filter(Boolean) : [],
    imageUrl: room.fotos?.[0] || '',
  };
}

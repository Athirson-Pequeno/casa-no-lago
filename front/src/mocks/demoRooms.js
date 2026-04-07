function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

function buildRoom({
  id,
  title,
  type,
  description,
  dailyRate,
  available,
  bookedDates,
  tags,
  amenities,
}) {
  return {
    id,
    title,
    type,
    description,
    dailyRate,
    dailyRateLabel: formatCurrency(dailyRate),
    available,
    isRented: !available,
    bookedDates,
    tags,
    amenities,
    imageUrl: '',
  };
}

export const demoRooms = [
  buildRoom({
    id: 'demo-standard',
    title: 'Cabana Aurora',
    type: 'standard',
    description: 'Um refugio leve com janela para a agua, texturas naturais e silencio para desacelerar.',
    dailyRate: 420,
    available: true,
    bookedDates: [],
    tags: ['Vista para o lago', 'Varanda privativa'],
    amenities: {
      capacity: 2,
      wifi: true,
      breakfast: false,
    },
  }),
  buildRoom({
    id: 'demo-suite',
    title: 'Suite Horizonte',
    type: 'suite',
    description: 'Mais espaco, tons suaves e uma atmosfera serena para estadias um pouco mais longas.',
    dailyRate: 560,
    available: true,
    bookedDates: [],
    tags: ['Cafe da manha', 'Banheira'],
    amenities: {
      capacity: 4,
      wifi: true,
      breakfast: true,
    },
  }),
  buildRoom({
    id: 'demo-luxo',
    title: 'Retiro do Lago',
    type: 'luxo',
    description: 'Uma opcao reservada com materiais quentes, luz baixa e clima de fim de semana prolongado.',
    dailyRate: 680,
    available: false,
    bookedDates: ['2026-04-10', '2026-04-11', '2026-04-12'],
    tags: ['Lareira', 'Deck privativo'],
    amenities: {
      capacity: 4,
      wifi: true,
      breakfast: true,
    },
  }),
];

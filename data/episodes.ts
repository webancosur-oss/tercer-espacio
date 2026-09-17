export type Episode = {
  id: string;
  title: string;
  description: string;
  duration: string;
  date: string;
  category: string;
  image: string;
};

export const episodes: Episode[] = [
  {
    id: '01',
    title: '¿Qué hace realmente valiosa una propiedad?',
    description:
      'Ubicación, desarrollo urbano, demanda y las variables que influyen en el valor de una propiedad.',
    duration: '38 min',
    date: '12 SEP 2026',
    category: 'INVERSIÓN',
    image: '/images/podcast/episodes/episode-01.jpg',
  },
  {
    id: '02',
    title: 'Comprar para vivir o comprar para invertir',
    description:
      'Dos decisiones distintas que requieren analizar objetivos, horizonte y contexto.',
    duration: '31 min',
    date: '05 SEP 2026',
    category: 'INVERSIÓN',
    image: '/images/podcast/episodes/episode-02.jpg',
  },
  {
    id: '03',
    title: 'Cómo una ciudad cambia el valor de sus propiedades',
    description:
      'Infraestructura, conectividad y crecimiento urbano como motores del mercado inmobiliario.',
    duration: '42 min',
    date: '29 AGO 2026',
    category: 'CIUDAD',
    image: '/images/podcast/episodes/episode-03.jpg',
  },
  {
    id: '04',
    title: 'Arquitectura que piensa en las personas',
    description:
      'Qué ocurre cuando diseño, funcionalidad y experiencia se convierten en una misma conversación.',
    duration: '35 min',
    date: '22 AGO 2026',
    category: 'ARQUITECTURA',
    image: '/images/podcast/episodes/episode-04.jpg',
  },
];
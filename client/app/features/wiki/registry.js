export const wikiRegistry = Object.freeze({
  version: 3,
  defaultSlug: 'nicolas-filipovich',
  articles: [
    {
      slug: 'nicolas-filipovich',
      title: 'Nicolás Filipovich',
      aliases: ['nicolas filipovich'],
      description: 'Político, maestro en formación y desarrollador uruguayo.',
      subtitle: 'Concejal · Canelones',
      thumbnail: 'client/assets/img/example.webp',
      tags: ['perfil', 'politica', 'uruguay'],
      category: 'biografia',
      related: ['bios-vs-uefi', 'market-anarchism'],
      updatedAt: '2026-07-01'
    },
    {
      slug: 'bios-vs-uefi',
      title: 'BIOS vs UEFI',
      aliases: ['bios', 'uefi firmware'],
      description: 'Resumen técnico e histórico de BIOS y UEFI.',
      subtitle: 'Arquitectura de firmware',
      tags: ['hardware', 'firmware'],
      category: 'tecnologia',
      related: ['uefi'],
      updatedAt: '2026-05-10'
    },
    {
      slug: 'uefi',
      title: 'UEFI',
      aliases: ['unified extensible firmware interface'],
      description: 'Interfaz de firmware moderna para inicialización del sistema.',
      subtitle: 'Especificación',
      tags: ['hardware', 'arranque'],
      category: 'tecnologia',
      related: ['bios-vs-uefi'],
      updatedAt: '2026-05-10'
    },
    {
      slug: 'market-anarchism',
      title: 'Market Anarchism',
      aliases: ['anarquismo de mercado'],
      description: 'Corriente política que defiende mercados libres sin Estado.',
      subtitle: 'Pensamiento político',
      tags: ['politica', 'filosofia'],
      category: 'ideas',
      related: ['nicolas-filipovich'],
      updatedAt: '2026-05-10'
    }
  ]
});

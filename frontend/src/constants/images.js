import louageImage from '../assets/louage.webp'

const placeholder = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="400"><rect width="800" height="400" fill="%23FFE5D0"/></svg>'

export const images = {
  hero: {
    src: louageImage,
    alt: 'Louage et passagers sur route en Tunisie',
    placeholder,
  },
  vehicles: {
    louage6: {
      src: louageImage,
      alt: 'Louage 6 places en Tunisie',
      placeholder,
    },
    louage8: {
      src: louageImage,
      alt: 'Louage 8 places en Tunisie',
      placeholder,
    },
    louage12: {
      src: louageImage,
      alt: 'Louage 12 places en Tunisie',
      placeholder,
    },
  },
  illustrations: {
    empty: {
      src: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect width="400" height="300" fill="%23FFF7ED"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Inter,Arial" font-size="16" fill="%23C2410C">Aucun trajet</text></svg>',
      alt: 'Illustration aucun résultat',
    },
  },
  avatars: {
    placeholder: {
      src: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80"><circle cx="40" cy="40" r="40" fill="%23E5E7EB"/><circle cx="40" cy="34" r="16" fill="%239CA3AF"/><path d="M16 72c4-14 18-22 24-22s20 8 24 22" fill="%239CA3AF"/></svg>',
      alt: 'Avatar par défaut',
    },
  },
}

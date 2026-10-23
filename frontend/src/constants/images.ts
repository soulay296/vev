export const images = {
  hero: {
    src: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    alt: "Bus et passagers sur route en Tunisie",
    placeholder: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="600"><rect width="1200" height="600" fill="%23FFE5D0"/></svg>',
  },
  vehicles: {
    minibus: {
      src: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      alt: "Minibus en circulation",
      placeholder: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="400"><rect width="800" height="400" fill="%23FFE5D0"/></svg>',
    },
    bus: {
      src: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      alt: "Bus collectif",
      placeholder: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="400"><rect width="800" height="400" fill="%23FFE5D0"/></svg>',
    },
    van: {
      src: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      alt: "Van pour transport collectif",
      placeholder: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="400"><rect width="800" height="400" fill="%23FFE5D0"/></svg>',
    },
  },
  illustrations: {
    empty: {
      src: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect width="400" height="300" fill="%23FFF7ED"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Inter,Arial" font-size="16" fill="%23F7931E">Aucun trajet</text></svg>',
      alt: "Illustration aucun résultat",
    },
  },
  avatars: {
    placeholder: {
      src: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80"><circle cx="40" cy="40" r="40" fill="%23E5E7EB"/><circle cx="40" cy="34" r="16" fill="%239CA3AF"/><path d="M16 72c4-14 18-22 24-22s20 8 24 22" fill="%239CA3AF"/></svg>',
      alt: "Avatar par défaut",
    },
  },
} as const;

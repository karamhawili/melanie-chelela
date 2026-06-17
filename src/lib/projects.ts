export interface Project {
  slug: string;
  n: string;
  name: string;
  tag: string;
  location: string;
  area: string;
  year: string;
  image: string;
  caption: string;
  description: string;
}

export const projects: Project[] = [
  {
    slug: "terra-mare",
    n: "01",
    name: "Son of a Fish",
    tag: "Restaurant & Bar",
    location: "Beirut",
    area: "740 m²",
    year: "2024",
    image: "/projects/terra-mare/cam07.jpg",
    caption: "Fig. 01 — Rooftop Terrace",
    description:
      "A rooftop carved from stone, reed and sea-light — where the Mediterranean is set at the table.",
  },
  {
    slug: "villa-faqra",
    n: "02",
    name: "Villa Faqra",
    tag: "Residential",
    location: "Mount Lebanon",
    area: "620 m²",
    year: "2023",
    image: "/projects/terra-mare/cam03.jpg",
    caption: "Fig. 02 — Salon",
    description:
      "A mountain house held in one warm key — where every threshold is drawn to frame the valley beyond.",
  },
  {
    slug: "appartement-achrafieh",
    n: "03",
    name: "Appartement Achrafieh",
    tag: "Residential",
    location: "Beirut",
    area: "240 m²",
    year: "2024",
    image: "/projects/terra-mare/cam05.jpg",
    caption: "Fig. 03 — Living",
    description:
      "A city apartment pared back to light, linen and aged brass — rooms that withhold, so the few things that matter can be seen.",
  },
  {
    slug: "maison-gemmayzeh",
    n: "04",
    name: "Maison Gemmayzeh",
    tag: "Restoration",
    location: "Beirut",
    area: "180 m²",
    year: "2023",
    image: "/projects/terra-mare/cam11.png",
    caption: "Fig. 04 — The Corridor",
    description:
      "A heritage house brought back to itself — curved plaster, a single reed niche, and light kept low and deliberate.",
  },
  {
    slug: "penthouse-saifi",
    n: "05",
    name: "Penthouse Saifi",
    tag: "Residential",
    location: "Beirut",
    area: "310 m²",
    year: "2022",
    image: "/projects/terra-mare/cam06.jpg",
    caption: "Fig. 05 — Bar",
    description:
      "Low, deliberate light and bespoke joinery, each run drawn and made for the room it belongs to.",
  },
  {
    slug: "riad-batroun",
    n: "06",
    name: "Riad Batroun",
    tag: "Hospitality",
    location: "Batroun",
    area: "880 m²",
    year: "2020",
    image: "/projects/terra-mare/cam01.jpg",
    caption: "Fig. 06 — Courtyard",
    description:
      "Crazy-paved travertine and woven shade gathered around a courtyard of water and slow Mediterranean light.",
  },
];

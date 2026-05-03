export type MenuTag = "fire" | "veg" | "new"

export interface MenuItemData {
  name: string
  desc?: string   // opcional — no todos los platos tienen descripción
  price: number
  tags: MenuTag[]
}

export interface MenuCategory {
  label: string
  note?: string   // nota opcional en cabecera de categoría (p.ej. "Incluye: patatas fritas…")
  items: MenuItemData[]
}

export interface RitualStep {
  num: string
  title: string
  time: string
  body: string
}

export interface Voice {
  quote: string
  name: string
  meta: string
  stars: number
  date: string
}

/* ─────────────────────────────────────────
   PASOS DEL RITUAL
───────────────────────────────────────── */
export const RITUAL_STEPS: RitualStep[] = [
  { num: "01", title: "Se elige el pollo",    time: "CADA MAÑANA",                  body: "Pollos frescos, nunca congelados. Llegan cada mañana del proveedor de siempre." },
  { num: "02", title: "Se adoba",             time: "EN CASA · DESDE EL DÍA ANTES", body: "Pimentón, ajo, laurel y hierbas. La mezcla de la abuela, la misma desde que abrimos." },
  { num: "03", title: "Al asador",            time: "FUEGO LENTO · 90 MIN",         body: "Giran despacio. La piel se dora, los jugos se quedan dentro. Como toda la vida." },
  { num: "04", title: "Costillar y codillo",  time: "HORNO · 3 HORAS",             body: "En paralelo, costillar a la BBQ y codillo al horno. Para quien no quiere pollo ese día." },
  { num: "05", title: "Listo para llevar",    time: "O PARA COMER AQUÍ",            body: "Papel de aluminio, bolsa de asa, y a casa. O te sientas en la terraza y te lo comes calentito." },
]

/* ─────────────────────────────────────────
   OPINIONES
───────────────────────────────────────── */
export const VOICES: Voice[] = [
  { quote: "Llevo viniendo diez años y el pollo <em>sigue igual de bueno</em>. Los domingos tengo mesa reservada sin reservar — saben que vengo.",  name: "Rosa M.",    meta: "Vecina · Valdemoro",   stars: 5, date: "Mar '26" },
  { quote: "El costillar es una barbaridad. Por 16€ comes tú, tu pareja y te sobra para el lunes. <em>Calidad-precio inmejorable.</em>",              name: "Javier L.",  meta: "Google Reviews",       stars: 5, date: "Feb '26" },
  { quote: "Pedí el codillo por encargo para un cumpleaños. <em>Se lo comieron hasta los niños.</em> Repetiremos el año que viene seguro.",           name: "Carmen R.",  meta: "Cliente desde 2018",   stars: 5, date: "Ene '26" },
  { quote: "Comida casera de la de verdad. Nada de tonterías, nada de modas. <em>El sitio de toda la vida</em> al que ya ibas con tus padres.",       name: "Andrés P.",  meta: "TripAdvisor",          stars: 5, date: "Dic '25" },
]

/* ─────────────────────────────────────────
   CARTA COMPLETA
   (secciones = categorías del restaurante)
───────────────────────────────────────── */
export const MENU_DATA: Record<string, MenuCategory> = {

  /* ── 1. ENSALADAS ── */
  ensaladas: {
    label: "Ensaladas",
    items: [
      { name: "Ensalada clásica",                           desc: "Lechuga, tomate, cebolla y aceitunas",                                                price:  8.90, tags: ["veg"] },
      { name: "Ensaladita rusa",                            desc: "Patata cocida, zanahoria, guisantes, atún y mayonesa",                                price:  8.90, tags: []      },
      { name: "Ensalada mixta",                             desc: "Lechuga, tomate, atún, zanahoria, maíz, remolacha y pepino",                          price: 11.90, tags: []      },
      { name: "Ensalada italiana",                          desc: "Lechuga, zanahoria, maíz, pasta, jamón dulce y queso",                                price: 10.90, tags: []      },
      { name: "Ensalada de endibias con salmón y Roquefort",desc: "Endibias, zanahoria, maíz, ensalada y Roquefort",                                     price: 11.90, tags: []      },
      { name: "Ensalada César",                             desc: "Lechuga, pollo crujiente, picatostes y salsa César",                                  price: 12.90, tags: []      },
      { name: "Ensalada de salmón ahumado con gulas",       desc: "Lechuga, zanahoria, salmón y gulas",                                                 price: 12.90, tags: []      },
      { name: "Ensalada de quesos con salsa Roquefort",     desc: "Lechuga, zanahoria, maíz, quesos frescos y curados",                                  price: 12.90, tags: ["veg"] },
      { name: "Ensalada de queso de cabra con cebolla caramelizada", desc: "Lechuga, queso de cabra, tomate, cebolla y aceitunas",                       price: 12.90, tags: ["veg"] },
    ],
  },

  /* ── 2. PASTAS ── */
  pastas: {
    label: "Pastas",
    note: "Salsa a elegir: Boloñesa · Pomodoro · Del chef (tomate, carne y Roquefort) · Roquefort y nueces",
    items: [
      { name: "Espaguetis de trigo",          price: 10.90, tags: [] },
      { name: "Fusilli tricolor",             price: 10.90, tags: [] },
      { name: "Cuadrottis rellenos de queso", price: 10.90, tags: [] },
      { name: "Raviolis rellenos de carne",   price: 10.90, tags: [] },
      { name: "Tagliatelles negros frescos",  price: 10.90, tags: [] },
    ],
  },

  /* ── 3. RACIONES (I + II fusionadas) ── */
  raciones: {
    label: "Raciones",
    items: [
      /* — Del menú original de Raciones — */
      { name: "Croquetas caseras de jamón",                        price:  9.80, tags: []      },
      { name: "Empanadillas de atún",                              price:  9.80, tags: []      },
      { name: "Buñuelos de bacalao con salsa alioli",              price:  9.80, tags: []      },
      { name: "Calabacín a la gabardina con alioli",               price:  9.80, tags: []      },
      { name: "Pimientos verdes fritos",                           price:  8.90, tags: ["veg"] },
      { name: "Pisto manchego",                                    price:  9.80, tags: ["veg"] },
      { name: "Mollejas de pollo al Jerez",                        price: 11.80, tags: []      },
      { name: "Setas a la parrilla con jamón y salsa alioli",      price: 11.90, tags: []      },
      { name: "Huevos estrellados con jamón, chistorra y chorizo", price: 11.90, tags: []      },
      { name: "Espárragos verdes a la plancha con salsa alioli",   price: 10.90, tags: ["veg"] },
      { name: "Lacón asado con pimientos rojos",                   price: 12.90, tags: []      },
      { name: "Pimiento de piquillo relleno de ternera",           price: 12.90, tags: []      },
      { name: "Calamares a la romana",                             price: 14.90, tags: []      },
      { name: "Langostinos a la gabardina con salsa rosa",         price: 14.90, tags: []      },
      { name: "Alitas Tex-Mex con salsa barbacoa",                 price: 10.90, tags: ["fire"] },
      { name: "Sticks de mozzarella con salsa barbacoa",           price: 12.90, tags: []      },
      { name: "Combo americano con salsa barbacoa",                desc: "Stick de mozzarella, aros de cebolla, jalapeños y patatas americanas", price: 14.80, tags: [] },
      { name: "Rollito de primavera",                              price:  3.40, tags: []      },
      /* — Del menú original de Raciones II — */
      { name: "Jalapeños rellenos de queso cheddar con salsa barbacoa", price: 12.90, tags: []      },
      { name: "Quesadilla de jamón, 4 quesos y salsa de yogur",         price: 11.90, tags: []      },
      { name: "Berenjena rellena de carne y bechamel",                  price: 10.90, tags: []      },
      { name: "Dúo de calabacín y berenjena a la plancha con nuez y queso", price: 10.90, tags: ["veg"] },
      { name: "Crepe de pollo, cebolla caramelizada y ensalada",        price: 10.40, tags: []      },
      { name: "Tigres de mejillones gallegos",                          price: 14.90, tags: []      },
      { name: "Paella mixta",                                           price:  9.40, tags: []      },
      { name: "Gazpacho",                                               price:  7.40, tags: ["veg"] },
      { name: "Consomé con jamón",                                      price:  7.40, tags: []      },
      { name: "Lentejas",                                               price:  7.40, tags: []      },
      { name: "Fabada asturiana",                                       price:  7.40, tags: []      },
    ],
  },

  /* ── 4. POLLO (asado + con guarnición + menús) ── */
  pollo: {
    label: "Pollo",
    note: "Guarnición a elegir: patatas fritas · arroz blanco · ensalada",
    items: [
      { name: "Pollo asado entero",          desc: "A elegir: hierbas o limón",                  price: 17.80, tags: ["fire"] },
      { name: "Medio pollo asado",           desc: "A elegir: hierbas o limón",                  price:  9.50, tags: ["fire"] },
      { name: "Cuarto de pollo con guarnición",                                                   price:  8.90, tags: ["fire"] },
      { name: "Medio pollo con guarnición",                                                       price: 12.50, tags: ["fire"] },
      { name: "Menú medio pollo",            desc: "Guarnición, pan y bebida incluidos",          price:  9.90, tags: ["fire"] },
      { name: "Menú cuarto de pollo",        desc: "Guarnición, pan y bebida incluidos",          price:  8.90, tags: ["fire"] },
    ],
  },

  /* ── 5. CARNES ── */
  carnes: {
    label: "Carnes",
    note: "Incluye: patatas fritas, arroz blanco o ensalada",
    items: [
      { name: "Costillar americano con barbacoa",            price: 17.90, tags: ["fire"] },
      { name: "Entrecot a la parrilla",     desc: "Salsa a elegir: Roquefort, pimienta o barbacoa", price: 18.90, tags: ["fire"] },
      { name: "Cachopo con jamón serrano y queso",           price: 18.90, tags: []       },
      { name: "Codillo asado",                               price: 14.90, tags: ["fire"] },
      { name: "Bistec a la parrilla",                        price: 14.90, tags: ["fire"] },
      { name: "Escalope de ternera",                         price: 14.90, tags: []       },
      { name: "Bocaditos de pollo con salsa barbacoa",       price: 12.90, tags: []       },
      { name: "Escalope de pollo",                           price: 12.90, tags: []       },
      { name: "Escalopines de lomo",                         price: 11.90, tags: []       },
      { name: "San Jacobo",                                  price: 10.90, tags: []       },
    ],
  },

  /* ── 6. PESCADOS ── */
  pescados: {
    label: "Pescados",
    note: "Incluye: patatas fritas, arroz blanco o ensalada",
    items: [
      { name: "Lubina a la plancha",              price: 15.90, tags: [] },
      { name: "Emperador a la plancha",           price: 15.90, tags: [] },
      { name: "Merluza a la romana o en salsa",   price: 15.90, tags: [] },
      { name: "Mejillones gallegos al vapor",     price: 14.90, tags: [] },
    ],
  },

  /* ── 7. POSTRES CASEROS ── */
  postres: {
    label: "Postres",
    items: [
      { name: "Ración de tarta",                 price: 5.20, tags: []      },
      { name: "Tarta de queso",     desc: "Sin hornear",                    price: 5.20, tags: []      },
      { name: "Tarta helada",                    price: 5.20, tags: []      },
      { name: "Brownie con helado",              price: 5.20, tags: []      },
      { name: "Profiteroles con chocolate",      price: 5.20, tags: []      },
      { name: "Crepes con sirope de chocolate",  price: 5.20, tags: []      },
      { name: "Torrijas",                        price: 5.20, tags: []      },
    ],
  },

  /* ── 8. GUARNICIONES (patatas + salsas) ── */
  guarniciones: {
    label: "Guarniciones",
    items: [
      { name: "Patatas fritas grandes",                                       price: 8.90, tags: ["veg"] },
      { name: "Patatas fritas medianas",                                      price: 7.90, tags: ["veg"] },
      { name: "Patatas americanas",      desc: "Con salsa barbacoa",          price: 9.40, tags: ["veg"] },
      { name: "Patatas Paris",           desc: "Con salsa barbacoa",          price: 9.40, tags: ["veg"] },
      { name: "Salsa rosa",                                                   price: 1.80, tags: []      },
      { name: "Alioli",                                                       price: 1.80, tags: []      },
      { name: "Salsa barbacoa",                                               price: 1.80, tags: []      },
      { name: "Salsa Roquefort",                                              price: 1.80, tags: []      },
      { name: "Salsa brava",                                                  price: 1.80, tags: []      },
      { name: "Salsa de yogur",                                               price: 1.80, tags: []      },
    ],
  },

}

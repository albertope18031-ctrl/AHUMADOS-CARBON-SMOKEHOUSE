export const RESTAURANT_INFO = {
  name: "Ahumados & Carbón Smokehouse",
  tagline: "Humo, Brasa & Cerveza Artesanal",
  status: "🟢 Abierto hoy • Fuego encendido hasta las 11:00 PM",
  smokeBadge: "⏳ Ahumado artesanalmente por hasta 12 horas con leña de encino seleccionada.",
  address: "Av. Gastronómica #104, Zona Poniente",
  hours: "Mar - Jue: 1:00 PM - 10:00 PM | Vie - Sáb: 1:00 PM - 11:30 PM | Dom: 1:00 PM - 8:00 PM",
  phoneDisplay: "662 417 5122",
  whatsappNumber: "526624175122"
};

export const CATEGORIES = [
  { id: "ahumados", name: "Ahumados Low & Slow", icon: "Flame" },
  { id: "cortes", name: "Cortes a la Leña", icon: "Beef" },
  { id: "burgers", name: "Burgers al Carbón", icon: "Sandwich" },
  { id: "entradas", name: "Entradas & Botanas", icon: "UtensilsCrossed" },
  { id: "cerveza", name: "Cervecería & Tragos", icon: "Beer" }
];

export const DISHES = [
  // Categoría A: Ahumados Low & Slow
  {
    id: "st-louis-cut",
    categoryId: "ahumados",
    name: "Costillar St. Louis Cut (Full Rack)",
    price: 385,
    badge: "🔥 Especialidad de la Casa",
    image: "/images/menu/costillas-st-louis.png",
    description: "Costillar entero cocinado a fuego indirecto con leña de encino durante 8 horas. Bañado con nuestro glaseado BBQ artesanal especiado. Se desprende del hueso solo con mirarlo. Incluye elote dulce tatemado y ensalada de col fresca.",
    requiresCookingPoint: false,
    hasSideOptions: true
  },
  {
    id: "brisket-tejano",
    categoryId: "ahumados",
    name: "Brisket Tejano Prime (350g)",
    price: 420,
    badge: "⭐ 12 Horas de Humo",
    image: "/images/menu/brisket-tejano-prime.png",
    description: "Corte de pecho de res calidad Prime con corteza crocante de pimienta negra martajada y sal kosher. Jugosidad absoluta y anillo de humo pronunciado. Servido con pepinillos encurtidos en casa y cebolla morada.",
    requiresCookingPoint: false,
    hasSideOptions: true
  },
  {
    id: "pulled-pork-sandwich",
    categoryId: "ahumados",
    name: "Pulled Pork Sandwich",
    price: 195,
    badge: "Top Ventas",
    image: "/images/menu/pulled-pork-sandwich.png",
    description: "Espaldilla de cerdo deshebrada a mano, marinada en vinagre de manzana y especias, coronada con ensalada coleslaw crujiente dentro de un pan brioche tostado con mantequilla.",
    requiresCookingPoint: false,
    hasSideOptions: true
  },
  // Categoría B: Cortes a la Leña
  {
    id: "rib-eye-asador",
    categoryId: "cortes",
    name: "Rib Eye Asador (450g)",
    price: 495,
    badge: "Corte Estelar",
    image: "/images/menu/rib-eye-asador.png",
    description: "Corte grueso con marmoleo superior asado a las brasas vivas de mezquite, sellado con costra de sal de grano y mantequilla de romero y ajo. Servido con chiles toreados y cebollas cambray.",
    requiresCookingPoint: true,
    hasSideOptions: true
  },
  {
    id: "vacio-res",
    categoryId: "cortes",
    name: "Vacío de Res a la Parrilla (400g)",
    price: 390,
    badge: null,
    image: "/images/menu/vacio-res.png",
    description: "Jugoso y de textura firme, cocinado a punto con chimichurri rústico tatemado de la casa y papas al ajillo.",
    requiresCookingPoint: true,
    hasSideOptions: true
  },
  // Categoría C: Hamburguesas Monster al Carbón
  {
    id: "la-brasa-burger",
    categoryId: "burgers",
    name: "La Brasa Smokehouse Burger",
    price: 220,
    badge: "🔥 La Favorita",
    image: "/images/menu/la-brasa-burger.png",
    description: "200g de mezcla artesanal de Rib Eye y Short Rib sellada al carbón, queso cheddar añejo gratinado, tocino ahumado grueso glaseado en maple, cebolla caramelizada al bourbon y aderezo especial en pan brioche.",
    requiresCookingPoint: true,
    hasSideOptions: true
  },
  {
    id: "black-truffle-burger",
    categoryId: "burgers",
    name: "Black Truffle Burger",
    price: 245,
    badge: null,
    image: "/images/menu/black-truffle-burger.png",
    description: "200g de carne de res al fuego, queso suizo emmental derretido, champiñones salteados al sartén de hierro y mayonesa infusionada con trufa negra y ajo confitado.",
    requiresCookingPoint: true,
    hasSideOptions: true
  },
  // Categoría D: Entradas & Cerveza
  {
    id: "papas-trufadas",
    categoryId: "entradas",
    name: "Papas Rústicas Trufadas",
    price: 145,
    badge: null,
    image: "/images/menu/papas-rusticas-trufadas.png",
    description: "Gajos de papa con piel fritos al punto crujiente, espolvoreados con queso parmesano recién rallado, perejil fresco y aceite de trufa blanca.",
    requiresCookingPoint: false,
    hasSideOptions: false
  },
  {
    id: "tuetanos-brasa",
    categoryId: "entradas",
    name: "Tuétanos a la Brasa (3 piezas)",
    price: 175,
    badge: null,
    image: "/images/menu/tuetanos-brasa.png",
    description: "Canoas de tuétano asadas con sal de mar, acompañadas de chimichurri caliente y tortillas de maíz recién hechas para armar tacos.",
    requiresCookingPoint: false,
    hasSideOptions: false
  },
  {
    id: "ipa-artesanal",
    categoryId: "cerveza",
    name: "IPA Artesanal de la Casa (355ml)",
    price: 95,
    badge: "Cerveza Local",
    image: "/images/menu/ipa-artesanal.png",
    description: "Cerveza lupulada de cuerpo medio con marcadas notas cítricas y resinosas. El maridaje perfecto para limpiar el paladar entre cortes grasos.",
    requiresCookingPoint: false,
    hasSideOptions: false
  }
];

export const COOKING_POINTS = [
  "Término Medio (Centro rojo tibio, máxima jugosidad)",
  "Tres Cuartos (Poco rosa al centro, textura firme)",
  "Bien Cocido (Sin rastro de rosa)"
];

export const SIDE_OPTIONS = [
  "Mac & Cheese con costra de queso ahumado",
  "Elote amarillo tatemado con mantequilla y paprika",
  "Papas a la francesa sazonadas",
  "Ensalada de col cremosa tradicional"
];

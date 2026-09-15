export const RESTAURANT_INFO = {
  name: "Ahumados & Carbón Smokehouse",
  tagline: "Humo, Brasa & Cerveza Artesanal",
  status: "🟢 Abierto hoy • Fuego encendido hasta las 11:00 PM",
  smokeBadge: "⏳ Ahumado artesanalmente por hasta 12 horas con leña de encino seleccionada.",
  address: "Av. Gastronómica #104, Zona Poniente",
  hours: "Mar - Jue: 1:00 PM - 10:00 PM | Vie - Sáb: 1:00 PM - 11:30 PM | Dom: 1:00 PM - 8:00 PM",
  phoneDisplay: "662 417 5122",
  phoneRaw: "+526624175122",
  whatsappNumber: "526624175122",
  googleMapsUrl: "https://maps.google.com/?q=Av.+Gastronomica+104+Zona+Poniente",
  wazeUrl: "https://waze.com/ul?q=Av.+Gastronomica+104+Zona+Poniente",
  billingEmail: "facturacion@ahumadosycarbon.com",
  socialLinks: {
    instagram: "https://instagram.com/ahumadosycarbon",
    facebook: "https://facebook.com/ahumadosycarbon",
    tiktok: "https://tiktok.com/@ahumadosycarbon"
  },
  scheduleWeekly: [
    { days: "Lunes", hours: "Cerrado (Curado de leña y ahumadores)", isOpen: false },
    { days: "Martes a Jueves", hours: "1:00 PM - 10:00 PM", isOpen: true },
    { days: "Viernes y Sábado", hours: "1:00 PM - 11:30 PM", isOpen: true, badge: "Noche de Fuego & Humo" },
    { days: "Domingo", hours: "1:00 PM - 8:00 PM", isOpen: true, badge: "Domingo de Brasa" }
  ],
  transparencyPolicies: {
    iva: "Todos nuestros precios incluyen IVA (precios netos en MXN).",
    tip: "La propina es 100% voluntaria conforme a las disposiciones oficiales.",
    noCommissions: "Sin cargos ocultos por servicio ni comisiones adicionales por pago con tarjeta.",
    tablePayment: "El cobro se realiza directamente en tu mesa con terminal inalámbrica o en caja al retirarte."
  },
  wifi: {
    network: "AhumadosCarbon_Guest",
    password: "humoybrasa2024"
  }
};

export const CATEGORIES = [
  { id: "cerveza", name: "Cervecería, Tragos & Bebidas", icon: "Beer" },
  { id: "entradas", name: "Entradas & Botanas", icon: "UtensilsCrossed" },
  { id: "ahumados", name: "Ahumados Low & Slow", icon: "Flame" },
  { id: "cortes", name: "Cortes a la Leña", icon: "Beef" },
  { id: "burgers", name: "Burgers al Carbón", icon: "Sandwich" },
  { id: "postres", name: "Postres & Café", icon: "CakeSlice" }
];

export const DEFAULT_PAIRING = {
  id: "ipa-artesanal",
  name: "Cerveza IPA Artesanal de la Casa (355ml)",
  price: 95,
  portion: "Individual (355ml)",
  image: "/images/menu/ipa-artesanal.png",
  description: "Cerveza lupulada fría con notas cítricas para limpiar el paladar entre cortes grasos."
};

export const QUICK_FILTERS = [
  { id: "especialidad", label: "Especialidades", icon: "⭐" },
  { id: "para-compartir", label: "Para Compartir", icon: "👥" },
  { id: "picante", label: "Picante", icon: "🌶️" },
  { id: "sin-gluten", label: "Sin Gluten", icon: "🌾" },
  { id: "ligero", label: "Opciones Ligeras / Verdes", icon: "🥗" }
];

export const DISHES = [
  // Categoría 1: Cervecería, Tragos & Bebidas
  {
    id: "ipa-artesanal",
    categoryId: "cerveza",
    name: "IPA Artesanal de la Casa (355ml)",
    portion: "Individual (355ml)",
    price: 95,
    badge: "Cerveza Local",
    image: "/images/menu/ipa-artesanal.png",
    description: "Cerveza lupulada de cuerpo medio con marcadas notas cítricas y resinosas. El maridaje perfecto para limpiar el paladar entre cortes grasos.",
    requiresCookingPoint: false,
    hasSideOptions: false,
    tags: ["bebida", "artesanal", "ligero"],
    isSpecialty: false,
    isTopSeller: true
  },
  {
    id: "limonada-ahumada",
    categoryId: "cerveza",
    name: "Limonada Ahumada con Romero (450ml)",
    portion: "Individual (450ml)",
    price: 65,
    badge: "Sin Alcohol",
    image: "/images/menu/limonada-ahumada.png",
    description: "Limones tatemados a la brasa, jarabe artesanal infusionado con romero fresco y agua mineral fría de manantial. Refrescante y aromática.",
    requiresCookingPoint: false,
    hasSideOptions: false,
    tags: ["bebida", "artesanal", "ligero"],
    isSpecialty: false,
    isTopSeller: false
  },

  // Categoría 2: Entradas & Botanas
  {
    id: "papas-trufadas",
    categoryId: "entradas",
    name: "Papas Rústicas Trufadas",
    portion: "Para compartir (2-3 pers.) • 350g",
    price: 145,
    badge: null,
    image: "/images/menu/papas-rusticas-trufadas.png",
    description: "Gajos de papa con piel fritos al punto crujiente, espolvoreados con queso parmesano recién rallado, perejil fresco y aceite de trufa blanca.",
    requiresCookingPoint: false,
    hasSideOptions: false,
    tags: ["vegetariano", "para-compartir", "sin-gluten", "ligero"],
    isSpecialty: false,
    isTopSeller: false
  },
  {
    id: "tuetanos-brasa",
    categoryId: "entradas",
    name: "Tuétanos a la Brasa (3 piezas)",
    portion: "Para compartir • 3 piezas",
    price: 175,
    badge: null,
    image: "/images/menu/tuetanos-brasa.png",
    description: "Canoas de tuétano asadas con sal de mar, acompañadas de chimichurri caliente y tortillas de maíz recién hechas para armar tacos.",
    requiresCookingPoint: false,
    hasSideOptions: false,
    tags: ["especialidad", "para-compartir", "picante", "sin-gluten"],
    isSpecialty: true,
    isTopSeller: false
  },

  // Categoría 3: Ahumados Low & Slow (Especialidad principal)
  {
    id: "st-louis-cut",
    categoryId: "ahumados",
    name: "Costillar St. Louis Cut (Full Rack)",
    portion: "Para compartir (2-3 pers.) • 750g",
    price: 385,
    badge: "🔥 Especialidad de la Casa",
    image: "/images/menu/costillas-st-louis.png",
    description: "Costillar entero cocinado a fuego indirecto con leña de encino durante 8 horas. Bañado con nuestro glaseado BBQ artesanal especiado. Se desprende del hueso solo con mirarlo. Incluye elote dulce tatemado y ensalada de col fresca.",
    requiresCookingPoint: false,
    hasSideOptions: true,
    tags: ["ahumado", "especialidad", "para-compartir", "sin-gluten"],
    isSpecialty: true,
    isTopSeller: true
  },
  {
    id: "brisket-tejano",
    categoryId: "ahumados",
    name: "Brisket Tejano Prime (350g)",
    portion: "Individual (350g)",
    price: 420,
    badge: "⭐ 12 Horas de Humo",
    image: "/images/menu/brisket-tejano-prime.png",
    description: "Corte de pecho de res calidad Prime con corteza crocante de pimienta negra martajada y sal kosher. Jugosidad absoluta y anillo de humo pronunciado. Servido con pepinillos encurtidos en casa y cebolla morada.",
    requiresCookingPoint: false,
    hasSideOptions: true,
    tags: ["ahumado", "especialidad", "sin-gluten", "para-compartir"],
    isSpecialty: true,
    isTopSeller: true
  },
  {
    id: "pulled-pork-sandwich",
    categoryId: "ahumados",
    name: "Pulled Pork Sandwich",
    portion: "Individual (280g)",
    price: 195,
    badge: "Top Ventas",
    image: "/images/menu/pulled-pork-sandwich.png",
    description: "Espaldilla de cerdo deshebrada a mano, marinada en vinagre de manzana y especias, coronada con ensalada coleslaw crujiente dentro de un pan brioche tostado con mantequilla.",
    requiresCookingPoint: false,
    hasSideOptions: true,
    tags: ["ahumado", "top-ventas"],
    isSpecialty: false,
    isTopSeller: true
  },

  // Categoría 4: Cortes a la Leña
  {
    id: "rib-eye-asador",
    categoryId: "cortes",
    name: "Rib Eye Asador (450g)",
    portion: "Individual / Para 2 (450g)",
    price: 495,
    badge: "Corte Estelar",
    image: "/images/menu/rib-eye-asador.png",
    description: "Corte grueso con marmoleo superior asado a las brasas vivas de mezquite, sellado con costra de sal de grano y mantequilla de romero y ajo. Servido con chiles toreados y cebollas cambray.",
    requiresCookingPoint: true,
    hasSideOptions: true,
    tags: ["especialidad", "sin-gluten", "para-compartir", "picante"],
    isSpecialty: true,
    isTopSeller: false
  },
  {
    id: "vacio-res",
    categoryId: "cortes",
    name: "Vacío de Res a la Parrilla (400g)",
    portion: "Individual / Para 2 (400g)",
    price: 390,
    badge: null,
    image: "/images/menu/vacio-res.png",
    description: "Jugoso y de textura firme, cocinado a punto con chimichurri rústico tatemado de la casa y papas al ajillo.",
    requiresCookingPoint: true,
    hasSideOptions: true,
    tags: ["sin-gluten", "para-compartir"],
    isSpecialty: false,
    isTopSeller: false
  },

  // Categoría 5: Hamburguesas Monster al Carbón
  {
    id: "la-brasa-burger",
    categoryId: "burgers",
    name: "La Brasa Smokehouse Burger",
    portion: "Individual (200g carne)",
    price: 220,
    badge: "🔥 La Favorita",
    image: "/images/menu/la-brasa-burger.png",
    description: "200g de mezcla artesanal de Rib Eye y Short Rib sellada al carbón, queso cheddar añejo gratinado, tocino ahumado grueso glaseado en maple, cebolla caramelizada al bourbon y aderezo especial en pan brioche.",
    requiresCookingPoint: true,
    hasSideOptions: true,
    tags: ["especialidad", "top-ventas", "ahumado"],
    isSpecialty: true,
    isTopSeller: true
  },
  {
    id: "black-truffle-burger",
    categoryId: "burgers",
    name: "Black Truffle Burger",
    portion: "Individual (200g carne)",
    price: 245,
    badge: null,
    image: "/images/menu/black-truffle-burger.png",
    description: "200g de carne de res al fuego, queso suizo emmental derretido, champiñones salteados al sartén de hierro y mayonesa infusionada con trufa negra y ajo confitado.",
    requiresCookingPoint: true,
    hasSideOptions: true,
    tags: ["especialidad", "gourmet"],
    isSpecialty: true,
    isTopSeller: false
  },

  // Categoría 6: Postres & Café
  {
    id: "skillet-cookie",
    categoryId: "postres",
    name: "Skillet Cookie de Chispas & Caramelo al Humo",
    portion: "Para compartir (2 pers.) • 250g",
    price: 135,
    badge: "Horneada al Momento",
    image: "/images/menu/skillet-cookie.png",
    description: "Galleta con chispas de chocolate horneada al instante en sartén de hierro colado, coronada con helado de vainilla de Papantla y reducción de caramelo con sutil toque ahumado.",
    requiresCookingPoint: false,
    hasSideOptions: false,
    tags: ["especialidad", "para-compartir", "vegetariano"],
    isSpecialty: true,
    isTopSeller: true
  },
  {
    id: "carajillo-smokehouse",
    categoryId: "postres",
    name: "Carajillo Flameado Smokehouse",
    portion: "Individual (200ml)",
    price: 140,
    badge: "Trago de Cierre",
    image: "/images/menu/carajillo-smokehouse.png",
    description: "Licor 43 flameado en mesa con café espresso recién extraído y canela ahumada en madera de encino.",
    requiresCookingPoint: false,
    hasSideOptions: false,
    tags: ["especialidad", "artesanal", "bebida"],
    isSpecialty: true,
    isTopSeller: false
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

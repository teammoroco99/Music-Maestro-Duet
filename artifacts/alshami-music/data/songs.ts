export interface Song {
  id: string;
  title: string;
  titleAr: string;
  youtubeId: string;
  difficulty: "easy" | "medium" | "hard";
  lyrics: LyricLine[];
  coverColor: string;
  year: number;
}

export interface LyricLine {
  id: string;
  text: string;
  words: string[];
}

export const SONGS: Song[] = [
  {
    id: "ya-leil",
    title: "Ya Leil W Yal Ein",
    titleAr: "يا ليل ويا عين",
    youtubeId: "b3unvqHR9m8",
    year: 2023,
    difficulty: "medium",
    coverColor: "#1A1AFF",
    lyrics: [
      {
        id: "l1",
        text: "يا ليل ويا عين",
        words: ["يا", "ليل", "ويا", "عين"],
      },
      {
        id: "l2",
        text: "يا غايب كيفك وين",
        words: ["يا", "غايب", "كيفك", "وين"],
      },
      {
        id: "l3",
        text: "نسيت الأهل والدين",
        words: ["نسيت", "الأهل", "والدين"],
      },
    ],
  },
  {
    id: "sabran",
    title: "Sabran",
    titleAr: "صبراً",
    youtubeId: "sjw3NZLMZFI",
    year: 2024,
    difficulty: "easy",
    coverColor: "#E91E8C",
    lyrics: [
      {
        id: "l1",
        text: "صبراً عليك صبراً",
        words: ["صبراً", "عليك", "صبراً"],
      },
      {
        id: "l2",
        text: "يا حياتي صبراً",
        words: ["يا", "حياتي", "صبراً"],
      },
      {
        id: "l3",
        text: "قلبي يعيش صبراً",
        words: ["قلبي", "يعيش", "صبراً"],
      },
    ],
  },
  {
    id: "dwali",
    title: "Dwali",
    titleAr: "دوالي",
    youtubeId: "5F3E4pyPV6c",
    year: 2024,
    difficulty: "hard",
    coverColor: "#6C3483",
    lyrics: [
      {
        id: "l1",
        text: "دوالي يا دوالي",
        words: ["دوالي", "يا", "دوالي"],
      },
      {
        id: "l2",
        text: "شو بتحسسني حالي",
        words: ["شو", "بتحسسني", "حالي"],
      },
      {
        id: "l3",
        text: "لما بنظر لعيناكي",
        words: ["لما", "بنظر", "لعيناكي"],
      },
    ],
  },
  {
    id: "wein",
    title: "Wein",
    titleAr: "وين",
    youtubeId: "TXioVRBD5hI",
    year: 2024,
    difficulty: "easy",
    coverColor: "#00B4D8",
    lyrics: [
      {
        id: "l1",
        text: "وين رايح وين",
        words: ["وين", "رايح", "وين"],
      },
      {
        id: "l2",
        text: "مش قادر أعيش من غيرك",
        words: ["مش", "قادر", "أعيش", "من", "غيرك"],
      },
      {
        id: "l3",
        text: "رجعلي يا حبيبي",
        words: ["رجعلي", "يا", "حبيبي"],
      },
    ],
  },
  {
    id: "doctor",
    title: "Doctor",
    titleAr: "دكتور",
    youtubeId: "rhOAyPKHWEo",
    year: 2025,
    difficulty: "medium",
    coverColor: "#E74C3C",
    lyrics: [
      {
        id: "l1",
        text: "دكتور دكتور",
        words: ["دكتور", "دكتور"],
      },
      {
        id: "l2",
        text: "قلبي مريض بيك",
        words: ["قلبي", "مريض", "بيك"],
      },
      {
        id: "l3",
        text: "ما في دواء غيرك",
        words: ["ما", "في", "دواء", "غيرك"],
      },
    ],
  },
  {
    id: "bethoon",
    title: "Bethoon",
    titleAr: "بتهون",
    youtubeId: "FSPLCPKn5yQ",
    year: 2025,
    difficulty: "easy",
    coverColor: "#43AA8B",
    lyrics: [
      {
        id: "l1",
        text: "بتهون بتهون",
        words: ["بتهون", "بتهون"],
      },
      {
        id: "l2",
        text: "بتهون علي كل شي",
        words: ["بتهون", "علي", "كل", "شي"],
      },
      {
        id: "l3",
        text: "بس أنت ما بتهون",
        words: ["بس", "أنت", "ما", "بتهون"],
      },
    ],
  },
  {
    id: "keefo",
    title: "Keefo",
    titleAr: "كيفو",
    youtubeId: "LsZFFUxW7Ig",
    year: 2025,
    difficulty: "medium",
    coverColor: "#F77F00",
    lyrics: [
      {
        id: "l1",
        text: "كيفو كيفو",
        words: ["كيفو", "كيفو"],
      },
      {
        id: "l2",
        text: "كيفو مع غيري",
        words: ["كيفو", "مع", "غيري"],
      },
      {
        id: "l3",
        text: "وأنا هون لحالي",
        words: ["وأنا", "هون", "لحالي"],
      },
    ],
  },
  {
    id: "shayel-zaneb",
    title: "Shayel Zaneb",
    titleAr: "شايل ذنب",
    youtubeId: "k7eFZOCpzgk",
    year: 2023,
    difficulty: "medium",
    coverColor: "#8338EC",
    lyrics: [
      {
        id: "l1",
        text: "شايل ذنب شايل ذنب",
        words: ["شايل", "ذنب", "شايل", "ذنب"],
      },
      {
        id: "l2",
        text: "إني حبيتك وما خبيتك",
        words: ["إني", "حبيتك", "وما", "خبيتك"],
      },
      {
        id: "l3",
        text: "شايل ذنب",
        words: ["شايل", "ذنب"],
      },
    ],
  },
  {
    id: "befdiki",
    title: "Befdiki",
    titleAr: "بفديكي",
    youtubeId: "QlrtjDm1nrU",
    year: 2023,
    difficulty: "easy",
    coverColor: "#FF6B6B",
    lyrics: [
      {
        id: "l1",
        text: "بفديكي بفديكي",
        words: ["بفديكي", "بفديكي"],
      },
      {
        id: "l2",
        text: "بفديكي يا عيوني",
        words: ["بفديكي", "يا", "عيوني"],
      },
      {
        id: "l3",
        text: "ما بتساوي فيكي",
        words: ["ما", "بتساوي", "فيكي"],
      },
    ],
  },
  {
    id: "sametek-sama",
    title: "Sametek Sama",
    titleAr: "سميتك سما",
    youtubeId: "b_vNTAM_aY8",
    year: 2023,
    difficulty: "hard",
    coverColor: "#1D3461",
    lyrics: [
      {
        id: "l1",
        text: "سميتك سما",
        words: ["سميتك", "سما"],
      },
      {
        id: "l2",
        text: "لأنك عالية ومش وصلني",
        words: ["لأنك", "عالية", "ومش", "وصلني"],
      },
      {
        id: "l3",
        text: "وبحبك من بعيد",
        words: ["وبحبك", "من", "بعيد"],
      },
    ],
  },
  {
    id: "qurban",
    title: "Qurban",
    titleAr: "قربان",
    youtubeId: "kC1kiYgvPYU",
    year: 2022,
    difficulty: "hard",
    coverColor: "#C0392B",
    lyrics: [
      {
        id: "l1",
        text: "قربان قربان بيك",
        words: ["قربان", "قربان", "بيك"],
      },
      {
        id: "l2",
        text: "وما بشيلك من بالي",
        words: ["وما", "بشيلك", "من", "بالي"],
      },
      {
        id: "l3",
        text: "يا حياتي ويا غالي",
        words: ["يا", "حياتي", "ويا", "غالي"],
      },
    ],
  },
  {
    id: "balaki",
    title: "Balaki",
    titleAr: "بلاكي",
    youtubeId: "GqUbr2RM-9k",
    year: 2022,
    difficulty: "medium",
    coverColor: "#117A65",
    lyrics: [
      {
        id: "l1",
        text: "بلاكي ما عندي غيرك",
        words: ["بلاكي", "ما", "عندي", "غيرك"],
      },
      {
        id: "l2",
        text: "بلاكي أنت حياتي",
        words: ["بلاكي", "أنت", "حياتي"],
      },
      {
        id: "l3",
        text: "وما بعيش من دونك",
        words: ["وما", "بعيش", "من", "دونك"],
      },
    ],
  },
  {
    id: "beredak",
    title: "Beredak",
    titleAr: "بريدك",
    youtubeId: "iTEW0uJs6Cs",
    year: 2022,
    difficulty: "easy",
    coverColor: "#2980B9",
    lyrics: [
      {
        id: "l1",
        text: "بريدك يا حياتي",
        words: ["بريدك", "يا", "حياتي"],
      },
      {
        id: "l2",
        text: "وما بعيش من غيرك",
        words: ["وما", "بعيش", "من", "غيرك"],
      },
      {
        id: "l3",
        text: "أنت اللي بالي",
        words: ["أنت", "اللي", "بالي"],
      },
    ],
  },
  {
    id: "leila",
    title: "Leila",
    titleAr: "ليلى",
    youtubeId: "TI9Nlu0JKGs",
    year: 2021,
    difficulty: "easy",
    coverColor: "#6C63FF",
    lyrics: [
      {
        id: "l1",
        text: "يا ليلى يا ليلى",
        words: ["يا", "ليلى", "يا", "ليلى"],
      },
      {
        id: "l2",
        text: "أنت حياتي وأملي",
        words: ["أنت", "حياتي", "وأملي"],
      },
      {
        id: "l3",
        text: "من غيرك ما بقدر",
        words: ["من", "غيرك", "ما", "بقدر"],
      },
    ],
  },
  {
    id: "ella",
    title: "Ella",
    titleAr: "إلا",
    youtubeId: "RLMCWjy5IUQ",
    year: 2021,
    difficulty: "medium",
    coverColor: "#884EA0",
    lyrics: [
      {
        id: "l1",
        text: "إلا أنت",
        words: ["إلا", "أنت"],
      },
      {
        id: "l2",
        text: "إلا حياتي وحبيبي",
        words: ["إلا", "حياتي", "وحبيبي"],
      },
      {
        id: "l3",
        text: "ما في شي إلا أنت",
        words: ["ما", "في", "شي", "إلا", "أنت"],
      },
    ],
  },
  {
    id: "yalli-dar",
    title: "Yalli Dar",
    titleAr: "يلي دار",
    youtubeId: "CxL9vmrRK3I",
    year: 2021,
    difficulty: "medium",
    coverColor: "#1E8BC3",
    lyrics: [
      {
        id: "l1",
        text: "يلي دار فيني",
        words: ["يلي", "دار", "فيني"],
      },
      {
        id: "l2",
        text: "شو بده مني",
        words: ["شو", "بده", "مني"],
      },
      {
        id: "l3",
        text: "وتركني لحالي",
        words: ["وتركني", "لحالي"],
      },
    ],
  },
  {
    id: "wayli",
    title: "Wayli",
    titleAr: "ويلي",
    youtubeId: "tPDCyqws4Ck",
    year: 2026,
    difficulty: "hard",
    coverColor: "#E67E22",
    lyrics: [
      {
        id: "l1",
        text: "ويلي منك ويلي",
        words: ["ويلي", "منك", "ويلي"],
      },
      {
        id: "l2",
        text: "أنت اللي خلي قلبي يحب",
        words: ["أنت", "اللي", "خلي", "قلبي", "يحب"],
      },
      {
        id: "l3",
        text: "وما بقدر أعيش من دونك",
        words: ["وما", "بقدر", "أعيش", "من", "دونك"],
      },
    ],
  },
];

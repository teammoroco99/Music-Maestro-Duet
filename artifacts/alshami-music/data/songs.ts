export interface Song {
  id: string;
  title: string;
  titleAr: string;
  youtubeId: string;
  difficulty: "easy" | "medium" | "hard";
  lyrics: LyricLine[];
  coverColor: string;
}

export interface LyricLine {
  id: string;
  text: string;
  words: string[];
}

export const SONGS: Song[] = [
  {
    id: "1",
    title: "Ana Mush Taybak",
    titleAr: "أنا مش طيبك",
    youtubeId: "Bv3kFlMoLkM",
    difficulty: "easy",
    coverColor: "#6C63FF",
    lyrics: [
      { id: "l1", text: "أنا مش طيبك", words: ["أنا", "مش", "طيبك"] },
      { id: "l2", text: "ولا بتجرحني بكلمة", words: ["ولا", "بتجرحني", "بكلمة"] },
      { id: "l3", text: "مين قالك إني زعلت", words: ["مين", "قالك", "إني", "زعلت"] },
    ],
  },
  {
    id: "2",
    title: "Wein Kint Rayeh",
    titleAr: "وين كنت رايح",
    youtubeId: "nCOoSe3Lv6U",
    difficulty: "medium",
    coverColor: "#E91E8C",
    lyrics: [
      { id: "l1", text: "وين كنت رايح", words: ["وين", "كنت", "رايح"] },
      { id: "l2", text: "ليه بعدتني عنك", words: ["ليه", "بعدتني", "عنك"] },
      { id: "l3", text: "ما كانتش في حياتي", words: ["ما", "كانتش", "في", "حياتي"] },
    ],
  },
  {
    id: "3",
    title: "Habib Galbi",
    titleAr: "حبيب قلبي",
    youtubeId: "p2YBBKR7tZk",
    difficulty: "easy",
    coverColor: "#FF6B6B",
    lyrics: [
      { id: "l1", text: "حبيب قلبي", words: ["حبيب", "قلبي"] },
      { id: "l2", text: "أنت اللي في بالي", words: ["أنت", "اللي", "في", "بالي"] },
      { id: "l3", text: "وبحبك كتير", words: ["وبحبك", "كتير"] },
    ],
  },
  {
    id: "4",
    title: "Mesh Aref",
    titleAr: "مش عارف",
    youtubeId: "K8Mn4J8TYWA",
    difficulty: "medium",
    coverColor: "#00B4D8",
    lyrics: [
      { id: "l1", text: "مش عارف شو بدي", words: ["مش", "عارف", "شو", "بدي"] },
      { id: "l2", text: "قلبي متعب مني", words: ["قلبي", "متعب", "مني"] },
      { id: "l3", text: "والوقت ماشي وأنا واقف", words: ["والوقت", "ماشي", "وأنا", "واقف"] },
    ],
  },
  {
    id: "5",
    title: "Ya Omri",
    titleAr: "يا عمري",
    youtubeId: "7Wy0M9CDQVI",
    difficulty: "hard",
    coverColor: "#F77F00",
    lyrics: [
      { id: "l1", text: "يا عمري يا حياتي", words: ["يا", "عمري", "يا", "حياتي"] },
      { id: "l2", text: "أنت اللي في خاطري", words: ["أنت", "اللي", "في", "خاطري"] },
      { id: "l3", text: "وفي قلبي مكانك ما بنساك", words: ["وفي", "قلبي", "مكانك", "ما", "بنساك"] },
    ],
  },
  {
    id: "6",
    title: "Law Ma Kont",
    titleAr: "لو ما كنت",
    youtubeId: "sAFYJOD4aFw",
    difficulty: "hard",
    coverColor: "#7209B7",
    lyrics: [
      { id: "l1", text: "لو ما كنت موجود في حياتي", words: ["لو", "ما", "كنت", "موجود", "في", "حياتي"] },
      { id: "l2", text: "كنت ضيعت كل شي", words: ["كنت", "ضيعت", "كل", "شي"] },
      { id: "l3", text: "أنت سبب وجودي", words: ["أنت", "سبب", "وجودي"] },
    ],
  },
  {
    id: "7",
    title: "Shou Baddak",
    titleAr: "شو بدك",
    youtubeId: "9V7oGZUuGW8",
    difficulty: "medium",
    coverColor: "#43AA8B",
    lyrics: [
      { id: "l1", text: "شو بدك مني تاني", words: ["شو", "بدك", "مني", "تاني"] },
      { id: "l2", text: "عطيتك كل اللي عندي", words: ["عطيتك", "كل", "اللي", "عندي"] },
      { id: "l3", text: "وما أبقى شي", words: ["وما", "أبقى", "شي"] },
    ],
  },
  {
    id: "8",
    title: "Nasini",
    titleAr: "ناسيني",
    youtubeId: "NZaFBivjqQ0",
    difficulty: "easy",
    coverColor: "#E63946",
    lyrics: [
      { id: "l1", text: "ناسيني وماشي", words: ["ناسيني", "وماشي"] },
      { id: "l2", text: "مش حاسس فيني", words: ["مش", "حاسس", "فيني"] },
      { id: "l3", text: "ولا طالبني بشي", words: ["ولا", "طالبني", "بشي"] },
    ],
  },
  {
    id: "9",
    title: "Sahran",
    titleAr: "سهران",
    youtubeId: "GvpyFgbXmHA",
    difficulty: "medium",
    coverColor: "#1D3461",
    lyrics: [
      { id: "l1", text: "سهران وبفكر فيك", words: ["سهران", "وبفكر", "فيك"] },
      { id: "l2", text: "والليل ما بخليني", words: ["والليل", "ما", "بخليني"] },
      { id: "l3", text: "نام من بعدك", words: ["نام", "من", "بعدك"] },
    ],
  },
  {
    id: "10",
    title: "Mrattak",
    titleAr: "مرتّك",
    youtubeId: "3GV0CKfj8qE",
    difficulty: "hard",
    coverColor: "#8338EC",
    lyrics: [
      { id: "l1", text: "مرتّك بتحبك", words: ["مرتّك", "بتحبك"] },
      { id: "l2", text: "وأنت مشغول بغيرها", words: ["وأنت", "مشغول", "بغيرها"] },
      { id: "l3", text: "الله يهديك يا إنسان", words: ["الله", "يهديك", "يا", "إنسان"] },
    ],
  },
];

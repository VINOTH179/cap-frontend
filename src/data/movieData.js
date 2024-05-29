export const MOVIES = [
  {
    id: 1,
    title: "Fighter (2024)",
    images: "https://upload.wikimedia.org/wikipedia/en/d/df/Fighter_film_teaser.jpg",
    price: 120,
    trailer: "https://youtu.be/973Ct2AC3EA?si=MBvnEVC6fOkw1ber"
  },
  {
    id: 2,
    title: "Hanu Man (2024)",
    images: "https://1847884116.rsc.cdn77.org/telugu/home/hanuman-130124-9.jpg",
    price: 120,
    trailer: "https://youtu.be/BUt-Ncdff50?si=5u2WA7_Nh3kJtuN5"
  },
  {
    id: 3,
    title: "Manjummel Boys (2024)",
    images: "https://dvvy6louqcr7j.cloudfront.net/vista/HO00015021/heroPoster/Manjummel-Boys-Malayalam.png",
    price: 120,
    trailer: "https://youtu.be/9Lc_Wp3ikCw?si=um-5giAijxXp-ZTV"
  },
  {
    id: 4,
    title: "Aavesham (2024)",
    images: "https://m.media-amazon.com/images/M/MV5BMzBkM2VjZTEtNDE5ZC00ZWI1LWIwOWQtYjMwZTBjZDcxNjRiXkEyXkFqcGdeQXVyMTUwMDg3OTQy._V1_.jpg",
    price: 120,
    trailer: "https://youtu.be/L0yEMl8PXnw?si=M0dKVYi4qeFjgJI8"
  },
  {
    id: 5,
    title: "Ayalaan (2024)",
    images: "https://pmvishwakarmayojana.in/wp-content/uploads/2024/01/239_11zon.jpg",
    price: 120,
    trailer: "https://youtu.be/kRhDvelx9uE?si=nBVddtMd7rjdFccD"
  },
  {
    id: 6,
    title: "Lal Salaam (2024)",
    images: "https://assets-in.bmscdn.com/iedb/movies/images/mobile/thumbnail/xlarge/lal-salaam-et00386331-1707216036.jpg",
    price: 120,
    trailer: "https://youtu.be/7tQPxLKsSgg?si=6cIoajvlZAiQ_H-p"
  },
];

export const THEATERS = [
  { id: 1, name: "Mayajaal Cinemas" },
  { id: 2, name: "PVR Cinemas (V R Chennai Mall)" },
  { id: 3, name: "Ags Cinemas (Vivira Mall)" },
];

// Sample screen data
export const SCREENS = [
  {
    id: 1,
    time: "10:00 AM",
    theaterId: 1,
    seats: Array(13).fill(1), // 13 seats available
  },
  {
    id: 2,
    time: "2:00 PM",
    theaterId: 1,
    seats: Array(14).fill(1), // 14 seats available
  },
  {
    id: 3,
    time: "6:00 PM",
    theaterId: 1,
    seats: Array(14).fill(1), // 14 seats available
  },
];

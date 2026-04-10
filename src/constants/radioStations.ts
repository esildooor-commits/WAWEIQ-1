export interface RadioStation {
  id: number;
  name: string;
  host: string;
  genre: string;
  coverUrl: string;
  bitrate: string;
  streamUrl: string;
  color: string;
  listeners: string;
  nowPlaying: string;
}

export const RADIO_STATIONS: RadioStation[] = [
  {
    id: 1,
    name: "Deep House Relax",
    host: "DJ Alex Vibe",
    genre: "Electronic",
    coverUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop&q=60",
    bitrate: "320 kbps HQ",
    streamUrl: "https://dummy-stream-1.com/live",
    color: "from-indigo-600 to-purple-700",
    listeners: "1.2k",
    nowPlaying: "Sunset Melodies - Kygo Style"
  },
  {
    id: 2,
    name: "Jazz Classics",
    host: "Sarah Jenkins",
    genre: "Jazz",
    coverUrl: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=800&auto=format&fit=crop&q=60",
    bitrate: "256 kbps",
    streamUrl: "https://dummy-stream-2.com/live",
    color: "from-amber-500 to-red-800",
    listeners: "850",
    nowPlaying: "Blue in Green - Miles Davis"
  },
  {
    id: 3,
    name: "Indie Rock Wave",
    host: "The Indie Hour",
    genre: "Rock",
    coverUrl: "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=800&auto=format&fit=crop&q=60",
    bitrate: "320 kbps HQ",
    streamUrl: "https://dummy-stream-3.com/live",
    color: "from-emerald-500 to-teal-700",
    listeners: "2.4k",
    nowPlaying: "Lost in Yesterday - Tame Impala"
  }
];

export const PODCASTS: RadioStation[] = [
  {
    id: 6,
    name: "Darknet Diaries",
    host: "Jack Rhysider",
    genre: "Tech / True Crime",
    coverUrl: "https://images.unsplash.com/photo-1589903308904-1010c2294adc?w=800&auto=format&fit=crop&q=60",
    bitrate: "128 kbps",
    streamUrl: "https://dummy-podcast-1.com/live",
    color: "from-purple-800 to-slate-900",
    listeners: "45k",
    nowPlaying: "Ep 133: The Hacker"
  },
  {
    id: 7,
    name: "The Daily",
    host: "Michael Barbaro",
    genre: "News",
    coverUrl: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&auto=format&fit=crop&q=60",
    bitrate: "128 kbps",
    streamUrl: "https://dummy-podcast-2.com/live",
    color: "from-blue-800 to-slate-900",
    listeners: "120k",
    nowPlaying: "The Future of AI"
  }
];

export const SPOTIFY: RadioStation[] = [
  {
    id: 9,
    name: "Daily Mix 1",
    host: "Spotify",
    genre: "Mixed",
    coverUrl: "https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?w=800&auto=format&fit=crop&q=60",
    bitrate: "320 kbps Ogg",
    streamUrl: "https://dummy-spotify-1.com/live",
    color: "from-[#1DB954] to-[#0a401c]",
    listeners: "Privat",
    nowPlaying: "Basierend auf deinem Geschmack"
  }
];

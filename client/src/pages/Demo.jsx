import { useState } from "react";
import { PostCard } from "../components/ui/posts";

const image = (id) => ({
  url: `https://picsum.photos/seed/${id}/800/1000`,
  mimeType: "image/jpeg",
  name: id,
});

const video = (id) => ({
  url: "https://www.w3schools.com/html/mov_bbb.mp4",
  mimeType: "video/mp4",
  name: id,
});

const longText = `
Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
Excepteur sint occaecat cupidatat non proident.
`;

const superLongTitle =
  "Ini adalah judul post yang sangat panjang untuk menguji bagaimana layout menangani teks yang overflow dan wrap dalam UI card component tanpa merusak struktur visual grid yang ada";

const initialPosts = [
  {
    id: "1",
    title: "Langit Berbintang",
    caption: "Melihat ufuk di atas langit berbintang.",
    postType: "PROJECT",
    isFeatured: true,
    createdAt: new Date(),
    author: { username: "gyess" },
    event: { id: "event-1", name: "Koloseum Festival" },
    media: [image("single")],
    poll: { options: [{}, {}, {}] },
    _count: { postLikes: 128, comments: 32 },
  },

  {
    id: "2",
    title: "Official Announcement",
    caption: "Registrasi dibuka minggu depan.",
    postType: "ANNOUNCEMENT",
    isFeatured: false,
    createdAt: new Date(),
    author: { username: "koloseum" },
    event: { id: "event-2", name: "Creative Summit" },
    media: [image("a"), image("b"), image("c"), image("d"), image("e")],
    _count: { postLikes: 54, comments: 8 },
  },

  {
    id: "3",
    title: "Reward Showcase",
    caption: "Seluruh pemenang diumumkan malam final.",
    postType: "REWARD",
    isFeatured: true,
    createdAt: new Date(),
    author: { username: "admin" },
    event: { id: "event-4", name: "Award Ceremony" },
    media: [image("q1"), image("q2"), image("q3"), image("q4")],
    poll: { options: [{}, {}] },
    _count: { postLikes: 892, comments: 120 },
  },

  // ================= TEXT ONLY =================
  {
    id: "4",
    title: "Text Only Post",
    caption: longText,
    postType: "ANNOUNCEMENT",
    isFeatured: false,
    createdAt: new Date(),
    author: { username: "textuser" },
    event: { id: "event-5", name: "Silent Event" },
    media: [],
    _count: { postLikes: 12, comments: 1 },
  },

  // ================= NO TYPE + LONG TITLE =================
  {
    id: "5",
    title: superLongTitle,
    caption: "Post ini tidak punya postType dan memiliki judul sangat panjang.",
    isFeatured: false,
    createdAt: new Date(),
    author: { username: "unknown" },
    event: { id: "event-6", name: "Mystery Event" },
    media: [image("unknown")],
    _count: { postLikes: 33, comments: 5 },
  },

  // ================= VIDEO =================
  {
    id: "6",
    title:
      "Video Highlight Event Malam Ini Dengan Durasi Panjang dan Deskripsi Tambahan Untuk Testing Layout",
    caption:
      "Video dokumentasi penuh dari acara utama yang berlangsung selama beberapa jam dan mencakup seluruh momen penting dari awal hingga akhir tanpa dipotong.",
    postType: "PROJECT",
    isFeatured: false,
    createdAt: new Date(),
    author: { username: "videomaker" },
    event: { id: "event-7", name: "Video Fest" },
    media: [video("vid-1")],
    _count: { postLikes: 210, comments: 44 },
  },

  // ================= MIX =================
  {
    id: "7",
    title:
      "Mixed Media Post dengan Penjelasan Panjang Mengenai Konsep Visual dan Implementasi Sistem Event Kolaboratif",
    caption: longText,
    postType: "PROJECT",
    isFeatured: false,
    createdAt: new Date(),
    author: { username: "mixmaster" },
    event: { id: "event-8", name: "Hybrid Event" },
    media: [image("m1"), video("m2"), image("m3")],
    _count: { postLikes: 88, comments: 11 },
  },

  // ================= NO POLL =================
  {
    id: "8",
    title: "No Poll Post",
    caption: "Post ini tidak punya poll sama sekali.",
    postType: "ANNOUNCEMENT",
    isFeatured: false,
    createdAt: new Date(),
    author: { username: "simple" },
    event: { id: "event-9", name: "Simple Event" },
    media: [image("simple")],
    _count: { postLikes: 5, comments: 0 },
  },
];

export default function Demo() {
  const [likedPosts, setLikedPosts] = useState(["1"]);

  const handleLike = (post) => {
    setLikedPosts((prev) =>
      prev.includes(post.id)
        ? prev.filter((id) => id !== post.id)
        : [...prev, post.id],
    );
  };

  const handleShare = async (post) => {
    console.log("share", post);
  };

  return (
    <div className="min-h-screen bg-stone-300 py-10 pr-10 pl-28">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10">
          <h1 className="text-5xl font-bold text-stone-900">
            Post Card Showcase
          </h1>
          <p className="mt-3 text-stone-600">
            Masonry-like responsive feed with variable content height.
          </p>
        </div>

        {/* USING MASONRY EFFECT */}
        <div className="columns-1 gap-8 md:columns-2 lg:columns-3">
          {initialPosts.map((post) => (
            <div key={post.id} className="mb-8 break-inside-avoid">
              <PostCard
                post={post}
                poll={post.poll}
                liked={likedPosts.includes(post.id)}
                onLike={handleLike}
                onShare={handleShare}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

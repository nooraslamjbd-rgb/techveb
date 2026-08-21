import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Jokes & Humor - Funny Jokes, Memes & Puns | TechVeb",
  description: "Enjoy the best collection of jokes, puns, and humor. Tech jokes, dad jokes, programming jokes, and more updated daily.",
  openGraph: {
    title: "Jokes & Humor - Funny Jokes, Memes & Puns | TechVeb",
    description: "Enjoy the best collection of jokes, puns, and humor.",
    url: "https://techveb.com/jokes",
  },
};

interface Joke {
  setup: string;
  punchline: string;
  category: string;
  rating: number;
  likes: number;
  author?: string;
}

const jokes: Joke[] = [
  // Tech/Programming Jokes
  { setup: "Why do programmers prefer dark mode?", punchline: "Because light attracts bugs! 🐛", category: "tech", rating: 4.5, likes: 28400 },
  { setup: "Why do Java developers wear glasses?", punchline: "Because they can't C#! 👓", category: "tech", rating: 4.3, likes: 24100 },
  { setup: "What's a programmer's favorite hangout place?", punchline: "Foo Bar! 🍺", category: "tech", rating: 4.2, likes: 19800 },
  { setup: "Why was the JavaScript developer sad?", punchline: "Because he didn't Node how to Express himself! 😢", category: "tech", rating: 4.4, likes: 26700 },
  { setup: "How many programmers does it take to change a light bulb?", punchline: "None — that's a hardware problem! 💡", category: "tech", rating: 4.1, likes: 22300 },
  { setup: "Why do programmers hate nature?", punchline: "It has too many bugs! 🌿", category: "tech", rating: 4.0, likes: 17600 },
  { setup: "What's a computer's least favorite food?", punchline: "Spam! 📧", category: "tech", rating: 3.9, likes: 15400 },
  { setup: "Why did the developer go broke?", punchline: "Because he used up all his cache! 💸", category: "tech", rating: 4.2, likes: 21200 },
  { setup: "What do you call a computer that sings?", punchline: "A-Dell! 🎵", category: "tech", rating: 3.8, likes: 14200 },
  { setup: "Why do Python programmers have low self-esteem?", punchline: "They're constantly comparing themselves to others with 'self'! 🐍", category: "tech", rating: 4.3, likes: 23800 },
  { setup: "A SQL query walks into a bar, sees two tables and asks...", punchline: "Can I join you? 🍻", category: "tech", rating: 4.5, likes: 27100 },
  { setup: "Why did the coder get fired?", punchline: "Because he didn't ENOUGH! 😂", category: "tech", rating: 4.0, likes: 18900 },
  
  // Dad Jokes
  { setup: "I'm afraid for the calendar.", punchline: "Its days are numbered! 📅", category: "dad", rating: 4.0, likes: 31200 },
  { setup: "What do you call a fake noodle?", punchline: "An impasta! 🍝", category: "dad", rating: 4.4, likes: 42800 },
  { setup: "Why don't scientists trust atoms?", punchline: "Because they make up everything! ⚛️", category: "dad", rating: 4.5, likes: 48300 },
  { setup: "I used to hate facial hair...", punchline: "But then it grew on me! 🧔", category: "dad", rating: 4.2, likes: 35600 },
  { setup: "What do you call a bear with no teeth?", punchline: "A gummy bear! 🐻", category: "dad", rating: 4.1, likes: 29400 },
  { setup: "Why don't eggs tell jokes?", punchline: "They'd crack each other up! 🥚", category: "dad", rating: 4.0, likes: 27800 },
  { setup: "I'm reading a book about anti-gravity.", punchline: "It's impossible to put down! 📚", category: "dad", rating: 4.3, likes: 33500 },
  { setup: "What did the ocean say to the beach?", punchline: "Nothing, it just waved! 🌊", category: "dad", rating: 3.9, likes: 25200 },
  { setup: "Why did the scarecrow win an award?", punchline: "He was outstanding in his field! 🌾", category: "dad", rating: 4.6, likes: 52100 },
  { setup: "What do you call a dog that does magic?", punchline: "A Labracadabrador! 🐕", category: "dad", rating: 4.2, likes: 30100 },
  { setup: "Why can't you give Elsa a balloon?", punchline: "Because she will let it go! 🎈", category: "dad", rating: 4.1, likes: 28600 },
  { setup: "I used to hate beard hair.", punchline: "But it grew on me! 🧔", category: "dad", rating: 3.8, likes: 22400 },
  
  // Science Jokes
  { setup: "Schrödinger's cat walks into a bar...", punchline: "And doesn't. 🐱", category: "science", rating: 4.7, likes: 38200 },
  { setup: "Helium walks into a bar.", punchline: "The bartender says 'We don't serve noble gases here.' Helium doesn't react. ⚗️", category: "science", rating: 4.5, likes: 34700 },
  { setup: "What's a physicist's favorite food?", punchline: "Fission chips! 🍟", category: "science", rating: 4.1, likes: 21300 },
  { setup: "Why can you never trust atoms?", punchline: "They make up literally everything! 🔬", category: "science", rating: 4.3, likes: 26800 },
  { setup: "Two atoms are walking down the street.", punchline: "One says, 'I think I lost an electron.' The other asks, 'Are you sure?' 'I'm positive!' ⚡", category: "science", rating: 4.6, likes: 36100 },
  { setup: "What did the biologist wear on a first date?", punchline: "Designer genes! 🧬", category: "science", rating: 4.0, likes: 19500 },
  { setup: "Why do chemists enjoy working with ammonia?", punchline: "Because it's pretty basic stuff! 🧪", category: "science", rating: 3.9, likes: 17200 },
  { setup: "A photon checks into a hotel.", punchline: "The bellhop asks, 'Need help with your luggage?' The photon replies, 'No thanks, I'm traveling light!' 💡", category: "science", rating: 4.4, likes: 29800 },
  
  // One Liners
  { setup: "I told my wife she was drawing her eyebrows too high.", punchline: "She looked surprised. 😮", category: "oneliner", rating: 4.2, likes: 32400 },
  { setup: "I have a lot of growing up to do.", punchline: "I realized that the other day inside my fort. 🏰", category: "oneliner", rating: 4.0, likes: 21700 },
  { setup: "I threw a boomerang years ago.", punchline: "I now live in constant fear. 😱", category: "oneliner", rating: 4.3, likes: 28900 },
  { setup: "My boss told me to have a good day.", punchline: "So I went home. 🏠", category: "oneliner", rating: 4.1, likes: 25600 },
  { setup: "The first rule of Fight Club is...", punchline: "You do not talk about Fight Club. 🤫", category: "oneliner", rating: 4.4, likes: 37200 },
  { setup: "I told my wife the truth.", punchline: "I told her I was seeing a surgeon. She said she was seeing a psychiatrist. 🏥", category: "oneliner", rating: 4.2, likes: 24300 },
  { setup: "What's the difference between a well-dressed man on a bike and a poorly-dressed man on a unicycle?", punchline: "Attire. 🚲", category: "oneliner", rating: 3.8, likes: 16800 },
  { setup: "My grandfather has the heart of a lion.", punchline: "And a lifetime ban from the zoo. 🦁", category: "oneliner", rating: 4.5, likes: 41200 },
  
  // Animal Jokes
  { setup: "What do you call an alligator in a vest?", punchline: "An investigator! 🐊", category: "animal", rating: 4.1, likes: 23600 },
  { setup: "What do you call a fish without eyes?", punchline: "A fsh! 🐟", category: "animal", rating: 3.9, likes: 18900 },
  { setup: "Why do seagulls fly over the sea?", punchline: "Because if they flew over the bay, they'd be baygulls! 🐦", category: "animal", rating: 4.0, likes: 20100 },
  { setup: "What do you call a sleeping bull?", punchline: "A bulldozer! 🐂", category: "animal", rating: 4.2, likes: 25800 },
  { setup: "Why don't oysters share their toys?", punchline: "Because they're shellfish! 🦪", category: "animal", rating: 4.1, likes: 22400 },
  { setup: "What do you call a deer with no eyes?", punchline: "No eye deer! 🦌", category: "animal", rating: 4.3, likes: 27600 },
  { setup: "What do you call a dog that does yoga?", punchline: "A pretzel! 🧘", category: "animal", rating: 4.0, likes: 19300 },
  { setup: "Why do cows have hooves instead of feet?", punchline: "Because they lactose! 🐄", category: "animal", rating: 4.2, likes: 24100 },
];

const categories = [
  { name: "Tech & Programming", icon: "💻", color: "#3B82F6", filter: "tech" },
  { name: "Dad Jokes", icon: "👔", color: "#10B981", filter: "dad" },
  { name: "Science", icon: "🔬", color: "#8B5CF6", filter: "science" },
  { name: "One Liners", icon: "⚡", color: "#F59E0B", filter: "oneliner" },
  { name: "Animal Jokes", icon: "🐾", color: "#EF4444", filter: "animal" },
];

const topJokes = [...jokes].sort((a, b) => b.likes - a.likes).slice(0, 5);

function formatLikes(n: number): string {
  if (n >= 1000) return (n / 1000).toFixed(1) + "K";
  return n.toString();
}

function RatingStars({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5 ? 1 : 0;
  return (
    <span className="text-xs text-yellow-500">
      {"★".repeat(full)}{"½".repeat(half)}{"☆".repeat(5 - full - half)}
      <span className="ml-1 text-muted-foreground">{rating}</span>
    </span>
  );
}

export default function JokesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Hero */}
      <div className="mb-12 text-center">
        <h1 className="mb-4 font-heading text-4xl font-bold text-foreground sm:text-5xl">
          😂 Jokes & Humor
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-muted">
          Daily dose of laughter — tech jokes, dad jokes, science humor, and more
        </p>
      </div>

      {/* Categories */}
      <div className="mb-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {categories.map((cat) => (
          <button
            key={cat.name}
            className="group rounded-xl border border-border bg-surface p-4 text-center transition-all hover:border-primary/30 hover:shadow-md"
          >
            <span className="mb-2 block text-2xl">{cat.icon}</span>
            <p className="text-sm font-semibold text-foreground">{cat.name}</p>
            <p className="text-xs text-muted-foreground">{jokes.filter((j) => j.category === cat.filter).length} jokes</p>
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Main Content */}
        <div className="flex-1">
          {/* Joke of the Day */}
          <div className="mb-10 rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 via-yellow-500/5 to-orange-500/5 p-6 sm:p-8">
            <div className="mb-4 flex items-center gap-2">
              <span className="rounded-full bg-yellow-500/10 px-3 py-1 text-xs font-semibold text-yellow-600">⭐ Joke of the Day</span>
            </div>
            <p className="mb-4 font-heading text-2xl font-bold text-foreground sm:text-3xl">{topJokes[0].setup}</p>
            <p className="mb-4 text-xl text-primary font-semibold">{topJokes[0].punchline}</p>
            <div className="flex items-center gap-4">
              <RatingStars rating={topJokes[0].rating} />
              <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-red-500 transition-colors">
                😂 {formatLikes(topJokes[0].likes)}
              </button>
              <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors">
                📋 Copy
              </button>
            </div>
          </div>

          {/* Random Joke Button */}
          <div className="mb-8 text-center">
            <button className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-primary-dark hover:shadow-lg hover:shadow-primary/20">
              🎲 Get Random Joke
            </button>
          </div>

          {/* Jokes by Category */}
          {categories.map((cat) => {
            const catJokes = jokes.filter((j) => j.category === cat.filter);
            return (
              <div key={cat.name} className="mb-10">
                <h2 className="mb-6 font-heading text-2xl font-bold text-foreground">
                  {cat.icon} {cat.name}
                </h2>
                <div className="space-y-4">
                  {catJokes.slice(0, 4).map((joke, idx) => (
                    <div key={idx} className="rounded-xl border border-border bg-surface p-5 transition-all hover:shadow-md">
                      <p className="mb-2 text-lg font-medium text-foreground">{joke.setup}</p>
                      <p className="mb-3 text-lg font-semibold text-primary">{joke.punchline}</p>
                      <div className="flex items-center gap-3">
                        <RatingStars rating={joke.rating} />
                        <span className="text-xs text-muted-foreground">😂 {formatLikes(joke.likes)}</span>
                        <button className="ml-auto text-xs text-muted-foreground hover:text-primary transition-colors">📋 Copy</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Sidebar */}
        <div className="w-full shrink-0 space-y-6 lg:w-72">
          {/* Top Jokes */}
          <div className="rounded-xl border border-border bg-surface p-5">
            <h3 className="mb-4 font-heading text-lg font-bold text-foreground">🔥 Top Jokes</h3>
            <div className="space-y-3">
              {topJokes.map((joke, idx) => (
                <div key={idx} className="group cursor-pointer rounded-lg p-2 transition-colors hover:bg-background">
                  <p className="text-sm font-medium text-foreground line-clamp-2">{joke.setup}</p>
                  <p className="mt-1 text-xs text-primary font-semibold">{joke.punchline}</p>
                  <p className="text-xs text-muted-foreground">😂 {formatLikes(joke.likes)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Joke Stats */}
          <div className="rounded-xl border border-border bg-surface p-5">
            <h3 className="mb-4 font-heading text-lg font-bold text-foreground">📊 Stats</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Jokes</span>
                <span className="font-semibold text-foreground">{jokes.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Categories</span>
                <span className="font-semibold text-foreground">{categories.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Laughs</span>
                <span className="font-semibold text-foreground">{formatLikes(jokes.reduce((acc, j) => acc + j.likes, 0))}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Avg Rating</span>
                <span className="font-semibold text-foreground">{(jokes.reduce((acc, j) => acc + j.rating, 0) / jokes.length).toFixed(1)} ⭐</span>
              </div>
            </div>
          </div>

          {/* Fun Fact */}
          <div className="rounded-xl border border-yellow-500/20 bg-gradient-to-br from-yellow-500/5 to-orange-500/5 p-5">
            <h3 className="mb-3 font-heading text-lg font-bold text-foreground">🤣 Fun Fact</h3>
            <p className="text-sm text-muted">Laughter releases endorphins, reduces stress hormones, and can burn up to 40 calories! So reading jokes here is technically exercise! 💪</p>
          </div>

          {/* Submit Joke */}
          <div className="rounded-xl border border-border bg-surface p-5">
            <h3 className="mb-3 font-heading text-lg font-bold text-foreground">💌 Submit a Joke</h3>
            <p className="mb-3 text-sm text-muted">Got a funny joke? Share it with the community!</p>
            <button className="w-full rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-primary-dark">
              Submit Joke →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quotes - Motivational, Funny & Daily Quotes | TechVeb",
  description: "Browse thousands of inspiring quotes from famous personalities. Motivational, funny, life, love, and wisdom quotes updated daily.",
  openGraph: {
    title: "Quotes - Motivational, Funny & Daily Quotes | TechVeb",
    description: "Browse thousands of inspiring quotes from famous personalities.",
    url: "https://techveb.com/quotes",
  },
};

interface Quote {
  text: string;
  author: string;
  category: string;
  likes: number;
}

const quotes: Quote[] = [
  // Motivational
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs", category: "motivation", likes: 45200 },
  { text: "Innovation distinguishes between a leader and a follower.", author: "Steve Jobs", category: "motivation", likes: 32100 },
  { text: "Your time is limited, don't waste it living someone else's life.", author: "Steve Jobs", category: "motivation", likes: 28900 },
  { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt", category: "motivation", likes: 41500 },
  { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius", category: "motivation", likes: 37800 },
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt", category: "motivation", likes: 33200 },
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill", category: "motivation", likes: 52300 },
  { text: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Chinese Proverb", category: "motivation", likes: 48100 },
  { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson", category: "motivation", likes: 22400 },
  { text: "Everything you've ever wanted is on the other side of fear.", author: "George Addair", category: "motivation", likes: 35600 },
  
  // Life
  { text: "In the end, it's not the years in your life that count. It's the life in your years.", author: "Abraham Lincoln", category: "life", likes: 39800 },
  { text: "Life is what happens when you're busy making other plans.", author: "John Lennon", category: "life", likes: 44200 },
  { text: "Get busy living or get busy dying.", author: "Stephen King", category: "life", likes: 31500 },
  { text: "You only live once, but if you do it right, once is enough.", author: "Mae West", category: "life", likes: 29700 },
  { text: "Life is really simple, but we insist on making it complicated.", author: "Confucius", category: "life", likes: 26300 },
  { text: "The purpose of our lives is to be happy.", author: "Dalai Lama", category: "life", likes: 42100 },
  { text: "Life is 10% what happens to us and 90% how we react to it.", author: "Charles R. Swindoll", category: "life", likes: 36900 },
  { text: "In three words I can sum up everything I've learned about life: it goes on.", author: "Robert Frost", category: "life", likes: 47500 },
  { text: "Life isn't about finding yourself. Life is about creating yourself.", author: "George Bernard Shaw", category: "life", likes: 33100 },
  { text: "The biggest adventure you can take is to live the life of your dreams.", author: "Oprah Winfrey", category: "life", likes: 28400 },
  
  // Love
  { text: "The best thing to hold onto in life is each other.", author: "Audrey Hepburn", category: "love", likes: 38700 },
  { text: "Love is not about how many days, months, or years you have been together. Love is about how much you love each other every single day.", author: "Unknown", category: "love", likes: 41200 },
  { text: "I have decided to stick with love. Hate is too great a burden to bear.", author: "Martin Luther King Jr.", category: "love", likes: 35400 },
  { text: "The greatest thing you'll ever learn is just to love and be loved in return.", author: "Eden Ahbez", category: "love", likes: 29800 },
  { text: "Love is composed of a single soul inhabiting two bodies.", author: "Aristotle", category: "love", likes: 27600 },
  { text: "We are most alive when we're in love.", author: "John Updike", category: "love", likes: 23100 },
  { text: "To love and be loved is to feel the sun from both sides.", author: "David Viscott", category: "love", likes: 31900 },
  { text: "Love doesn't just sit there, like a stone, it has to be made, like bread; remade all the time, made new.", author: "Ursula K. Le Guin", category: "love", likes: 25700 },
  
  // Wisdom
  { text: "The only true wisdom is in knowing you know nothing.", author: "Socrates", category: "wisdom", likes: 43800 },
  { text: "The unexamined life is not worth living.", author: "Socrates", category: "wisdom", likes: 36200 },
  { text: "Turn your wounds into wisdom.", author: "Oprah Winfrey", category: "wisdom", likes: 29400 },
  { text: "The wise man does at once what the fool does finally.", author: "Niccolo Machiavelli", category: "wisdom", likes: 19800 },
  { text: "Knowledge speaks, but wisdom listens.", author: "Jimi Hendrix", category: "wisdom", likes: 44500 },
  { text: "The fear of death follows from the fear of life. A man who lives fully is prepared to die at any time.", author: "Mark Twain", category: "wisdom", likes: 31200 },
  { text: "Yesterday I was clever, so I wanted to change the world. Today I am wise, so I am changing myself.", author: "Rumi", category: "wisdom", likes: 48900 },
  { text: "A wise man will create more opportunities than he finds.", author: "Francis Bacon", category: "wisdom", likes: 22100 },
  
  // Funny
  { text: "I'm not superstitious, but I am a little stitious.", author: "Michael Scott", category: "funny", likes: 52100 },
  { text: "Before you criticize someone, you should walk a mile in their shoes. That way, when you criticize them, you're a mile away and you have their shoes.", author: "Jack Handey", category: "funny", likes: 38400 },
  { text: "I always wanted to be somebody, but now I realize I should have been more specific.", author: "Lily Tomlin", category: "funny", likes: 29700 },
  { text: "The trouble with the world is that the stupid are cocksure and the intelligent are full of doubt.", author: "Bertrand Russell", category: "funny", likes: 35200 },
  { text: "I am so clever that sometimes I don't understand a single word of what I am saying.", author: "Oscar Wilde", category: "funny", likes: 41800 },
  { text: "A day without sunshine is like, you know, night.", author: "Steve Martin", category: "funny", likes: 22900 },
  { text: "I'm writing a book. I've got the page numbers done.", author: "Steven Wright", category: "funny", likes: 26300 },
  { text: "My therapist told me to write letters to people I hate and then burn them. I did, but now I don't know what to do with the letters.", author: "Norm Crosby", category: "funny", likes: 33500 },
  
  // Success
  { text: "Success is not the key to happiness. Happiness is the key to success.", author: "Albert Schweitzer", category: "success", likes: 37200 },
  { text: "Success usually comes to those who are too busy to be looking for it.", author: "Henry David Thoreau", category: "success", likes: 28600 },
  { text: "Don't be afraid to give up the good to go for the great.", author: "John D. Rockefeller", category: "success", likes: 24100 },
  { text: "I find that the harder I work, the more luck I seem to have.", author: "Thomas Jefferson", category: "success", likes: 31800 },
  { text: "Success is walking from failure to failure with no loss of enthusiasm.", author: "Winston Churchill", category: "success", likes: 39400 },
  { text: "The secret of success is to do the common thing uncommonly well.", author: "John D. Rockefeller Jr.", category: "success", likes: 21700 },
  { text: "Success is not in never falling, but in rising every time we fall.", author: "Nelson Mandela", category: "success", likes: 42800 },
  { text: "Success is getting what you want, happiness is wanting what you get.", author: "W.P. Kinsella", category: "success", likes: 27300 },
  
  // Technology
  { text: "Technology is nothing. What's important is that you have a faith in people.", author: "Steve Jobs", category: "technology", likes: 28400 },
  { text: "The advance of technology is based on making it fit in so that you don't really even notice it.", author: "Bill Gates", category: "technology", likes: 22100 },
  { text: "It's not that we use technology, we live technology.", author: "Godfrey Reggio", category: "technology", likes: 18900 },
  { text: "Any sufficiently advanced technology is indistinguishable from magic.", author: "Arthur C. Clarke", category: "technology", likes: 45600 },
  { text: "The real danger is not that computers will begin to think like men, but that men will begin to think like computers.", author: "Sydney Harris", category: "technology", likes: 33200 },
  { text: "We have paleolithic emotions, medieval institutions, and godlike technology.", author: "E.O. Wilson", category: "technology", likes: 21800 },
  { text: "Software is a great combination between artistry and engineering.", author: "Bill Gates", category: "technology", likes: 16400 },
  { text: "The Internet is the first thing that humanity has built that humanity doesn't understand.", author: "Eric Schmidt", category: "technology", likes: 24700 },
];

const categories = [
  { name: "Motivation", icon: "🔥", color: "#EF4444", filter: "motivation" },
  { name: "Life", icon: "🌱", color: "#10B981", filter: "life" },
  { name: "Love", icon: "❤️", color: "#EC4899", filter: "love" },
  { name: "Wisdom", icon: "🧠", color: "#8B5CF6", filter: "wisdom" },
  { name: "Funny", icon: "😂", color: "#F59E0B", filter: "funny" },
  { name: "Success", icon: "🏆", color: "#3B82F6", filter: "success" },
  { name: "Technology", icon: "💻", color: "#6366F1", filter: "technology" },
];

const dailyQuotes = quotes.slice(0, 5);
const trendingQuotes = [...quotes].sort((a, b) => b.likes - a.likes).slice(0, 6);

function formatLikes(n: number): string {
  if (n >= 1000) return (n / 1000).toFixed(1) + "K";
  return n.toString();
}

export default function QuotesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Hero */}
      <div className="mb-12 text-center">
        <h1 className="mb-4 font-heading text-4xl font-bold text-foreground sm:text-5xl">
          💬 Quotes Collection
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-muted">
          Browse inspiring quotes from the world&apos;s greatest minds — motivational, life, love, wisdom, and more
        </p>
      </div>

      {/* Categories */}
      <div className="mb-10 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
        {categories.map((cat) => (
          <button
            key={cat.name}
            className="group rounded-xl border border-border bg-surface p-4 text-center transition-all hover:border-primary/30 hover:shadow-md"
          >
            <span className="mb-2 block text-2xl">{cat.icon}</span>
            <p className="text-sm font-semibold text-foreground">{cat.name}</p>
            <p className="text-xs text-muted-foreground">{quotes.filter((q) => q.category === cat.filter).length} quotes</p>
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Main Content */}
        <div className="flex-1">
          {/* Quote of the Day */}
          <div className="mb-10 rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 via-blue-500/5 to-purple-500/5 p-6 sm:p-8">
            <div className="mb-4 flex items-center gap-2">
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">✨ Quote of the Day</span>
            </div>
            <blockquote className="mb-4 font-heading text-2xl font-bold leading-relaxed text-foreground sm:text-3xl">
              &ldquo;{quotes[0].text}&rdquo;
            </blockquote>
            <p className="text-lg text-primary">— {quotes[0].author}</p>
            <div className="mt-4 flex items-center gap-4">
              <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-red-500 transition-colors">
                ❤️ {formatLikes(quotes[0].likes)}
              </button>
              <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors">
                📋 Copy
              </button>
              <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors">
                📤 Share
              </button>
            </div>
          </div>

          {/* Daily Quotes */}
          <div className="mb-10">
            <h2 className="mb-6 font-heading text-2xl font-bold text-foreground">🌅 Daily Inspiration</h2>
            <div className="space-y-4">
              {dailyQuotes.map((quote, idx) => (
                <div key={idx} className="rounded-xl border border-border bg-surface p-5 transition-all hover:shadow-md">
                  <blockquote className="mb-2 text-lg font-medium text-foreground">&ldquo;{quote.text}&rdquo;</blockquote>
                  <p className="text-sm text-primary">— {quote.author}</p>
                  <div className="mt-3 flex items-center gap-3">
                    <span className="rounded-full bg-surface px-2.5 py-0.5 text-xs text-muted-foreground border border-border">
                      {categories.find((c) => c.filter === quote.category)?.icon} {quote.category}
                    </span>
                    <span className="text-xs text-muted-foreground">❤️ {formatLikes(quote.likes)}</span>
                    <button className="ml-auto text-xs text-muted-foreground hover:text-primary transition-colors">📋 Copy</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* All Quotes by Category */}
          {categories.map((cat) => {
            const catQuotes = quotes.filter((q) => q.category === cat.filter);
            return (
              <div key={cat.name} className="mb-10">
                <h2 className="mb-6 font-heading text-2xl font-bold text-foreground">
                  {cat.icon} {cat.name} Quotes
                </h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {catQuotes.slice(0, 4).map((quote, idx) => (
                    <div key={idx} className="rounded-xl border border-border bg-surface p-5 transition-all hover:shadow-md">
                      <blockquote className="mb-2 text-base font-medium text-foreground">&ldquo;{quote.text}&rdquo;</blockquote>
                      <p className="text-sm text-primary">— {quote.author}</p>
                      <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                        <span>❤️ {formatLikes(quote.likes)}</span>
                        <button className="hover:text-primary transition-colors">📋 Copy</button>
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
          {/* Trending */}
          <div className="rounded-xl border border-border bg-surface p-5">
            <h3 className="mb-4 font-heading text-lg font-bold text-foreground">🔥 Trending Quotes</h3>
            <div className="space-y-3">
              {trendingQuotes.map((quote, idx) => (
                <div key={idx} className="group cursor-pointer rounded-lg p-2 transition-colors hover:bg-background">
                  <p className="text-sm font-medium text-foreground line-clamp-2">&ldquo;{quote.text}&rdquo;</p>
                  <p className="mt-1 text-xs text-primary">{quote.author}</p>
                  <p className="text-xs text-muted-foreground">❤️ {formatLikes(quote.likes)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Random Quote */}
          <div className="rounded-xl border border-purple-500/20 bg-gradient-to-br from-purple-500/5 to-pink-500/5 p-5">
            <h3 className="mb-3 font-heading text-lg font-bold text-foreground">🎲 Random Quote</h3>
            <blockquote className="mb-2 text-sm font-medium text-foreground">&ldquo;The purpose of our lives is to be happy.&rdquo;</blockquote>
            <p className="text-xs text-primary">— Dalai Lama</p>
            <button className="mt-3 w-full rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-primary-dark">
              🔄 Get New Quote
            </button>
          </div>

          {/* Top Authors */}
          <div className="rounded-xl border border-border bg-surface p-5">
            <h3 className="mb-4 font-heading text-lg font-bold text-foreground">🏆 Top Authors</h3>
            <div className="space-y-2">
              {["Steve Jobs", "Confucius", "Winston Churchill", "Oprah Winfrey", "Mark Twain", "Rumi"].map((author) => (
                <div key={author} className="flex items-center justify-between rounded-lg p-2 transition-colors hover:bg-background cursor-pointer">
                  <span className="text-sm font-medium text-foreground">{author}</span>
                  <span className="text-xs text-muted-foreground">{quotes.filter((q) => q.author === author).length} quotes</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quote Stats */}
          <div className="rounded-xl border border-border bg-surface p-5">
            <h3 className="mb-4 font-heading text-lg font-bold text-foreground">📊 Stats</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Quotes</span>
                <span className="font-semibold text-foreground">{quotes.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Categories</span>
                <span className="font-semibold text-foreground">{categories.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Likes</span>
                <span className="font-semibold text-foreground">{formatLikes(quotes.reduce((acc, q) => acc + q.likes, 0))}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

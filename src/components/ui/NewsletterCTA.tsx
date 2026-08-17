"use client";

export default function NewsletterCTA() {
  return (
    <section className="my-16 rounded-2xl bg-gradient-to-br from-primary to-primary-dark p-8 sm:p-12 text-center text-white">
      <h2 className="mb-3 font-heading text-2xl sm:text-3xl font-bold">
        Stay Ahead of the Curve
      </h2>
      <p className="mb-6 mx-auto max-w-md text-white/80">
        Get the latest tech insights, AI trends, and product reviews delivered
        straight to your inbox. No spam, just quality content.
      </p>
      <form
        onSubmit={(e) => e.preventDefault()}
        className="mx-auto flex max-w-md flex-col gap-3 sm:flex-row"
      >
        <input
          type="email"
          placeholder="Enter your email"
          className="flex-1 rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white/50"
        />
        <button
          type="submit"
          className="rounded-xl bg-white px-6 py-3 font-semibold text-primary transition-colors hover:bg-white/90"
        >
          Subscribe
        </button>
      </form>
    </section>
  );
}

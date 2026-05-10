const faqs = [
  {
    question: "Will KiraPass charge me automatically?",
    answer: "No. You review the pass first, then explicitly continue to KIRAPAY checkout."
  },
  {
    question: "When is the QR ticket issued?",
    answer: "Only after KIRAPAY confirms payment through the webhook."
  },
  {
    question: "Can a ticket be reused?",
    answer: "No. The organizer verification screen marks checked-in passes as used."
  },
  {
    question: "Are add-ons required?",
    answer: "No. They are optional demo extras and the server computes the final total."
  }
];

export function FAQSection() {
  return (
    <section className="relative z-10 mx-auto max-w-7xl px-5 py-20 sm:px-8">
      <div className="mb-8 max-w-2xl">
        <p className="text-sm font-black uppercase tracking-[0.24em] text-[#14f195]">FAQ</p>
        <h2 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">What attendees need to know.</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {faqs.map((faq) => (
          <article key={faq.question} className="rounded-2xl border border-white/10 bg-white/[0.055] p-6 backdrop-blur">
            <h3 className="text-lg font-black">{faq.question}</h3>
            <p className="mt-3 text-sm leading-6 text-white/62">{faq.answer}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

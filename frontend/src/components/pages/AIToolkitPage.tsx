"use client";

export default function AIToolkitPage() {
  const tools = [
    {
      title: "Question Generator",
      description: "Generate diverse questions from your curriculum",
      icon: "✨",
    },
    {
      title: "Paper Creator",
      description: "Create structured question papers automatically",
      icon: "📄",
    },
    {
      title: "Answer Evaluator",
      description: "AI-powered answer evaluation and grading",
      icon: "✅",
    },
    {
      title: "Student Analytics",
      description: "Detailed performance insights for each student",
      icon: "📊",
    },
  ];

  return (
    <section className="flex flex-1 flex-col">
      <div className="mb-8">
        <p className="text-sm font-bold uppercase tracking-wide text-[#999]">Tools</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tighter text-[#2e3033]">
          AI Teacher's Toolkit
        </h1>
        <p className="mt-2 text-lg text-[#666]">Powerful AI tools to enhance your teaching</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {tools.map((tool) => (
          <div key={tool.title} className="rounded-2xl border border-[#e8e8e8] p-6 transition hover:border-[#ff8a1f] hover:shadow-lg">
            <div className="text-4xl">{tool.icon}</div>
            <h3 className="mt-4 text-xl font-bold text-[#2e3033]">{tool.title}</h3>
            <p className="mt-2 text-[#999]">{tool.description}</p>
            <button className="mt-4 inline-flex h-10 items-center justify-center rounded-full bg-[#1a1a1a] px-4 text-sm font-semibold text-white transition hover:bg-[#333]">
              Try Now
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

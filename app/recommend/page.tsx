import Link from "next/link";
import { moodData, Mood } from "@/lib/beerData";
import { notFound } from "next/navigation";

export default async function RecommendPage({
  searchParams,
}: {
  searchParams: Promise<{ mood?: string }>;
}) {
  const { mood } = await searchParams;

  if (!mood || !(mood in moodData)) {
    notFound();
  }

  const moodKey = mood as Mood;
  const data = moodData[moodKey];

  const bgGradients: Record<Mood, string> = {
    happy: "from-yellow-400 to-orange-400",
    relaxed: "from-green-400 to-teal-400",
    adventurous: "from-red-500 to-orange-500",
    tired: "from-indigo-500 to-purple-500",
    excited: "from-pink-400 to-rose-500",
  };

  return (
    <main className="flex-1 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Back */}
        <Link
          href="/mood"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6 transition-colors"
        >
          ← 気分を選び直す
        </Link>

        {/* Mood Header */}
        <div
          className={`bg-gradient-to-r ${bgGradients[moodKey]} rounded-2xl p-6 text-white mb-6 shadow-lg`}
        >
          <div className="flex items-center gap-3 mb-2">
            <span className="text-4xl">{data.emoji}</span>
            <div>
              <p className="text-sm font-medium opacity-80">今の気分</p>
              <h1 className="text-2xl font-bold">{data.label}</h1>
            </div>
          </div>
          <p className="text-sm opacity-80">{data.description}</p>
        </div>

        {/* Recommendation Title */}
        <h2 className="text-lg font-bold text-gray-700 mb-4">
          🍺 あなたにおすすめのクラフトビール
        </h2>

        {/* Beer Cards */}
        <div className="space-y-5">
          {data.beers.map((beer) => (
            <div
              key={beer.id}
              className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100"
            >
              <div className="flex">
                {/* Beer Image Area */}
                <div className="w-28 flex-shrink-0 bg-amber-50 flex items-center justify-center text-5xl border-r border-gray-100">
                  {beer.imageEmoji}
                </div>

                {/* Beer Info */}
                <div className="flex-1 p-5">
                  <div className="flex items-start justify-between mb-1">
                    <div>
                      <p className="text-xs font-medium text-amber-600 uppercase tracking-wide">
                        {beer.style}
                      </p>
                      <h3 className="text-lg font-bold text-gray-800">
                        {beer.name} {beer.emoji}
                      </h3>
                      <p className="text-xs text-gray-400">{beer.brewery}</p>
                    </div>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full font-mono">
                      ABV {beer.abv}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 leading-relaxed mt-2 mb-4">
                    {beer.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-gray-800">
                      ¥{beer.price.toLocaleString()}
                      <span className="text-sm font-normal text-gray-400">
                        /本
                      </span>
                    </span>
                    <Link
                      href={`/shop/${beer.id}`}
                      className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold rounded-lg transition-colors shadow-sm"
                    >
                      購入する →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer CTA */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-400 mb-2">
            気分が変わったら他のビールも見てみましょう
          </p>
          <Link
            href="/mood"
            className="inline-block px-6 py-2.5 border-2 border-amber-400 text-amber-600 hover:bg-amber-50 rounded-lg font-medium transition-colors"
          >
            別の気分で探す
          </Link>
        </div>
      </div>
    </main>
  );
}

import Link from "next/link";
import { moodData, moods } from "@/lib/beerData";
import { notFound } from "next/navigation";
import type { Beer } from "@/lib/beerData";
import PurchaseBox from "./PurchaseBox";

function findBeer(beerId: string): { beer: Beer; moodKey: string } | null {
  for (const mood of moods) {
    const found = moodData[mood].beers.find((b) => b.id === beerId);
    if (found) return { beer: found, moodKey: mood };
  }
  return null;
}

export default async function ShopPage({
  params,
}: {
  params: Promise<{ beerId: string }>;
}) {
  const { beerId } = await params;
  const result = findBeer(beerId);

  if (!result) {
    notFound();
  }

  const { beer } = result;

  return (
    <main className="flex-1 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Navigation */}
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
          <Link href="/" className="hover:text-gray-600 transition-colors">ホーム</Link>
          <span>/</span>
          <Link href="/mood" className="hover:text-gray-600 transition-colors">気分選択</Link>
          <span>/</span>
          <span className="text-gray-600">{beer.name}</span>
        </div>

        {/* Shop Header */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-6 border border-gray-100">
          <div className="flex gap-6">
            <div className="w-32 h-40 flex-shrink-0 bg-amber-50 rounded-xl flex items-center justify-center text-6xl border border-amber-100">
              🍺
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                  クラフトビール
                </span>
                <span className="text-xs text-gray-400">{beer.style}</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-800 mb-1">
                {beer.name} {beer.emoji}
              </h1>
              <p className="text-sm text-gray-400 mb-3">{beer.brewery}</p>
              <div className="flex items-center gap-1 mb-3">
                {"⭐".repeat(5)}
                <span className="text-sm text-gray-400 ml-1">(124件)</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-gray-800">
                  ¥{beer.price.toLocaleString()}
                </span>
                <span className="text-gray-400 text-sm">税込 / 1本</span>
              </div>
              <p className="text-xs text-green-600 mt-1">✓ 在庫あり・即日発送</p>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6 border border-gray-100">
          <h2 className="font-bold text-gray-700 mb-3">商品説明</h2>
          <p className="text-gray-600 text-sm leading-relaxed mb-4">{beer.description}</p>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-gray-400 text-xs mb-1">スタイル</p>
              <p className="font-medium text-gray-700">{beer.style}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-gray-400 text-xs mb-1">アルコール度数</p>
              <p className="font-medium text-gray-700">{beer.abv}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-gray-400 text-xs mb-1">醸造所</p>
              <p className="font-medium text-gray-700">{beer.brewery}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-gray-400 text-xs mb-1">容量</p>
              <p className="font-medium text-gray-700">330ml</p>
            </div>
          </div>
        </div>

        {/* Purchase Box (client component) */}
        <PurchaseBox beer={beer} />

        <div className="mt-6 text-center">
          <Link href="/mood" className="text-sm text-gray-400 hover:text-gray-600 transition-colors">
            ← 他のビールも見る
          </Link>
        </div>
      </div>
    </main>
  );
}

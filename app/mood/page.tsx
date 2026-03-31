import Link from "next/link";
import { moodData, moods } from "@/lib/beerData";

export default function MoodPage() {
  return (
    <main className="flex-1 flex items-center justify-center p-6">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🍺</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            今日の気分はどうですか？
          </h1>
          <p className="text-gray-500 text-sm">
            気分を選ぶと、ぴったりのクラフトビールをご提案します
          </p>
        </div>

        {/* Mood Cards */}
        <div className="space-y-3">
          {moods.map((mood) => {
            const data = moodData[mood];
            const colorClasses: Record<string, string> = {
              happy:
                "bg-yellow-50 border-yellow-300 hover:bg-yellow-100 hover:border-yellow-400",
              relaxed:
                "bg-green-50 border-green-300 hover:bg-green-100 hover:border-green-400",
              adventurous:
                "bg-red-50 border-red-300 hover:bg-red-100 hover:border-red-400",
              tired:
                "bg-indigo-50 border-indigo-300 hover:bg-indigo-100 hover:border-indigo-400",
              excited:
                "bg-pink-50 border-pink-300 hover:bg-pink-100 hover:border-pink-400",
            };
            const textClasses: Record<string, string> = {
              happy: "text-yellow-700",
              relaxed: "text-green-700",
              adventurous: "text-red-700",
              tired: "text-indigo-700",
              excited: "text-pink-700",
            };

            return (
              <Link
                key={mood}
                href={`/recommend?mood=${mood}`}
                className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all cursor-pointer ${colorClasses[mood]}`}
              >
                <span className="text-3xl">{data.emoji}</span>
                <div>
                  <p
                    className={`font-bold text-lg ${textClasses[mood]}`}
                  >
                    {data.label}
                  </p>
                  <p className="text-gray-500 text-sm">{data.description}</p>
                </div>
                <span className="ml-auto text-gray-400 text-lg">→</span>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}

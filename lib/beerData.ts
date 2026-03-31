export type Mood = "happy" | "relaxed" | "adventurous" | "tired" | "excited";

export interface Beer {
  id: string;
  name: string;
  style: string;
  brewery: string;
  description: string;
  abv: string;
  emoji: string;
  color: string;
  price: number;
  imageEmoji: string;
}

export interface MoodData {
  label: string;
  emoji: string;
  description: string;
  color: string;
  bgColor: string;
  beers: Beer[];
}

export const moodData: Record<Mood, MoodData> = {
  happy: {
    label: "楽しい",
    emoji: "😄",
    description: "今日は最高の気分！",
    color: "text-yellow-700",
    bgColor: "bg-yellow-50 border-yellow-300",
    beers: [
      {
        id: "yuzu-ipa",
        name: "柚子フルーティーIPA",
        style: "Fruity IPA",
        brewery: "クラフトビール醸造所 東京",
        description:
          "国産柚子の爽やかな香りが広がるフルーティーなIPA。ホップの苦みと柑橘の甘みが絶妙なバランスで、楽しい気分をさらに盛り上げます。",
        abv: "6.5%",
        emoji: "🍋",
        color: "amber",
        price: 680,
        imageEmoji: "🍺",
      },
      {
        id: "mango-wheat",
        name: "マンゴーウィートエール",
        style: "Wheat Ale",
        brewery: "サニーブリュワリー 大阪",
        description:
          "完熟マンゴーを贅沢に使用したトロピカルなウィートエール。フルーティーで飲みやすく、パーティーシーンに最適です。",
        abv: "5.2%",
        emoji: "🥭",
        color: "orange",
        price: 620,
        imageEmoji: "🍺",
      },
    ],
  },
  relaxed: {
    label: "リラックス",
    emoji: "😌",
    description: "ゆったりとした時間を楽しもう",
    color: "text-green-700",
    bgColor: "bg-green-50 border-green-300",
    beers: [
      {
        id: "session-lager",
        name: "セッションラガー",
        style: "Session Lager",
        brewery: "やすらぎブリュワリー 京都",
        description:
          "低アルコールでゴクゴク飲める至福のラガー。穏やかなホップとすっきりした後味で、リラックスタイムにぴったり。",
        abv: "3.8%",
        emoji: "🌿",
        color: "green",
        price: 550,
        imageEmoji: "🍺",
      },
      {
        id: "cream-ale",
        name: "クリームエール",
        style: "Cream Ale",
        brewery: "まろやかブリュワリー 北海道",
        description:
          "なめらかでクリーミーな口当たりが特徴。麦の甘みとほのかなバニラ香が心を和ませる、休日に最適な一杯。",
        abv: "4.5%",
        emoji: "☁️",
        color: "yellow",
        price: 600,
        imageEmoji: "🍺",
      },
    ],
  },
  adventurous: {
    label: "冒険したい",
    emoji: "🔥",
    description: "新しいことに挑戦したい気分",
    color: "text-red-700",
    bgColor: "bg-red-50 border-red-300",
    beers: [
      {
        id: "imperial-stout",
        name: "インペリアルスタウト",
        style: "Imperial Stout",
        brewery: "ダークホースブリュワリー 東京",
        description:
          "チョコレートとコーヒーの深い風味が特徴の高アルコールスタウト。複雑で奥深い味わいはビール冒険者向け。",
        abv: "10.2%",
        emoji: "⚡",
        color: "gray",
        price: 850,
        imageEmoji: "🍺",
      },
      {
        id: "sour-ale",
        name: "ベルジャンサワーエール",
        style: "Sour Ale",
        brewery: "アシッドブリュワリー 横浜",
        description:
          "自然発酵による独特の酸味と複雑なフルーティーな風味。個性的な味わいに挑戦したい方に。",
        abv: "5.8%",
        emoji: "🍇",
        color: "purple",
        price: 780,
        imageEmoji: "🍺",
      },
    ],
  },
  tired: {
    label: "疲れた",
    emoji: "😴",
    description: "今日も一日お疲れ様",
    color: "text-indigo-700",
    bgColor: "bg-indigo-50 border-indigo-300",
    beers: [
      {
        id: "milk-stout",
        name: "ミルクスタウト",
        style: "Milk Stout",
        brewery: "やすらぎブリュワリー 仙台",
        description:
          "乳糖の甘みとロースト麦の香ばしさが疲れた心を癒す。チョコレートケーキのような風味でゆっくり楽しめる一杯。",
        abv: "5.0%",
        emoji: "🌙",
        color: "dark",
        price: 650,
        imageEmoji: "🍺",
      },
      {
        id: "dark-porter",
        name: "ダークポーター",
        style: "Porter",
        brewery: "ナイトキャップブリュワリー 名古屋",
        description:
          "深みのあるローストモルトが疲れを癒す。カラメルとコーヒーのニュアンスが口いっぱいに広がる癒しの一杯。",
        abv: "5.5%",
        emoji: "☕",
        color: "brown",
        price: 620,
        imageEmoji: "🍺",
      },
    ],
  },
  excited: {
    label: "ワクワク",
    emoji: "🤩",
    description: "テンション上がってる！",
    color: "text-pink-700",
    bgColor: "bg-pink-50 border-pink-300",
    beers: [
      {
        id: "hefeweizen",
        name: "ヘーフェヴァイツェン",
        style: "Hefeweizen",
        brewery: "フェスティバルブリュワリー 福岡",
        description:
          "バナナとクローブの華やかな香りが特徴のドイツ伝統スタイル。お祭り気分にぴったりの弾けるような一杯。",
        abv: "5.3%",
        emoji: "🎉",
        color: "yellow",
        price: 640,
        imageEmoji: "🍺",
      },
      {
        id: "pale-ale",
        name: "アメリカンペールエール",
        style: "Pale Ale",
        brewery: "ハイエナジーブリュワリー 渋谷",
        description:
          "シトラス系ホップが弾けるエネルギッシュなペールエール。フレッシュでジューシーな風味がハイな気分をさらに高めます。",
        abv: "5.8%",
        emoji: "🎊",
        color: "amber",
        price: 660,
        imageEmoji: "🍺",
      },
    ],
  },
};

export const moods: Mood[] = [
  "happy",
  "relaxed",
  "adventurous",
  "tired",
  "excited",
];

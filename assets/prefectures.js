/* 対応府県の設定
   軽快さを保つため、選ばれた府県のデータファイルだけを動的に読み込みます。
   （3府県ぶんを毎回まとめて読み込むことはしません） */

const PREFECTURES = [
  {
    id: "osaka",
    label: "大阪府",
    shortLabel: "大阪",
    stationCount: 66,
    stationsUrl: "assets/pref/osaka-stations.js",
    jurisdictionUrl: "assets/pref/osaka-jurisdiction.js",
    source: "大阪府警本部公式サイト、および大阪府条例「大阪府警察署の名称、位置及び管轄区域に関する条例」",
    examples: [
      "大阪市中央区南船場3-1-1",
      "堺市西区鳳東町4-388",
      "東大阪市稲葉1丁目7-1",
      "豊中市服部本町3丁目"
    ]
  },
  {
    id: "kyoto",
    label: "京都府",
    shortLabel: "京都",
    stationCount: 24,
    stationsUrl: "assets/pref/kyoto-stations.js",
    jurisdictionUrl: "assets/pref/kyoto-jurisdiction.js",
    source: "京都府警察公式サイト「警察本部・警察署・交番等所在地」",
    examples: [
      "京都市中京区壬生坊城町48-16",
      "宇治市宇治宇文字2-12",
      "向日市上植野町上川原5",
      "京丹後市峰山町長岡469-1"
    ]
  },
  {
    id: "hyogo",
    label: "兵庫県",
    shortLabel: "兵庫",
    stationCount: 46,
    stationsUrl: "assets/pref/hyogo-stations.js",
    jurisdictionUrl: "assets/pref/hyogo-jurisdiction.js",
    source: "兵庫県警察公式サイト「警察署名称・位置及び管轄区域」「警察署の管轄区域」",
    examples: [
      "神戸市中央区旭通3丁目",
      "西宮市甲子園口4丁目1-1",
      "姫路市飾磨区中島1130-9",
      "尼崎市南塚口町3丁目1-1"
    ]
  }
];

function getPrefById(id){
  return PREFECTURES.find(p => p.id === id) || PREFECTURES[0];
}

// 読み込み済みの府県データをキャッシュしておき、タブを切り替えるたびに
// グローバル変数（STATIONS / JURISDICTION_RULES）へ明示的に反映し直す。
// こうすることで「表示は大阪なのに、中身のデータは前に見ていた兵庫のまま」
// といった、表示と実データのズレを防ぐ。
const _prefDataCache = {};
let _prefLoadToken = 0;

function loadScript(src){
  return new Promise((resolve, reject) => {
    const el = document.createElement('script');
    el.src = src;
    el.onload = () => resolve();
    el.onerror = () => reject(new Error('読み込み失敗: ' + src));
    document.body.appendChild(el);
  });
}

async function loadPrefData(prefId){
  const myToken = ++_prefLoadToken; // 連打対策：後から呼ばれた読み込みだけを有効にする

  if(_prefDataCache[prefId]){
    if(myToken !== _prefLoadToken) return; // すでに別の府県への切り替えが割り込んでいたら何もしない
    STATIONS = _prefDataCache[prefId].stations;
    JURISDICTION_RULES = _prefDataCache[prefId].rules;
    return;
  }

  const pref = getPrefById(prefId);
  await loadScript(pref.stationsUrl);
  await loadScript(pref.jurisdictionUrl);

  if(myToken !== _prefLoadToken) return; // 読み込み中に、さらに別の府県へ切り替えられていたら反映しない

  // スクリプト実行直後のグローバル変数の中身をキャッシュに保存しておく
  _prefDataCache[prefId] = { stations: STATIONS, rules: JURISDICTION_RULES };
}

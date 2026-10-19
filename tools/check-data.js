/* ==========================================================================
   管轄データ・判定ロジックの自動点検スクリプト

   使い方（サイトのフォルダ直下で）：
     node tools/check-data.js

   assets/pref/ のデータや assets/jurisdiction-match.js を修正したら、
   アップロードの前に必ず実行してください。最後に「NG 0件」と出れば合格です。

   点検する内容
     1. データの整合性（存在しない警察署名、使われていない警察署、未知の項目名）
     2. 自己一致テスト：データに書かれた町丁目・範囲を、いろいろな書き方
        （漢数字／算用数字／全角数字／「丁目」省略／府県名つき）で入力して、
        そのルールの警察署が返るか
     3. 府県内の全市区町村が判定できるか（郡を省いた町村名も含む）
     4. 答えが分かっている住所での判定（回帰テスト）
     5. トップページの入力例がすべて判定できるか
     6. 他府県の住所を誤って判定しないか
   ========================================================================== */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');
const M = require(path.join(ROOT, 'assets/jurisdiction-match.js'));

function loadPref(id){
  const ctx = {};
  vm.createContext(ctx);
  const code = ['stations', 'jurisdiction']
    .map(k => fs.readFileSync(path.join(ROOT, `assets/pref/${id}-${k}.js`), 'utf8')).join('\n');
  vm.runInContext(code + '\n;this.__S = STATIONS; this.__R = JURISDICTION_RULES;', ctx);
  return { stations: ctx.__S, rules: ctx.__R };
}

const prefCtx = {};
vm.createContext(prefCtx);
vm.runInContext(fs.readFileSync(path.join(ROOT, 'assets/prefectures.js'), 'utf8') + '\n;this.__P = PREFECTURES;', prefCtx);
const PREFS = prefCtx.__P;

const data = {};
PREFS.forEach(p => { data[p.id] = loadPref(p.id); });

let ng = 0, ok = 0;
const ngList = [];
function check(cond, label){
  if(cond){ ok++; return; }
  ng++;
  ngList.push(label);
}
function match(prefId, addr){
  return M.matchStation(addr, data[prefId].rules);
}

/* ---------- 1. データの整合性 ---------- */
const KNOWN_KEYS = new Set(['city','station','whole','names','ranges','patterns','displayNames','townPrefix','caveat','cityNote']);
PREFS.forEach(p => {
  const { stations, rules } = data[p.id];
  const names = new Set(stations.map(s => s.name));
  check(stations.length === p.stationCount, `[${p.label}] 警察署数が prefectures.js の stationCount と違う（データ ${stations.length}／設定 ${p.stationCount}）`);
  rules.forEach((r, i) => {
    check(names.has(r.station), `[${p.label}] ルール${i + 1}（${r.city}）の警察署「${r.station}」が警察署データにない`);
    Object.keys(r).forEach(k => check(KNOWN_KEYS.has(k), `[${p.label}] ルール${i + 1}（${r.city}）に未知の項目「${k}」`));
    check(r.whole || r.names || r.ranges || r.patterns, `[${p.label}] ルール${i + 1}（${r.city}）に whole／names／ranges／patterns のどれもない`);
  });
  stations.forEach(s => check(rules.some(r => r.station === s.name), `[${p.label}] 警察署「${s.name}」を受け持つルールがない`));
  stations.forEach(s => check(s.zip && s.addr && s.tel && s.url, `[${p.label}] 警察署「${s.name}」の住所・電話・URLが欠けている`));
  // 同じ市区町村で whole のルールは1つだけ、かつ最後に置く
  const cities = [...new Set(rules.map(r => r.city))];
  cities.forEach(c => {
    const rs = rules.filter(r => r.city === c);
    const wholes = rs.filter(r => r.whole);
    check(wholes.length <= 1, `[${p.label}] ${c} に whole のルールが複数ある`);
    if(wholes.length === 1) check(rs[rs.length - 1].whole, `[${p.label}] ${c} の whole ルールが最後に置かれていない（後ろのルールが使われない）`);
  });
});

/* ---------- 2. 自己一致テスト ---------- */
const toKanji = n => {
  const d = '〇一二三四五六七八九';
  if(n < 10) return d[n];
  if(n === 10) return '十';
  if(n < 20) return '十' + d[n % 10];
  return d[Math.floor(n / 10)] + '十' + (n % 10 ? d[n % 10] : '');
};
const toFull = s => s.replace(/[0-9]/g, c => String.fromCharCode(c.charCodeAt(0) + 0xFEE0)).replace(/-/g, '－');

function variants(prefLabel, city, town){
  // town は「梅田一丁目」「梅田1丁目」「茶屋町」など
  const m = M.normalizeAddress(town).match(/^(.*?)(\d+)丁目$/);
  const list = [];
  if(m){
    const base = m[1], n = +m[2];
    list.push(`${city}${base}${n}丁目5-6`, `${city}${base}${toKanji(n)}丁目5番6号`,
      `${city}${base}${n}-5-6`, toFull(`${city}${base}${n}-5-6`), `${prefLabel}${city}${base}${n}丁目`);
  } else {
    list.push(`${city}${town}12-3`, `${city}${town}12番地`, toFull(`${city}${town}12-3`), `${prefLabel}${city}${town}`);
  }
  return list;
}

PREFS.forEach(p => {
  const { rules } = data[p.id];
  rules.forEach(rule => {
    const towns = [];
    (rule.names || []).forEach(n => towns.push(n));
    (rule.ranges || []).forEach(r => { for(let n = r.from; n <= r.to; n++) towns.push(`${r.base}${n}丁目`); });
    towns.forEach(town => {
      variants(p.label, rule.city, town).forEach(addr => {
        const r = match(p.id, addr);
        // 番地単位の例外（patterns）に当たる番地は、テストでは避けている（12番地・5番6号）
        const got = r ? [r.station, ...(r.alsoStations || [])] : [];
        check(got.includes(rule.station),
          `[${p.label}] 「${addr}」→ ${r ? got.join('・') : '判定なし'}（データ上は ${rule.station}）`);
      });
    });
    if(rule.whole){
      const addr = `${rule.city}存在しない町99`;
      const r = match(p.id, addr);
      check(r && r.station === rule.station, `[${p.label}] 「${addr}」（その他の区域）→ ${r ? r.station : '判定なし'}（データ上は ${rule.station}）`);
    }
  });
});

/* ---------- 3. 府県内の全市区町村 ---------- */
const MUNICIPALITIES = {
  osaka: [
    ...'都島 福島 此花 西 港 大正 天王寺 浪速 西淀川 東淀川 東成 生野 旭 城東 阿倍野 住吉 東住吉 西成 淀川 鶴見 住之江 平野 北 中央'.split(' ').map(w => `大阪市${w}区`),
    ...'堺 中 東 西 南 北 美原'.split(' ').map(w => `堺市${w}区`),
    ...'岸和田市 豊中市 池田市 吹田市 泉大津市 高槻市 貝塚市 守口市 枚方市 茨木市 八尾市 泉佐野市 富田林市 寝屋川市 河内長野市 松原市 大東市 和泉市 箕面市 柏原市 羽曳野市 門真市 摂津市 高石市 藤井寺市 東大阪市 泉南市 四條畷市 交野市 大阪狭山市 阪南市'.split(' '),
    '三島郡島本町', '豊能郡豊能町', '豊能郡能勢町', '泉北郡忠岡町', '泉南郡熊取町', '泉南郡田尻町', '泉南郡岬町',
    '南河内郡太子町', '南河内郡河南町', '南河内郡千早赤阪村',
  ],
  kyoto: [
    ...'北 上京 左京 中京 東山 山科 下京 南 右京 西京 伏見'.split(' ').map(w => `京都市${w}区`),
    ...'福知山市 舞鶴市 綾部市 宇治市 宮津市 亀岡市 城陽市 向日市 長岡京市 八幡市 京田辺市 京丹後市 南丹市 木津川市'.split(' '),
    '乙訓郡大山崎町', '久世郡久御山町', '綴喜郡井手町', '綴喜郡宇治田原町', '相楽郡笠置町', '相楽郡和束町',
    '相楽郡精華町', '相楽郡南山城村', '船井郡京丹波町', '与謝郡伊根町', '与謝郡与謝野町',
  ],
  hyogo: [
    ...'東灘 灘 兵庫 長田 須磨 垂水 北 中央 西'.split(' ').map(w => `神戸市${w}区`),
    ...'姫路市 尼崎市 明石市 西宮市 洲本市 芦屋市 伊丹市 相生市 豊岡市 加古川市 赤穂市 西脇市 宝塚市 三木市 高砂市 川西市 小野市 三田市 加西市 丹波篠山市 養父市 丹波市 南あわじ市 朝来市 淡路市 宍粟市 加東市 たつの市'.split(' '),
    '川辺郡猪名川町', '多可郡多可町', '加古郡稲美町', '加古郡播磨町', '神崎郡市川町', '神崎郡福崎町', '神崎郡神河町',
    '揖保郡太子町', '赤穂郡上郡町', '佐用郡佐用町', '美方郡香美町', '美方郡新温泉町',
  ],
};
Object.entries(MUNICIPALITIES).forEach(([id, list]) => {
  const label = PREFS.find(p => p.id === id).label;
  list.forEach(name => {
    const addr = `${name}存在しない町1-1`;
    check(match(id, addr), `[${label}] 市区町村「${name}」が判定できない`);
    const town = name.replace(/^.+?郡/, '');
    if(town !== name){
      check(match(id, `${town}1-1`), `[${label}] 郡名を省いた「${town}」が判定できない`);
    }
  });
});

/* ---------- 4. 答えが分かっている住所（回帰テスト） ---------- */
const KNOWN = [
  ['osaka', '大阪市北区梅田1丁目1-3', '曽根崎警察署'],
  ['osaka', '大阪市北区曾根崎２丁目１６－１４', '曽根崎警察署'],
  ['osaka', '大阪市北区中之島1-3-20', '天満警察署'],
  ['osaka', '大阪市北区大淀中1-1-88', '大淀警察署'],
  ['osaka', '大阪市中央区難波5丁目1-60', '南警察署'],
  ['osaka', '大阪市中央区大阪城1-1', '東警察署'],
  ['osaka', '城東区古市1丁目', '城東警察署'],
  ['osaka', '東大阪市稲葉1丁目7-1', '河内警察署'],
  ['osaka', '東大阪市鷹殿町26-5', '河内警察署'],
  ['osaka', '東大阪市鷹殿町18-1', '枚岡警察署'],
  ['osaka', '東大阪市本町1-1', '枚岡警察署'],
  ['osaka', '東大阪市小阪本町1丁目1-1', '布施警察署'],
  ['osaka', '東大阪市高井田元町1丁目', '布施警察署'],
  ['osaka', '東大阪市足代新町1-1', '布施警察署'],
  ['osaka', '忠岡町忠岡東1丁目', '泉大津警察署'],
  ['kyoto', '京都市伏見区醍醐高畑町30', '山科警察署'],
  ['kyoto', '京都市伏見区日野西大道町1', '山科警察署'],
  ['kyoto', '京都市伏見区石田森南町1', '山科警察署'],
  ['kyoto', '京都市伏見区淀樋爪町1', '向日町警察署'],
  ['kyoto', '京都市伏見区久我東町1', '向日町警察署'],
  ['kyoto', '京都市伏見区深草藪之内町68', '伏見警察署'],
  ['kyoto', '京都市伏見区淀池上町1', '伏見警察署'],
  ['kyoto', '京都市東山区清水1丁目294', '東山警察署'],
  ['kyoto', '八幡市八幡長町1', '伏見警察署'],
  ['kyoto', '八幡市内里大谷1', '田辺警察署'],
  ['kyoto', '八幡市八幡園内75', '八幡警察署'],
  ['kyoto', '綴喜郡井手町井手', '田辺警察署'],
  ['kyoto', '宇治田原町荒木', '田辺警察署'],
  ['kyoto', '久御山町島田', '宇治警察署'],
  ['kyoto', '大山崎町大山崎', '向日町警察署'],
  ['kyoto', '精華町祝園', '木津警察署'],
  ['hyogo', '神戸市中央区旭通3丁目', '葺合警察署'],
  ['hyogo', '神戸市中央区旭通５丁目', '葺合警察署'],
];
KNOWN.forEach(([id, addr, expect]) => {
  const r = match(id, addr);
  check(r && r.station === expect, `[回帰] 「${addr}」→ ${r ? r.station : '判定なし'}（正解 ${expect}）`);
});

/* ---------- 5. トップページの入力例 ---------- */
PREFS.forEach(p => {
  p.examples.forEach(ex => check(match(p.id, ex), `[${p.label}] 入力例「${ex}」が判定できない`));
});

/* ---------- 6. 他府県の住所を誤判定しないか ---------- */
PREFS.forEach(p => {
  PREFS.filter(q => q.id !== p.id).forEach(q => {
    q.examples.forEach(ex => {
      const r = match(p.id, ex);
      check(!r, `[${p.label}] ${q.label}の住所「${ex}」を ${r && r.station} と誤判定`);
    });
  });
});

/* ---------- 結果 ---------- */
const MAX = 80;
ngList.slice(0, MAX).forEach(l => console.log('NG ' + l));
if(ngList.length > MAX) console.log(`…ほか ${ngList.length - MAX} 件`);
console.log(`\n点検結果：OK ${ok}件／NG ${ng}件`);
process.exitCode = ng ? 1 : 0;

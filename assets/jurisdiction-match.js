/* ==========================================================================
   住所 → 管轄警察署 判定ロジック
   assets/pref/（府県名）-jurisdiction.js の JURISDICTION_RULES を利用します。

   ルールの書き方（各府県のデータファイル）
     city        市区町村・郡名（例：「大阪市北区」「東大阪市」「乙訓郡」）
     whole       true なら、同じ city のほかのルールに当てはまらない住所をすべて受け持つ
     names       町丁目名の一覧（例：「梅田一丁目」「茶屋町」）
     townPrefix  true なら、names は「市区町村名の直後に続く町名」としてだけ照合する
                 （「本町」が「小阪本町」などの一部に誤って当たらないようにする）
     ranges      「旭通1〜5丁目」のような範囲（{base:"旭通", from:1, to:5}）
     patterns    正規表現（正規化後の住所に対して照合。例：番地単位の例外）
     displayNames patterns の内容を人が読める形で示したもの
   ========================================================================== */

const KANJI_DIGITS = {'〇':0,'一':1,'二':2,'三':3,'四':4,'五':5,'六':6,'七':7,'八':8,'九':9};

function kanjiNumberToArabic(m){
  if(m.length === 1) return m === '十' ? '10' : String(KANJI_DIGITS[m]);
  if(m.includes('十')){
    const idx = m.indexOf('十');
    const tens = idx === 0 ? 1 : KANJI_DIGITS[m[0]];
    const ones = idx === m.length - 1 ? 0 : KANJI_DIGITS[m[idx + 1]];
    return String(tens * 10 + ones);
  }
  return m.split('').map(c => KANJI_DIGITS[c]).join('');
}

function kanjiChomeToArabic(s){
  return s.replace(/[〇一二三四五六七八九十]{1,3}(?=丁目)/g, kanjiNumberToArabic);
}

// 住所の表記ゆれをそろえる（入力・データの両方に同じ処理をかける）
function normalizeAddress(s){
  if(!s) return '';
  s = String(s)
    // 全角英数字 → 半角（スマホの日本語入力では全角数字になりやすい）
    .replace(/[０-９Ａ-Ｚａ-ｚ]/g, c => String.fromCharCode(c.charCodeAt(0) - 0xFEE0))
    // ハイフンの表記ゆれ → 半角ハイフン
    .replace(/[－−‐‑–—―ｰ]/g, '-')
    .replace(/(\d)ー(?=\d)/g, '$1-')
    .replace(/〒?\d{3}-?\d{4}/g, '')          // 郵便番号
    .replace(/^日本[、,]?/, '')
    .replace(/大阪府|京都府|兵庫県/g, '')
    .replace(/[\s　]/g, '')
    .replace(/[,、，]/g, '')
    // 字体・かなの表記ゆれ
    .replace(/[ケヶが](?=[丘岡崎原谷淵浦島鼻下])/g, 'ケ')
    .replace(/ヶ/g, 'ケ')
    .replace(/曾/g, '曽')
    .replace(/頰/g, '頬')
    .replace(/ノ/g, 'の');
  return kanjiChomeToArabic(s);
}

function escapeRegExp(s){
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// 町丁目名が住所テキストに含まれているかを判定する。
// 「◯◯4丁目」のような名称は、数字の直後が「丁目」か数字以外であることを確認し、
// 「4」が「40」など別の数字の一部として誤マッチしないようにしている。
// anchored が true なら、input の先頭（＝市区町村名の直後）から始まる場合だけマッチさせる。
function nameMatches(input, name, anchored){
  const norm = normalizeAddress(name);
  const head = anchored ? '^' : '';
  const m = norm.match(/^(.*?)(\d+)丁目$/);
  if(m){
    const re = new RegExp(head + escapeRegExp(m[1]) + m[2] + '(?:丁目|(?!\\d))');
    return re.test(input);
  }
  return new RegExp(head + escapeRegExp(norm)).test(input);
}

// 「◯◯一丁目から五丁目まで」のような範囲指定にマッチするかどうかを判定する。
// range = {base: "旭通", from: 1, to: 5}
function rangeMatches(input, range){
  const base = normalizeAddress(range.base);
  const re = new RegExp(escapeRegExp(base) + '(\\d+)(?:丁目|(?!\\d))', 'g');
  let match;
  while((match = re.exec(input))){
    const num = parseInt(match[1], 10);
    if(num >= range.from && num <= range.to) return true;
  }
  return false;
}

// 区を持つ政令指定都市
const CITY_PREFIXES = /^(大阪市|堺市|京都市|神戸市)/;
const CITY_PREFIX_LIST = ["大阪市", "堺市", "京都市", "神戸市"];

// 郡に属する町村（「郡」を省いて「久御山町」のように入力されたときの補完用）
const COUNTY_TOWNS = {
  // 大阪府
  '三島郡': ['島本町'],
  '豊能郡': ['豊能町', '能勢町'],
  '泉北郡': ['忠岡町'],
  '泉南郡': ['熊取町', '田尻町', '岬町'],
  '南河内郡': ['太子町', '河南町', '千早赤阪村'],
  // 京都府
  '乙訓郡': ['大山崎町'],
  '久世郡': ['久御山町'],
  '綴喜郡': ['井手町', '宇治田原町'],
  '相楽郡': ['笠置町', '和束町', '精華町', '南山城村'],
  '船井郡': ['京丹波町'],
  '与謝郡': ['伊根町', '与謝野町'],
  // 兵庫県
  '川辺郡': ['猪名川町'],
  '多可郡': ['多可町'],
  '加古郡': ['稲美町', '播磨町'],
  '神崎郡': ['市川町', '福崎町', '神河町'],
  '揖保郡': ['太子町'],
  '赤穂郡': ['上郡町'],
  '佐用郡': ['佐用町'],
  '美方郡': ['香美町', '新温泉町'],
};

function buildAliasMap(rules){
  const shortToFull = {};
  rules.forEach(r => {
    const short = r.city.replace(CITY_PREFIXES, '');
    if(short === r.city) return; // 元々市名のみ（高槻市など）はエイリアス不要
    if(!shortToFull[short]) shortToFull[short] = new Set();
    shortToFull[short].add(r.city);
  });
  const safeAlias = {};
  Object.keys(shortToFull).forEach(short => {
    if(shortToFull[short].size === 1){
      safeAlias[short] = [...shortToFull[short]][0];
    }
  });
  return safeAlias; // { "都島区": "大阪市都島区", ... }（北区・西区など複数市に存在するものは含まれない）
}

// 入力住所が、あるルールの city にヒットした位置（ヒットした文字列の直後の位置）を返す。
// ヒットしなければ -1。完全一致を優先し、それが無い場合のみ短縮名（エイリアス）でのヒットを認める。
// エイリアスは、入力住所に別の政令市名が明示されている場合には使わない（「神戸市西区」への誤爆防止）。
function cityHitEnd(input, city, aliasMap, mentionedCityPrefix){
  const full = normalizeAddress(city);
  const i = input.indexOf(full);
  if(i >= 0) return i + full.length;

  const shortCity = city.replace(CITY_PREFIXES, '');
  if(shortCity === city) return -1; // エイリアス対象外（市名のみのルール）
  const cityPrefixMatch = city.match(CITY_PREFIXES);
  const cityPrefix = cityPrefixMatch ? cityPrefixMatch[0] : null;
  const aliasSafe = aliasMap[shortCity] === city;
  const noConflict = !mentionedCityPrefix || mentionedCityPrefix === cityPrefix;
  if(!(aliasSafe && noConflict)) return -1;
  const short = normalizeAddress(shortCity);
  const j = input.indexOf(short);
  return j >= 0 ? j + short.length : -1;
}

function cityMatches(input, city, aliasMap, mentionedCityPrefix){
  return cityHitEnd(input, city, aliasMap, mentionedCityPrefix) >= 0;
}

// 郡名が省かれた町村名に郡名を補う（このルール集に含まれる郡だけが対象）
function expandCountyTowns(input, rules){
  let out = input;
  const counties = new Set(rules.map(r => (r.city.match(/^(.+?郡)/) || [])[1]).filter(Boolean));
  counties.forEach(county => {
    (COUNTY_TOWNS[county] || []).forEach(town => {
      if(out.includes(town) && !out.includes(county + town)) out = out.replace(town, county + town);
    });
  });
  return out;
}

function findHitCities(input, rules, aliasMap){
  const mentionedCityPrefix = CITY_PREFIX_LIST.find(p => {
    // 「東大阪市」は「大阪市」を含むが、大阪市の明示ではない
    const i = input.indexOf(p);
    return i >= 0 && !(p === '大阪市' && input[i - 1] === '東');
  }) || null;
  const allCities = [...new Set(rules.map(r => r.city))];
  return allCities
    .map(city => ({ city, end: cityHitEnd(input, city, aliasMap, mentionedCityPrefix) }))
    .filter(h => h.end >= 0);
}

function matchStation(inputRaw, rules){
  let input = normalizeAddress(inputRaw);
  const aliasMap = buildAliasMap(rules);

  // 1. 入力にヒットする可能性のある city（市区町村）の候補をすべて集める。
  let hits = findHitCities(input, rules, aliasMap);
  if(hits.length === 0){
    input = expandCountyTowns(input, rules);
    hits = findHitCities(input, rules, aliasMap);
  }
  if(hits.length === 0) return null;

  // 2. 「東淀川区」が「淀川区」を含むような入れ子に対応するため、
  //    もっとも長い（＝もっとも具体的な）市区町村名を優先して採用する。
  const best = hits.reduce((a, b) => (b.city.length > a.city.length ? b : a));
  const bestCity = best.city;
  const afterCity = input.slice(best.end);   // 市区町村名より後ろ（町名・番地）

  // 3. 採用した city に属するルールだけを、具体的なものから順に試す。
  //    町名は「市区町村名より後ろ」の部分だけで照合する（市区町村名の一部に誤マッチしないように）。
  //      ① 番地単位の例外（patterns）
  //      ② 丁目まで指定された町名・丁目の範囲（「猪名寺3丁目」「旭通1〜5丁目」）
  //      ③ 丁目のない町名（「猪名寺」「茶屋町」）※②より後にしないと「猪名寺」が「猪名寺3丁目」にも当たる
  //      ④ その市区町村の残り全部（whole）
  //    同じ段階で複数の警察署に当たった場合（「の一部」で区域が分かれている町丁目）は、
  //    最初の警察署を結果とし、ほかの警察署を alsoStations に入れて返す。
  const candidateRules = rules.filter(r => r.city === bestCity);

  for(const rule of candidateRules){
    if(!rule.patterns) continue;
    for(let k = 0; k < rule.patterns.length; k++){
      if(new RegExp(rule.patterns[k]).test(input)){
        const label = (rule.displayNames && rule.displayNames[k]) || rule.patterns[k];
        return { station: rule.station, rule, matchedBy: 'pattern', matchedName: label, alsoStations: [] };
      }
    }
  }

  const isChomeName = name => /\d+丁目$/.test(normalizeAddress(name));
  const stages = [
    rule => {
      const name = (rule.names || []).filter(isChomeName).find(n => nameMatches(afterCity, n, !!rule.townPrefix));
      if(name) return { matchedBy: 'chome', matchedName: name };
      const range = (rule.ranges || []).find(r => rangeMatches(afterCity, r));
      if(range) return { matchedBy: 'range', matchedName: `${range.base}${range.from}〜${range.to}丁目` };
      return null;
    },
    rule => {
      const name = (rule.names || []).filter(n => !isChomeName(n)).find(n => nameMatches(afterCity, n, !!rule.townPrefix));
      return name ? { matchedBy: 'chome', matchedName: name } : null;
    },
  ];
  for(const stage of stages){
    const found = [];
    candidateRules.forEach(rule => {
      const hit = stage(rule);
      if(hit) found.push({ station: rule.station, rule, ...hit });
    });
    if(found.length){
      const first = found[0];
      first.alsoStations = [...new Set(found.map(f => f.station))].filter(st => st !== first.station);
      return first;
    }
  }

  const wholeRule = candidateRules.find(r => r.whole);
  if(wholeRule) return { station: wholeRule.station, rule: wholeRule, matchedBy: 'ward', alsoStations: [] };
  return null;
}

if(typeof module !== 'undefined'){
  module.exports = { normalizeAddress, matchStation, nameMatches, rangeMatches, buildAliasMap, cityMatches, expandCountyTowns, CITY_PREFIXES, COUNTY_TOWNS };
}

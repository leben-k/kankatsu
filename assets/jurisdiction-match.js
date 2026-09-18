/* ==========================================================================
   住所 → 管轄警察署 判定ロジック
   assets/jurisdiction-data.js の JURISDICTION_RULES を利用します。
   ========================================================================== */

function kanjiChomeToArabic(s){
  const map = {'〇':0,'一':1,'二':2,'三':3,'四':4,'五':5,'六':6,'七':7,'八':8,'九':9};
  return s.replace(/[一二三四五六七八九十]{1,3}(?=丁目)/g, (m)=>{
    if(m.length===1){
      if(m==='十') return '10';
      return String(map[m]);
    }
    if(m.includes('十')){
      const idx = m.indexOf('十');
      const tens = idx===0?1:map[m[0]];
      const ones = idx===m.length-1?0:map[m[idx+1]];
      return String(tens*10+ones);
    }
    return m.split('').map(c=>map[c]).join('');
  });
}

function normalizeAddress(s){
  if(!s) return '';
  s = s.replace(/大阪府/g,'').replace(/\s|　/g,'');
  s = s.replace(/ケ|ヶ/g,'ケ');
  s = kanjiChomeToArabic(s);
  return s;
}

// 町丁目名が住所テキストに含まれているかを判定する。
// 「◯◯四丁目」のような名称は、末尾の数字の直後が「丁目」という文字列か、
// あるいは数字以外の文字（ハイフンや番地の始まりなど）であることを確認し、
// 「4」が「40」など別の数字の一部として誤マッチしないようにしている。
function nameMatches(input, name){
  const norm = normalizeAddress(name);
  const m = norm.match(/^(.*?)(\d+)丁目$/);
  if(m){
    const base = m[1];
    const num = m[2];
    const escapedBase = base.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp(escapedBase + num + '(?:丁目|(?!\\d))');
    return re.test(input);
  }
  const escaped = norm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(escaped).test(input);
}

// 「◯◯一丁目から五丁目まで」のような範囲指定にマッチするかどうかを判定する。
// range = {base: "旭通", from: 1, to: 5}
function rangeMatches(input, range){
  const base = normalizeAddress(range.base);
  const escapedBase = base.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp(escapedBase + '(\\d+)(?:丁目|(?!\\d))');
  const match = input.match(re);
  if(!match) return false;
  const num = parseInt(match[1], 10);
  return num >= range.from && num <= range.to;
}

// city名の「短縮キー」が複数の市区町村で衝突しないかを事前計算
// 大阪市・堺市・京都市・神戸市など、区を持つ政令指定都市名のプレフィックスを想定
const CITY_PREFIXES = /^(大阪市|堺市|京都市|神戸市)/;
const CITY_PREFIX_LIST = ["大阪市", "堺市", "京都市", "神戸市"];

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

// 入力住所が、あるルールの city（例：「大阪市東淀川区」）にヒットするかどうかを判定する。
// 完全一致（fullHit）を優先し、それが無い場合のみ短縮名（エイリアス）でのヒットを認める。
// エイリアスは、入力住所に別の政令市名が明示されている場合には使わない
// （例：「神戸市西区」への誤爆を防ぐため）。
function cityMatches(input, city, aliasMap, mentionedCityPrefix){
  const fullHit = input.includes(normalizeAddress(city));
  if(fullHit) return true;

  const shortCity = city.replace(CITY_PREFIXES, '');
  if(shortCity === city) return false; // エイリアス対象外（市名のみのルール）

  const cityPrefixMatch = city.match(CITY_PREFIXES);
  const cityPrefix = cityPrefixMatch ? cityPrefixMatch[0] : null;
  const aliasSafe = aliasMap[shortCity] === city;
  const noConflict = !mentionedCityPrefix || mentionedCityPrefix === cityPrefix;

  return aliasSafe && noConflict && input.includes(normalizeAddress(shortCity));
}

function matchStation(inputRaw, rules){
  const input = normalizeAddress(inputRaw);
  const aliasMap = buildAliasMap(rules);
  const mentionedCityPrefix = CITY_PREFIX_LIST.find(p => input.includes(normalizeAddress(p))) || null;

  // 1. 入力にヒットする可能性のある city（市区町村）の候補をすべて集める。
  const allCities = [...new Set(rules.map(r => r.city))];
  const hitCities = allCities.filter(city => cityMatches(input, city, aliasMap, mentionedCityPrefix));
  if(hitCities.length === 0) return null;

  // 2. 「東淀川区」が「淀川区」を、「東住吉区」が「住吉区」を部分文字列として含んでしまう
  //    ような入れ子のケースに対応するため、ヒットした候補のうち、文字列としてもっとも
  //    長い（＝もっとも具体的な）ものを優先して採用する。
  const bestCity = hitCities.reduce((a, b) => (b.length > a.length ? b : a));

  // 3. 採用した city に属するルールだけを、元の並び順（明示ルール→包括ルールの順）で試す。
  const candidateRules = rules.filter(r => r.city === bestCity);
  for(const rule of candidateRules){
    if(rule.whole){
      return { station: rule.station, rule, matchedBy: 'ward' };
    }
    if(rule.names){
      for(const name of rule.names){
        if(nameMatches(input, name)){
          return { station: rule.station, rule, matchedBy: 'chome', matchedName: name };
        }
      }
    }
    if(rule.ranges){
      for(const range of rule.ranges){
        if(rangeMatches(input, range)){
          return { station: rule.station, rule, matchedBy: 'range', matchedName: `${range.base}${range.from}〜${range.to}丁目` };
        }
      }
    }
  }
  return null;
}

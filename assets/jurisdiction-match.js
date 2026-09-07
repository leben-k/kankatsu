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

// city名の「短縮キー」が複数の市区町村で衝突しないかを事前計算
function buildAliasMap(rules){
  const shortToFull = {};
  rules.forEach(r => {
    const short = r.city.replace(/^(大阪市|堺市)/, '');
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

function matchStation(inputRaw, rules){
  const input = normalizeAddress(inputRaw);
  const aliasMap = buildAliasMap(rules);

  for(const rule of rules){
    const cityHit = input.includes(normalizeAddress(rule.city))
      || (aliasMap[rule.city.replace(/^(大阪市|堺市)/, '')] === rule.city
          && input.includes(normalizeAddress(rule.city.replace(/^(大阪市|堺市)/, ''))));
    if(!cityHit) continue;

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
  }
  return null;
}

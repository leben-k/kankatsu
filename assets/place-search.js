/* ==========================================================================
   名所・施設名・駅名からの所在地検索、および現在地の住所変換
   （OpenStreetMap Nominatim を利用）

   ・住所として判定できなかった検索語だけを Nominatim に問い合わせます。
   ・Nominatim の利用規約に合わせて、問い合わせは1秒に1回以下に抑え、
     同じ問い合わせの結果はページ内でキャッシュします。
   ・入力中の自動補完（1文字ごとの問い合わせ）には使いません。
   ・DOMには依存しません（fetch があれば動きます）。
   ========================================================================== */

const NOMINATIM_BASE = 'https://nominatim.openstreetmap.org';

// 大阪府・京都府・兵庫県をおおむね含む範囲（西経度,北緯度,東経度,南緯度）
const PLACE_SEARCH_VIEWBOX = '134.2,35.8,136.1,34.1';

// ISO 3166-2 の都道府県コード → このサイトの府県ID
const PREF_ID_BY_ISO = { 'JP-26': 'kyoto', 'JP-27': 'osaka', 'JP-28': 'hyogo' };
const PREF_LABEL_BY_ID = { osaka: '大阪府', kyoto: '京都府', hyogo: '兵庫県' };

// よく使われる略称・愛称 → 地図データ上の正式名（入力全体が一致したときだけ置き換え）
const PLACE_ALIASES = {
  'usj': 'ユニバーサル・スタジオ・ジャパン',
  'ユニバ': 'ユニバーサル・スタジオ・ジャパン',
  'ユニバーサルスタジオジャパン': 'ユニバーサル・スタジオ・ジャパン',
  'ハルカス': 'あべのハルカス',
  '甲子園球場': '阪神甲子園球場',
};

// 住所として使う項目。施設名・道路名・建物名・郵便番号などは除外する
// （施設名に「北区」「中央」などの文字が含まれていても誤判定しないように）。
const ADDRESS_KEYS = [
  'province', 'state', 'county', 'city', 'town', 'village', 'municipality',
  'city_district', 'district', 'borough', 'suburb', 'quarter', 'neighbourhood',
  'hamlet', 'isolated_dwelling', 'city_block', 'house_number'
];

/* ---- 問い合わせ（1秒1回以下・キャッシュ付き） ---- */

const _nominatimCache = new Map();
let _nominatimQueue = Promise.resolve();
let _nominatimLastAt = 0;

function nominatimGet(path, params){
  const url = `${NOMINATIM_BASE}/${path}?${new URLSearchParams(params)}`;
  if(_nominatimCache.has(url)) return Promise.resolve(_nominatimCache.get(url));

  const run = async () => {
    const wait = _nominatimLastAt + 1100 - Date.now();
    if(wait > 0) await new Promise(r => setTimeout(r, wait));
    _nominatimLastAt = Date.now();
    const res = await fetch(url, { headers: { 'Accept': 'application/json' } });
    if(!res.ok) throw new Error(`Nominatim HTTP ${res.status}`);
    const data = await res.json();
    _nominatimCache.set(url, data);
    return data;
  };
  const p = _nominatimQueue.then(run, run);
  _nominatimQueue = p.catch(() => {});
  return p;
}

/* ---- 応答 → 日本の住所の順の文字列 ---- */

function prefIdFromNominatim(item){
  const a = (item && item.address) || {};
  const iso = a['ISO3166-2-lvl4'] || a['ISO3166-2-lvl3'];
  if(iso && PREF_ID_BY_ISO[iso]) return PREF_ID_BY_ISO[iso];
  const text = [a.province, a.state, item && item.display_name].filter(Boolean).join(' ');
  return Object.keys(PREF_LABEL_BY_ID).find(id => text.includes(PREF_LABEL_BY_ID[id])) || null;
}

// display_name は「16, 曽根崎二丁目, 北区, 大阪市, 大阪府, 530-0057, 日本」のように
// 小さい単位から並ぶ。住所の項目だけを残して逆順につなぎ、
// 「大阪府大阪市北区曽根崎二丁目16」の形にする。
function nominatimToAddress(item){
  if(!item) return '';
  const a = item.address || {};
  const parts = String(item.display_name || '').split(',').map(t => t.trim()).filter(Boolean);
  const allowed = new Set(ADDRESS_KEYS.map(k => a[k]).filter(Boolean));

  let kept = parts.filter(t => allowed.has(t));
  if(!kept.length){
    // address が付いていない応答への保険：施設名・郵便番号・国名だけ除く
    kept = parts.filter(t => t !== '日本' && !/^\d{3}-?\d{4}$/.test(t));
    if(item.name && kept[0] === item.name) kept.shift();
  }
  let addr = [...new Set(kept.reverse())].join(''); // 同じ地名の重複（「中央区」が2回など）を除く

  // 府県名が含まれていなければ先頭に補う
  const prefId = prefIdFromNominatim(item);
  if(prefId && !addr.includes(PREF_LABEL_BY_ID[prefId])) addr = PREF_LABEL_BY_ID[prefId] + addr;
  return addr;
}

function toPlace(item){
  const parts = String(item.display_name || '').split(',').map(t => t.trim());
  const a = item.address || {};
  return {
    name: item.name || parts[0] || '',
    // 対応エリア外のときに「〇〇県」と案内するための都道府県名（対応府県以外も入る）
    prefName: a.province || a.state || (parts.find(t => /^.{2,3}[都道府県]$/.test(t)) || ''),
    country: a.country_code || '',
    cityName: a.city || a.town || a.village || a.municipality || '',
    address: nominatimToAddress(item),
    prefId: prefIdFromNominatim(item),
    lat: parseFloat(item.lat),
    lon: parseFloat(item.lon),
    kind: [item.category || item.class, item.type].filter(Boolean).join('/')
  };
}

/* ---- 検索語の整形 ---- */

function normalizePlaceQuery(s){
  let q = String(s || '')
    .replace(/[Ａ-Ｚａ-ｚ０-９]/g, c => String.fromCharCode(c.charCodeAt(0) - 0xFEE0))
    .replace(/[\s　]+/g, ' ')
    .trim();
  const alias = PLACE_ALIASES[q.toLowerCase()] || PLACE_ALIASES[q];
  return alias || q;
}

/* ---- 公開する関数 ---- */

// 名所・施設名・駅名などで検索し、大阪・京都・兵庫の候補だけを返す。
async function searchPlaces(query){
  const q = normalizePlaceQuery(query);
  if(!q) return [];
  const tries = [q];
  // 地図データでは駅名が「京都」のように「駅」なしで登録されていることがあるため、
  // 見つからなければ「京都 駅」の形でも探す。
  if(/.駅$/.test(q)) tries.push(q.replace(/駅$/, ' 駅'));

  for(const t of tries){
    const data = await nominatimGet('search', {
      q: t, format: 'jsonv2', addressdetails: '1', 'accept-language': 'ja',
      countrycodes: 'jp', viewbox: PLACE_SEARCH_VIEWBOX, bounded: '1', limit: '8'
    });
    const seen = new Set();
    const places = (Array.isArray(data) ? data : [])
      .map(toPlace)
      .filter(p => p.prefId && p.address)
      .filter(p => {
        const key = p.name + '|' + p.address;
        if(seen.has(key)) return false;
        seen.add(key);
        return true;
      });
    if(places.length) return places;
  }
  return [];
}

// 緯度経度 → 住所（現在地検索や、施設の住所が町丁目まで分からなかったときに使う）
async function reverseGeocode(lat, lon){
  const data = await nominatimGet('reverse', {
    lat: String(lat), lon: String(lon), format: 'jsonv2', addressdetails: '1',
    'accept-language': 'ja', zoom: '18'
  });
  if(!data || data.error) return null;
  return toPlace(data);
}

if(typeof module !== 'undefined'){
  module.exports = { nominatimToAddress, prefIdFromNominatim, normalizePlaceQuery, toPlace, searchPlaces, reverseGeocode };
}

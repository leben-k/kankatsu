/* ==========================================================================
   市区町村別の管轄警察署ページ（area/*.html）と sitemap.xml を生成するスクリプト

   使い方（サイトのフォルダ直下で）：
     node tools/build-area-pages.js

   assets/pref/ の府県データ（STATIONS / JURISDICTION_RULES）を読み込み、
   市区町村ごとに1ページずつ静的なHTMLを書き出します。管轄データを修正したら
   このスクリプトを再実行すれば、ページとサイトマップが最新の内容に揃います。
   市区町村を追加した場合は、下の SLUGS にローマ字のファイル名を追加してください
   （未登録の市区町村があるとエラーで止まります）。
   ========================================================================== */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');
const BASE = 'https://leben-k.github.io/kankatsu/';
const SITE_NAME = '警察署管轄ガイド（大阪・京都・兵庫版）';
const TODAY = new Date().toLocaleDateString('sv-SE', { timeZone: 'Asia/Tokyo' }); // 日本時間の日付（YYYY-MM-DD）

// サイトマップに載せる既存ページ（about.html は noindex、kankatsu-kensaku.html は転送ページのため除外）
const STATIC_PAGES = [
  ['', '1.0'], ['keisatsusho.html', '0.9'],
  ['fuzoku-eigyo.html', '0.8'], ['shinya-inshoku.html', '0.8'], ['keibigyo.html', '0.8'],
  ['tanteigyo.html', '0.8'], ['doro-shiyo.html', '0.8'], ['shako-shomei.html', '0.8'],
  ['honbu-ka-taiou.html', '0.6'], ['honbu-ka-taiou-kyoto.html', '0.6'], ['honbu-ka-taiou-hyogo.html', '0.6'],
  ['privacy.html', '0.3'], ['contact.html', '0.3'],
];

// 市区町村名 → ページのファイル名（ローマ字）
const SLUGS = {
  // 大阪府
  '大阪市北区':'osaka-shi-kita-ku','大阪市中央区':'osaka-shi-chuo-ku','大阪市港区':'osaka-shi-minato-ku',
  '大阪市鶴見区':'osaka-shi-tsurumi-ku','大阪市都島区':'osaka-shi-miyakojima-ku','大阪市福島区':'osaka-shi-fukushima-ku',
  '大阪市此花区':'osaka-shi-konohana-ku','大阪市西区':'osaka-shi-nishi-ku','大阪市大正区':'osaka-shi-taisho-ku',
  '大阪市天王寺区':'osaka-shi-tennoji-ku','大阪市浪速区':'osaka-shi-naniwa-ku','大阪市西淀川区':'osaka-shi-nishiyodogawa-ku',
  '大阪市淀川区':'osaka-shi-yodogawa-ku','大阪市東淀川区':'osaka-shi-higashiyodogawa-ku','大阪市東成区':'osaka-shi-higashinari-ku',
  '大阪市生野区':'osaka-shi-ikuno-ku','大阪市旭区':'osaka-shi-asahi-ku','大阪市城東区':'osaka-shi-joto-ku',
  '大阪市阿倍野区':'osaka-shi-abeno-ku','大阪市住之江区':'osaka-shi-suminoe-ku','大阪市住吉区':'osaka-shi-sumiyoshi-ku',
  '大阪市東住吉区':'osaka-shi-higashisumiyoshi-ku','大阪市平野区':'osaka-shi-hirano-ku','大阪市西成区':'osaka-shi-nishinari-ku',
  '大東市':'daito-shi','松原市':'matsubara-shi','八尾市':'yao-shi','東大阪市':'higashiosaka-shi','守口市':'moriguchi-shi',
  '池田市':'ikeda-shi','豊中市':'toyonaka-shi',
  '堺市堺区':'sakai-shi-sakai-ku','堺市北区':'sakai-shi-kita-ku','堺市西区':'sakai-shi-nishi-ku','堺市中区':'sakai-shi-naka-ku',
  '堺市南区':'sakai-shi-minami-ku','堺市東区':'sakai-shi-higashi-ku','堺市美原区':'sakai-shi-mihara-ku',
  '大阪狭山市':'osakasayama-shi','泉大津市':'izumiotsu-shi','和泉市':'izumi-shi','泉北郡':'senboku-gun','高石市':'takaishi-shi',
  '岸和田市':'kishiwada-shi','貝塚市':'kaizuka-shi','泉佐野市':'izumisano-shi','泉南市':'sennan-shi',
  '泉南郡田尻町':'sennan-gun-tajiri-cho','泉南郡熊取町':'sennan-gun-kumatori-cho','泉南郡岬町':'sennan-gun-misaki-cho',
  '阪南市':'hannan-shi','羽曳野市':'habikino-shi','藤井寺市':'fujiidera-shi','富田林市':'tondabayashi-shi',
  '南河内郡':'minamikawachi-gun','河内長野市':'kawachinagano-shi','柏原市':'kashiwara-shi','枚方市':'hirakata-shi',
  '交野市':'katano-shi','寝屋川市':'neyagawa-shi','四條畷市':'shijonawate-shi','門真市':'kadoma-shi','高槻市':'takatsuki-shi',
  '三島郡':'mishima-gun','茨木市':'ibaraki-shi','摂津市':'settsu-shi','吹田市':'suita-shi','豊能郡':'toyono-gun','箕面市':'minoh-shi',
  // 京都府
  '京都市上京区':'kyoto-shi-kamigyo-ku','京都市東山区':'kyoto-shi-higashiyama-ku','京都市中京区':'kyoto-shi-nakagyo-ku',
  '京都市下京区':'kyoto-shi-shimogyo-ku','京都市左京区':'kyoto-shi-sakyo-ku','京都市伏見区':'kyoto-shi-fushimi-ku',
  '京都市山科区':'kyoto-shi-yamashina-ku','京都市右京区':'kyoto-shi-ukyo-ku','京都市南区':'kyoto-shi-minami-ku',
  '京都市北区':'kyoto-shi-kita-ku','京都市西京区':'kyoto-shi-nishikyo-ku',
  '向日市':'muko-shi','長岡京市':'nagaokakyo-shi','乙訓郡':'otokuni-gun','宇治市':'uji-shi','久世郡':'kuse-gun',
  '城陽市':'joyo-shi','八幡市':'yawata-shi','京田辺市':'kyotanabe-shi','木津川市':'kizugawa-shi','相楽郡':'soraku-gun',
  '亀岡市':'kameoka-shi','南丹市':'nantan-shi','船井郡':'funai-gun','綾部市':'ayabe-shi','福知山市':'fukuchiyama-shi',
  '舞鶴市':'maizuru-shi','宮津市':'miyazu-shi','与謝郡':'yosa-gun','京丹後市':'kyotango-shi',
  // 兵庫県
  '神戸市中央区':'kobe-shi-chuo-ku','神戸市北区':'kobe-shi-kita-ku','神戸市東灘区':'kobe-shi-higashinada-ku',
  '神戸市灘区':'kobe-shi-nada-ku','神戸市兵庫区':'kobe-shi-hyogo-ku','神戸市長田区':'kobe-shi-nagata-ku',
  '神戸市須磨区':'kobe-shi-suma-ku','神戸市垂水区':'kobe-shi-tarumi-ku','神戸市西区':'kobe-shi-nishi-ku',
  '西宮市':'nishinomiya-shi','尼崎市':'amagasaki-shi','姫路市':'himeji-shi','芦屋市':'ashiya-shi','伊丹市':'itami-shi',
  '川西市':'kawanishi-shi','川辺郡':'kawabe-gun','宝塚市':'takarazuka-shi','三田市':'sanda-shi',
  '丹波篠山市':'tambasasayama-shi','丹波市':'tamba-shi','明石市':'akashi-shi','三木市':'miki-shi','小野市':'ono-shi',
  '加東市':'kato-shi','加西市':'kasai-shi','西脇市':'nishiwaki-shi','多可郡':'taka-gun','加古川市':'kakogawa-shi',
  '加古郡':'kako-gun','高砂市':'takasago-shi','神崎郡':'kanzaki-gun','たつの市':'tatsuno-shi','揖保郡':'ibo-gun',
  '佐用郡':'sayo-gun','相生市':'aioi-shi','赤穂郡':'ako-gun','赤穂市':'ako-shi','宍粟市':'shiso-shi','朝来市':'asago-shi',
  '養父市':'yabu-shi','豊岡市':'toyooka-shi','美方郡':'mikata-gun','洲本市':'sumoto-shi','淡路市':'awaji-shi',
  '南あわじ市':'minamiawaji-shi',
};

const GUIDES = [
  ['fuzoku-eigyo.html', '風俗営業許可'], ['shinya-inshoku.html', '深夜酒類提供の届出'],
  ['keibigyo.html', '警備業の認定'], ['tanteigyo.html', '探偵業の届出'],
  ['doro-shiyo.html', '道路使用許可'], ['shako-shomei.html', '車庫証明'],
];

// ---------- データ読み込み ----------
function runFile(file, exportExpr){
  const ctx = {};
  vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(path.join(ROOT, file), 'utf8') + `\n;this.__out = ${exportExpr};`, ctx);
  return ctx.__out;
}
const PREFECTURES = runFile('assets/prefectures.js', 'PREFECTURES');
const prefs = PREFECTURES.map(p => ({
  ...p,
  stations: runFile(p.stationsUrl, 'STATIONS'),
  rules: runFile(p.jurisdictionUrl, 'JURISDICTION_RULES'),
}));

// ---------- 小道具 ----------
const esc = s => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const shortSt = n => n.replace(/警察署$/, '');
const dedupeNames = names => {
  const seen = new Set();
  return names.filter(n => {
    const key = n.replace(/曾/g, '曽').replace(/ヶ/g, 'ケ');
    if(seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};
const rangeLabel = r => r.from === r.to ? `${r.base}${r.from}丁目` : `${r.base}${r.from}〜${r.to}丁目`;

function groupCity(pref, city){
  const rules = pref.rules.filter(r => r.city === city);
  const order = [];
  const byStation = {};
  rules.forEach(r => {
    if(!byStation[r.station]){
      byStation[r.station] = { station: r.station, names: [], ranges: [], whole: false, caveats: [] };
      order.push(r.station);
    }
    const g = byStation[r.station];
    if(r.names) g.names.push(...r.names);
    if(r.ranges) g.ranges.push(...r.ranges);
    if(r.whole) g.whole = true;
    if(r.caveat && !g.caveats.includes(r.caveat)) g.caveats.push(r.caveat);
  });
  return order.map(s => ({ ...byStation[s], names: dedupeNames(byStation[s].names) }));
}

// 管轄ルールには無いが、注記（caveat）の中で「一部の区域を管轄する」と書かれている警察署を拾う。
// 例：東大阪市の枚岡警察署（恩智川左岸以東）、吹田市の摂津警察署（安威川左岸以南）
function noteOnlyStations(pref, city, groups){
  const inGroups = new Set(groups.map(g => g.station));
  const caveats = [...new Set(pref.rules.filter(r => r.city === city && r.caveat).map(r => r.caveat))];
  return pref.stations
    .filter(st => !inGroups.has(st.name))
    .map(st => {
      const re = new RegExp('(?<![\\u4E00-\\u9FFF])' + st.name);
      const hits = caveats.filter(c => re.test(c));
      return hits.length ? { station: st.name, caveats: hits } : null;
    })
    .filter(Boolean);
}

// ヘッダー・フッター共通の「許認可手続」ドロップダウン
const NAV_GUIDES = [
  ['fuzoku-eigyo.html', '風俗営業許可'], ['shinya-inshoku.html', '深夜酒類提供飲食店の届出'],
  ['keibigyo.html', '警備業の認定'], ['tanteigyo.html', '探偵業の届出'],
  ['doro-shiyo.html', '道路使用許可'], ['shako-shomei.html', '車庫証明'],
];
function navDrop(prefix){
  return `      <details class="nav-drop">
        <summary>許認可手続</summary>
        <div class="nav-drop-menu">
${NAV_GUIDES.map(([h, l]) => `          <a href="${prefix}${h}">${l}</a>`).join('\n')}
        </div>
      </details>`;
}

function header(prefix, current){
  const cur = k => current === k ? ' class="current"' : '';
  return `<header class="site-header">
  <div class="wrap">
    <a class="brand" href="${prefix}">警察署管轄ガイド<small>大阪・京都・兵庫版</small></a>
    <nav class="site-nav">
      <a href="${prefix}">トップ</a>
      <a href="${prefix}area/"${cur('area')}>市区町村別</a>
${navDrop(prefix)}
      <a href="${prefix}keisatsusho.html">警察署一覧</a>
      <a href="${prefix}honbu-ka-taiou.html">本部と署の課対応</a>
    </nav>
  </div>
</header>`;
}

function footer(prefix){
  return `<footer class="site-footer">
  <div class="wrap">
    <div class="footer-links">
      <a href="${prefix}">トップ</a>
      <a href="${prefix}area/">市区町村別の管轄警察署</a>
${navDrop(prefix)}
      <a href="${prefix}keisatsusho.html">警察署一覧</a>
      <a href="${prefix}honbu-ka-taiou.html">本部と署の課対応</a>
      <a href="${prefix}about.html">運営者情報</a>
      <a href="${prefix}privacy.html">プライバシーポリシー</a>
      <a href="${prefix}contact.html">お問い合わせ</a>
    </div>
    <p class="footer-note">当サイトはいずれの府県警察の公式サイトでもなく、個人が運営する情報サイトです。掲載情報は一般的な参考情報であり、法的助言ではありません。正式な手続き・最新の管轄区域については、必ず管轄警察署または各府県警察本部の公式発表をご確認ください。</p>
  </div>
</footer>`;
}

function head({title, description, canonical, prefix, jsonld}){
  return `<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link rel="icon" href="${prefix}favicon.ico" sizes="48x48">
<link rel="icon" href="${prefix}favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="${prefix}apple-touch-icon.png">
<title>${esc(title)}</title>
<link rel="canonical" href="${canonical}">
<meta name="description" content="${esc(description)}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Shippori+Mincho:wght@500;700&family=Noto+Sans+JP:wght@400;500;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="${prefix}assets/style.css">
${jsonld ? `<script type="application/ld+json">${JSON.stringify(jsonld)}</script>\n` : ''}</head>
<body>
`;
}

const PIN_ICON = `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 16 L24 10 L40 16 L54 10 V48 L40 54 L24 48 L10 54 Z" stroke="var(--navy)" stroke-width="2.5" stroke-linejoin="round"/>
          <line x1="24" y1="10" x2="24" y2="48" stroke="var(--navy)" stroke-width="2"/>
          <line x1="40" y1="16" x2="40" y2="54" stroke="var(--navy)" stroke-width="2"/>
          <circle cx="32" cy="30" r="4" stroke="var(--brass)" stroke-width="2.5"/>
        </svg>`;

function breadcrumbLd(items){
  return {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: items.map(([name, url], i) => ({ '@type': 'ListItem', position: i + 1, name, item: url })),
  };
}

// ---------- 市区町村ページ ----------
function cityPage(pref, city, allCities){
  const slug = SLUGS[city];
  const groups = groupCity(pref, city);
  const stNames = groups.map(g => g.station);
  const extra = noteOnlyStations(pref, city, groups);
  const extraNames = extra.map(e => e.station);
  const multi = groups.length > 1;
  const canonical = `${BASE}area/${slug}.html`;

  const allNames = [...stNames, ...extraNames];
  const title = multi || extraNames.length
    ? `${city}の管轄警察署（${allNames.map(shortSt).join('・')}）｜${SITE_NAME}`
    : `${city}の管轄警察署は${stNames[0]}｜住所・電話番号｜${SITE_NAME}`;
  const description = multi
    ? `${pref.label}${city}は、町丁目によって${stNames.join('・')}の${groups.length}署に管轄が分かれています。町丁目ごとの管轄区域と、各警察署の住所・電話番号を掲載。`
    : `${pref.label}${city}を管轄する警察署は${stNames[0]}です${extraNames.length ? `（一部区域は${extraNames.join('・')}）` : ''}。所在地・電話番号・公式ページと、風俗営業許可や車庫証明など開業時の手続きの窓口を確認できます。`;

  let dek;
  if(multi){
    dek = `${city}は、町丁目によって${stNames.join('・')}の${groups.length}つの警察署に管轄が分かれています。下の一覧で、出店・開業予定地の町丁目がどの警察署の区域に入るかをご確認ください。`;
  } else {
    dek = `${city}は、${stNames[0]}が管轄しています。風俗営業許可・深夜酒類提供の届出・警備業・探偵業の手続きや、道路使用許可・車庫証明の申請は、原則としてこの警察署が窓口です。`;
  }
  if(extraNames.length){
    dek += `このほか、一部の区域が${extraNames.join('・')}の管轄になる場合があります。町名だけでは区別できないため、下の注記をご覧ください。`;
  }

  const stationBlocks = groups.map(g => {
    const st = pref.stations.find(s => s.name === g.station);
    const areaParts = [];
    const chips = [...g.names, ...g.ranges.map(rangeLabel)];
    if(chips.length){
      areaParts.push(`<ul class="chome-list">\n${chips.map(c => `        <li>${esc(c)}</li>`).join('\n')}\n      </ul>`);
    }
    if(g.whole){
      areaParts.push(multi
        ? `<p>${chips.length ? '上記に加えて、' : ''}ほかの警察署の管轄区域を除く、${esc(city)}のその他の区域。</p>`
        : `<p>${extraNames.length ? `下に記載した一部区域を除く、${esc(city)}の全域。` : `${esc(city)}の全域。`}</p>`);
    }
    const notes = g.caveats.map(c => `<p class="area-note">※ ${esc(c)}</p>`).join('\n      ');
    return `    <div class="area-station">
      <h2>${esc(g.station)}</h2>
      ${st ? `<table class="info-table">
        <tr><th>所在地</th><td>〒${esc(st.zip)} ${esc(st.addr)}</td></tr>
        <tr><th>電話番号</th><td><a href="tel:${st.tel.replace(/-/g, '')}">${esc(st.tel)}</a></td></tr>
        <tr><th>公式ページ</th><td><a href="${esc(st.url)}" target="_blank" rel="noopener">${esc(pref.label)}警察の公式サイトで見る</a></td></tr>
      </table>` : ''}
      <h3>${esc(city)}の中の管轄区域</h3>
      ${areaParts.join('\n      ')}
      ${notes}
    </div>`;
  }).join('\n\n');

  const extraBlocks = extra.map(e => {
    const st = pref.stations.find(s => s.name === e.station);
    return `    <div class="area-station">
      <h2>${esc(e.station)}<span class="area-partial">一部区域</span></h2>
      <table class="info-table">
        <tr><th>所在地</th><td>〒${esc(st.zip)} ${esc(st.addr)}</td></tr>
        <tr><th>電話番号</th><td><a href="tel:${st.tel.replace(/-/g, '')}">${esc(st.tel)}</a></td></tr>
        <tr><th>公式ページ</th><td><a href="${esc(st.url)}" target="_blank" rel="noopener">${esc(pref.label)}警察の公式サイトで見る</a></td></tr>
      </table>
      <h3>${esc(city)}の中の管轄区域</h3>
      ${e.caveats.map(c => `<p class="area-note">※ ${esc(c)}</p>`).join('\n      ')}
    </div>`;
  }).join('\n\n');

  const others = allCities.filter(c => c !== city)
    .map(c => `        <li><a href="${SLUGS[c]}.html">${esc(c)}</a></li>`).join('\n');

  const lookupUrl = `../?pref=${pref.id}&amp;q=${encodeURIComponent(city)}`;

  const jsonld = breadcrumbLd([
    ['トップ', BASE], ['市区町村別の管轄警察署', `${BASE}area/`],
    [pref.label, `${BASE}area/#${pref.id}`], [city, canonical],
  ]);

  return head({ title, description, canonical, prefix: '../', jsonld }) + header('../', 'area') + `

<div class="article-head">
  <div class="wrap">
    <p class="breadcrumb"><a href="../">トップ</a> ／ <a href="./">市区町村別</a> ／ <a href="./#${pref.id}">${esc(pref.label)}</a> ／ ${esc(city)}</p>
    <div class="article-head-inner">
      <div class="article-head-icon">
        ${PIN_ICON}
      </div>
      <div class="article-head-text">
    <p class="kicker">${esc(pref.label)} ／ 市区町村別の管轄</p>
    <h1>${esc(city)}の管轄警察署</h1>
    <p class="dek">${esc(dek)}</p>
      </div>
    </div>
  </div>
</div>

<div class="article-body">
  <div class="wrap">

${stationBlocks}
${extraBlocks ? '\n' + extraBlocks + '\n' : ''}
    <div class="callout">
      <strong>番地まで入れて確認する</strong><br>
      住所をそのまま入力して判定したい場合は、<a href="${lookupUrl}">トップページの住所検索</a>をご利用ください。境界付近や「一部」とされる区域では判定が難しいことがあるため、申請の前には必ず警察署に電話などで確認してください。
    </div>

    <h3>この地域で警察署が窓口になる主な手続き</h3>
    <div class="related">
${GUIDES.map(([href, label]) => `      <a href="../${href}">${label}</a>`).join('\n')}
    </div>

    <h3 style="margin-top:40px;">${esc(pref.label)}のほかの市区町村</h3>
      <ul class="area-links">
${others}
      </ul>

    <p class="area-note">出典：${esc(pref.source)}。掲載内容は作成時点のものです。組織改編や管轄区域の変更により、実際と異なる場合があります。</p>

  </div>
</div>

` + footer('../') + `

<script src="../assets/nav.js" defer></script>
</body>
</html>
`;
}

// ---------- 一覧（ハブ）ページ ----------
function hubPage(){
  const canonical = `${BASE}area/`;
  const sections = prefs.map(pref => {
    const cities = [...new Set(pref.rules.map(r => r.city))];
    const items = cities.map(c => {
      const groups = groupCity(pref, c);
      const sts = groups.map(g => shortSt(g.station));
      const ex = noteOnlyStations(pref, c, groups).map(e => shortSt(e.station));
      const label = sts.join('・') + (ex.length ? `（一部 ${ex.join('・')}）` : '') + (sts.length > 1 ? '（町丁目で分割）' : '');
      return `        <li><a href="${SLUGS[c]}.html">${esc(c)}</a><span class="area-dir-st">${esc(label)}</span></li>`;
    }).join('\n');
    return `    <h2 id="${pref.id}" class="pref-heading" data-pref="${pref.id}">${esc(pref.label)}（${pref.stationCount}署）</h2>
      <ul class="area-dir">
${items}
      </ul>`;
  }).join('\n\n');

  const jsonld = breadcrumbLd([['トップ', BASE], ['市区町村別の管轄警察署', canonical]]);

  return head({
    title: `市区町村別の管轄警察署一覧（大阪・京都・兵庫）｜${SITE_NAME}`,
    description: '大阪府・京都府・兵庫県の市区町村ごとに、管轄する警察署をまとめた一覧です。同じ区・市の中で町丁目によって管轄が分かれる地域は、町丁目名まで掲載しています。',
    canonical, prefix: '../', jsonld,
  }) + header('../', 'area') + `

<div class="article-head">
  <div class="wrap">
    <p class="breadcrumb"><a href="../">トップ</a> ／ 市区町村別</p>
    <div class="article-head-inner">
      <div class="article-head-icon">
        ${PIN_ICON}
      </div>
      <div class="article-head-text">
    <p class="kicker">市区町村別の管轄</p>
    <h1>市区町村から管轄警察署を探す</h1>
    <p class="dek">大阪府・京都府・兵庫県の市区町村ごとに、管轄する警察署をまとめています。「町丁目で分割」とある地域は、同じ区・市の中でも場所によって窓口の警察署が変わります。</p>
      </div>
    </div>
    <div class="related" style="margin-top:18px;">
${prefs.map(p => `      <a href="#${p.id}">${esc(p.label)}</a>`).join('\n')}
    </div>
  </div>
</div>

<div class="article-body">
  <div class="wrap">

${sections}

    <p class="area-note">町丁目までの判定は、<a href="../">トップページの住所検索</a>でもできます。</p>

  </div>
</div>

` + footer('../') + `

<script src="../assets/nav.js" defer></script>
</body>
</html>
`;
}

// ---------- 書き出し ----------
const outDir = path.join(ROOT, 'area');
fs.mkdirSync(outDir, { recursive: true });
fs.readdirSync(outDir).filter(f => f.endsWith('.html')).forEach(f => fs.unlinkSync(path.join(outDir, f)));

const usedSlugs = new Set();
const areaUrls = [];
prefs.forEach(pref => {
  const cities = [...new Set(pref.rules.map(r => r.city))];
  cities.forEach(city => {
    const slug = SLUGS[city];
    if(!slug) throw new Error(`SLUGS に未登録の市区町村があります：${city}`);
    if(usedSlugs.has(slug)) throw new Error(`ファイル名が重複しています：${slug}`);
    usedSlugs.add(slug);
    fs.writeFileSync(path.join(outDir, `${slug}.html`), cityPage(pref, city, cities));
    areaUrls.push(`area/${slug}.html`);
  });
});
fs.writeFileSync(path.join(outDir, 'index.html'), hubPage());

const urlEntry = (loc, priority) => `  <url>\n    <loc>${BASE}${loc}</loc>\n    <lastmod>${TODAY}</lastmod>\n    <priority>${priority}</priority>\n  </url>`;
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<!-- このファイルは tools/build-area-pages.js で自動生成しています。手で編集せず、スクリプトを再実行してください。 -->
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...STATIC_PAGES.map(([p, pr]) => urlEntry(p, pr)), urlEntry('area/', '0.8'), ...areaUrls.map(u => urlEntry(u, '0.7'))].join('\n')}
</urlset>
`;
fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), sitemap);

console.log(`市区町村ページ ${areaUrls.length} 件、一覧ページ 1 件、sitemap.xml（${STATIC_PAGES.length + 1 + areaUrls.length} URL）を生成しました。`);

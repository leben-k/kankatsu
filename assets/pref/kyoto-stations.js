/* 京都府警察 24署 データ
   出典：京都府警察公式サイト「警察本部・警察署・交番等所在地」
   https://www.pref.kyoto.jp/fukei/site/keimu_k/shozaiti/index.html （2026年7月8日更新版） */

var STATIONS = [
  // ---- 京都市内（11署。京都市の11区とそれぞれ1対1で対応） ----
  {name:"上京警察署", zip:"602-8386", addr:"京都市上京区御前通今小路下る馬喰町692-1", tel:"075-465-0110", area:"京都市内", url:"https://www.pref.kyoto.jp/fukei/site/policemap/kamigyo/index.html"},
  {name:"東山警察署", zip:"605-0862", addr:"京都市東山区清水4丁目185-6", tel:"075-525-0110", area:"京都市内", url:"https://www.pref.kyoto.jp/fukei/site/policemap/higashiyama/index.html"},
  {name:"中京警察署", zip:"604-8804", addr:"京都市中京区壬生坊城町48-16", tel:"075-823-0110", area:"京都市内", url:"https://www.pref.kyoto.jp/fukei/site/policemap/nakagyo/index.html"},
  {name:"下京警察署", zip:"600-8413", addr:"京都市下京区烏丸通高辻上る大政所町682", tel:"075-352-0110", area:"京都市内", url:"https://www.pref.kyoto.jp/fukei/site/policemap/shimogyo/index.html"},
  {name:"左京警察署", zip:"606-8206", addr:"京都市左京区田中馬場町6", tel:"075-703-0110", area:"京都市内", url:"https://www.pref.kyoto.jp/fukei/site/policemap/sakyou.html"},
  {name:"伏見警察署", zip:"612-8384", addr:"京都市伏見区下鳥羽浄春ケ前町101", tel:"075-602-0110", area:"京都市内", url:"https://www.pref.kyoto.jp/fukei/site/policemap/fushimi/index.html"},
  {name:"山科警察署", zip:"607-8185", addr:"京都市山科区大宅神納町167", tel:"075-575-0110", area:"京都市内", url:"https://www.pref.kyoto.jp/fukei/site/policemap/yamashina/index.html"},
  {name:"右京警察署", zip:"616-8162", addr:"京都市右京区太秦蜂岡町31", tel:"075-865-0110", area:"京都市内", url:"https://www.pref.kyoto.jp/fukei/site/policemap/ukyo/index.html"},
  {name:"南警察署", zip:"601-8444", addr:"京都市南区西九条森本町39-2", tel:"075-682-0110", area:"京都市内", url:"https://www.pref.kyoto.jp/fukei/site/policemap/minami/index.html"},
  {name:"北警察署", zip:"603-8202", addr:"京都市北区紫竹東桃ノ本町25", tel:"075-493-0110", area:"京都市内", url:"https://www.pref.kyoto.jp/fukei/site/policemap/kita/index.html"},
  {name:"西京警察署", zip:"615-8236", addr:"京都市西京区山田大吉見町7・8合地", tel:"075-391-0110", area:"京都市内", url:"https://www.pref.kyoto.jp/fukei/site/policemap/nishikyo/index.html"},

  // ---- 京都市外（13署） ----
  {name:"向日町警察署", zip:"617-0006", addr:"向日市上植野町上川原5", tel:"075-921-0110", area:"京都市外", url:"https://www.pref.kyoto.jp/fukei/site/policemap/mukomachi/index.html"},
  {name:"宇治警察署", zip:"611-0021", addr:"宇治市宇治宇文字2-12", tel:"0774-21-0110", area:"京都市外", url:"https://www.pref.kyoto.jp/fukei/site/policemap/uji/index.html"},
  {name:"城陽警察署", zip:"610-0121", addr:"城陽市寺田庭井25-1", tel:"0774-53-0110", area:"京都市外", url:"https://www.pref.kyoto.jp/fukei/site/policemap/joyo/index.html"},
  {name:"八幡警察署", zip:"614-8071", addr:"八幡市八幡五反田37-8", tel:"075-981-0110", area:"京都市外", url:"https://www.pref.kyoto.jp/fukei/site/policemap/yawata/index.html"},
  {name:"田辺警察署", zip:"610-0332", addr:"京田辺市興戸小モ詰1", tel:"0774-63-0110", area:"京都市外", url:"https://www.pref.kyoto.jp/fukei/site/policemap/tanabe/index.html"},
  {name:"木津警察署", zip:"619-0214", addr:"木津川市木津南垣外15", tel:"0774-72-0110", area:"京都市外", url:"https://www.pref.kyoto.jp/fukei/site/policemap/kidu/index.html"},
  {name:"亀岡警察署", zip:"621-0805", addr:"亀岡市安町大池8", tel:"0771-24-0110", area:"京都市外", url:"https://www.pref.kyoto.jp/fukei/site/policemap/kameoka/index.html"},
  {name:"南丹警察署", zip:"622-0014", addr:"南丹市園部町上本町南2-5", tel:"0771-62-0110", area:"京都市外", url:"https://www.pref.kyoto.jp/fukei/site/policemap/nantan/index.html"},
  {name:"綾部警察署", zip:"623-0053", addr:"綾部市宮代町宮ノ下6・7・8合地", tel:"0773-43-0110", area:"京都市外", url:"https://www.pref.kyoto.jp/fukei/site/policemap/ayabe/index.html"},
  {name:"福知山警察署", zip:"620-0882", addr:"福知山市字堀小字上高田2108-3", tel:"0773-22-0110", area:"京都市外", url:"https://www.pref.kyoto.jp/fukei/site/policemap/fukuchiyama/index.html"},
  {name:"舞鶴警察署", zip:"624-0853", addr:"舞鶴市南田辺9", tel:"0773-75-0110", area:"京都市外", url:"https://www.pref.kyoto.jp/fukei/site/policemap/maiduru/index.html"},
  {name:"宮津警察署", zip:"626-0041", addr:"宮津市字鶴賀2151", tel:"0772-25-0110", area:"京都市外", url:"https://www.pref.kyoto.jp/fukei/site/policemap/miyadu/index.html"},
  {name:"京丹後警察署", zip:"627-0042", addr:"京丹後市峰山町長岡469-1", tel:"0772-62-0110", area:"京都市外", url:"https://www.pref.kyoto.jp/fukei/site/policemap/kyotango/index.html"}
];

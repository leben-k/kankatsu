/* 兵庫県警察 46署 データ
   出典：兵庫県警察公式サイト「警察署一覧」
   https://www.police.pref.hyogo.lg.jp/shokai/keisatu/index2.htm */

var STATIONS = [
  // ---- 神戸市内（12署） ----
  {name:"東灘警察署", zip:"658-0054", addr:"神戸市東灘区御影中町2丁目3番2号", tel:"078-854-0110", area:"神戸市内", url:"https://www.police.pref.hyogo.lg.jp/ps/01higashinada/index.htm"},
  {name:"灘警察署", zip:"657-0831", addr:"神戸市灘区水道筋1丁目24番地の8", tel:"078-802-0110", area:"神戸市内", url:"https://www.police.pref.hyogo.lg.jp/ps/02nada/index.htm"},
  {name:"葺合警察署", zip:"651-0076", addr:"神戸市中央区吾妻通5丁目1番2号", tel:"078-231-0110", area:"神戸市内", url:"https://www.police.pref.hyogo.lg.jp/ps/03fukiai/index.htm"},
  {name:"生田警察署", zip:"650-0004", addr:"神戸市中央区中山手通2丁目2番25号", tel:"078-333-0110", area:"神戸市内", url:"https://www.police.pref.hyogo.lg.jp/ps/04ikuta/index.htm"},
  {name:"兵庫警察署", zip:"652-0047", addr:"神戸市兵庫区下沢通3丁目1番28号", tel:"078-577-0110", area:"神戸市内", url:"https://www.police.pref.hyogo.lg.jp/ps/05hyogo/index.htm"},
  {name:"長田警察署", zip:"653-0016", addr:"神戸市長田区北町3丁目4番地9", tel:"078-578-0110", area:"神戸市内", url:"https://www.police.pref.hyogo.lg.jp/ps/06nagata/index.htm"},
  {name:"須磨警察署", zip:"654-0026", addr:"神戸市須磨区大池町5丁目1番30号", tel:"078-731-0110", area:"神戸市内", url:"https://www.police.pref.hyogo.lg.jp/ps/07suma/index.htm"},
  {name:"垂水警察署", zip:"655-0006", addr:"神戸市垂水区本多聞3丁目12番1号", tel:"078-781-0110", area:"神戸市内", url:"https://www.police.pref.hyogo.lg.jp/ps/08tarumi/index.htm"},
  {name:"神戸水上警察署", zip:"650-0045", addr:"神戸市中央区港島3丁目1番", tel:"078-306-0110", area:"神戸市内（水上）", url:"https://www.police.pref.hyogo.lg.jp/ps/09suijyou/index.htm"},
  {name:"神戸西警察署", zip:"651-2273", addr:"神戸市西区糀台5丁目12番地の2", tel:"078-992-0110", area:"神戸市内", url:"https://www.police.pref.hyogo.lg.jp/ps/10kobenishi/index.htm"},
  {name:"神戸北警察署", zip:"651-1142", addr:"神戸市北区甲栄台3丁目6番1号", tel:"078-594-0110", area:"神戸市内", url:"https://www.police.pref.hyogo.lg.jp/ps/11kobekita/index.htm"},
  {name:"有馬警察署", zip:"651-1301", addr:"神戸市北区藤原台北町6丁目18番1号", tel:"078-981-0110", area:"神戸市内", url:"https://www.police.pref.hyogo.lg.jp/ps/12arima/index.htm"},

  // ---- 阪神地区（12署） ----
  {name:"芦屋警察署", zip:"659-0065", addr:"芦屋市公光町6番7号", tel:"0797-23-0110", area:"阪神", url:"https://www.police.pref.hyogo.lg.jp/ps/13ashiya/index.htm"},
  {name:"西宮警察署", zip:"662-0853", addr:"西宮市津田町3番3号", tel:"0798-33-0110", area:"阪神", url:"https://www.police.pref.hyogo.lg.jp/ps/14nishinomiya/index.htm"},
  {name:"甲子園警察署", zip:"663-8177", addr:"西宮市甲子園七番町11番14号", tel:"0798-41-0110", area:"阪神", url:"https://www.police.pref.hyogo.lg.jp/ps/15koshien/index.htm"},
  {name:"尼崎南警察署", zip:"660-0881", addr:"尼崎市昭和通2丁目6番82号", tel:"06-6487-0110", area:"阪神", url:"https://www.police.pref.hyogo.lg.jp/ps/16amaminami/index.htm"},
  {name:"尼崎東警察署", zip:"661-0976", addr:"尼崎市潮江5丁目8番55号", tel:"06-6424-0110", area:"阪神", url:"https://www.police.pref.hyogo.lg.jp/ps/17amahigashi/index.htm"},
  {name:"尼崎北警察署", zip:"661-0012", addr:"尼崎市南塚口町2丁目13番23号", tel:"06-6426-0110", area:"阪神", url:"https://www.police.pref.hyogo.lg.jp/ps/18amakita/index.htm"},
  {name:"伊丹警察署", zip:"664-0898", addr:"伊丹市千僧1丁目51番地の2", tel:"072-771-0110", area:"阪神", url:"https://www.police.pref.hyogo.lg.jp/ps/19itami/index.htm"},
  {name:"川西警察署", zip:"666-0003", addr:"川西市丸の内町1番1号", tel:"072-755-0110", area:"阪神", url:"https://www.police.pref.hyogo.lg.jp/ps/20kawanishi/index.htm"},
  {name:"宝塚警察署", zip:"665-0835", addr:"宝塚市旭町1丁目2番30号", tel:"0797-85-0110", area:"阪神", url:"https://www.police.pref.hyogo.lg.jp/ps/21takaraduka/index.htm"},
  {name:"三田警察署", zip:"669-1531", addr:"三田市天神1丁目10番1号", tel:"079-563-0110", area:"阪神", url:"https://www.police.pref.hyogo.lg.jp/ps/22sanda/index.htm"},
  {name:"篠山警察署", zip:"669-2341", addr:"丹波篠山市郡家403番地18", tel:"079-552-0110", area:"丹波", url:"https://www.police.pref.hyogo.lg.jp/ps/23sasayama/index.htm"},
  {name:"丹波警察署", zip:"669-3309", addr:"丹波市柏原町柏原2649番地", tel:"0795-72-0110", area:"丹波", url:"https://www.police.pref.hyogo.lg.jp/ps/24tanba/index.htm"},

  // ---- 東播・北播地区（8署） ----
  {name:"明石警察署", zip:"673-0025", addr:"明石市田町2丁目10番10号", tel:"078-922-0110", area:"東播", url:"https://www.police.pref.hyogo.lg.jp/ps/25akashi/index.htm"},
  {name:"三木警察署", zip:"673-0405", addr:"三木市平田240番地の1", tel:"0794-82-0110", area:"北播", url:"https://www.police.pref.hyogo.lg.jp/ps/26miki/index.htm"},
  {name:"小野警察署", zip:"675-1366", addr:"小野市中島町535-1", tel:"0794-64-0110", area:"北播", url:"https://www.police.pref.hyogo.lg.jp/ps/49ono/index.htm"},
  {name:"加東警察署", zip:"673-1431", addr:"加東市社1075番地の2", tel:"0795-42-0110", area:"北播", url:"https://www.police.pref.hyogo.lg.jp/ps/27kato/index.htm"},
  {name:"加西警察署", zip:"675-2321", addr:"加西市北条町東高室873番地の7", tel:"0790-42-0110", area:"北播", url:"https://www.police.pref.hyogo.lg.jp/ps/28kasai/index.htm"},
  {name:"西脇警察署", zip:"677-0014", addr:"西脇市郷瀬町666番地の6", tel:"0795-22-0110", area:"北播", url:"https://www.police.pref.hyogo.lg.jp/ps/29nishiwaki/index.htm"},
  {name:"加古川警察署", zip:"675-0101", addr:"加古川市平岡町新在家1224番地の13", tel:"079-427-0110", area:"東播", url:"https://www.police.pref.hyogo.lg.jp/ps/30kakogawa/index.htm"},
  {name:"高砂警察署", zip:"676-0015", addr:"高砂市荒井町紙町1番48号", tel:"079-442-0110", area:"東播", url:"https://www.police.pref.hyogo.lg.jp/ps/31takasago/index.htm"},

  // ---- 姫路・西播地区（8署） ----
  {name:"姫路警察署", zip:"670-0943", addr:"姫路市市之郷926番地5", tel:"079-222-0110", area:"西播", url:"https://www.police.pref.hyogo.lg.jp/ps/32himeji/index.htm"},
  {name:"飾磨警察署", zip:"672-8035", addr:"姫路市飾磨区中島1130番地9", tel:"079-235-0110", area:"西播", url:"https://www.police.pref.hyogo.lg.jp/ps/33shikama/index.htm"},
  {name:"網干警察署", zip:"671-1234", addr:"姫路市網干区新在家1336番地の6", tel:"079-274-0110", area:"西播", url:"https://www.police.pref.hyogo.lg.jp/ps/34aboshi/index.htm"},
  {name:"福崎警察署", zip:"679-2214", addr:"神崎郡福崎町福崎新376番地の3", tel:"0790-23-0110", area:"西播", url:"https://www.police.pref.hyogo.lg.jp/ps/35fukusaki/index.htm"},
  {name:"たつの警察署", zip:"679-4167", addr:"たつの市龍野町富永1005番地の75", tel:"0791-63-0110", area:"西播", url:"https://www.police.pref.hyogo.lg.jp/ps/36tatuno/index.htm"},
  {name:"相生警察署", zip:"678-0007", addr:"相生市陸本町11番26号", tel:"0791-22-0110", area:"西播", url:"https://www.police.pref.hyogo.lg.jp/ps/37aioi/index.htm"},
  {name:"赤穂警察署", zip:"678-0233", addr:"赤穂市加里屋中洲1丁目17番地", tel:"0791-43-0110", area:"西播", url:"https://www.police.pref.hyogo.lg.jp/ps/38ako/index.htm"},
  {name:"宍粟警察署", zip:"671-2573", addr:"宍粟市山崎町今宿5番地", tel:"0790-62-0110", area:"西播", url:"https://www.police.pref.hyogo.lg.jp/ps/40shiso/index.htm"},

  // ---- 但馬地区（3署） ----
  {name:"南但馬警察署", zip:"669-5213", addr:"朝来市和田山町玉置653番地2", tel:"079-672-0110", area:"但馬", url:"https://www.police.pref.hyogo.lg.jp/ps/41minamitajima/index.htm"},
  {name:"豊岡警察署", zip:"668-0055", addr:"豊岡市昭和町7番5号", tel:"0796-24-0110", area:"但馬", url:"https://www.police.pref.hyogo.lg.jp/ps/43toyooka/index.htm"},
  {name:"美方警察署", zip:"669-6746", addr:"美方郡新温泉町戸田37番地", tel:"0796-82-0110", area:"但馬", url:"https://www.police.pref.hyogo.lg.jp/ps/45mikata/index.htm"},

  // ---- 淡路地区（3署） ----
  {name:"洲本警察署", zip:"656-0024", addr:"洲本市山手2丁目1番3号", tel:"0799-22-0110", area:"淡路", url:"https://www.police.pref.hyogo.lg.jp/ps/46sumoto/index.htm"},
  {name:"淡路警察署", zip:"656-2401", addr:"淡路市岩屋2942番地の24", tel:"0799-72-0110", area:"淡路", url:"https://www.police.pref.hyogo.lg.jp/ps/47awaji/index.htm"},
  {name:"南あわじ警察署", zip:"656-0472", addr:"南あわじ市市善光寺18番の25", tel:"0799-42-0110", area:"淡路", url:"https://www.police.pref.hyogo.lg.jp/ps/48minamiawaji/index.htm"}
];

/* 兵庫県警察 管轄区域データ
   出典：兵庫県警察公式サイト「警察署名称・位置及び管轄区域」「警察署の管轄区域」
   https://www.police.pref.hyogo.lg.jp/shokai/keisatu/index3.htm
   https://www.police.pref.hyogo.lg.jp/shokai/keisatu/index3_2.htm （令和元年5月7日現在の版を基準に作成）
   甲子園警察署の管轄区域は、各署の「警察署の紹介」「交番案内」ページ（例：
   https://www.police.pref.hyogo.lg.jp/ps/15koshien/index.htm ）もあわせて参照し、
   より正確なリストに更新しています。
   神戸市中央区（葺合・生田・水上）、神戸市北区（有馬・神戸北）、西宮市（甲子園・西宮）、
   尼崎市（尼崎東・尼崎北・尼崎南）、姫路市（飾磨・網干・姫路）は、公式サイトに掲載されて
   いる町丁目単位の一覧をもとに作成しています。「の一部」とされる区域は、正確な境界線までは
   反映できていないため、該当ルールに注記を付けています。 */

var JURISDICTION_RULES = [
  {city:"神戸市中央区", station:"葺合警察署", names:["加納町1丁目","三宮町1丁目","中尾町","葺合町","脇浜海岸通"], ranges:[{base:"旭通",from:1,to:5},{base:"吾妻通",from:1,to:6},{base:"生田町",from:1,to:4},{base:"磯上通",from:1,to:8},{base:"磯辺通",from:1,to:4},{base:"小野柄通",from:1,to:8},{base:"籠池通",from:1,to:7},{base:"上筒井通",from:1,to:7},{base:"神若通",from:1,to:7},{base:"北本町通",from:1,to:6},{base:"国香通",from:1,to:7},{base:"雲井通",from:1,to:8},{base:"熊内町",from:1,to:9},{base:"熊内橋通",from:1,to:7},{base:"御幸通",from:1,to:8},{base:"琴ノ緒町",from:1,to:5},{base:"坂口通",from:1,to:7},{base:"東雲通",from:1,to:6},{base:"神仙寺通",from:1,to:4},{base:"大日通",from:1,to:7},{base:"筒井町",from:1,to:3},{base:"中島通",from:1,to:5},{base:"二宮町",from:1,to:4},{base:"布引町",from:1,to:4},{base:"野崎通",from:1,to:7},{base:"旗塚通",from:1,to:7},{base:"八幡通",from:1,to:4},{base:"浜辺通",from:1,to:6},{base:"日暮通",from:1,to:6},{base:"真砂通",from:1,to:2},{base:"南本町通",from:1,to:6},{base:"宮本通",from:1,to:7},{base:"八雲通",from:1,to:6},{base:"若菜通",from:1,to:6},{base:"脇浜海岸通",from:1,to:4},{base:"脇浜町",from:1,to:3},{base:"割塚通",from:1,to:7}], caveat:"「の一部」とされる区域が一部含まれます。詳細は兵庫県警察公式サイトでご確認ください。"},
  {city:"神戸市中央区", station:"神戸水上警察署", names:["磯上通1丁目","小野浜町","神戸空港","新港町","波止場町","弁天町"], ranges:[{base:"海岸通",from:1,to:6},{base:"浜辺通",from:1,to:6},{base:"港島",from:1,to:9},{base:"港島中町",from:1,to:8},{base:"港島南町",from:1,to:7}], caveat:"海面・港湾施設が中心の管轄です。「の一部」とされる区域が含まれます。"},
  {city:"神戸市中央区", station:"生田警察署", whole:true},
  {city:"神戸市北区", station:"有馬警察署", names:["有馬町","山田町","有野町","唐櫃六甲台","八多町","大沢町","道場町","長尾町","淡河町"], ranges:[{base:"有野中町",from:1,to:4},{base:"菖蒲が丘",from:1,to:3},{base:"西山",from:1,to:2},{base:"藤原台北町",from:1,to:7},{base:"藤原台中町",from:1,to:8},{base:"藤原台南町",from:1,to:5},{base:"東有野台",from:1,to:5},{base:"唐櫃台",from:1,to:4},{base:"西大池",from:1,to:2},{base:"東大池",from:1,to:3},{base:"有野台",from:1,to:9},{base:"京地",from:1,to:4},{base:"赤松台",from:1,to:2},{base:"上津台",from:1,to:9},{base:"鹿の子台北町",from:1,to:8},{base:"鹿の子台南町",from:1,to:6}], caveat:"公式サイトの記載を一部要約しています。詳細は公式サイトでご確認ください。"},
  {city:"神戸市北区", station:"神戸北警察署", whole:true},
  {city:"西宮市", station:"甲子園警察署", names:["上鳴尾町","池開町","今津野田町","今津上野町","上田西町","上田中町","上田東町","枝川町","笠屋町","甲子園町","戸崎町","花園町","古川町","武庫川町","甲子園一番町","甲子園二番町","甲子園三番町","甲子園四番町","甲子園五番町","甲子園六番町","甲子園七番町","甲子園八番町","甲子園九番町","甲子園春風町","甲子園浜田町","甲子園砂田町","甲子園六石町","甲子園浦風町","甲子園高潮町","甲子園洲鳥町","甲子園網引町","甲子園三保町","今津真砂町"], ranges:[{base:"学文殿町",from:1,to:2},{base:"上甲子園",from:1,to:5},{base:"甲子園口",from:1,to:6},{base:"小曽根町",from:1,to:4},{base:"小松町",from:1,to:2},{base:"小松北町",from:1,to:2},{base:"小松東町",from:1,to:3},{base:"小松西町",from:1,to:2},{base:"小松南町",from:1,to:3},{base:"里中町",from:1,to:3},{base:"高須町",from:1,to:2},{base:"鳴尾町",from:1,to:5},{base:"鳴尾浜",from:1,to:3},{base:"浜甲子園",from:1,to:4},{base:"東鳴尾町",from:1,to:2},{base:"南甲子園",from:1,to:3},{base:"若草町",from:1,to:2}], caveat:"今津真砂町・甲子園九番町の一部は西宮警察署の管轄です。詳細は公式サイトでご確認ください。"},
  {city:"西宮市", station:"西宮警察署", whole:true},
  {city:"尼崎市", station:"尼崎東警察署", names:["大物町1丁目","東大物町1丁目","扶桑町","梶ケ島","神崎町","善法寺","善法寺町","高田","高田町","額田","額田町","名神町3丁目","弥生ケ丘町","猪名寺","上食満","下食満","中食満","塚口本町8丁目","戸ノ内","法界寺","南清水"], ranges:[{base:"今福",from:1,to:2},{base:"金楽寺町",from:1,to:2},{base:"杭瀬北新町",from:1,to:4},{base:"杭瀬寺島",from:1,to:2},{base:"杭瀬本町",from:1,to:3},{base:"杭瀬南新町",from:1,to:4},{base:"久々知",from:1,to:3},{base:"久々知西町",from:1,to:2},{base:"潮江",from:1,to:5},{base:"下坂部",from:1,to:4},{base:"常光寺",from:1,to:4},{base:"次屋",from:1,to:4},{base:"長洲中通",from:1,to:3},{base:"長洲西通",from:1,to:2},{base:"長洲東通",from:1,to:3},{base:"長洲本通",from:1,to:3},{base:"西川",from:1,to:2},{base:"西長洲町",from:1,to:3},{base:"浜",from:1,to:3},{base:"猪名寺",from:1,to:2},{base:"上坂部",from:1,to:3},{base:"瓦宮",from:1,to:2},{base:"口田中",from:1,to:2},{base:"食満",from:1,to:7},{base:"小中島",from:1,to:3},{base:"椎堂",from:1,to:2},{base:"田能",from:1,to:6},{base:"戸ノ内町",from:1,to:6},{base:"若王寺",from:1,to:3},{base:"東園田町",from:1,to:9},{base:"東塚口町",from:1,to:2},{base:"御園",from:1,to:3}]},
  {city:"尼崎市", station:"尼崎北警察署", names:["武庫之荘西2丁目","猪名寺3丁目"], ranges:[{base:"大西町",from:1,to:3},{base:"尾浜町",from:1,to:3},{base:"上ノ島町",from:1,to:3},{base:"栗山町",from:1,to:2},{base:"三反田町",from:1,to:3},{base:"立花町",from:1,to:4},{base:"塚口町",from:1,to:6},{base:"塚口本町",from:1,to:7},{base:"富松町",from:1,to:4},{base:"水堂町",from:1,to:4},{base:"南塚口町",from:1,to:8},{base:"南武庫之荘",from:1,to:12},{base:"武庫之荘東",from:1,to:2},{base:"武庫之荘本町",from:1,to:3},{base:"名神町",from:1,to:2},{base:"常松",from:1,to:2},{base:"常吉",from:1,to:2},{base:"西昆陽",from:1,to:4},{base:"武庫町",from:1,to:4},{base:"武庫の里",from:1,to:2},{base:"武庫之荘",from:1,to:9},{base:"武庫元町",from:1,to:3},{base:"武庫豊町",from:2,to:3}]},
  {city:"尼崎市", station:"尼崎南警察署", whole:true},
  {city:"姫路市", station:"飾磨警察署", names:["家島町坊勢","家島町真浦","家島町宮","井ノ口","今宿","大塩町","大塩町宮前","岡田","奥山","兼田","上手野","北原","北夢前台2丁目","木場","木場十八反町","木場前中町","木場前七反町","栗山町","西庄","三条町2丁目","飾磨区英賀","飾磨区英賀保駅前町","飾磨区英賀宮台","飾磨区阿成","飾磨区阿成植木","飾磨区阿成鹿古","飾磨区阿成下垣内","飾磨区阿成中垣内","飾磨区阿成渡場","飾磨区今在家","飾磨区入船町","飾磨区恵美酒","飾磨区大浜","飾磨区粕谷新町","飾磨区構","飾磨区鎌倉町","飾磨区亀山","飾磨区加茂","飾磨区加茂北","飾磨区加茂東","飾磨区加茂南","飾磨区御幸","飾磨区栄町","飾磨区三和町","飾磨区思案橋","飾磨区清水","飾磨区須加","飾磨区蓼野町","飾磨区玉地","飾磨区付城","飾磨区天神","飾磨区中島","飾磨区野田町","飾磨区東堀","飾磨区富士見ケ丘町","飾磨区細江","飾磨区堀川町","飾磨区宮","飾磨区妻鹿","飾磨区妻鹿東海町","飾磨区妻鹿常盤町","飾磨区妻鹿日田町","飾磨区山崎","飾磨区山崎台","飾磨区若宮町","四郷町明田","四郷町上鈴","四郷町坂元","四郷町中鈴","四郷町東阿保","四郷町本郷","四郷町見野","四郷町山脇","白浜町","白浜町灘浜","高岡新町","中地","中地南町","町坪","町坪南町","継","苫編","名古山町","西延末","延末","東延末","東山","藤ヶ台","別所町家具町","別所町北宿","別所町小林","別所町佐土","別所町佐土新","別所町別所","的形町福泊","的形町的形","御国野町国分寺","御国野町御着","御国野町西御着","御国野町深志野","八家"], ranges:[{base:"飯田",from:1,to:3},{base:"大塩町汐咲",from:1,to:3},{base:"亀山",from:1,to:2},{base:"北今宿",from:1,to:3},{base:"車崎",from:1,to:3},{base:"飾磨区英賀春日町",from:1,to:2},{base:"飾磨区英賀清水町",from:1,to:3},{base:"飾磨区英賀西町",from:1,to:3},{base:"飾磨区英賀東町",from:1,to:2},{base:"飾磨区英賀宮町",from:1,to:2},{base:"飾磨区今在家",from:2,to:7},{base:"飾磨区今在家北",from:1,to:3},{base:"飾磨区構",from:1,to:5},{base:"飾磨区上野田",from:1,to:6},{base:"飾磨区清水",from:1,to:3},{base:"飾磨区下野田",from:1,to:4},{base:"飾磨区城南町",from:1,to:3},{base:"飾磨区高町",from:1,to:2},{base:"飾磨区付城",from:1,to:2},{base:"飾磨区都倉",from:1,to:3},{base:"飾磨区中島",from:1,to:3},{base:"飾磨区中野田",from:1,to:4},{base:"飾磨区中浜町",from:1,to:3},{base:"飾磨区西浜町",from:1,to:3},{base:"飾磨区三宅",from:1,to:3},{base:"飾磨区矢倉町",from:1,to:2},{base:"下手野",from:1,to:6},{base:"白浜町宇佐崎北",from:1,to:3},{base:"白浜町宇佐崎中",from:1,to:3},{base:"白浜町宇佐崎南",from:1,to:2},{base:"白浜町神田",from:1,to:2},{base:"白浜町寺家",from:1,to:2},{base:"玉手",from:1,to:4},{base:"土山",from:4,to:7},{base:"手柄",from:1,to:2},{base:"苫編南",from:1,to:2},{base:"西今宿",from:1,to:8},{base:"東今宿",from:1,to:6},{base:"東延末",from:1,to:5},{base:"東夢前台",from:1,to:3},{base:"別所町佐土",from:1,to:3},{base:"別所町別所",from:1,to:5},{base:"神子岡前",from:1,to:4},{base:"安田",from:1,to:3},{base:"山吹",from:1,to:2}]},
  {city:"姫路市", station:"網干警察署", names:["網干区網干浜","網干区大江島","網干区大江島寺前町","網干区大江島古川町","網干区興浜","網干区垣内北町","網干区垣内中町","網干区垣内西町","網干区垣内東町","網干区垣内本町","網干区垣内南町","網干区北新在家","網干区坂出","網干区坂上","網干区新在家","網干区田井","網干区高田","網干区津市場","網干区浜田","網干区福井","網干区宮内","網干区余子浜","網干区和久","大津区北天満町","大津区吉美","大津区天満","大津区長松","大津区西土井","大津区平松","大津区真砂町","勝原区朝日谷","勝原区大谷","勝原区勝原町","勝原区勝山町","勝原区熊見","勝原区下太田","勝原区宮田","勝原区山戸","勝原区丁","広畑区蒲田","広畑区北河原町","広畑区京見町","広畑区小坂","広畑区才","広畑区城山町","広畑区西蒲田","広畑区則直","広畑区東夢前台4丁目","広畑区富士町","余部区上川原","余部区上余部","余部区下余部"], ranges:[{base:"大津区恵美酒町",from:1,to:2},{base:"大津区大津町",from:1,to:4},{base:"大津区勘兵衛町",from:1,to:5},{base:"大津区新町",from:1,to:2},{base:"大津区天神町",from:1,to:2},{base:"広畑区吾妻町",from:1,to:3},{base:"広畑区大町",from:1,to:3},{base:"広畑区蒲田",from:1,to:5},{base:"広畑区北野町",from:1,to:2},{base:"広畑区小松町",from:1,to:4},{base:"広畑区清水町",from:1,to:3},{base:"広畑区末広町",from:1,to:3},{base:"広畑区正門通",from:1,to:4},{base:"広畑区高浜町",from:1,to:4},{base:"広畑区鶴町",from:1,to:2},{base:"広畑区長町",from:1,to:2},{base:"広畑区西夢前台",from:4,to:8},{base:"広畑区早瀬町",from:1,to:3},{base:"広畑区東新町",from:1,to:3},{base:"広畑区本町",from:1,to:6},{base:"広畑区夢前町",from:1,to:4}]},
  {city:"姫路市", station:"姫路警察署", whole:true},
  {city:"神戸市東灘区", station:"東灘警察署", whole:true, caveat:"神戸水上警察署の管轄区域（港湾部）を除きます。"},
  {city:"神戸市灘区", station:"灘警察署", whole:true, caveat:"神戸水上警察署の管轄区域（港湾部）を除きます。"},
  {city:"神戸市兵庫区", station:"兵庫警察署", whole:true, caveat:"神戸水上警察署の管轄区域（港湾部）を除きます。"},
  {city:"神戸市長田区", station:"長田警察署", whole:true},
  {city:"神戸市須磨区", station:"須磨警察署", whole:true},
  {city:"神戸市垂水区", station:"垂水警察署", whole:true},
  {city:"神戸市西区", station:"神戸西警察署", whole:true},
  {city:"芦屋市", station:"芦屋警察署", whole:true},
  {city:"伊丹市", station:"伊丹警察署", whole:true},
  {city:"川西市", station:"川西警察署", whole:true},
  {city:"川辺郡", station:"川西警察署", whole:true},
  {city:"宝塚市", station:"宝塚警察署", whole:true},
  {city:"三田市", station:"三田警察署", whole:true},
  {city:"丹波篠山市", station:"篠山警察署", whole:true},
  {city:"丹波市", station:"丹波警察署", whole:true},
  {city:"明石市", station:"明石警察署", whole:true},
  {city:"三木市", station:"三木警察署", whole:true},
  {city:"小野市", station:"小野警察署", whole:true},
  {city:"加東市", station:"加東警察署", whole:true},
  {city:"加西市", station:"加西警察署", whole:true},
  {city:"西脇市", station:"西脇警察署", whole:true},
  {city:"多可郡", station:"西脇警察署", whole:true},
  {city:"加古川市", station:"加古川警察署", whole:true},
  {city:"加古郡", station:"加古川警察署", whole:true},
  {city:"高砂市", station:"高砂警察署", whole:true},
  {city:"神崎郡", station:"福崎警察署", whole:true},
  {city:"たつの市", station:"たつの警察署", whole:true},
  {city:"揖保郡", station:"たつの警察署", whole:true},
  {city:"佐用郡", station:"たつの警察署", whole:true},
  {city:"相生市", station:"相生警察署", whole:true},
  {city:"赤穂郡", station:"相生警察署", whole:true},
  {city:"赤穂市", station:"赤穂警察署", whole:true},
  {city:"宍粟市", station:"宍粟警察署", whole:true},
  {city:"朝来市", station:"南但馬警察署", whole:true},
  {city:"養父市", station:"南但馬警察署", whole:true},
  {city:"豊岡市", station:"豊岡警察署", whole:true},
  {city:"美方郡", station:"美方警察署", whole:true},
  {city:"洲本市", station:"洲本警察署", whole:true},
  {city:"淡路市", station:"淡路警察署", whole:true},
  {city:"南あわじ市", station:"南あわじ警察署", whole:true},];

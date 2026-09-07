/* 京都府警察 管轄区域データ
   京都市内の11区は、区名と同名の警察署が1対1で対応しており（例：上京区→上京警察署）、
   大阪市のように同じ区の中で複数の警察署に分かれることはありません。
   京都市外は、各警察署が原則として市・郡単位で管轄しています。
   出典：京都府警察公式サイトの各警察署ページ、および京都府警察公式サイト「警察本部・
   警察署・交番等所在地」。郡部の町村がどの警察署の管轄かは、各警察署の公式ページで
   確認できる範囲の情報をもとにしていますが、確認が取れていない組み合わせ
   には注記を付けています。 */

var JURISDICTION_RULES = [

  // ---- 京都市内（11区＝11署、1対1） ----
  {city:"京都市上京区", station:"上京警察署", whole:true},
  {city:"京都市東山区", station:"東山警察署", whole:true},
  {city:"京都市中京区", station:"中京警察署", whole:true},
  {city:"京都市下京区", station:"下京警察署", whole:true},
  {city:"京都市左京区", station:"左京警察署", whole:true},
  {city:"京都市伏見区", station:"伏見警察署", whole:true, caveat:"伏見区西部（久我・羽束師・淀の各地区）は向日町警察署の管轄という情報もあります。この付近にお住まい・出店予定の場合は両署にご確認ください。"},
  {city:"京都市山科区", station:"山科警察署", whole:true},
  {city:"京都市右京区", station:"右京警察署", whole:true},
  {city:"京都市南区", station:"南警察署", whole:true},
  {city:"京都市北区", station:"北警察署", whole:true},
  {city:"京都市西京区", station:"西京警察署", whole:true},

  // ---- 京都市外（13署。市・郡単位。郡部の町の組み合わせは公式ページの情報をもとにしています） ----
  {city:"向日市", station:"向日町警察署", whole:true},
  {city:"長岡京市", station:"向日町警察署", whole:true, caveat:"長岡京市・乙訓郡大山崎町が向日町警察署の管轄という情報にもとづいています。念のため公式ページでご確認ください。"},
  {city:"乙訓郡", station:"向日町警察署", whole:true, caveat:"長岡京市・乙訓郡大山崎町が向日町警察署の管轄という情報にもとづいています。念のため公式ページでご確認ください。"},

  {city:"宇治市", station:"宇治警察署", whole:true},
  {city:"久世郡", station:"宇治警察署", whole:true, caveat:"久世郡久御山町が宇治警察署の管轄という情報にもとづいています。念のため公式ページでご確認ください。"},

  {city:"城陽市", station:"城陽警察署", whole:true},
  {city:"八幡市", station:"八幡警察署", whole:true},
  {city:"京田辺市", station:"田辺警察署", whole:true},

  {city:"木津川市", station:"木津警察署", whole:true},
  {city:"相楽郡", station:"木津警察署", whole:true, caveat:"相楽郡内の町村がすべて木津警察署の管轄かどうかは未確認です。念のため公式ページでご確認ください。"},

  {city:"亀岡市", station:"亀岡警察署", whole:true},

  {city:"南丹市", station:"南丹警察署", whole:true},
  {city:"船井郡", station:"南丹警察署", whole:true, caveat:"船井郡京丹波町が南丹警察署の管轄という情報にもとづいています。念のため公式ページでご確認ください。"},

  {city:"綾部市", station:"綾部警察署", whole:true},
  {city:"福知山市", station:"福知山警察署", whole:true},
  {city:"舞鶴市", station:"舞鶴警察署", whole:true},

  {city:"宮津市", station:"宮津警察署", whole:true},
  {city:"与謝郡", station:"宮津警察署", whole:true, caveat:"与謝郡内の町（伊根町・与謝野町）が宮津警察署の管轄という情報にもとづいています。念のため公式ページでご確認ください。"},

  {city:"京丹後市", station:"京丹後警察署", whole:true}
];

# 警察署管轄ガイド（大阪・京都・兵庫版）

大阪府・京都府・兵庫県内で開業・出店する際に、管轄警察署と関連する届出・許可手続き（風俗営業、深夜酒類提供飲食店営業、警備業、探偵業、道路使用許可、車庫証明）を確認できる静的サイトです。トップページで府県を選び、住所（または現在地）を入力すると、その場で管轄警察署が判定されます。市区町村ごとの管轄警察署ページ（`area/`）も静的HTMLとして用意しています。

## ファイル構成

```
index.html            トップページ（府県切り替え＋住所・現在地からの管轄検索を統合）
kankatsu-kensaku.html  旧URL互換のためのリダイレクトページ（index.htmlへ転送）
keisatsusho.html       警察署一覧・キーワード検索ページ（大阪・京都・兵庫、あわせて136署）
honbu-ka-taiou.html    大阪府警察本部の「課」と警察署の「課」の対応関係の解説
honbu-ka-taiou-kyoto.html  京都府警察版の同内容
honbu-ka-taiou-hyogo.html  兵庫県警察版の同内容
fuzoku-eigyo.html      風俗営業許可の解説
shinya-inshoku.html    深夜酒類提供飲食店営業の届出の解説
keibigyo.html          警備業の認定の解説
tanteigyo.html         探偵業の届出の解説
doro-shiyo.html        道路使用許可の解説
shako-shomei.html      車庫証明の解説
about.html             運営者情報
privacy.html           プライバシーポリシー
contact.html           お問い合わせ
favicon.svg / favicon.ico / apple-touch-icon.png  ファビコン（SVGが元データ。icoとpngはそこから書き出したもの）
area/index.html        市区町村別の管轄警察署一覧（ハブページ）
area/*.html            市区町村ごとの管轄警察署ページ（144ページ。tools/build-area-pages.js で自動生成）
sitemap.xml            サイトマップ（tools/build-area-pages.js で自動生成）
tools/build-area-pages.js  市区町村ページとサイトマップの生成スクリプト（Node.js）
assets/style.css              共通スタイルシート（アイコングリッド・レスポンシブ対応含む）
assets/prefectures.js         対応府県の設定（府県ごとのデータファイルを動的に読み込むしくみ）
assets/jurisdiction-match.js  住所文字列→管轄警察署の判定ロジック（府県共通）
assets/pref/osaka-stations.js       大阪府警察署データ（66署）
assets/pref/osaka-jurisdiction.js   大阪府の管轄区域データ（条例に基づく町丁目単位のルール）
assets/pref/kyoto-stations.js       京都府警察署データ（24署）
assets/pref/kyoto-jurisdiction.js   京都府の管轄区域データ（市区町村単位のルール）
assets/pref/hyogo-stations.js       兵庫県警察署データ（46署）
assets/pref/hyogo-jurisdiction.js   兵庫県の管轄区域データ
```

外部ライブラリは使用していません。すべて素のHTML/CSS/JavaScriptです。

## GitHub Pagesでの公開手順

1. GitHubで新しいリポジトリを作成します（例：`kankatsu-guide`）。
2. このフォルダの中身一式（index.html を含むすべてのファイル）をリポジトリ直下にアップロードします。
3. リポジトリの `Settings` → `Pages` を開き、`Source` を `Deploy from a branch`、ブランチを `main`、フォルダを `/ (root)` に設定して保存します。
4. 数分後、`https://ユーザー名.github.io/リポジトリ名/` でサイトが公開されます。

## 独自ドメインへの切り替え

1. ドメインを取得したら、DNS設定でAレコード（ルートドメインの場合）またはCNAMEレコード（サブドメインの場合）をGitHub Pagesに向けます。
2. リポジトリの `Settings` → `Pages` → `Custom domain` に取得したドメインを入力します。
3. `CNAME` というファイルがリポジトリ直下に自動生成されます。
4. HTTPS化がGitHubにより自動で行われます（反映まで数時間かかることがあります）。

## 実装済み：住所からの管轄判定（大阪・京都・兵庫の3府県対応）

`index.html` のトップページで、大阪府・京都府・兵庫県のいずれかをタブで選び、住所（または現在地）を入力すると、その場で管轄警察署を判定します。仕組みは次のとおりです。

- 各府県のデータ（警察署一覧・管轄区域ルール）は、`assets/pref/` フォルダ内に府県ごとのファイルとして分かれています（例：大阪府なら `osaka-stations.js` と `osaka-jurisdiction.js`）。
- `assets/prefectures.js` が、選択された府県のデータファイルだけを動的に読み込み、`STATIONS` / `JURISDICTION_RULES` というグローバル変数に反映します（3府県分をまとめて読み込むことはしません）。
- 判定ロジック自体は `assets/jurisdiction-match.js` に1つだけあり、大阪・京都・兵庫のどのデータが読み込まれていても共通して使われます。Node.jsでも動作確認できます（DOM非依存）。
- ブラウザの位置情報（Geolocation API）から現在地を取得し、OpenStreetMap Nominatim（無料の逆ジオコーディングAPI）で住所化してから、同じロジックで判定する機能も備えています。
- `kankatsu-kensaku.html` は、住所検索機能が旧バージョンで独立したページだった頃のURLに対する互換用リダイレクトです。現在の検索機能はすべて `index.html` にあります。

**判定の精度について**：大阪府のデータ・ロジックは、条例の記載にもとづき55件のテスト住所で検証済みです。京都府・兵庫県のデータも同じ判定ロジックを使いますが、京都府のデータ（`assets/pref/kyoto-jurisdiction.js`）には「確認が取れていない組み合わせ」を示す注記（caveat）が大阪府より多く含まれています。条例上、河川・道路・水路の左岸／右岸や東西南北で境界が決まる区域（例：「安威川左岸以南」）についても、住所テキストだけでは機械的に判定できません。該当する可能性がある結果には注記（caveat）を表示するようにしていますが、正式な手続きの前には必ず表示された警察署への確認をお願いする設計にしています。

## 今後の拡張候補

- 地図タップによる管轄判定（現在は住所テキスト入力＋現在地取得のみ対応。地図UIを追加すればタップした地点の緯度経度→逆ジオコーディング→同じ判定ロジックで実現可能）
- 大阪・京都・兵庫以外の近隣府県（奈良県・和歌山県・滋賀県など）への対応拡大（対象府県の条例・規則を、既存の3府県と同じ形式で構造化データ化すれば追加できます）
- 京都府の管轄区域データにある「確認が取れていない組み合わせ」（caveat付きのルール）の裏取りと精度向上
- 各記事の内容の充実（実例、FAQ、費用の目安など）

## 市区町村別ページとサイトマップの生成

`area/` 以下のページと `sitemap.xml` は、府県データ（`assets/pref/`）から自動生成しています。管轄データを修正したときは、サイトのフォルダ直下で次のコマンドを実行してから、生成されたファイルごとアップロードしてください。

```
node tools/build-area-pages.js
```

- 市区町村を追加した場合は、スクリプト内の `SLUGS` にローマ字のファイル名を追加してください（未登録があるとエラーで止まります）。
- 管轄ルールには無く、注記（caveat）の中でだけ名前が出てくる警察署（例：東大阪市の枚岡警察署、吹田市の摂津警察署）は、「一部区域」として注記付きで表示されます。
- `sitemap.xml` は手で編集せず、このスクリプトで作り直してください。

## 検索エンジン向けの設定

- 正規URL：トップページは `https://leben-k.github.io/kankatsu/`（`index.html` なし）です。各ページの `<head>` に自分自身を指す `<link rel="canonical">` を入れ、サイト内のトップへのリンクもすべて `./`（下の階層からは `../`）に統一しています。新しいページを作るときも同じようにしてください。
- `about.html` は noindex のため、canonical とサイトマップから外しています。
- `robots.txt` は、GitHub Pages のプロジェクトサイト（`/kankatsu/`）では検索エンジンに読まれません。サイトマップは Search Console の「サイトマップ」から `https://leben-k.github.io/kankatsu/sitemap.xml` を直接送信してください。
- 独自ドメインに移行した場合は、canonical・`tools/build-area-pages.js` の `BASE`・`robots.txt` のURLを新しいドメインに書き換えてください。

## データの出典・注意事項

- 警察署の名称・住所・電話番号：大阪府警察・京都府警察・兵庫県警察 各公式サイト
- 各記事の内容は、風営法・警備業法・探偵業法・道路交通法・車庫法等の一般的な制度説明であり、法的助言ではありません。
- 公開前に、`about.html` の運営者情報および `privacy.html` のプライバシーポリシーを、実際の運営者情報に合わせて書き換えてください（現在はプレースホルダーです）。

/*
 * フッターの著作権表示を自動更新するスクリプト。
 * 開始年（START_YEAR）は固定のまま、表示される「終了年」は
 * 訪問時の年を自動で取得します。
 * 例）2026年中に閲覧 → 🄫 2026 警察署管轄ガイド
 *     2027年になってから閲覧 → 🄫 2026-2027 警察署管轄ガイド
 * 年をまたぐたびに、このファイルを書き換える必要はありません。
 */
(function () {
  var START_YEAR = 2026;
  var currentYear = new Date().getFullYear();
  var yearLabel = currentYear > START_YEAR
    ? START_YEAR + '-' + currentYear
    : String(START_YEAR);
  var text = '\u{1F12B} ' + yearLabel + ' \u8B66\u5BDF\u7F72\u7BA1\u8F44\u30AC\u30A4\u30C9';

  document.querySelectorAll('.js-copyright').forEach(function (el) {
    el.textContent = text;
  });
})();

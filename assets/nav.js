/* フッターの著作権表示の年（<span class="copy-year" data-start="2026">）
   開始年より後の年になったら「2026-2027」のように自動で範囲表示にします。
   JavaScriptが動かない環境では、HTMLに書いた「2026」がそのまま表示されます。 */
(function () {
  var y = new Date().getFullYear();
  document.querySelectorAll('.copy-year').forEach(function (el) {
    var start = parseInt(el.getAttribute('data-start'), 10);
    if (start && y > start) el.textContent = start + '-' + y;
  });
})();

/* 「許認可手続」ドロップダウン（<details class="nav-drop">）の補助
   ・ほかの場所をクリック／タップしたら閉じる
   ・Escキーで閉じる
   ・1つ開いたら、ほかのドロップダウンは閉じる
   JavaScriptが動かない環境でも、<details> の標準機能で開閉はできます。 */
(function () {
  var drops = document.querySelectorAll('details.nav-drop');
  if (!drops.length) return;

  drops.forEach(function (d) {
    d.addEventListener('toggle', function () {
      if (!d.open) return;
      drops.forEach(function (o) { if (o !== d) o.open = false; });
    });
  });

  document.addEventListener('click', function (e) {
    drops.forEach(function (d) {
      if (d.open && !d.contains(e.target)) d.open = false;
    });
  });

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    drops.forEach(function (d) {
      if (d.open) { d.open = false; d.querySelector('summary').focus(); }
    });
  });
})();

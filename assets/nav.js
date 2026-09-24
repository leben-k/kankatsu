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

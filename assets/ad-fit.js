/* ==========================================================================
   広告枠（.ad-slot--furusato）のスマホはみ出し対策／PC余白対策
   ----------------------------------------------------------------------
   これまでの不具合の原因：
   　.ad-slot-inner をそのままの場所で測ると、周囲の枠がスマホ幅で
   　すでに狭くなっているため、中のテーブルなどが「本来の広さ」より
   　圧縮されて描画された状態で測ってしまい、実際に必要な幅を
   　過小評価していた（＝縮小が足りず、右側がはみ出ていた）。

   対策：
   　.ad-slot-inner の複製（clone）を画面の外（見えない位置）に置き、
   　width: max-content を指定して「何にも制約されない、本来の大きさ」
   　を測る。そのうえで、本体の .ad-slot-inner にも同じく
   　width: max-content を指定してから、測定結果をもとに
   　transform: scale() でまるごと縮小する。
   ========================================================================== */

(function () {
  function measureNatural(inner) {
    var clone = inner.cloneNode(true);
    clone.style.position = 'fixed';
    clone.style.left = '-99999px';
    clone.style.top = '0';
    clone.style.right = 'auto';
    clone.style.bottom = 'auto';
    clone.style.width = 'max-content';
    clone.style.maxWidth = 'none';
    clone.style.transform = 'none';
    clone.style.margin = '0';
    clone.style.visibility = 'hidden';
    document.body.appendChild(clone);

    var width = clone.scrollWidth;
    var height = clone.scrollHeight;

    document.body.removeChild(clone);
    return { width: width, height: height };
  }

  function fitOne(wrapper) {
    var frame = wrapper.querySelector('.ad-slot-frame');
    var inner = wrapper.querySelector('.ad-slot-inner');
    if (!frame || !inner) return;

    // 1) 画面外の複製で、広告コードの「本来の、制約のない」サイズを測る
    var natural = measureNatural(inner);
    var naturalWidth = natural.width;
    var naturalHeight = natural.height;
    if (naturalWidth <= 0 || naturalHeight <= 0) return; // まだ描画されていない

    // 2) 枠(wrapper)自身のpaddingを差し引いて、実際に使える横幅を求める
    frame.style.width = '';
    frame.style.height = '';
    wrapper.style.width = '100%'; // 一時的に親いっぱいに広げて、使える最大幅を測る

    var wrapperClientWidth = wrapper.clientWidth; // 内容+padding（borderは含まない）
    var cs = window.getComputedStyle(wrapper);
    var paddingX = parseFloat(cs.paddingLeft || 0) + parseFloat(cs.paddingRight || 0);
    var available = wrapperClientWidth - paddingX;
    if (available <= 0) return;

    // 3) 縮小率を計算（収まっていればscale=1のまま、縮小はしない）
    var scale = naturalWidth > available ? (available / naturalWidth) : 1;

    // 4) 本体のinnerも「本来の大きさ」で描画させたうえで、まるごと縮小する
    inner.style.width = 'max-content';
    inner.style.maxWidth = 'none';
    inner.style.transform = scale < 1 ? ('scale(' + scale + ')') : 'none';
    inner.style.transformOrigin = 'top left';

    // 5) 枠(wrapper・frame)を、縮小後の実際のサイズにぴったり合わせる
    frame.style.width = Math.ceil(naturalWidth * scale) + 'px';
    frame.style.height = Math.ceil(naturalHeight * scale) + 'px';
    wrapper.style.width = Math.ceil(naturalWidth * scale + paddingX) + 'px';
  }

  function fitAll() {
    document.querySelectorAll('.ad-slot--furusato').forEach(fitOne);
  }

  window.addEventListener('load', fitAll);
  window.addEventListener('resize', fitAll);

  // 広告コード内の画像は、貼り付け直後は未読み込みで高さ・幅が
  // 不確定なことが多いため、各画像の読み込み完了時にも測り直す。
  document.querySelectorAll('.ad-slot--furusato .ad-slot-inner img').forEach(function (img) {
    img.addEventListener('load', fitAll);
    img.addEventListener('error', fitAll);
  });

  // 保険として、少し時間をおいて何度か測り直す
  [200, 600, 1200, 2500, 5000].forEach(function (delay) {
    setTimeout(fitAll, delay);
  });

  // 広告コードが後から script によって書き換えられるケース
  // （img.srcの差し替えなど、属性変化を含む）にも対応する。
  if (window.MutationObserver) {
    document.querySelectorAll('.ad-slot--furusato .ad-slot-inner').forEach(function (inner) {
      var mo = new MutationObserver(function () { fitAll(); });
      mo.observe(inner, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['src', 'width', 'height', 'style']
      });
    });
  }

  // 初回実行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fitAll);
  } else {
    fitAll();
  }
})();

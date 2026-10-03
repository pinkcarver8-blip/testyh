(function () {
  // 모바일 메뉴
  var burger = document.querySelector('.burger');
  var nav = document.querySelector('nav');
  if (burger) burger.addEventListener('click', function () { nav.classList.toggle('open'); });

  // 스크롤 등장 효과
  var items = document.querySelectorAll('.reveal, .tl-item');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('show'); io.unobserve(e.target); } });
    }, { threshold: 0.15 });
    items.forEach(function (i) { io.observe(i); });
  } else items.forEach(function (i) { i.classList.add('show'); });

  // 맨 위로 버튼
  var top = document.getElementById('toTop');
  if (top) {
    window.addEventListener('scroll', function () { top.classList.toggle('on', window.scrollY > 400); });
    top.addEventListener('click', function () { window.scrollTo({ top: 0 }); });
  }

  // 작품 필터 + 검색
  var fbtns = document.querySelectorAll('.filters button');
  var works = document.querySelectorAll('.work');
  var search = document.getElementById('search');
  var cat = 'all';
  function apply() {
    var q = search ? search.value.trim().toLowerCase() : '';
    works.forEach(function (w) {
      var okCat = cat === 'all' || w.dataset.cat === cat;
      var okQ = !q || w.textContent.toLowerCase().indexOf(q) > -1;
      w.classList.toggle('hide', !(okCat && okQ));
    });
  }
  fbtns.forEach(function (b) {
    b.addEventListener('click', function () {
      fbtns.forEach(function (x) { x.classList.remove('on'); });
      b.classList.add('on'); cat = b.dataset.cat; apply();
    });
  });
  if (search) search.addEventListener('input', apply);

  // 독서 가이드 퀴즈
  var box = document.getElementById('quiz');
  if (box) {
    var qs = [
      { q: '어떤 분량의 책이 좋은가요?', o: [['짧고 강렬한 한 편', 'short'], ['오래 빠져들 대작', 'long']] },
      { q: '끌리는 분위기는?', o: [['악몽 같은 정치·역사', 'dark'], ['청춘, 시, 방랑', 'youth']] },
      { q: '읽는 방식은?', o: [['한 호흡에 몰아서', 'fast'], ['천천히 여러 목소리를 따라', 'slow']] }
    ];
    var recs = {
      '칠레의 밤': ['칠레의 밤 (2000)', '쉼표 없이 흐르는 한 사제의 고백. 짧지만 가장 날카로운 입문작.'],
      '아뮬렛': ['아뮬렛 (1999)', '1968년 멕시코 대학 점거 속 한 여인의 환각 같은 기억. 얇고 시적입니다.'],
      '야만스러운 탐정들': ['야만스러운 탐정들 (1998)', '사라진 시인을 쫓는 청춘과 방랑의 대서사. 볼라뇨를 알고 싶다면 이 책입니다.'],
      '2666': ['2666 (2004)', '다섯 부로 이루어진 유작 대작. 천천히 깊이 잠기고 싶은 독자에게.']
    };
    var step = 0, score = {};
    function render() {
      if (step >= qs.length) return result();
      var cur = qs[step];
      box.innerHTML = '<div class="progress"><i style="width:' + (step / qs.length * 100) + '%"></i></div><p class="q">' + cur.q + '</p>';
      cur.o.forEach(function (o) {
        var b = document.createElement('button');
        b.className = 'opt'; b.textContent = o[0];
        b.addEventListener('click', function () { score[o[1]] = 1; step++; render(); });
        box.appendChild(b);
      });
    }
    function result() {
      var key;
      if (score.short && score.dark) key = '칠레의 밤';
      else if (score.short) key = '아뮬렛';
      else if (score.long && score.youth) key = '야만스러운 탐정들';
      else key = '2666';
      if (score.short && !score.dark) key = '아뮬렛';
      var r = recs[key];
      box.innerHTML = '<div class="result"><p class="eyebrow">추천 도서</p><h3>' + r[0] + '</h3><p style="color:var(--muted);margin:10px 0 22px">' + r[1] + '</p><button class="btn" id="again">다시 하기</button></div>';
      document.getElementById('again').addEventListener('click', function () { step = 0; score = {}; render(); });
    }
    render();
  }
})();

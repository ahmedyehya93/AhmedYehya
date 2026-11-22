const arabic = document.documentElement.lang === "ar";
const cases=[
{id:4,name:'Bedaya Health',category:'Healthcare',title:'Turning visibility into stronger organic reach.',clicks:'109K',impressions:'5.06M'},
{id:2,name:'Botsmsg',category:'Technical SEO',title:'Removing the barriers to organic discovery.',clicks:'652',impressions:'43.8K'},
{id:3,name:'Dr. Kareem Shilwa',category:'Healthcare',title:'Building visibility around patient search needs.',clicks:'1.57K',impressions:'160K'},
{id:1,name:'Right Nutritions',category:'Healthcare',title:'A new search presence in a competitive niche.',clicks:'434',impressions:'23.3K'},
{id:0,name:'Souq Used Furniture',category:'Local SEO',title:'Reaching local customers with buying intent.',clicks:'271',impressions:'24.6K'}
];
const arabicCards = {
  "4": [
    "الرعاية الصحية",
    "زيادة النقرات من البحث العضوي على الصفحات الطبية."
  ],
  "2": [
    "تحسين تقني",
    "معالجة مشكلات الزحف والفهرسة في موقع لخدمات الأتمتة."
  ],
  "3": [
    "الرعاية الصحية",
    "تحسين ظهور محتوى طبي يجيب عن أسئلة المرضى."
  ],
  "1": [
    "الرعاية الصحية",
    "بناء حضور في البحث لموقع تغذية جديد."
  ],
  "0": [
    "تحسين البحث المحلي",
    "الوصول إلى عملاء محليين يبحثون عن أثاث مستعمل."
  ]
};
const casePaths={"4": "case-bedaya-health.html", "2": "case-botsmsg.html", "3": "case-dr-kareem-shilwa.html", "1": "case-right-nutritions.html", "0": "case-souq-used-furniture.html"};
const projects=document.querySelector('#projects'),dialog=document.querySelector('dialog');
function render(filter='All'){projects.innerHTML=cases.filter(c=>filter==='All'||c.category===filter).map(c=>{
const {name} = c;
const [category, title] = arabic ? arabicCards[c.id] : [c.category, c.title];
const assetRoot = arabic ? '../assets' : 'assets';
return `<article class="project"><img class="project-image" src="${assetRoot}/case-${c.id}.jpg" alt="${arabic ? 'مقارنة أداء '+name+' في Google Search Console' : name+' Google Search Console performance comparison'}" loading="lazy" data-case="${c.id}" tabindex="0" role="button" aria-label="${arabic ? 'افتح دراسة حالة '+name : 'Open '+name+' case study'}"><div class="project-body"><span class="tag">${category}</span><h3><bdi lang="en" dir="ltr">${name}</bdi></h3><p>${title}</p><div class="project-result"><div data-metric="clicks"><strong dir="ltr">${c.clicks}</strong><small>${arabic ? "النقرات من البحث العضوي" : "Organic clicks"}</small></div><div data-metric="impr"><strong dir="ltr">${c.impressions}</strong><small>${arabic ? "مرات الظهور" : "Impressions"}</small></div></div><a class="case-button" href="${casePaths[c.id]}">${arabic ? 'اقرأ دراسة الحالة' : 'Read the full case study'} <span>↗</span></a></div></article>`}).join('')}
function openCase(id){location.href=casePaths[id];}
projects.addEventListener('click',e=>{const t=e.target.closest('[data-case]');if(t)openCase(t.dataset.case)});projects.addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&e.target.matches('img[data-case]')){e.preventDefault();openCase(e.target.dataset.case)}});document.querySelectorAll('[data-filter]').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('[data-filter]').forEach(x=>{x.classList.toggle('active',x===b);x.setAttribute('aria-pressed',String(x===b))});render(b.dataset.filter)}));document.querySelector('.close').onclick=()=>dialog.close();dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close()}});render();

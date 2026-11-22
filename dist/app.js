const arabic = document.documentElement.lang === "ar";
const cases=[
{id:4,name:'Bedaya Health',category:'Healthcare',title:'Turning visibility into stronger organic reach.',metric:'109K',label:'organic clicks',second:'+103%',secondLabel:'click growth',challenge:'A competitive medical niche with a gap between existing search visibility and click-through volume.',strategy:'Refined titles and descriptions, implemented relevant structured data, and addressed mobile Core Web Vitals issues including CLS and LCP.',result:'Clicks increased from 53.6K to 109K, while impressions reached 5.06 million. Average position improved from 8.5 to 8.1.'},
{id:2,name:'Botsmsg',category:'Technical SEO',title:'Removing the barriers to organic discovery.',metric:'31 → 652',label:'organic clicks',second:'6.8',secondLabel:'average position',challenge:'An automation website with limited search visibility and reported indexation barriers.',strategy:'Audited crawl issues, refined the XML sitemap and aligned landing-page content with commercial search intent.',result:'The published comparison shows clicks growing from 31 to 652, 43.8K impressions, and average position improving from 24 to 6.8.'},
{id:3,name:'Dr. Kareem Shilwa',category:'Healthcare',title:'Building visibility around patient search needs.',metric:'160K',label:'search impressions',second:'1.57K',secondLabel:'organic clicks',challenge:'A specialist medical profile competing against established healthcare websites.',strategy:'Built topic clusters and internal links around the specialty, targeting specific symptoms and procedure-related search needs.',result:'Impressions increased from 30.8K to 160K. The published case study reports approximately 238% click growth, reaching 1.57K clicks.'},
{id:1,name:'Right Nutritions',category:'Healthcare',title:'A new search presence in a competitive niche.',metric:'434',label:'organic clicks',second:'23.3K',secondLabel:'search impressions',challenge:'A new nutrition and supplements website entering a competitive, trust-sensitive market.',strategy:'Focused on evidence-supported content and a hub-and-spoke internal-linking structure connecting relevant content and product pages.',result:'The case study reports 434 clicks and 23.3K impressions from a zero baseline, with average position 7.6 and CTR of 1.9%.'},
{id:0,name:'Souq Used Furniture',category:'Local SEO',title:'Reaching local customers with buying intent.',metric:'79 → 271',label:'organic clicks',second:'24.6K',secondLabel:'search impressions',challenge:'Strong competition for local used-furniture searches and high-intent transactional keywords.',strategy:'Aligned category pages with buy/sell intent and improved server response and mobile usability.',result:'Clicks increased from 79 to 271, while impressions exceeded 24.6K. Average position improved from 39.7 to 27.7.'}
];
const arabicCards = {
  "4": [
    "الرعاية الصحية",
    "زيادة النقرات من البحث العضوي على الصفحات الطبية.",
    "نقرات من البحث العضوي",
    "نمو النقرات"
  ],
  "2": [
    "تحسين تقني",
    "معالجة مشكلات الزحف والفهرسة في موقع لخدمات الأتمتة.",
    "نقرات من البحث العضوي",
    "متوسط الترتيب"
  ],
  "3": [
    "الرعاية الصحية",
    "تحسين ظهور محتوى طبي يجيب عن أسئلة المرضى.",
    "مرات الظهور في البحث",
    "نقرات من البحث العضوي"
  ],
  "1": [
    "الرعاية الصحية",
    "بناء حضور في البحث لموقع تغذية جديد.",
    "نقرات من البحث العضوي",
    "مرات الظهور في البحث"
  ],
  "0": [
    "تحسين البحث المحلي",
    "الوصول إلى عملاء محليين يبحثون عن أثاث مستعمل.",
    "نقرات من البحث العضوي",
    "مرات الظهور في البحث"
  ]
};
const casePaths={"4": "case-bedaya-health.html", "2": "case-botsmsg.html", "3": "case-dr-kareem-shilwa.html", "1": "case-right-nutritions.html", "0": "case-souq-used-furniture.html"};
const projects=document.querySelector('#projects'),dialog=document.querySelector('dialog');
const metricKind=l=>/growth/i.test(l)?'up':/click/i.test(l)?'clicks':/impression/i.test(l)?'impr':'';
function render(filter='All'){projects.innerHTML=cases.filter(c=>filter==='All'||c.category===filter).map(c=>{
const {name} = c;
const [category, title, label, secondLabel] = arabic ? arabicCards[c.id] : [c.category, c.title, c.label, c.secondLabel];
const assetRoot = arabic ? '../assets' : 'assets';
return `<article class="project"><img class="project-image" src="${assetRoot}/case-${c.id}.jpg" alt="${arabic ? 'مقارنة أداء '+name+' في Google Search Console' : name+' Google Search Console performance comparison'}" loading="lazy" data-case="${c.id}" tabindex="0" role="button" aria-label="${arabic ? 'افتح دراسة حالة '+name : 'Open '+name+' case study'}"><div class="project-body"><span class="tag">${category}</span><h3><bdi lang="en" dir="ltr">${name}</bdi></h3><p>${title}</p><div class="project-result"><div data-metric="${metricKind(c.label)}"><strong>${c.metric}</strong><small>${label}</small></div><div data-metric="${metricKind(c.secondLabel)}"><strong>${c.second}</strong><small>${secondLabel}</small></div></div><a class="case-button" href="${casePaths[c.id]}">${arabic ? 'اقرأ دراسة الحالة' : 'Read the full case study'} <span>↗</span></a></div></article>`}).join('')}
function openCase(id){location.href=casePaths[id];}
projects.addEventListener('click',e=>{const t=e.target.closest('[data-case]');if(t)openCase(t.dataset.case)});projects.addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&e.target.matches('img[data-case]')){e.preventDefault();openCase(e.target.dataset.case)}});document.querySelectorAll('[data-filter]').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('[data-filter]').forEach(x=>{x.classList.toggle('active',x===b);x.setAttribute('aria-pressed',String(x===b))});render(b.dataset.filter)}));document.querySelector('.close').onclick=()=>dialog.close();dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close()}});render();

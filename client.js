/* ===== B2C: клиент строит дом ===== */
const CNAV=[['build','🏡','Построить дом'],['track','🧱','Ход стройки']];
const ST3=['Участок','Проверка','Проект и дизайн','Согласование','Кредит','Заявка'];
const CSITES=[
 {id:0,name:'с. Усады, ул. Речная',cad:'16:50:0123:112',area:12,price:2.9,dist:18,risk:14,rural:1,x:64,y:30,
  comm:[['Электричество',1],['Газ',1],['Вода',.5],['Дорога',1],['Интернет',1]],infra:'Школа 1,2 км · Детсад 0,8 км · Магазин 0,5 км',
  checks:[['Права продавца','ok','Собственник с 2018 г., один владелец'],['Назначение земли','ok','Земли населённых пунктов, ИЖС'],['Аресты и запреты','ok','Не найдены'],['Обременения','ok','Не найдены'],['Споры в судах','ok','За 3 года не найдено'],['Строить можно','ok','Разрешены дома до 3 этажей']],
  extra:[['Кадастровая стоимость','1,9 млн ₽'],['Грунт','суглинок, грунтовые воды 3,2 м'],['Экология','хорошая, рядом лес'],['Рост цены участков','≈ +9% в год'],['Соседи','застроено на 70%'],['До центра Казани','18 км, 30 мин']],
  cases:[['А65-2210/2024','Спор о границах соседей — решён, к участку отношения не имеет','ok']],tip:'Хороший вариант: газ уже подведён, сельская ипотека 3% возможна.'},
 {id:1,name:'КП «Берёзовая роща», уч. 27',cad:'16:24:0105:61',area:10,price:3.4,dist:11,risk:9,rural:0,x:46,y:48,
  comm:[['Электричество',1],['Газ',1],['Вода',1],['Дорога',1],['Интернет',1]],infra:'Школа 2,0 км · Детсад 1,1 км · Охраняемый въезд',
  checks:[['Права продавца','ok','Девелопер КП, права подтверждены'],['Назначение земли','ok','ИЖС'],['Аресты и запреты','ok','Не найдены'],['Обременения','ok','Не найдены'],['Споры в судах','ok','Не найдены'],['Строить можно','ok','Единый архитектурный регламент КП']],
  extra:[['Кадастровая стоимость','2,6 млн ₽'],['Грунт','супесь, воды 4 м'],['Экология','хорошая'],['Рост цены участков','≈ +11% в год'],['Взнос за обслуживание КП','7 500 ₽/мес'],['До центра Казани','11 км, 20 мин']],
  cases:[],tip:'Самый чистый вариант и все коммуникации, но дороже и есть обязательные правила застройки.'},
 {id:2,name:'д. Куюки, ул. Луговая',cad:'16:50:0112:44',area:15,price:4.1,dist:22,risk:31,rural:0,x:78,y:56,
  comm:[['Электричество',1],['Газ',.5],['Вода',0],['Дорога',1],['Интернет',1]],infra:'Школа 3,5 км · Детсад 2,8 км',
  checks:[['Права продавца','ok','Собственник с 2019 г.'],['Назначение земли','ok','ИЖС'],['Аресты и запреты','ok','Не найдены'],['Обременения','warn','Сервитут линии электропередачи (4% участка)'],['Споры в судах','ok','Не найдены'],['Строить можно','ok','Нужно сместить дом от ЛЭП на 6 м']],
  extra:[['Кадастровая стоимость','3,2 млн ₽'],['Грунт','суглинок, воды 2,1 м — нужен усиленный фундамент'],['Экология','хорошая'],['Рост цены участков','≈ +6% в год'],['Охранная зона ЛЭП','120 м²'],['До центра Казани','22 км, 35 мин']],
  cases:[['А65-5530/2023','Сервитут ЛЭП: компенсация собственнику','info']],tip:'Просторный, но с ограничением из-за ЛЭП: просите скидку 3–5% (≈ 0,15 млн ₽).'},
 {id:3,name:'п. Дубровка, ул. Сосновая',cad:'16:24:0210:15',area:8,price:2.2,dist:25,risk:76,rural:1,x:30,y:64,
  comm:[['Электричество',1],['Газ',0],['Вода',0],['Дорога',.5],['Интернет',.5]],infra:'Школа 6 км · Детсад 5 км',
  checks:[['Права продавца','warn','3 смены владельца за 14 месяцев'],['Назначение земли','ok','ИЖС'],['Аресты и запреты','bad','Арест по делу № А65-4410/2025'],['Обременения','bad','Ипотека в силу закона'],['Споры в судах','bad','2 иска об оспаривании сделки'],['Строить можно','warn','Часть участка в водоохранной зоне']],
  extra:[['Кадастровая стоимость','1,4 млн ₽'],['Грунт','торфянистый, нужны сваи'],['Экология','водоохранная зона 14%'],['Рост цены участков','≈ +2% в год'],['Соседи','почти не застроено'],['До центра Казани','25 км, 45 мин']],
  cases:[['А65-4410/2025','Арест участка по иску кредитора','bad'],['А65-7802/2025','Оспаривание сделки (подозрительная)','bad']],tip:'Дёшево, но юридический риск высокий — покупать не рекомендуем.'},
 {id:4,name:'с. Столбище, ул. Ключевая',cad:'16:50:0301:19',area:10,price:3.9,dist:14,risk:18,rural:1,x:55,y:20,
  comm:[['Электричество',1],['Газ',1],['Вода',1],['Дорога',1],['Интернет',1]],infra:'Школа 0,9 км · Детсад 0,6 км · Поликлиника 1,5 км',
  checks:[['Права продавца','ok','Собственник с 2017 г.'],['Назначение земли','ok','ИЖС'],['Аресты и запреты','ok','Не найдены'],['Обременения','ok','Не найдены'],['Споры в судах','ok','Не найдены'],['Строить можно','ok','Ограничений нет']],
  extra:[['Кадастровая стоимость','2,8 млн ₽'],['Грунт','суглинок, воды 3,5 м'],['Экология','хорошая, рядом река'],['Рост цены участков','≈ +10% в год'],['Соседи','застроено на 85%'],['До центра Казани','14 км, 25 мин']],
  cases:[],tip:'Сбалансированный вариант: развитая инфраструктура, сельская ипотека применима.'}
];
const STY={scand:{n:'Скандинавский',r:.062,pal:[['#f3f0ea','#3b4452','#c9a47a'],['#e4ded2','#2c3a3f','#8c6a4a'],['#ffffff','#575b63','#7fa7a0']]},
 modern:{n:'Модерн',r:.078,pal:[['#e9ecef','#2b2f36','#6e8ca0'],['#d7dbd8','#3a3f45','#c68a4f'],['#f5f5f3','#22262b','#5d7a6b']]},
 classic:{n:'Классика',r:.070,pal:[['#efe3cf','#8a4b3a','#b9985a'],['#f0ead9','#6b3f35','#8a7b5c'],['#e8dcc4','#4e4a47','#a9704b']]},
 barn:{n:'Барнхаус',r:.066,pal:[['#33383c','#1f2326','#c58a54'],['#3e4244','#272a2c','#d2a066'],['#2b3033','#15181a','#a56d3d']]}};
const INT=[{n:'Тёплый дуб',c:['#efe6d8','#c49a6c','#8a9a7b','#e0b25b'],p:0},{n:'Графит и лён',c:['#d9dcdf','#4a4f57','#b9ab95','#e3a64a'],p:.15},{n:'Светлый минимализм',c:['#f7f7f5','#d8d2c8','#9db6b0','#e86f5b'],p:.09}];
const OPTS=[['terr','Терраса 24 м²',.45],['gar','Гараж на 1 авто',.9],['fl','Тёплые полы',.38],['sol','Солнечные панели 5 кВт',.52]];
const VAR=[['Базовая компоновка',1,'Классическая планировка, вход по центру'],['Открытая гостиная + терраса',1.06,'Большая гостиная-кухня, выход на террасу'],['Экономичный',.97,'Компактные коридоры, без лишних перегородок']];

function cwInit(){return{step:1,site:null,more:{},chkN:0,checked:false,rep:false,gen:0,plan:{area:140,floors:2,beds:3,style:'scand'},vars:null,vi:null,opts:{},pal:0,ok:false,profile:{kids:2,income:310,down:4.5,term:20,under6:1,matcap:1,it:0},prod:null,tab:'plan'}}
const onBuild=()=>!location.hash||location.hash==='#build';
const cwS=()=>S.cw||(S.cw=cwInit());
const csite=()=>CSITES[cwS().site];
const pmt=(L,r,y)=>{if(L<=0)return 0;const i=r/1200,n=y*12;return L*i/(1-Math.pow(1+i,-n))};

function houseSvg(style,fl,pal,o={}){const [wall,roof,acc]=pal,gy=168,fh=50,top=gy-fl*fh,bx=70,bw=170;
 let s=`<svg viewBox="0 0 320 190" class="hs"><rect width="320" height="190" fill="#e8f3ee"/><circle cx="278" cy="28" r="14" fill="#ffd98a"/><rect y="${gy}" width="320" height="22" fill="#a9cfa0"/>`;
 if(o.garage)s+=`<rect x="240" y="${gy-58}" width="64" height="58" fill="${wall}" stroke="#0003"/><rect x="249" y="${gy-44}" width="46" height="44" fill="${acc}" opacity=".7"/><rect x="236" y="${gy-66}" width="72" height="9" fill="${roof}"/>`;
 if(o.terrace)s+=`<rect x="22" y="${gy-10}" width="52" height="10" fill="#b98f5e"/><path d="M24 ${gy-10}v-24M72 ${gy-10}v-24M24 ${gy-34}h48" stroke="#8a6a44" stroke-width="2" fill="none"/>`;
 s+=`<rect x="${bx}" y="${top}" width="${bw}" height="${fl*fh}" fill="${wall}" stroke="#0003"/>`;
 if(style==='modern'){s+=`<rect x="60" y="${top-9}" width="${bw+20}" height="10" fill="${roof}"/>`;if(fl===2)s+=`<rect x="${bx+60}" y="${top}" width="110" height="${fh}" fill="${acc}" opacity=".35"/>`}
 else if(style==='classic')s+=`<polygon points="60,${top} 105,${top-42} 205,${top-42} 250,${top}" fill="${roof}"/>`;
 else if(style==='barn')s+=`<polygon points="60,${top} 155,${top-34} 250,${top}" fill="${roof}"/>`;
 else s+=`<polygon points="58,${top} 155,${top-52} 252,${top}" fill="${roof}"/>`;
 const ww=style==='modern'?42:26;
 for(let f=0;f<fl;f++){const y=top+f*fh+10;[bx+18,bx+bw-18-ww].forEach(x=>s+=`<rect x="${x}" y="${y}" width="${ww}" height="28" fill="#bfe0f0" stroke="${acc}" stroke-width="2"/>`);
  if(f===fl-1)s+=`<rect x="${bx+bw/2-12}" y="${gy-38}" width="24" height="38" fill="${acc}"/>`;else s+=`<rect x="${bx+bw/2-13}" y="${y}" width="26" height="28" fill="#bfe0f0" stroke="${acc}" stroke-width="2"/>`}
 s+=`<circle cx="46" cy="${gy-26}" r="18" fill="#7cb27a" opacity=".85"/><rect x="44" y="${gy-12}" width="4" height="12" fill="#6b5233"/></svg>`;return s}
function roomSvg(c){return `<svg viewBox="0 0 320 190" class="hs"><rect width="320" height="190" fill="${c[0]}"/><polygon points="0,135 320,135 320,190 0,190" fill="${c[1]}"/><rect x="200" y="30" width="86" height="70" fill="#d6ecf7" stroke="#fff" stroke-width="5"/><path d="M243 30v70M200 65h86" stroke="#fff" stroke-width="3"/><rect x="36" y="100" width="130" height="44" rx="10" fill="${c[2]}"/><rect x="28" y="116" width="22" height="32" rx="8" fill="${c[2]}"/><rect x="152" y="116" width="22" height="32" rx="8" fill="${c[2]}"/><rect x="52" y="104" width="30" height="22" rx="6" fill="${c[3]}"/><rect x="60" y="34" width="70" height="46" fill="#fff" stroke="${c[3]}" stroke-width="3"/><circle cx="95" cy="57" r="13" fill="${c[3]}" opacity=".7"/><rect x="228" y="124" width="4" height="40" fill="#555"/><ellipse cx="230" cy="122" rx="14" ry="9" fill="${c[3]}"/><ellipse cx="110" cy="170" rx="60" ry="9" fill="${c[3]}" opacity=".25"/></svg>`}

function cwTotal(){const c=cwS(),site=c.site!=null?csite().price:0,p=c.plan,vi=c.vi==null?0:c.vi,st=STY[p.style];
 const build=p.area*st.r*(p.floors===2?.93:1)*VAR[vi][1],opts=OPTS.filter(o=>c.opts[o[0]]).reduce((a,o)=>a+o[2],0),design=.28+INT[c.pal].p;
 return{site,build,opts,design,total:site+build+opts+design,months:Math.round(5+p.area/28+(p.floors===1?1:0))}}
const m1=n=>fmt(n,2)+' млн ₽';

function prodList(){const c=cwS(),p=c.profile,site=csite(),T=cwTotal(),tot=T.total,mat=p.matcap&&p.kids?0.69:0,loan=Math.max(0,tot-p.down-mat),dp=(p.down+mat)/tot*100,fam=(p.kids>=1&&p.under6)||p.kids>=3,inc=p.income;
 const D=[
  {id:'fam',n:'Семейная ипотека',rate:6,cap:6,tag:'господдержка',ok:fam&&dp>=20,why:!fam?'Нужен ребёнок до 6 лет или трое и более детей':'Первоначальный взнос меньше 20%',d:'Фиксированная ставка на весь срок'},
  {id:'rur',n:'Сельская ипотека',rate:3,cap:6,tag:'господдержка',ok:!!site.rural&&dp>=20,why:!site.rural?'Участок не в сельской территории':'Первоначальный взнос меньше 20%',d:'Для домов в сёлах и посёлках'},
  {id:'it',n:'IT-ипотека',rate:6,cap:9,tag:'для IT',ok:!!p.it&&dp>=20,why:!p.it?'Нужна работа в аккредитованной IT-компании':'Первоначальный взнос меньше 20%',d:'Для сотрудников IT-компаний'},
  {id:'dv',n:'Дальневосточная ипотека',rate:2,cap:6,tag:'господдержка',ok:false,why:'Участок не в Дальневосточном округе',d:''},
  {id:'con',n:'Ипотека на строительство дома',rate:10.9,cap:15,tag:'базовая',ok:dp>=15,why:'Первоначальный взнос меньше 15%',d:'Деньги выдаются по этапам стройки, банк контролирует расходы'}];
 const rest=D.find(x=>x.id==='con');
 D.forEach(x=>{if(!x.ok)return;x.part=Math.min(loan,x.cap);x.rest=loan-x.part;x.pay=pmt(x.part,x.rate,p.term)+(x.rest>0?pmt(x.rest,rest.rate,p.term):0);x.over=x.pay*p.term*12-loan;const r=x.pay*1e5/inc;x.ratio=r;x.app=r<=30?['Высокая','ok']:r<=45?['Средняя','warn']:['Низкая','bad']});
 const okL=D.filter(x=>x.ok).sort((a,b)=>a.pay-b.pay);if(okL[0])okL[0].best=1;
 return{D,okL,bad:D.filter(x=>!x.ok),loan,mat,dp,tot}}
function prodHtml(){const c=cwS(),L=prodList();
 if(L.loan<=0)return `<div class="callout">Кредит не требуется: собственных средств достаточно.</div>`;
 return `<div class="row sb wrap" style="margin-bottom:10px"><div><b>Нужно взять в кредит: ${m1(L.loan)}</b><div class="sm mut">Стоимость ${m1(L.tot)} − взнос ${m1(c.profile.down)}${L.mat?' − маткапитал 0,69 млн ₽':''}</div></div>${chip('взнос '+fmt(L.dp,0)+'%',L.dp>=20?'ok':'warn')}</div>
 <h3 style="margin:14px 0 8px">Доступно вам: ${L.okL.length}</h3>
 ${L.okL.map(x=>`<div class="prod ${c.prod===x.id?'on':''} ${x.best?'best':''}">${x.best?'<span class="rec">Лучший для вас</span>':''}<div class="row sb wrap"><div><b style="font-size:16px">${x.n}</b> ${chip(x.tag,x.tag==='базовая'?'gray':'ok')}<div class="sm mut">${x.d}${x.rest>0?` · до ${x.cap} млн по ставке ${x.rate}%, остаток ${fmt(x.rest,1)} млн — по ${fmt(rest10(),1)}%`:''}</div></div><div style="text-align:right"><div class="b" style="font-size:22px">${fmt(x.pay*1e6)} ₽/мес</div><div class="sm mut">ставка ${x.rate}% · переплата ${fmt(x.over,1)} млн ₽</div></div></div>
 <div class="row sb wrap" style="margin-top:8px"><span class="sm">Вероятность одобрения: ${chip(x.app[0],x.app[1])} · платёж ${fmt(x.ratio,0)}% дохода</span><button class="btn ${c.prod===x.id?'':'ghost'} sm" data-act="cwprod" data-id="${x.id}">${c.prod===x.id?'✓ Выбрано':'Выбрать'}</button></div></div>`).join('')||'<div class="callout warn">Нет доступных программ — увеличьте первоначальный взнос.</div>'}
 ${L.bad.length?`<h3 style="margin:14px 0 8px" class="mut">Недоступно сейчас</h3>${L.bad.map(x=>`<div class="prod off"><b>${x.n}</b> <span class="sm mut">от ${x.rate}%</span><div class="sm down">✕ ${x.why}</div></div>`).join('')}`:''}`}
const rest10=()=>10.9;

function prevHtml(){const c=cwS(),p=c.plan,st=STY[p.style],T=cwTotal();return houseSvg(p.style,p.floors,st.pal[0],{terrace:c.opts.terr,garage:c.opts.gar})+`<div class="row sb" style="margin-top:8px"><span class="mut sm">Предварительная оценка стройки</span><b>≈ ${m1(T.build+T.opts)}</b></div>`}
window.UPD_cw=()=>{const c=cwS();if(c.step===5&&$('#cw-live'))$('#cw-live').innerHTML=prodHtml();if(c.step===3&&$('#cw-prev'))$('#cw-prev').innerHTML=prevHtml()};

const stepper=c=>`<div class="stepper">${ST3.map((s,i)=>`<div class="sp ${i+1<c.step?'done':i+1===c.step?'act':''}" ${i+1<c.step?`data-act="cwgo" data-s="${i+1}"`:''}><b>${i+1<c.step?'✓':i+1}</b><span>${s}</span></div>`).join('')}</div>`;
const commChips=a=>a.map(x=>`<span class="chip ${x[1]===1?'ok':x[1]?'warn':'gray'}">${x[1]===1?'✓':x[1]?'◔':'✕'} ${x[0]}</span>`).join(' ');

function s1(c){return `<div class="g g12"><div class="card"><h3>Выберите участок <span class="sub">5 вариантов под ваш запрос</span></h3>
 <div class="row wrap sm mut" style="margin-bottom:10px">Запрос: Казань и пригород · ИЖС · до 4,5 млн ₽ · с коммуникациями</div>
 ${CSITES.map(s=>`<div class="site ${c.site===s.id?'on':''}"><div class="row sb"><b>${s.name}</b><b>${fmt(s.price,1)} млн ₽</b></div><div class="sm mut">${s.area} соток · ${s.dist} км от Казани · ${s.cad}</div><div style="margin:6px 0">${commChips(s.comm)}</div><div class="sm">${s.infra}</div>
 ${c.more[s.id]?`<div class="callout" style="margin-top8px;margin-top:8px"><table>${s.extra.map(e=>`<tr><td class="mut">${e[0]}</td><td><b>${e[1]}</b></td></tr>`).join('')}</table><div style="margin-top:6px">💡 ${s.tip}</div></div>`:''}
 <div class="row" style="margin-top:8px"><button class="btn ${c.site===s.id?'':'ghost'} sm" data-act="cwsite" data-i="${s.id}">${c.site===s.id?'✓ Выбран':'Выбрать'}</button><button class="btn ghost sm" data-act="cwmore" data-i="${s.id}">${c.more[s.id]?'Скрыть':'Подробнее об участке'}</button></div></div>`).join('')}</div>
 <div class="card"><h3>На карте</h3><div class="map" style="height:360px"><svg viewBox="0 0 100 100" preserveAspectRatio="none"><rect width="100" height="100" fill="#eef5f0"/><path d="M0 70 Q30 55 60 66 T100 60" stroke="#cfe3f7" stroke-width="3" fill="none"/><path d="M10 10 L45 55 L95 80" stroke="#dce6df" stroke-width="1.6" fill="none"/></svg>
 <div class="pin ok" style="left:22%;top:78%"><i style="background:#2f7de1"></i><span>Казань</span></div>
 ${CSITES.map(s=>`<div class="pin ok ${c.site===s.id?'sel':''}" style="left:${s.x}%;top:${s.y}%" data-act="cwsite" data-i="${s.id}"><i></i><span>${fmt(s.price,1)} млн</span></div>`).join('')}</div>
 <button class="btn" style="width:100%;margin-top:12px" ${c.site==null?'disabled':''} data-act="cwgo" data-s="2">Проверить участок →</button>${c.site==null?'<div class="sm mut" style="text-align:center;margin-top:6px">Сначала выберите участок</div>':''}</div></div>`}

function s2(c){const s=csite(),src=['Росреестр: права и обременения','Картотека арбитражных дел','Реестр банкротств (ЕФРСБ)','ГПЗУ и правила застройки','Кадастровая карта и границы','Охранные и водоохранные зоны','Судебные акты судов общей юрисдикции','Сведения о продавце'];
 const col=riskCol(s.risk),ic={ok:'✅',warn:'⚠️',bad:'⛔'};
 if(!c.checked)return `<div class="card"><h3>Проверяем «${s.name}»…</h3>${src.map((x,i)=>`<div class="chk"><span class="ic">${i<c.chkN?'✅':i===c.chkN?'⏳':'·'}</span><div class="${i>c.chkN?'mut':''}">${x}</div></div>`).join('')}${bar(c.chkN/src.length*100)}</div>`;
 const v=s.risk<35?['Участок чистый — можно покупать','ok']:s.risk<60?['Можно покупать с условиями','warn']:['Покупать не рекомендуем','bad'];
 return `<div class="g g21"><div class="card"><div class="row"><div class="gauge" style="background:conic-gradient(${col} ${s.risk}%,#e6ebe7 0)"><b>${s.risk}</b></div><div><div class="b" style="font-size:18px">${v[0]}</div><div class="sm mut">Проверка заняла 11 минут · 27 источников</div></div></div>
  <div class="callout ${v[1]==='ok'?'':'warn'}" style="margin:12px 0">${s.tip}</div>
  ${s.checks.map(x=>`<div class="chk"><span class="ic">${ic[x[1]]}</span><div><b>${x[0]}</b><div class="sm mut">${x[2]}</div></div></div>`).join('')}
  <div class="row wrap" style="margin-top:12px"><button class="btn ghost sm" data-act="cwrep">${c.rep?'Скрыть расширенный отчёт':'Расширенный отчёт'}</button><button class="btn ghost sm" data-act="toast" data-m="Отчёт сохранён в PDF (демо)">⬇ Скачать PDF</button><button class="btn ghost sm" data-act="toast" data-m="Заказана свежая выписка ЕГРН (демо)">Заказать выписку ЕГРН</button></div>
  ${c.rep?`<div style="margin-top:12px"><h3 style="margin-bottom:6px">Судебная практика</h3>${s.cases.length?s.cases.map(x=>`<div class="row sb" style="padding:5px 0"><div><b>${x[0]}</b><div class="sm mut">${x[1]}</div></div>${chip(x[2]==='bad'?'риск':x[2]==='info'?'инфо':'норма',x[2]==='bad'?'bad':x[2]==='info'?'info':'ok')}</div>`).join(''):'<div class="sm mut">Дел, связанных с участком, не найдено.</div>'}<h3 style="margin:12px 0 6px">Источники</h3><div class="sm mut">${src.join(' · ')}</div><h3 style="margin:12px 0 6px">Характеристики</h3><table>${s.extra.map(e=>`<tr><td class="mut">${e[0]}</td><td>${e[1]}</td></tr>`).join('')}</table></div>`:''}</div>
  <div class="card"><h3>Что дальше</h3>${s.risk>=60?`<div class="alert bad"><b>Выберите другой участок</b><div class="sm">В этом — арест и судебные споры. Мы сохранили отчёт, чтобы вы могли показать его продавцу.</div></div><button class="btn" style="width:100%" data-act="cwgo" data-s="1">← К выбору участка</button>`:`<p class="mut" style="margin-top:0">Участок: <b>${fmt(s.price,1)} млн ₽</b>, ${s.area} соток.</p><button class="btn" style="width:100%" data-act="cwgo" data-s="3">Далее: проект дома →</button><button class="btn ghost" style="width:100%;margin-top:8px" data-act="cwgo" data-s="1">Выбрать другой участок</button>`}</div></div>`}

function s3(c){const p=c.plan,st=STY[p.style],stale=c.vars&&JSON.stringify(c.vars.plan)!==JSON.stringify(p);
 const side=`<div class="card"><h3>Какой дом хотите?</h3>
  ${slider('cw.plan.area','Площадь дома, м²',60,260,5)}
  <div class="fld"><label>Этажей</label><div class="tabs" style="margin:0">${[1,2].map(f=>`<button data-act="cwplan" data-k="floors" data-v="${f}" class="${p.floors===f?'on':''}">${f}</button>`).join('')}</div></div>
  ${slider('cw.plan.beds','Спален',1,6,1)}
  <div class="fld"><label>Стиль</label><div class="tabs" style="margin:0">${Object.entries(STY).map(([k,v])=>`<button data-act="cwplan" data-k="style" data-v="${k}" class="${p.style===k?'on':''}">${v.n}</button>`).join('')}</div></div>
  <div id="cw-prev" style="margin-bottom:10px">${prevHtml()}</div>
  <button class="btn" style="width:100%" data-act="cwgen" ${c.gen===1?'disabled':''}>${c.gen===1?'Создаём проект…':c.vars?'Создать заново':'✨ Создать проект и дизайн'}</button><div class="sm mut" style="margin-top:6px">Агент подберёт планировку под ваш участок: ${csite().area} соток, ограничения учтены.</div></div>`;
 let main='';
 if(c.gen===1)main=`<div class="card"><h3>Генерируем варианты…</h3>${['Анализ границ участка и отступов','Подбор планировок под семью','Расчёт сметы по ценам поставщиков','Дизайн интерьера'].map((x,i)=>`<div class="chk"><span class="ic">⏳</span><div>${x}</div></div>`).join('')}</div>`;
 else if(!c.vars)main=`<div class="card" style="display:grid;place-items:center;text-align:center;min-height:260px;color:var(--mut)"><div><div style="font-size:44px">🏡</div>Задайте параметры слева и нажмите «Создать проект» — мы покажем 3 варианта дома, планировку, дизайн и смету.</div></div>`;
 else{const T=cwTotal(),vi=c.vi;
  main=`${stale?'<div class="alert">Параметры изменились — нажмите «Создать заново», чтобы обновить варианты.</div>':''}
  <div class="card" style="margin-bottom:16px"><h3>Варианты проекта <span class="sub">выберите один</span></h3><div class="g g3" style="margin:0">${VAR.map((v,i)=>{const sel=c.vars.plan,cost=sel.area*STY[sel.style].r*(sel.floors===2?.93:1)*v[1];return `<div class="vcard ${vi===i?'on':''}" data-act="cwvar" data-i="${i}">${houseSvg(sel.style,sel.floors,STY[sel.style].pal[i],{terrace:i===1,garage:c.opts.gar})}<div class="bd"><b>${i+1}. ${v[0]}</b><div class="sm mut">${v[2]}</div><div class="row sb" style="margin-top:6px"><b>${m1(cost)}</b><span class="sm mut">≈ ${cwTotal().months} мес.</span></div></div></div>`}).join('')}</div></div>
  ${vi==null?'':`<div class="card"><div class="tabs">${[['plan','Планировка'],['int','Дизайн интерьера'],['opt','Опции и пожелания']].map(t=>`<button data-act="cwtab" data-t="${t[0]}" class="${c.tab===t[0]?'on':''}">${t[1]}</button>`).join('')}</div>${c.tab==='plan'?planHtml(c):c.tab==='int'?intHtml(c):optHtml(c)}
  <div class="row sb wrap" style="margin-top:14px;border-top:1px solid var(--line);padding-top:12px"><div><div class="mut sm">Итого: участок + дом + дизайн</div><b style="font-size:20px">${m1(T.total)}</b></div><button class="btn" data-act="cwgo" data-s="4">Далее: согласование →</button></div></div>`}`}
 return `<div class="g g12">${side}<div>${main}</div></div>`}
function planHtml(c){const p=c.vars.plan,A=p.area,liv=Math.round(A*.28),bed=Math.round(A*.5/p.beds*10)/10,bath=p.floors===2?2:1;
 const R=[['Гостиная-кухня',liv,'#bfe8cc'],...Array.from({length:p.beds},(_,i)=>['Спальня '+(i+1),Math.max(10,Math.round(bed)),'#e3f0fb']),['Санузел ×'+bath,6*bath,'#fde9c8'],['Котельная',6,'#e9e9e9'],['Холл и лестница',Math.round(A*.1),'#f0e6ff']];
 return `<div class="plan">${R.map(r=>`<div style="flex:${r[1]};background:${r[2]}"><b>${r[0]}</b><span>${r[1]} м²</span></div>`).join('')}</div><div class="sm mut" style="margin-top:8px">Схема пропорций помещений. Общая площадь ${A} м², ${p.floors} эт., ${p.beds} спален. Срок строительства ≈ ${cwTotal().months} мес.</div>`}
function intHtml(c){const T=INT[c.pal];return `<div class="g g2" style="margin:0"><div>${roomSvg(T.c)}</div><div>${INT.map((x,i)=>`<div class="site ${c.pal===i?'on':''}" data-act="cwpal" data-i="${i}"><div class="row sb"><b>${x.n}</b><span class="sm mut">${x.p?'+'+fmt(x.p,2)+' млн ₽':'входит в проект'}</span></div><div class="row" style="margin-top:6px">${x.c.map(k=>`<span class="sw" style="background:${k}"></span>`).join('')}</div></div>`).join('')}</div></div>`}
function optHtml(c){return `${OPTS.map(o=>`<label class="chk" style="cursor:pointer"><input type="checkbox" data-act="cwopt" data-k="${o[0]}" ${c.opts[o[0]]?'checked':''}><div style="flex:1"><b>${o[1]}</b></div><b>+${fmt(o[2],2)} млн ₽</b></label>`).join('')}<div class="row" style="margin-top:12px"><input type="text" id="cw-wish" placeholder="Своё пожелание: «хочу кабинет на втором этаже»"><button class="btn" data-act="cwwish">Учесть</button></div>`}

function s4(c){const T=cwTotal(),s=csite(),p=c.plan;
 return `<div class="g g21"><div class="card"><h3>Ваш проект готов к согласованию</h3><div class="g g2" style="margin:0 0 12px">${houseSvg(p.style,p.floors,STY[p.style].pal[c.vi],{terrace:c.vi===1,garage:c.opts.gar})}${roomSvg(INT[c.pal].c)}</div>
  <table><tr><td class="mut">Участок</td><td>${s.name}, ${s.area} соток</td><td class="n">${m1(T.site)}</td></tr><tr><td class="mut">Дом</td><td>${STY[p.style].n}, ${p.area} м², ${p.floors} эт., ${p.beds} спальни · вариант ${c.vi+1}</td><td class="n">${m1(T.build)}</td></tr>${T.opts?`<tr><td class="mut">Опции</td><td>${OPTS.filter(o=>c.opts[o[0]]).map(o=>o[1]).join(', ')}</td><td class="n">${m1(T.opts)}</td></tr>`:''}<tr><td class="mut">Проект и дизайн</td><td>${INT[c.pal].n}</td><td class="n">${m1(T.design)}</td></tr><tr><td><b>Итого</b></td><td class="mut">срок стройки ≈ ${T.months} мес.</td><td class="n"><b>${m1(T.total)}</b></td></tr></table></div>
  <div class="card sber"><h3>Всё устраивает?</h3><p class="mut" style="margin-top:0">После подтверждения мы подберём кредитные продукты, доступные именно вам.</p><button class="btn" style="width:100%;font-size:16px;padding:12px" data-act="cwok">✓ Всё устраивает — ОК</button><button class="btn ghost" style="width:100%;margin-top:8px" data-act="cwgo" data-s="3">Изменить проект</button><button class="btn ghost" style="width:100%;margin-top:8px" data-act="toast" data-m="Проект и смета сохранены в PDF (демо)">⬇ Скачать проект</button></div></div>`}

function s5(c){const p=c.profile;
 return `<div class="g g12"><div class="card"><h3>О вас <span class="sub">условия подбора</span></h3>
  ${slider('cw.profile.kids','Детей в семье',0,4,1)}${slider('cw.profile.income','Доход семьи, тыс. ₽/мес',80,800,10)}${slider('cw.profile.down','Первоначальный взнос, млн ₽',0.5,12,.1)}${slider('cw.profile.term','Срок кредита, лет',5,30,1)}
  <label class="chk" style="cursor:pointer"><input type="checkbox" data-act="cwflag" data-k="under6" ${p.under6?'checked':''}><div>Есть ребёнок младше 6 лет</div></label>
  <label class="chk" style="cursor:pointer"><input type="checkbox" data-act="cwflag" data-k="matcap" ${p.matcap?'checked':''}><div>Использую материнский капитал (0,69 млн ₽)</div></label>
  <label class="chk" style="cursor:pointer"><input type="checkbox" data-act="cwflag" data-k="it" ${p.it?'checked':''}><div>Работаю в аккредитованной IT-компании</div></label></div>
  <div class="card"><h3>Кредитные продукты <span class="sub">условия демонстрационные</span></h3><div id="cw-live">${prodHtml()}</div>
  <button class="btn" style="width:100%;margin-top:12px" ${c.prod||prodList().loan<=0?'':'disabled'} data-act="cwgo" data-s="6">Оформить заявку →</button></div></div>`}

function s6(c){const L=prodList(),pr=L.D.find(x=>x.id===c.prod)||{n:'Без кредита',rate:0,pay:0};
 return `<div class="card sber" style="text-align:center;padding:26px"><div style="font-size:48px">🎉</div><h2 style="margin:6px 0">Заявка отправлена</h2><div class="mut">№ ПФ-2026-0417 · ${pr.n}${pr.pay?` · ${fmt(pr.pay*1e6)} ₽/мес`:''}</div></div>
 <div class="g g2" style="margin-top:16px"><div class="card"><h3>Что будет дальше</h3>${[['Сегодня','Заявка принята, документы по участку и проекту приложены автоматически'],['1–2 дня','Решение банка и подготовка условий'],['3–5 дней','Сделка по участку, расчёты через эскроу'],['Через 2 недели','Подбор подрядчика и старт строительства'],['Далее','Деньги выдаются по этапам, агент проверяет каждый платёж']].map((x,i)=>`<div class="chk"><span class="ic">${i===0?'✅':'⏳'}</span><div><b>${x[0]}</b><div class="sm mut">${x[1]}</div></div></div>`).join('')}</div>
 <div class="card dc"><h3><span class="badge dc">ДомКлик</span> После завершения</h3><p class="mut" style="margin-top:0">Хотите потом продать или сдать дом? Разместим объявление в ДомКлик с готовыми фото и планами.</p><button class="btn dc" data-act="toast" data-m="Напомним об этом за 2 месяца до завершения стройки">Напомнить позже</button><div style="margin-top:12px"><a class="btn" href="#track" style="text-decoration:none;display:inline-block">Перейти к ходу стройки →</a></div></div></div>`}

PC={};
PC.build=()=>{const c=cwS(),s=[0,s1,s2,s3,s4,s5,s6][c.step];
 return `<div class="row sb wrap" style="margin-bottom:12px"><div><div class="mut sm">Анна Соколова · семья, двое детей</div><h2 style="margin:0">Построим ваш дом</h2></div><button class="btn ghost sm" data-act="cwreset">Начать заново</button></div>${stepper(c)}${s(c)}`};
PC.track=()=>{const T=cwTotal(),st=[['Подготовка и фундамент','done','июн – июл','100%'],['Коробка и перекрытия','act','авг – окт','65%'],['Кровля','wait','окт – ноя',''],['Инженерные системы','wait','ноя – дек',''],['Отделка','wait','янв – фев','']],tr=[['1. Фундамент',20,'выдан 18.07'],['2. Коробка',30,'ожидает акта (65%)'],['3. Кровля',15,''],['4. Инженерия',20,''],['5. Отделка',15,'']];
 return `<div class="g g3"><div class="card kpi hero"><div class="l">Ваш дом</div><div class="v" style="font-size:20px">Сады Айдара, уч. 14</div><div class="d">Скандинавский · 140 м² · 2 этажа</div></div><div class="card kpi"><div class="l">Готовность</div><div class="v">38%</div>${bar(38)}</div><div class="card kpi"><div class="l">Ввод в эксплуатацию</div><div class="v">март 2027</div><div class="d up">по графику</div></div></div>
 <div class="g g2"><div class="card"><h3>Этапы</h3>${st.map(x=>`<div class="chk"><span class="ic">${x[1]==='done'?'✅':x[1]==='act'?'🔄':'⏳'}</span><div style="flex:1"><b>${x[0]}</b><div class="sm mut">${x[2]}</div>${x[3]?bar(parseInt(x[3])):''}</div></div>`).join('')}</div>
 <div class="card"><h3>Деньги по этапам <span class="sub">банк платит после акта</span></h3><table><tr><th>Транш</th><th class="n">Доля</th><th>Статус</th></tr>${tr.map(x=>`<tr><td>${x[0]}</td><td class="n">${x[1]}%</td><td>${x[2]||'—'}</td></tr>`).join('')}</table><div class="callout" style="margin-top:10px">Агент сверяет платежи подрядчикам со сметой: проверено 12, замечаний нет.</div></div></div>
 <div class="card"><h3>Фото со стройки <span class="sub">обновлено сегодня</span></h3><div class="g g4" style="margin:0">${['Монолитная плита','Стены 1 этажа','Перекрытие','Армирование'].map((x,i)=>`<div class="house"><div class="im" style="background:linear-gradient(135deg,${['#d8e4dc','#e6dccb','#dbe3ea','#e8e0d8'][i]},#fff)">🏗️</div><div class="bd"><b>${x}</b><div class="sm mut">${12+i*3} сент.</div></div></div>`).join('')}</div></div>`};
const AC={
 cwsite:e=>{const c=cwS();c.site=+e.dataset.i;c.checked=false;c.chkN=0;c.rep=false;render.keep=1;render()},
 cwmore:e=>{const c=cwS(),i=+e.dataset.i;c.more[i]=!c.more[i];render.keep=1;render()},
 cwgo:e=>{const c=cwS(),n=+e.dataset.s;if(n===1){c.checked=false}c.step=n;if(n===2&&!c.checked)runCheck();window.scrollTo(0,0);render()},
 cwrep:()=>{const c=cwS();c.rep=!c.rep;render.keep=1;render()},
 cwplan:e=>{const c=cwS();c.plan[e.dataset.k]=e.dataset.k==='floors'?+e.dataset.v:e.dataset.v;render.keep=1;render()},
 cwgen:()=>{const c=cwS();c.gen=1;c.vi=null;render.keep=1;render();setTimeout(()=>{c.gen=2;c.vars={plan:{...c.plan}};c.vi=0;render.keep=1;if(onBuild())render()},1600)},
 cwvar:e=>{const c=cwS();c.vi=+e.dataset.i;render.keep=1;render()},
 cwtab:e=>{cwS().tab=e.dataset.t;render.keep=1;render()},
 cwpal:e=>{cwS().pal=+e.dataset.i;render.keep=1;render()},
 cwopt:e=>{const c=cwS();c.opts[e.dataset.k]=e.checked;render.keep=1;render()},
 cwwish:()=>{const v=$('#cw-wish').value.trim();toast(v?`Агент учёл пожелание «${v}», обновил планировку и смету (демо)`:'Напишите пожелание')},
 cwok:()=>{const c=cwS();c.ok=true;c.step=5;toast('Проект согласован. Подбираем кредитные продукты…');window.scrollTo(0,0);render()},
 cwprod:e=>{const c=cwS();c.prod=e.dataset.id;render.keep=1;render()},
 cwflag:e=>{cwS().profile[e.dataset.k]=e.checked?1:0;render.keep=1;render()},
 cwreset:()=>{S.cw=cwInit();window.scrollTo(0,0);render()}
};
function runCheck(){const c=cwS();c.chkN=0;c.checked=false;clearInterval(runCheck.t);runCheck.t=setInterval(()=>{c.chkN++;if(c.chkN>=8){c.checked=true;clearInterval(runCheck.t)}if(onBuild()&&c.step===2){render.keep=1;render()}},380)}

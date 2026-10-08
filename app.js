const $=s=>document.querySelector(s);
const fmt=(n,d=0)=>Number(n).toLocaleString('ru-RU',{minimumFractionDigits:d,maximumFractionDigits:d});
const chip=(t,c='gray')=>`<span class="chip ${c}">${t}</span>`;
const stc={ok:'ok',warn:'warn',bad:'bad'};
const stTxt={ok:'В норме',warn:'Внимание',bad:'Риск'};
const S={role:'client',cw:null,pid:'lg',site:0,scen:'base',fm:{price:168000,cost:128000,months:22,rate:10.7},psdCur:false,
 pay:JSON.parse(JSON.stringify(PAYMENTS)),log:[['14.09, 16:20','Контроль-агент','Платёж № 418 помечен как нецелевой, ожидает решения банка']],
 calc:{share:3,margin:4,team:15,months:24},house:'all',mort:{price:25.9,down:20,rate:6,years:25},
 chat:[{a:1,t:'Здравствуйте! Я консультирую по сделке и оформлению проекта. Задайте вопрос или выберите пример ниже.'}],wiz:0,searched:true};
const CHAT_QA=[
 ['Можно ли вести ИЖС на участке с видом ЛПХ?','Напрямую — нет: для строительства дома под ИЖС потребуется изменить вид разрешённого использования (ст. 7 ЗК РФ, ст. 37 ГрК РФ). Срок ≈2–3 месяца. Практика: дело А65-1847/2024. Могу подготовить заявление о смене ВРИ.'],
 ['Какие документы нужны для заявки на ПФ?','Базовый пакет — 12 документов: учредительные документы и баланс застройщика, ГПЗУ, права на участок, разрешение на строительство, заключение экспертизы ПСД, финмодель, график платежей, договоры подряда. Готово 11 из 12.'],
 ['Как защититься от срыва подрядчика?','В проекте включён резерв: по каждому ключевому материалу подобран альтернативный поставщик и подготовлен шаблон допсоглашения. Контроль-агент ежедневно оценивает риск подрядчика (сейчас максимум — «СтальМонтаж», 71/100).'],
 ['Что делать с сервитутом ЛЭП на участке?','Сервитут занимает 120 м² (4% площади). Варианты: сместить пятно застройки, запросить скидку 3–5% (4–7 млн ₽) или вынести опору по ТУ сетевой организации (≈9 млн ₽, 5–6 мес.).']];

const NAV=[['overview','▦','Обзор портфеля'],['project','▣','Карточка проекта'],['site','⌖','Участок и юр-проверка'],['finmodel','₽','Финмодель и заявка'],['psd','▤','ПСД и смета'],['control','◉','Контроль исполнения'],['finish','⌂','Завершение и продажи'],['case','↗','Бизнес-кейс']];
const TITLES=Object.fromEntries(NAV.map(n=>[n[0],n[2]]));

/* ---------- charts ---------- */
function chart({w=620,h=240,series,labels,fy=v=>fmt(v)}){
 const L=50,R=12,T=14,B=28;let all=series.flatMap(s=>s.data),mn=Math.min(0,...all),mx=Math.max(0,...all);if(mx===mn)mx=mn+1;
 const pad=(mx-mn)*.08;mx+=pad;if(mn<0)mn-=pad;
 const X=i=>L+(i+.5)*(w-L-R)/labels.length,Y=v=>T+(mx-v)*(h-T-B)/(mx-mn);let g='';
 for(let i=0;i<=4;i++){const v=mn+(mx-mn)*i/4;g+=`<line class="grid" x1="${L}" x2="${w-R}" y1="${Y(v)}" y2="${Y(v)}"/><text class="ax" x="${L-6}" y="${Y(v)+4}" text-anchor="end">${fy(v)}</text>`}
 labels.forEach((l,i)=>g+=`<text class="ax" x="${X(i)}" y="${h-8}" text-anchor="middle">${l}</text>`);
 g+=`<line class="zero" x1="${L}" x2="${w-R}" y1="${Y(0)}" y2="${Y(0)}"/>`;
 const bw=(w-L-R)/labels.length*.5;
 series.forEach(s=>{if(s.type==='bar')s.data.forEach((v,i)=>g+=`<rect x="${X(i)-bw/2}" y="${Math.min(Y(v),Y(0))}" width="${bw}" height="${Math.max(1,Math.abs(Y(v)-Y(0)))}" fill="${s.color}" rx="3"/>`);
  else g+=`<polyline points="${s.data.map((v,i)=>X(i)+','+Y(v)).join(' ')}" fill="none" stroke="${s.color}" stroke-width="2.5" ${s.dash?'stroke-dasharray="6 4"':''}/>`+s.data.map((v,i)=>`<circle cx="${X(i)}" cy="${Y(v)}" r="3" fill="${s.color}"/>`).join('')});
 return `<svg viewBox="0 0 ${w} ${h}" class="chart">${g}</svg><div class="legend">${series.map(s=>`<span><i style="background:${s.color}"></i>${s.name}</span>`).join('')}</div>`;
}
const bar=(p,c='')=>`<div class="bar"><i class="${c}" style="width:${Math.min(100,p)}%"></i></div>`;
const riskC=r=>r>=60?'bad':r>=35?'warn':'ok';
const riskCol=r=>r>=60?'var(--bad)':r>=35?'var(--warn)':'var(--sber)';
const proj=()=>PROJECTS.find(p=>p.id===S.pid);
const visible=()=>S.role==='dev'?PROJECTS.filter(p=>p.dev.includes('СтройАльянс')):PROJECTS;
const slider=(path,label,min,max,step,unit='')=>{const v=path.split('.').reduce((o,k)=>o[k],S);return `<div class="fld"><label>${label}<output data-val="${path}" data-u="${unit}">${fmt(v,step<1?1:0)}${unit}</output></label><input type="range" data-bind="${path}" min="${min}" max="${max}" step="${step}" value="${v}"></div>`};

/* ---------- pages ---------- */
const P={};Object.assign(P,PC);Object.assign(TITLES,Object.fromEntries(CNAV.map(n=>[n[0],n[2]])));

P.overview=()=>{
 const ps=visible(),loan=ps.reduce((a,p)=>a+p.loan,0),red=ps.filter(p=>p.st==='bad').length,yel=ps.filter(p=>p.st==='warn').length;
 const stages=['Участок','Финмодель','ПСД','Строительство','Завершение','Продажи'];const mx=Math.max(...stages.map(s=>ps.filter(p=>p.stage===s).length),1);
 const dev=S.role==='dev';
 return `
 <div class="g g4">
  <div class="card kpi hero"><div class="l">${dev?'Мои проекты':'Проектов в сопровождении'}</div><div class="v">${ps.length}</div><div class="d">${dev?'3 объекта в Казани':'+2 за квартал'}</div></div>
  <div class="card kpi"><div class="l">${dev?'Профинансировано':'Объём лимитов'}</div><div class="v">${fmt(loan/1000,1)} млрд ₽</div><div class="d up">▲ ${dev?'ставка 10,7%':'средняя ставка 10,7%'}</div></div>
  <div class="card kpi"><div class="l">Требуют внимания</div><div class="v"><span class="down">${red}</span> / <span style="color:var(--warn)">${yel}</span></div><div class="d mut">красных / жёлтых</div></div>
  <div class="card kpi"><div class="l">Время на проверки</div><div class="v">−412 ч</div><div class="d up">в месяц, чел-часов</div></div>
 </div>
 <div class="g g21">
  <div class="card"><h3>Карта проектов <span class="sub">клик по точке — карточка проекта</span></h3>
   <div class="map"><svg viewBox="0 0 100 100" preserveAspectRatio="none"><path d="M6 28 Q12 10 30 14 Q50 6 70 14 Q92 20 96 44 Q92 64 78 70 Q60 82 38 86 Q16 92 10 74 Q2 50 6 28Z" fill="#dcebe0" stroke="#bcd5c4" stroke-width=".5"/></svg>
   ${ps.map(p=>`<div class="pin ${p.st}" style="left:${p.x}%;top:${p.y}%" data-act="open" data-id="${p.id}"><i></i><span>${p.city}</span></div>`).join('')}</div></div>
  <div class="card"><h3>Воронка по стадиям</h3><div class="funnel">${stages.map(s=>{const c=ps.filter(p=>p.stage===s).length;return `<div><span>${s}</span><b style="width:${Math.max(12,c/mx*100)}%">${c}</b></div>`}).join('')}</div>
   <h3 style="margin-top:16px">Требуют решения</h3>
   <div class="alert bad"><b>Нецелевой платёж 14,2 млн ₽</b><br><span class="sm mut">«Лесная гавань» · <a href="#control">перейти</a></span></div>
   <div class="alert bad"><b>Арест на участке</b><br><span class="sm mut">«Тюмень-Север» · <a href="#site">перейти</a></span></div>
   <div class="alert"><b>Срыв графика, 41 день</b><br><span class="sm mut">«Южные террасы»</span></div></div>
 </div>
 <div class="g g12">
  <div class="card"><h3>Лента событий агентов</h3><ul class="feed">${EVENTS.map(e=>`<li><span class="t">${e[0]}</span><div><span class="tag">${e[1]}</span>${e[2]} ${e[3]==='bad'?chip('риск','bad'):e[3]==='warn'?chip('внимание','warn'):''}</div></li>`).join('')}</ul></div>
  <div class="card"><h3>Проекты</h3><table><tr><th>Проект</th><th>Город</th><th>Стадия</th><th class="n">Лимит, млн ₽</th><th>Готовность</th><th>Статус</th></tr>
  ${ps.map(p=>`<tr class="click" data-act="open" data-id="${p.id}"><td><b>${p.name}</b><br><span class="sm mut">${p.dev}</span></td><td>${p.city}</td><td>${p.stage}</td><td class="n">${fmt(p.loan)}</td><td style="min-width:90px">${p.prog}%${bar(p.prog,p.st==='ok'?'':p.st)}</td><td>${chip(stTxt[p.st],stc[p.st])}</td></tr>`).join('')}</table></div>
 </div>`};

P.project=()=>{
 const p=proj(),act=STAGE_IDX[p.stage],docs=DOCS;
 const agentM=['14 участков отобрано','27 источников проверки','4 вопроса / день','3 сценария модели','2 версии сметы','38 платежей, 1 флаг','1 допсоглашение','7 из 12 документов','11 броней'];
 return `
 <div class="card sber" style="margin-bottom:16px"><div class="row sb wrap"><div><div class="mut sm">${p.dev} · ${p.city}</div><h2 style="margin:2px 0;font-size:22px">${p.name}</h2><div>${p.obj} · кредит <b>${fmt(p.loan)} млн ₽</b> · ставка ${p.rate}%</div></div>
  <div style="text-align:right">${chip(stTxt[p.st],stc[p.st])}<div class="sm mut" style="margin-top:6px">${p.note}</div><div class="row" style="margin-top:8px;justify-content:flex-end"><select id="pick" style="width:auto">${visible().map(x=>`<option value="${x.id}" ${x.id===p.id?'selected':''}>${x.name}</option>`).join('')}</select></div></div></div></div>
 <div class="card" style="margin-bottom:16px"><h3>Жизненный цикл: 9 функций платформы</h3><div class="tl">${FUNCS.map((f,i)=>`<div class="st ${i<act?'done':i===act?'act':''}"><div class="c">${i<act?'✓':i+1}</div>${f}</div>`).join('')}</div></div>
 <div class="card" style="margin-bottom:16px"><h3>Агенты проекта <span class="sub">мультиагентная оркестрация</span></h3><div class="g g3" style="margin:0">${FUNCS.map((f,i)=>`<div class="agent"><div class="row sb"><span class="n">${i+1}. ${f}</span>${i<act?chip('готово','ok'):i===act?chip('в работе','info'):chip('ожидает')}</div><div class="m">${i<=act?agentM[i]:'—'}</div>${bar(i<act?100:i===act?p.prog:0)}</div>`).join('')}</div></div>
 <div class="g g2">
  <div class="card"><h3>Документы проекта</h3><table>${docs.map(d=>`<tr><td>📄 ${d[0]}</td><td>${d[1]==='actual'?chip('актуален','ok'):d[1]==='sign'?chip('подписан','info'):chip('ожидается','warn')}</td><td class="mut sm">${d[2]}</td></tr>`).join('')}</table></div>
  <div class="card"><h3>Ассистент по сделке</h3><div class="chat" id="chat">${S.chat.map(m=>`<div class="msg ${m.a?'a':'u'}">${m.t}</div>`).join('')}</div>
   <div class="row wrap" style="margin-bottom:8px">${CHAT_QA.map((q,i)=>`<button class="btn ghost sm" data-act="ask" data-i="${i}">${q[0]}</button>`).join('')}</div>
   <div class="row"><input type="text" id="q" placeholder="Задайте вопрос по сделке…"><button class="btn" data-act="askfree">Спросить</button></div></div>
 </div>
 <p class="mut sm">Подробные сценарии страниц 3–7 показаны на примере «Лесной гавани».</p>`};

P.site=()=>{
 const s=SITES[S.site];const col=riskCol(s.risk);
 const ic={ok:'✅',warn:'⚠️',bad:'⛔'};
 return `
 <div class="g g12">
  <div class="card"><h3>Параметры поиска</h3>
   <div class="fld"><label>Регион</label><select><option>Казань и пригород</option><option>Республика Татарстан</option></select></div>
   <div class="fld"><label>Площадь, га</label><input type="text" value="2 – 4"></div>
   <div class="fld"><label>Бюджет, млн ₽</label><input type="text" value="до 180"></div>
   <div class="fld"><label>Назначение</label><select><option>ИЖС</option><option>МКД</option></select></div>
   <div class="fld"><label>Коммуникации</label><select><option>Обязательны</option><option>Не требуются</option></select></div>
   <button class="btn" style="width:100%" data-act="search">Найти и проверить</button>
   <div class="mut sm" style="margin-top:10px">Источники: Росреестр, ГПЗУ, кадастровые карты, картотека арбитражных дел.</div></div>
  <div class="card"><h3>Найдено участков: 3 <span class="sub">отсортировано по риску</span></h3>
   <div class="g g2" style="margin:0">
    <div>${SITES.map(x=>`<div class="site ${x.id===S.site?'on':''}" data-act="site" data-i="${x.id}"><div class="row sb"><b>${x.cad}</b>${chip('риск '+x.risk+'/100',riskC(x.risk))}</div><div class="sm mut">${x.addr}</div><div class="row sb" style="margin-top:4px"><span>${x.area} га</span><b>${x.price} млн ₽</b></div></div>`).join('')}</div>
    <div class="parcels"><svg viewBox="0 0 440 300"><rect width="440" height="300" fill="#eef5f0"/><path d="M0 200 Q120 170 220 200 T440 180" stroke="#cfe3f7" stroke-width="14" fill="none"/><path d="M0 100 H440 M200 0 V300" stroke="#dce6df" stroke-width="3"/>
    ${SITES.map(x=>`<polygon points="${x.pts}" fill="${x.id===S.site?riskCol(x.risk):'#b9c8be'}" fill-opacity="${x.id===S.site?.55:.35}" stroke="${riskCol(x.risk)}" stroke-width="2" style="cursor:pointer" data-act="site" data-i="${x.id}"/>`).join('')}
    <text x="${S.site===0?60:S.site===1?290:90}" y="${S.site===0?95:S.site===1?105:210}" font-size="12" fill="#16201a" font-weight="700">${s.cad}</text></svg></div>
   </div></div>
 </div>
 <div class="g g21">
  <div class="card"><h3>Юридическая проверка · ${s.cad} <span class="sub">8 проверок, 27 источников</span></h3>
   ${s.checks.map(c=>`<div class="chk"><span class="ic">${ic[c[1]]}</span><div><b>${c[0]}</b><div class="sm mut">${c[2]}</div></div></div>`).join('')}</div>
  <div>
   <div class="card" style="margin-bottom:16px"><h3>Итоговый риск</h3><div class="row"><div class="gauge" style="background:conic-gradient(${col} ${s.risk}%,#e6ebe7 0)"><b>${s.risk}</b></div><div><div class="b">${s.risk<35?'Низкий — рекомендуем':s.risk<60?'Средний — с условиями':'Высокий — отказ'}</div><div class="sm mut">Цена: ${s.price} млн ₽ · ${s.area} га</div></div></div>
    <div class="callout ${s.risk>=35?'warn':''}" style="margin-top:12px">${s.risks}</div></div>
   <div class="card" style="margin-bottom:16px"><h3>Судебная практика</h3>${s.cases.map(c=>`<div class="row sb" style="padding:5px 0"><div><b>${c[0]}</b><div class="sm mut">${c[1]}</div></div>${chip(c[2]==='ok'?'норма':c[2]==='bad'?'риск':c[2]==='warn'?'внимание':'инфо',c[2])}</div>`).join('')}</div>
   <div class="card"><h3>Эффект</h3><div class="ba"><div><div class="mut sm">Вручную</div><div class="x old">3–5 дней</div><div class="sm mut">9 источников</div></div><div class="x">→</div><div><div class="mut sm">С агентом</div><div class="x new">11 минут</div><div class="sm mut">27 источников</div></div></div></div>
  </div>
 </div>`};

function fmCalc(){
 const f={...S.fm};if(S.scen==='pess'){f.price*=.88;f.cost*=1.04;f.months+=4}if(S.scen==='opt'){f.price*=1.05;f.cost*=.99}
 const area=6480,loan=640,rev=f.price*area/1e6,cost=f.cost*area/1e6,interest=.6*loan*f.rate/100*f.months/12;
 const Q=Math.ceil(f.months/3),labels=[],net=[];
 for(let i=0;i<Q+2;i++){labels.push('К'+(i+1));net.push(i<Q?-cost/Q:i===Q?rev*.7:rev*.3)}
 const cum=[];net.reduce((a,v,i)=>(cum[i]=a+v),0);
 const peak=cost,equity=Math.max(0,cost-loan),eqp=equity/cost*100,margin=(rev-cost-interest)/rev*100,cov=rev/(loan+interest);
 const score=Math.round(Math.max(10,Math.min(96,25+margin*1.6+eqp*.8+(cov-1)*8)));
 return {rev,cost,interest,margin,cov,score,eqp,equity,labels,net,cum,peak,months:f.months};
}
function fmOut(){
 const r=fmCalc();const v=r.score>=70?['Рекомендовать','ok']:r.score>=50?['С условиями','warn']:['Отказ','bad'];
 return `
 <div class="g g4" style="margin-bottom:16px">
  <div class="card kpi"><div class="l">Выручка проекта</div><div class="v">${fmt(r.rev)} млн</div></div>
  <div class="card kpi"><div class="l">Маржа проекта</div><div class="v ${r.margin<8?'down':''}">${fmt(r.margin,1)}%</div><div class="d mut">себестоимость ${fmt(r.cost)} млн, проценты ${fmt(r.interest)} млн</div></div>
  <div class="card kpi"><div class="l">Покрытие долга эскроу</div><div class="v">${fmt(r.cov,2)}×</div><div class="d mut">кредит 640 млн ₽</div></div>
  <div class="card kpi"><div class="l">Собственные средства</div><div class="v ${r.eqp<15?'down':''}">${fmt(r.eqp,1)}%</div><div class="d mut">минимум по ПФ — 15%</div></div>
 </div>
 <div class="g g21"><div class="card"><h3>Денежный поток по кварталам, млн ₽ <span class="sub">выручка раскрывается из эскроу после ввода</span></h3>
  ${chart({series:[{name:'Чистый поток квартала',type:'bar',color:'#21A038',data:r.net.map(x=>Math.round(x))},{name:'Накопленный итог',color:'#2f7de1',data:r.cum.map(x=>Math.round(x))}],labels:r.labels})}</div>
  <div class="card"><h3>Кредитоспособность</h3><div class="row"><div class="gauge" style="background:conic-gradient(${r.score>=70?'var(--sber)':r.score>=50?'var(--warn)':'var(--bad)'} ${r.score}%,#e6ebe7 0)"><b>${r.score}</b></div><div><div class="b">${chip(v[0],v[1])}</div><div class="sm mut" style="margin-top:6px">Срок строительства: ${r.months} мес.<br>Пик потребности: ${fmt(r.peak)} млн ₽</div></div></div>
  <div class="sm" style="margin-top:12px;line-height:1.7">Кредит: <b>640 млн</b><br>Собственные: <b>${fmt(r.equity)} млн</b><br>Долговая нагрузка застройщика: <b>умеренная</b></div></div></div>`}
P.finmodel=()=>{
 const pk=['Пакет заявки на ПФ',['Анкета застройщика','ok'],['Бухгалтерская отчётность за 3 года','ok'],['ГПЗУ и права на участок','ok'],['Разрешение на строительство','ok'],['Финансовая модель и график','ok'],['Договоры подряда (проекты)','ok'],['Заключение экспертизы ПСД','warn']];
 return `
 <div class="g g12"><div>
  <div class="card" style="margin-bottom:16px"><h3>Параметры проекта</h3>
   <div class="tabs">${[['base','Базовый'],['pess','Пессимистичный'],['opt','Оптимистичный']].map(t=>`<button data-act="scen" data-s="${t[0]}" class="${S.scen===t[0]?'on':''}">${t[1]}</button>`).join('')}</div>
   ${slider('fm.price','Цена продажи, ₽/м²',120000,220000,1000)}${slider('fm.cost','Себестоимость, ₽/м²',90000,170000,1000)}${slider('fm.months','Срок строительства, мес.',12,36,1)}${slider('fm.rate','Ставка, %',8,16,.1,'%')}</div>
  <div class="card sber"><h3>${pk[0]}</h3>${pk.slice(1).map(x=>`<div class="chk"><span class="ic">${x[1]==='ok'?'✅':'⏳'}</span><div>${x[0]}</div></div>`).join('')}
   <div class="row sb" style="margin-top:10px"><span class="sm mut">Готово 11 из 12</span><button class="btn" data-act="toast" data-m="Заявка экспортирована в Портал DA (демо)">Экспорт в Портал DA</button></div></div>
 </div><div id="fm-out">${fmOut()}</div></div>
 <div class="card"><div class="ba"><div><div class="mut sm">Подготовка заявки вручную</div><div class="x old">3–4 недели</div></div><div class="x">→</div><div><div class="mut sm">С агентом</div><div class="x new">4 рабочих дня</div></div></div></div>`};
UPD_fm=()=>{$('#fm-out').innerHTML=fmOut()};

function smetaCalc(){return SMETA.map(r=>[r[0],r[1],r[1]*(1+(S.psdCur?r[2]:0)/100),r[2]])}
P.psd=()=>{const rows=smetaCalc(),tot=rows.reduce((a,r)=>a+r[2],0),base=763;
 return `
 <div class="g g3">
  <div class="card kpi"><div class="l">Объект</div><div class="v" style="font-size:20px">42 × 154 м²</div><div class="d mut">2 этажа · кирпич + газобетон · класс B</div></div>
  <div class="card kpi hero"><div class="l">Сметная стоимость</div><div class="v" id="smeta-total">${fmt(tot,0)} млн ₽</div><div class="d">на 6,8% ниже типовой по аналогам</div></div>
  <div class="card kpi"><div class="l">Замечаний до экспертизы</div><div class="v down">4</div><div class="d mut">2 критичных, 2 средних</div></div>
 </div>
 <div class="g g2">
  <div class="card"><h3>Сметный расчёт <span class="sub"><label><input type="checkbox" data-act="psdcur" ${S.psdCur?'checked':''}> цены поставщиков на сегодня</label></span></h3>
   <table><tr><th>Раздел</th><th class="n">Заложено</th><th class="n">${S.psdCur?'Актуально':'—'}</th><th class="n">Δ</th></tr>
   ${rows.map(r=>`<tr><td>${r[0]}</td><td class="n">${fmt(r[1])}</td><td class="n">${S.psdCur?fmt(r[2],1):'—'}</td><td class="n ${S.psdCur&&r[3]>0?'down':'up'}">${S.psdCur?(r[3]>0?'+':'')+fmt(r[3],1)+'%':''}</td></tr>`).join('')}
   <tr><td><b>Итого, млн ₽</b></td><td class="n"><b>${base}</b></td><td class="n"><b>${S.psdCur?fmt(tot,1):'—'}</b></td><td class="n"><b>${S.psdCur?'+'+fmt((tot/base-1)*100,1)+'%':''}</b></td></tr></table></div>
  <div class="card"><h3>Цены поставщиков <span class="sub">обновлено 07.10.2026</span></h3><table><tr><th>Материал</th><th class="n">Заложено</th><th class="n">Сейчас</th><th class="n">Δ</th></tr>
   ${PRICES.map(p=>{const d=(p[2]/p[1]-1)*100;return `<tr><td>${p[0]}</td><td class="n">${fmt(p[1],p[1]<100?1:0)}</td><td class="n">${fmt(p[2],p[2]<100?1:0)}</td><td class="n ${d>0?'down':'up'}">${d>0?'+':''}${fmt(d,1)}%</td></tr>`}).join('')}</table></div>
 </div>
 <div class="g g2">
  <div class="card"><h3>Риск дефектов ПСД</h3>${REMARKS.map(r=>`<div class="alert ${r[2]==='bad'?'bad':''}"><b>${r[0]}</b><div class="sm">${r[1]}</div></div>`).join('')}</div>
  <div class="card"><h3>Резервные контрагенты на случай форс-мажора</h3><table><tr><th>Материал</th><th>Поставщик</th><th class="n">Цена</th><th class="n">Δ</th><th>Поставка</th></tr>${ALTS.map(a=>`<tr><td>${a[0]}</td><td>${a[1]}</td><td class="n">${a[2]}</td><td class="n">${a[3]}</td><td>${a[4]}</td></tr>`).join('')}</table>
  <h3 style="margin-top:14px">Проекты договоров</h3><div class="row wrap">${['Поставка бетона','Подряд: фундамент','Допсоглашение об индексации'].map(c=>`<button class="btn ghost sm" data-act="toast" data-m="Черновик «${c}» сформирован и сохранён в проекте">📄 ${c}</button>`).join('')}</div></div>
 </div>`};

P.control=()=>{
 const pend=S.pay.filter(x=>x.s==='flag').length;
 return `
 <div class="g g4">
  <div class="card kpi"><div class="l">Проверено платежей</div><div class="v">38</div><div class="d up">за сентябрь</div></div>
  <div class="card kpi"><div class="l">Подозрительных</div><div class="v ${pend?'down':''}">${pend}</div><div class="d mut">ожидают решения банка</div></div>
  <div class="card kpi"><div class="l">Освоение: факт / план</div><div class="v">62 / 68%</div><div class="d down">отставание 19 дней</div></div>
  <div class="card kpi"><div class="l">Транш под блокировкой</div><div class="v">${fmt(S.pay.filter(x=>x.s==='blocked').reduce((a,x)=>a+x.sum,0),1)} млн</div></div>
 </div>
 <div class="card" style="margin-bottom:16px"><h3>Контроль целевого использования средств <span class="sub">${proj().name}</span></h3>
  <table><tr><th>Дата</th><th>Контрагент</th><th>Назначение</th><th class="n">Сумма, млн ₽</th><th>Вердикт агента</th><th></th></tr>
  ${S.pay.map(x=>`<tr><td>${x.d}</td><td><b>${x.cp}</b></td><td>${x.purpose}${x.why?`<div class="sm ${x.s==='flag'||x.s==='blocked'?'down':'mut'}">⚠ ${x.why}</div>`:''}</td><td class="n">${fmt(x.sum,1)}</td>
   <td>${x.s==='ok'||x.s==='approved'?chip(x.s==='approved'?'одобрен':'целевой','ok'):x.s==='warn'?chip('проверить цену','warn'):x.s==='blocked'?chip('заблокирован','bad'):x.s==='asked'?chip('запрошены пояснения','info'):chip('нецелевой','bad')}</td>
   <td>${x.s==='flag'||x.s==='asked'?`<div class="row"><button class="btn bad sm" data-act="pay" data-i="${x.id}" data-v="blocked">Блокировать</button><button class="btn ghost sm" data-act="pay" data-i="${x.id}" data-v="asked">Запросить</button><button class="btn ghost sm" data-act="pay" data-i="${x.id}" data-v="approved">Одобрить</button></div>`:''}</td></tr>`).join('')}</table></div>
 <div class="g g21">
  <div class="card"><h3>План-факт освоения, % <span class="sub">12 месяцев</span></h3>${chart({series:[{name:'План',color:'#9aa59d',dash:1,data:PLAN},{name:'Факт',color:'#21A038',data:FACT}],labels:['Окт','Ноя','Дек','Янв','Фев','Мар','Апр','Май','Июн','Июл','Авг','Сен'],fy:v=>fmt(v)+'%'})}
   <div class="callout warn" style="margin-top:8px">Причина отставания — задержка поставки арматуры (22 дня). Агент предлагает заменить поставщика.</div>
   <button class="btn" style="margin-top:10px" data-act="wiz">Перезаключить контракт на арматуру →</button></div>
  <div class="card"><h3>Риск контрагентов</h3>${CONTRACTORS.map(c=>`<div style="margin-bottom:10px"><div class="row sb"><b>${c[0]}</b><span class="${c[1]>=60?'down':'mut'}">${c[1]}/100</span></div>${bar(c[1],c[1]>=60?'bad':c[1]>=35?'warn':'')}<div class="sm mut">${c[2]}</div></div>`).join('')}</div>
 </div>
 <div class="card"><h3>Журнал решений банка</h3><ul class="feed">${S.log.map(l=>`<li><span class="t" style="width:92px">${l[0]}</span><div><span class="tag">${l[1]}</span>${l[2]}</div></li>`).join('')}</ul></div>`};

P.finish=()=>{
 const hs=HOUSES.filter(h=>S.house==='all'||h.s===S.house),lab={sold:'Продан',res:'Бронь',free:'В продаже',pre:'Предпродажа'};
 const m=S.mort,loan=m.price*1e6*(1-m.down/100),r=m.rate/1200,n=m.years*12,pay=loan*r/(1-Math.pow(1+r,-n));
 return `
 <div class="g g21">
  <div class="card"><h3>Чек-лист завершения проекта</h3>
   ${[['Акт приёмки объекта','ok','подписан 28.09'],['Технический план','warn','кадастровый инженер, 6 дней'],['Разрешение на ввод','warn','подано 02.10, ожидание 7 дн.'],['Регистрация права собственности','wait','после ввода'],['Закрытие эскроу-счетов','wait','после регистрации']].map(c=>`<div class="chk"><span class="ic">${c[1]==='ok'?'✅':c[1]==='warn'?'🔄':'⏳'}</span><div><b>${c[0]}</b><div class="sm mut">${c[2]}</div></div></div>`).join('')}</div>
  <div class="card"><h3>Прогноз ввода</h3><div class="kpi"><div class="v">18.12.2026</div><div class="d mut">± 12 дней · вероятность в срок 71%</div></div><div class="callout warn" style="margin-top:12px">Главный риск: затянутая экспертиза технического плана (+8 дней).</div></div>
 </div>
 <div class="card dc" style="margin-bottom:16px"><h3><span class="badge dc">ДомКлик</span> Витрина объектов <span class="sub">первая очередь: 24 дома из 42</span></h3>
  <div class="g g4" style="margin-bottom:12px"><div><div class="mut sm">Лидов</div><div class="b" style="font-size:22px">480</div></div><div><div class="mut sm">Броней</div><div class="b" style="font-size:22px">${HOUSES.filter(h=>h.s==='res').length}</div></div><div><div class="mut sm">Сделок</div><div class="b" style="font-size:22px">${HOUSES.filter(h=>h.s==='sold').length}</div></div><div><div class="mut sm">Средняя цена</div><div class="b" style="font-size:22px">25,9 млн ₽</div></div></div>
  <div class="tabs">${[['all','Все'],['sold','Проданы'],['res','Бронь'],['free','В продаже'],['pre','Предпродажа']].map(t=>`<button data-act="hf" data-f="${t[0]}" class="${S.house===t[0]?'on':''}">${t[1]}</button>`).join('')}</div>
  <div class="g g4" style="margin:0">${hs.map(h=>`<div class="house ${h.s}"><div class="im">🏠</div><div class="bd"><div class="row sb"><b>Дом №${h.n}</b>${chip(lab[h.s],h.s==='sold'?'gray':h.s==='res'?'warn':'ok')}</div><div class="sm mut">${h.area} м² · 2 эт.</div><div class="b">${fmt(h.price,1)} млн ₽</div></div></div>`).join('')}</div></div>
 <div class="g g2">
  <div class="card dc"><h3>Воронка продаж</h3><div class="funnel dc">${[['Лиды',480],['Показы',96],['Брони',18],['Сделки',7]].map(f=>`<div><span>${f[0]}</span><b style="width:${Math.max(10,f[1]/480*100)}%">${f[1]}</b></div>`).join('')}</div></div>
  <div class="card dc"><h3>Ипотека для покупателя</h3>
   <div class="fld"><label>Цена, млн ₽<output data-val="mort.price">${S.mort.price}</output></label><input type="range" data-bind="mort.price" data-upd="mort" min="15" max="40" step=".1" value="${m.price}"></div>
   <div class="fld"><label>Первоначальный взнос, %<output data-val="mort.down">${m.down}</output></label><input type="range" data-bind="mort.down" data-upd="mort" min="10" max="60" step="1" value="${m.down}"></div>
   <div class="fld"><label>Ставка, %<output data-val="mort.rate">${m.rate}</output></label><input type="range" data-bind="mort.rate" data-upd="mort" min="4" max="14" step=".1" value="${m.rate}"></div>
   <div class="callout" id="mort-out">Платёж: <b>${fmt(pay/1000)} тыс. ₽/мес</b> · кредит ${fmt(loan/1e6,1)} млн ₽ на ${m.years} лет</div></div>
 </div>`};
UPD_mort=()=>{const m=S.mort,loan=m.price*1e6*(1-m.down/100),r=m.rate/1200,n=m.years*12,pay=loan*r/(1-Math.pow(1+r,-n));$('#mort-out').innerHTML=`Платёж: <b>${fmt(pay/1000)} тыс. ₽/мес</b> · кредит ${fmt(loan/1e6,1)} млн ₽ на ${m.years} лет`};

function calcOut(){const c=S.calc,eff=MARKET.portfolio*c.share/100*c.margin/100,cost=c.team*c.months*.4,ratio=eff*1000/cost;
 return `<div class="g g3" style="margin-bottom:16px"><div class="card kpi hero"><div class="l">Годовой эффект</div><div class="v">${fmt(eff,2)} млрд ₽</div><div class="d">доп. объём ${fmt(MARKET.portfolio*c.share/100)} млрд ₽</div></div>
 <div class="card kpi"><div class="l">Затраты на реализацию</div><div class="v">${fmt(cost)} млн ₽</div><div class="d mut">${c.team} чел × ${c.months} мес × 0,4 млн</div></div>
 <div class="card kpi"><div class="l">Эффект / затраты</div><div class="v">${fmt(ratio)}×</div><div class="d mut">порядок величины, не NPV</div></div></div>`}
P.case=()=>`
 <div class="g g3">
  <div class="card kpi"><div class="l">Портфель ПФ застройщиков в РФ, 2 кв. 2025</div><div class="v">≈9,3 трлн ₽</div><div class="d mut">Банк России</div></div>
  <div class="card kpi"><div class="l">Средневзвешенная ставка по портфелю</div><div class="v">10,7%</div><div class="d mut">Банк России</div></div>
  <div class="card kpi"><div class="l">Доля Сбера (оценка)</div><div class="v">40–55%</div><div class="d mut">диапазон, точная доля не найдена</div></div>
 </div>
 <div class="g g12"><div class="card sber"><h3>Калькулятор вилки эффекта</h3>
   ${slider('calc.share','Прирост доли рынка, п.п.',1,3,.5)}${slider('calc.margin','Чистая процентная маржа, %',2,4,.5)}${slider('calc.team','Размер команды, чел.',8,15,1)}${slider('calc.months','Срок разработки, мес.',15,24,1)}
   <div class="sm mut">Допущения: прирост доли и маржа — обоснованные предположения, не найденные в открытых источниках.</div></div>
  <div id="calc-out">${calcOut()}<div class="card"><h3>Семь критериев эффективности</h3><table>${[['Хеджирование правовых рисков участка','отдельно по функции'],['Экономия на ПСД, снижение дефектов','отдельно по функции'],['Снижение риска срыва контрактов','отдельно по функции'],['Предотвращение нецелевого расходования','отдельно по функции'],['Оптимизация сроков и стоимости','отдельно по функции'],['Рост доходности застройщика, качество сервиса','по факту MVP'],['Рост доли Сбера на рынке ПФ','в вилке выше · по факту MVP']].map((c,i)=>`<tr><td>${i+1}</td><td>${c[0]}</td><td>${chip(c[1],i===6?'ok':'gray')}</td></tr>`).join('')}</table></div></div></div>
 <div class="card" style="margin-bottom:16px"><h3>Дорожная карта: начать с MVP на 1–2 функциях</h3><div class="road">
  <div><b>Фаза 1 · MVP · 6–8 мес.</b><span class="sm">Юр-проверка участка + финмодель и заявка</span></div>
  <div><b>Фаза 2</b><span class="sm">Контроль целевого использования, график</span></div>
  <div><b>Фаза 3</b><span class="sm">ПСД, смета, перезаключение контрактов</span></div>
  <div><b>Фаза 4</b><span class="sm">Завершение, продажи (ДомКлик)</span></div></div></div>
 <div class="card"><h3>Допущения и открытые вопросы</h3><ul style="margin:0;padding-left:18px"><li>Прирост доли +1…3 п.п. от одной платформы — предположение; выбор банка определяется ставкой, репутацией, условиями.</li><li>Взаимосвязь девяти функций не проанализирована; ПСД технически сложнее, чем оформление завершающих документов.</li><li>Рост доли рынка нужно измерять по факту MVP на данных о конверсии застройщиков, а не закладывать в решение о старте.</li></ul></div>`;
UPD_calc=()=>{const t=document.createElement('div');t.innerHTML=calcOut();$('#calc-out').firstElementChild.replaceWith(t.firstElementChild)};

/* ---------- wizard / modal ---------- */
function wizHtml(){const st=['Причина','Альтернативы','Сравнение условий','Черновик'];const w=S.wiz;
 const body=[
 `<p>Поставщик <b>МеталлТорг-Волга</b> задерживает поставку арматуры на <b>22 дня</b>; оплачено 6,4 млн ₽. Остаток поставки — 142 т. Задержка сдвигает график на 19 дней.</p><div class="callout warn">Нарушение п. 5.2 договора № 77/А: штраф 0,1% в день, максимум 10%.</div>`,
 `<table><tr><th>Поставщик</th><th class="n">Цена, ₽/т</th><th>Срок</th><th>Риск</th></tr><tr><td><b>Урал-Металл</b> ✓ рекомендован</td><td class="n">72 100</td><td>3 дня</td><td>${chip('17/100','ok')}</td></tr><tr><td>Сталь-Центр</td><td class="n">73 400</td><td>6 дней</td><td>${chip('33/100','warn')}</td></tr></table>`,
 `<table><tr><th>Условие</th><th>Текущий</th><th>Новый</th></tr><tr><td>Цена за 142 т</td><td>10,11 млн ₽</td><td>10,24 млн ₽ (+0,13)</td></tr><tr><td>Срок поставки</td><td>22 дня просрочки</td><td>3 дня</td></tr><tr><td>Штрафы за просрочку</td><td>0,1%/день</td><td>0,15%/день</td></tr><tr><td>Эффект</td><td colspan="2"><b>экономия ≈2,1 млн ₽</b> (штрафы + удержанное отставание)</td></tr></table>`,
 `<div class="callout" style="font-family:ui-monospace,monospace;font-size:12px">ДОПОЛНИТЕЛЬНОЕ СОГЛАШЕНИЕ № 3<br>о замене поставщика по договору № 77/А<br>1. Стороны расторгают договор поставки арматуры с ООО «МеталлТорг-Волга» по соглашению сторон.<br>2. Подрядчик заключает договор с АО «Урал-Металл» на поставку 142 т арматуры А500 по цене 72 100 ₽/т.<br>3. Срок поставки — не позднее 3 рабочих дней с момента подписания…</div>`][w];
 return `<div class="mbox"><div class="steps">${st.map((s,i)=>`<i class="${i<=w?'on':''}"></i>`).join('')}</div><h3 style="margin:0 0 10px">Перезаключение контракта · ${w+1}/4: ${st[w]}</h3>${body}
 <div class="row sb" style="margin-top:16px"><button class="btn ghost" data-act="wizclose">Отмена</button><div class="row">${w>0?'<button class="btn ghost" data-act="wizprev">Назад</button>':''}${w<3?'<button class="btn" data-act="wiznext">Далее</button>':'<button class="btn" data-act="wizsend">Отправить на согласование</button>'}</div></div></div>`}
function openWiz(){const m=$('#modal');m.innerHTML=wizHtml();m.hidden=false}

/* ---------- chat ---------- */
function ask(text){S.chat.push({a:0,t:text});render();setTimeout(()=>{const f=CHAT_QA.find(q=>q[0]===text);const ans=f?f[1]:/участ|сервитут/i.test(text)?CHAT_QA[3][1]:/документ|заявк/i.test(text)?CHAT_QA[1][1]:'Уточните вопрос: я могу ответить про оформление сделки, документы для заявки, риски по участку и подрядчикам. В боевой версии ответ строится по нормам права и судебной практике.';S.chat.push({a:1,t:ans});if(location.hash==='#project')render();},700)}

/* ---------- core ---------- */
function toast(m){const t=$('#toast');t.textContent=m;t.classList.add('show');clearTimeout(toast.t);toast.t=setTimeout(()=>t.classList.remove('show'),2800)}
function render(){
 const isC=S.role==='client',CL=['build','track'];let h=location.hash.slice(1);if(!P[h])h=isC?'build':'overview';
 if(isC&&!CL.includes(h)){location.hash='#build';return}if(!isC&&CL.includes(h)){location.hash='#overview';return}
 $('#nav').innerHTML=(isC?CNAV:NAV).filter(n=>!(S.role==='dev'&&n[0]==='case')).map(n=>`<a href="#${n[0]}" class="${n[0]===h?'on':''}"><i>${n[1]}</i>${S.role==='dev'&&n[0]==='overview'?'Мои проекты':n[2]}${n[0]==='control'&&S.pay.some(x=>x.s==='flag')?'<em>1</em>':''}</a>`).join('');
 $('#title').textContent=S.role==='dev'&&h==='overview'?'Мои проекты':TITLES[h];
 if(S.role==='dev'&&h==='case'){location.hash='#overview';return}
 const sy=window.scrollY;$('#view').innerHTML=P[h]();document.querySelectorAll('#role button').forEach(b=>b.classList.toggle('on',b.dataset.role===S.role));
 $('#side').classList.remove('open');$('#scrim').classList.remove('on');
 const c=$('#chat');if(c)c.scrollTop=c.scrollHeight;if(render.keep)window.scrollTo(0,sy);render.keep=0;
}
const A={
 open:e=>{S.pid=e.dataset.id;location.hash='#project'},
 ask:e=>ask(CHAT_QA[e.dataset.i][0]),
 askfree:()=>{const v=$('#q').value.trim();if(v)ask(v)},
 site:e=>{S.site=+e.dataset.i;render.keep=1;render()},
 search:e=>{e.textContent='Проверяю 27 источников…';e.disabled=true;setTimeout(()=>{toast('Найдено 3 участка, проверка завершена за 11 минут (демо — ускорено)');render.keep=1;render()},1100)},
 scen:e=>{S.scen=e.dataset.s;render.keep=1;render()},
 psdcur:e=>{S.psdCur=e.checked;render.keep=1;render()},
 pay:e=>{const p=S.pay.find(x=>x.id==e.dataset.i),v=e.dataset.v;p.s=v;const t=new Date();const txt={blocked:`Транш ${fmt(p.sum,1)} млн ₽ заблокирован до пояснений застройщика`,asked:'У застройщика запрошены пояснения по платежу № 418',approved:'Платёж одобрен вручную'}[v];S.log.unshift(['14.09, 16:'+(21+S.log.length),'Иванова А.С.',txt]);toast(txt);render.keep=1;render()},
 hf:e=>{S.house=e.dataset.f;render.keep=1;render()},
 toast:e=>toast(e.dataset.m),
 wiz:()=>{S.wiz=0;openWiz()},wiznext:()=>{S.wiz++;openWiz()},wizprev:()=>{S.wiz--;openWiz()},
 wizclose:()=>{$('#modal').hidden=true},
 wizsend:()=>{$('#modal').hidden=true;S.log.unshift(['07.10, 12:05','Договор-агент','Допсоглашение № 3 (замена поставщика арматуры) отправлено на согласование']);toast('Допсоглашение отправлено на согласование');render()}
};
Object.assign(A,AC);
document.addEventListener('click',ev=>{
 const e=ev.target.closest('[data-act]');if(e&&A[e.dataset.act]){if(e.type!=='checkbox')A[e.dataset.act](e);return}
 const r=ev.target.closest('#role button');if(r){S.role=r.dataset.role;if(S.role==='dev'&&S.pid!=='lg'&&!visible().find(p=>p.id===S.pid))S.pid='lg';const dh=S.role==='client'?'#build':'#overview';if(location.hash!==dh){location.hash=dh}else render()}
 if(ev.target.id==='modal')$('#modal').hidden=true;
 if(ev.target.id==='burger'){$('#side').classList.toggle('open');$('#scrim').classList.toggle('on')}if(ev.target.id==='scrim'){$('#side').classList.remove('open');$('#scrim').classList.remove('on')}
});
document.addEventListener('change',ev=>{const e=ev.target;if(e.dataset.act==='psdcur')A.psdcur(e);if(e.dataset.act&&e.type==='checkbox'&&/^cw(opt|flag)$/.test(e.dataset.act))A[e.dataset.act](e);if(e.id==='pick'){S.pid=e.value;render()}});
document.addEventListener('keydown',ev=>{if(ev.key==='Enter'&&ev.target.id==='q')A.askfree()});
document.addEventListener('input',ev=>{const e=ev.target;if(!e.dataset.bind)return;const ks=e.dataset.bind.split('.');const o=ks.slice(0,-1).reduce((a,k)=>a[k],S);o[ks.pop()]=+e.value;
 document.querySelectorAll(`[data-val="${e.dataset.bind}"]`).forEach(o=>o.textContent=fmt(+e.value,+e.step<1?1:0)+(o.dataset.u||''));
 const f={fm:UPD_fm,calc:UPD_calc,mort:UPD_mort,cw:window.UPD_cw}[ks[0]];if(f)f()});
window.addEventListener('hashchange',()=>{window.scrollTo(0,0);render()});
render();

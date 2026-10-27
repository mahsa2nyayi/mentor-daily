
(function(){
"use strict";
/* ---------- helpers ---------- */
var fa=function(n){return String(n).replace(/\d/g,function(d){return "۰۱۲۳۴۵۶۷۸۹"[d]})};
var pad=function(n){return String(n).padStart(2,"0")};
var keyOf=function(d){return d.getFullYear()+"-"+pad(d.getMonth()+1)+"-"+pad(d.getDate())};
var parseKey=function(k){var p=k.split("-").map(Number);return new Date(p[0],p[1]-1,p[2])};
var addDays=function(d,n){var x=new Date(d);x.setDate(x.getDate()+n);return x};
var mins=function(t){var p=t.split(":").map(Number);return p[0]*60+p[1]};
var hm=function(m){m=Math.max(0,Math.min(1439,m));return pad(Math.floor(m/60))+":"+pad(m%60)};
var $=function(s,r){return (r||document).querySelector(s)};
var esc=function(s){return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")};
var DAY={6:"شنبه",0:"یکشنبه",1:"دوشنبه",2:"سه‌شنبه",3:"چهارشنبه",4:"پنجشنبه",5:"جمعه"};
var ORDER=[6,0,1,2,3,4,5];
var fmtDate=new Intl.DateTimeFormat("fa-IR-u-ca-persian",{day:"numeric",month:"long",year:"numeric"});
var pf=new Intl.DateTimeFormat("en-US-u-ca-persian-nu-latn",{year:"numeric",month:"numeric",day:"numeric"});
function pparts(d){var o={};pf.formatToParts(d).forEach(function(p){if(p.type!=="literal"&&p.type!=="era")o[p.type]=parseInt(p.value,10)});o.year=o.year||o.relatedYear;return o}
var PM=["فروردین","اردیبهشت","خرداد","تیر","مرداد","شهریور","مهر","آبان","آذر","دی","بهمن","اسفند"];
function pmOf(d){var p=pparts(d);return p.year+"-"+pad(p.month)}
function shiftPM(k,n){var p=k.split("-").map(Number),m=p[1]-1+n,y=p[0]+Math.floor(m/12);m=((m%12)+12)%12;return y+"-"+pad(m+1)}
function pmLabel(k){var p=k.split("-").map(Number);return PM[p[1]-1]+" "+fa(p[0])}
var dur=function(m){var h=Math.floor(m/60),r=m%60;return (h?fa(h)+" ساعت":"")+(h&&r?" و ":"")+(r?fa(r)+" دقیقه":"")};
var money=function(n){return fa(String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g,","))+" تومان"};
var rid=function(){return Date.now().toString(36)+Math.random().toString(36).slice(2,6)};

/* ---------- base schedule ---------- */
var FOCUS={6:"درس آزمون مهاجرت",0:"تمرین زبان",1:"پروژهٔ دانشگاه",2:"ویدیوی آموزشی یا تولید محتوا",4:"مطالعهٔ کتاب"};
function kind(dow){return dow===3?"w":dow===4?"t":dow===5?"f":"n"}

function plan(dow){
  var k=kind(dow),L=[];
  var H=function(t){L.push({h:t})};
  var R=function(t,title,tag,fl,note){L.push({t:t,title:title,tag:tag||"",info:fl==="i",opt:fl==="o",note:note||""})};
  var SUN=function(t,n){R(t,"ضدآفتاب (نوبت "+fa(n)+" از "+fa(3)+")","sun")};

  if(k==="f"){
    H("صبح");
    R("07:00","بیدار شدن؛ شستن صورت و دهان؛ مراقبت پوست","care","","ساعت بیداری جمعه نزدیک روزهای دیگر بماند");
    R("08:00","صبحانه","meal");
    R("08:10","مکمل‌ها بعد از صبحانه: امگا۳، مولتی‌ویتامین، زینک، ویتامین D","supp");
    R("09:00","جمع کردن اتاق و شستن لباس‌ها","tidy","o");
    R("10:30","دوش، ماسک مو، مراقبت از بدن","care");
    R("11:15","رقص و کشش ۱۵ دقیقه","move","o");
    H("میان‌روز");
    R("12:00","یک بلوک برای کار عقب‌افتاده (فقط ۱ تا ۲ مورد مشخص)","work","o");
    R("13:30","ناهار","meal");
    R("14:15","چرت ۲۰ تا ۳۰ دقیقه","rest","o");
    R("15:30","درس آزمون مهاجرت یا پروژهٔ دانشگاه (۹۰ دقیقه)","study","o");
    H("عصر و شب");
    R("17:30","عصرانه","meal");
    R("18:00","فیلم و استراحت","","i");
    R("19:15","آماده کردن شنبه: لباس، صبحانه، ناهار، میان‌وعده، وسایل آرایش","prep");
    R("20:00","شام با خانواده","meal");
    R("21:00","روتین شب: شستن صورت، تونر، مرطوب‌کننده، کرم دور چشم، مسواک، نخ دندان","care");
    R("21:15","قالب دندان را بگذار","ret");
    R("21:30","خواب","sleep");
    return fin(L);
  }

  H("صبح");
  var T=k==="t"?["06:05","06:09","06:12","06:18","06:21","06:24","06:30"]:["05:40","05:44","05:47","05:57","06:00","06:02","06:04"];
  R(T[0],"بیدار شدن؛ شستن دست، صورت و دهان؛ شستن قالب ارتودنسی","care");
  R(T[1],"سرم پوست، بعد ضدآفتاب (نوبت "+fa(1)+" از "+fa(3)+")","sun");
  R(T[2],"آرایش سبک","care","o");
  R(T[3],"مرتب کردن موهای بلند","care");
  R(T[4],"پوشیدن لباسِ آماده‌شده از شب قبل","care");
  R(T[5],"برداشتن وسایل: ایرپاد، کارت، صبحانه و ناهار","prep");
  if(k==="t"){R(T[6],"اسنپ تا شرکت (حدود ۲۵ دقیقه)","","i")}
  else{R(T[6],"حرکت؛ ۸ دقیقه پیاده‌روی تا ایستگاه","","i");R("06:15","سوار سرویس: موزیک یا پادکست","","i")}

  H(k==="w"?"شرکت تا ساعت ۱۰":"شرکت");
  var A=k==="t"?["06:55","07:00","07:05"]:["06:50","06:55","07:00"];
  R(A[0],"رسیدن به شرکت؛ روشن کردن سیستم","work");
  R(A[1],"تحویل صبحانه، ناهار و میان‌وعده به آشپزخانه","prep");
  R(A[2],"چک کردن کارهای روز؛ انتخاب ۳ اولویت","work");
  R("07:30","صبحانه (قبل از ساعت ۸)","meal");
  R("07:40","مکمل‌ها بعد از صبحانه: امگا۳، مولتی‌ویتامین، زینک، ویتامین D","supp","","روی معدهٔ خالی نخور");

  if(k==="w"){
    R("08:00","کارهای ضروری و هماهنگی مرخصی","work");
    R("08:30","آیس‌کافی (تا ۹:۰۰)","meal");
    R("09:45","میان‌وعدهٔ ۱۰:۳۰ را قبل از رانندگی بخور؛ آب و کیسهٔ غذا را بردار","meal");
    SUN("09:50",2);
    R("10:00","مرخصی و رانندگی به تهران (حدود ۲٫۵ ساعت)","","i");
    H("دانشگاه");
    R("12:30","رسیدن به دانشگاه؛ کلاس","","i");
    R("14:30","آنتراک: ناهارِ آماده‌شده از خانه و آب","meal");
    SUN("14:40",3);
    R("14:50","۵ دقیقه پیاده‌روی بیرون از ساختمان","move","o");
    R("15:00","کلاس","","i");
    R("16:30","آنتراک: قهوهٔ آخر روز و میان‌وعدهٔ آماده","meal");
    R("16:40","۵ دقیقه پیاده‌روی و آب","move","o");
    R("17:00","کلاس","","i");
    R("19:00","آنتراک: شام سبک آماده‌شده","meal");
    R("19:10","آب، کشش کوتاه یا ۱۵ دقیقه استراحت بدون خواب سنگین","rest","o");
    R("19:30","کلاس","","i");
    H("برگشت");
    R("21:00","پایان کلاس؛ حرکت به خانه","","i");
    R("22:10","توقف ۱۰ دقیقه‌ای در راه؛ آب و کشش","rest");
    R("23:30","رسیدن به خانه؛ روتین حداقلی: شستن صورت، مرطوب‌کننده، مسواک، نخ دندان","care");
    R("23:40","قالب دندان را بگذار","ret");
    R("23:50","خواب","sleep");
    return fin(L);
  }

  R("08:00","بلوک کار اول: مهم‌ترین کار روز","work");
  R("08:30","آیس‌کافی (تا ۹:۰۰)","meal");
  R("09:15","اگر کاری نبود: "+FOCUS[dow],"study","o");
  R("10:30","میان‌وعده","meal");
  SUN("10:35",2);
  R("11:00","یادگیری ۲۰ دقیقه: ویدیوی مفید یا کتاب","learn","o");
  R("13:30","ناهار","meal");
  SUN("13:40",3);
  R("14:15","جمع‌بندی کارها؛ نوشتن ۳ اولویت فردا","work");
  R("15:00","خروج از شرکت؛ سرویس با موزیک یا پادکست","","i");

  H("عصر");
  R("15:45","رسیدن به خانه؛ لباس راحت؛ قالب دندان را بگذار","ret");
  R("16:15","دوش و مراقبت از پوست بدن","care");
  if(dow===6||dow===1||dow===4)R("16:30","ماسک یا مراقبت مو","care","o");
  R("16:50","رقص ۱۰ تا ۱۵ دقیقه","move","o");
  R("17:10","استراحت: موزیک، چرت کوتاه یا کار آرام","","i");
  R("17:30","عصرانه (قالب را دربیاور)","meal");
  R("18:00","قالب دندان را دوباره بگذار","ret");
  if(dow===0||dow===4)R("18:05","جمع کردن اتاق یا شستن لباس‌ها","tidy","o");
  else R("18:05","لینکدین: ۲۰ دقیقه (یک پست، یک کامنت یا یک پیام)","linkedin","o");
  if(dow===6)R("18:35","۳۰ دقیقه تمرین زبان","study","o");
  if(dow===1)R("18:35","۳۰ دقیقه پروژهٔ دانشگاه","study","o");
  if(dow===2){R("18:35","۳۰ دقیقه ویدیوی آموزشی","study","o");R("19:25","آماده کردن بستهٔ غذایی چهارشنبه: ناهار، میان‌وعده، شام، آب، کیسهٔ خنک","prep")}
  R("19:15","آماده کردن فردا: لباس، صبحانه، ناهار، میان‌وعده، وسایل آرایش","prep");
  R("19:45","وقت آزاد با خانواده یا فیلم","","i");

  H("شب");
  R("20:00","شام با خانواده (قالب را دربیاور)","meal");
  R("20:40","آرام: بدون کار و بدون صفحه‌نمایش روشن","","i");
  R("21:00","روتین شب: شستن صورت، تونر، مرطوب‌کننده، کرم دور چشم، مسواک، نخ دندان","care");
  R("21:15","قالب دندان را بگذار","ret");
  R("21:30","خواب","sleep");
  return fin(L);
}
/* sort items by time inside each phase, then give each a stable id */
function fin(L){
  var out=[],grp=[];
  var flush=function(){grp.map(function(x,i){return [x,i]}).sort(function(a,b){return mins(a[0].t)-mins(b[0].t)||a[1]-b[1]}).forEach(function(p){out.push(p[0])});grp=[]};
  L.forEach(function(x){if(x.h){flush();out.push(x)}else grp.push(x)});
  flush();
  var seen={};
  out.forEach(function(x){if(x.h)return;var id=x.t.replace(":","");while(seen[id])id+="b";seen[id]=1;x.id=id});
  return out;
}
function wakeOf(dow){return plan(dow).find(function(x){return !x.h}).t}
function bedOf(dow){return plan(dow).filter(function(x){return x.tag==="sleep"})[0].t}
function sleepMins(dow){var nd=(dow+1)%7;return (mins(wakeOf(nd))+1440-mins(bedOf(dow)))%1440}

/* ---------- state ---------- */
var today=keyOf(new Date());
var sel=today;
var days={},events={},txs={};
var uid=null,col=null,dbOK=false;
var inflight={},dirty={},debTimers={},deleted={};
var tab="today";
var confirmDel=null;
var evDefaultDate=null;

function ensure(k){
  var d=days[k]||(days[k]={});
  d.done=d.done||{};d.skip=d.skip||{};d.sym=d.sym||{};d.food=d.food||[];
  if(d.light===undefined)d.light=false;
  ["energy","flow","pain","mood"].forEach(function(f){if(typeof d[f]!=="number")d[f]=0});
  if(typeof d.sleep!=="string")d.sleep="";
  if(typeof d.note!=="string")d.note="";
  return d;
}
function clone(o){return JSON.parse(JSON.stringify(o))}
function setSync(ok,msg){var e=$("#sync");e.className="sync"+(ok?" ok":"");$("span",e).textContent=msg}
function getObj(id){return id.indexOf("ev_")===0?events[id]:id.indexOf("tx_")===0?txs[id]:days[id]}
function saveLocal(){try{localStorage.setItem("mentor.v2",JSON.stringify({days:days,events:events,txs:txs}))}catch(e){}}
function loadLocal(){try{var s=JSON.parse(localStorage.getItem("mentor.v2")||"null");if(s){days=s.days||{};events=s.events||{};txs=s.txs||{}}}catch(e){}}

function persist(id){
  saveLocal();
  if(!dbOK){return}
  if(inflight[id]){dirty[id]=true;return}
  var o=getObj(id);if(!o)return;
  inflight[id]=true;
  col.doc(id).set(clone(o)).then(function(){setSync(true,"ذخیره شد")}).catch(function(){setSync(false,"ذخیره نشد؛ دوباره تلاش کن")}).then(function(){
    inflight[id]=false;if(dirty[id]){dirty[id]=false;persist(id)}
  });
}
function persistSoon(id){clearTimeout(debTimers[id]);debTimers[id]=setTimeout(function(){persist(id)},700)}
function removeDoc(id){
  if(id.indexOf("ev_")===0)delete events[id];else if(id.indexOf("tx_")===0)delete txs[id];else delete days[id];
  saveLocal();
  if(!dbOK){return}
  deleted[id]=1;
  col.doc(id).delete().catch(function(){setSync(false,"حذف نشد؛ دوباره تلاش کن")}).then(function(){delete deleted[id]});
}

/* ---------- events and the plan that adapts to them ---------- */
var EVT=[["nail","ناخن",90],["facial","فیشیال",60],["hair","آرایشگاه",120],["doctor","دکتر",90],["date","دیت",180],["friends","دیدن دوستان",180],["shop","خرید",90],["other","سایر",60]];
function evType(c){return EVT.filter(function(x){return x[0]===c})[0]||EVT[EVT.length-1]}
function eventsOn(k){
  return Object.keys(events).map(function(i){var e=events[i];e.id=i;return e}).filter(function(e){return e.d===k}).sort(function(a,b){return mins(a.t)-mins(b.t)});
}
/* the day's plan with events laid on top: optional items under an event step aside, core items get a conflict badge */
function planFor(k){
  var d=parseKey(k),dow=d.getDay(),L=plan(dow).map(function(x){return Object.assign({},x)});
  var moved=[],warns=[],conf=0,evs=eventsOn(k);
  var kd=kind(dow),bed=mins(bedOf(dow));
  evs.forEach(function(ev){
    var s=mins(ev.t),e=s+(ev.dur||60);
    L=L.filter(function(x){
      if(x.h||x.info||x.ev)return true;
      var m=mins(x.t);
      if(m>=s&&m<e){if(x.opt){moved.push(x.title);return false}x.conflict=true;conf++}
      return true;
    });
    var note=dur(ev.dur||60)+(ev.note?" · "+ev.note:"");
    if((kd==="n"||kd==="t")&&s<mins("15:00")&&e>mins("06:50"))note+=" · ساعت کاری است؛ مرخصی هماهنگ کن";
    if(kd==="w"&&s<mins("23:00")&&e>mins("06:50"))note+=" · چهارشنبه برنامهٔ دانشگاه دارد؛ تداخل را بررسی کن";
    var item={t:ev.t,title:ev.title,tag:"event",ev:true,id:"e_"+ev.id.slice(3),info:false,opt:false,note:note};
    var i=L.findIndex(function(x){return !x.h&&mins(x.t)>s});
    if(i<0)L.push(item);else L.splice(i,0,item);
    if(e>bed-90){
      var msg=e>bed?"رویداد بعد از ساعت خواب تمام می‌شود؛ بعدش فقط روتین حداقلی و خواب":"رویداد نزدیک ساعت خواب تمام می‌شود؛ روتین شب را کوتاه کن و خواب را عقب نینداز";
      warns.push(msg);
      var w={t:hm(e),title:msg,tag:"",info:true,opt:false,note:"",id:"w_"+ev.id.slice(3)};
      var j=L.findIndex(function(x){return !x.h&&mins(x.t)>e});
      if(j<0)L.push(w);else L.splice(j,0,w);
    }
  });
  L.moved=moved;L.warns=warns;L.conf=conf;
  return L;
}
function visible(k,light){return planFor(k).filter(function(x){return !x.h&&!x.info&&!(light&&x.opt)})}

/* ---------- stats ---------- */
function dayStat(k){
  var doc=days[k];if(!doc)return null;
  var ts=visible(k,doc.light),n=0,s=0;
  ts.forEach(function(x){if(doc.done&&doc.done[x.id])n++;if(doc.skip&&doc.skip[x.id])s++});
  return {done:n,skip:s,total:ts.length,pct:ts.length?n/ts.length:0};
}
function weekStart(k){var d=parseKey(k);var back=(d.getDay()+1)%7;return addDays(d,-back)}
var GOALS=[["sleep","خواب سر وقت",6],["move","رقص و حرکت",5],["study","درس و آزمون",4],["linkedin","لینکدین",3],["tidy","اتاق و لباس",2]];
function weekCounts(startDate){
  var c={};
  for(var i=0;i<7;i++){
    var k=keyOf(addDays(startDate,i)),doc=days[k];if(!doc)continue;
    planFor(k).forEach(function(x){if(x.h||!x.tag)return;if(doc.done&&doc.done[x.id])c[x.tag]=(c[x.tag]||0)+1});
  }
  return c;
}
function streak(){
  var n=0,d=parseKey(today);
  var st=dayStat(today);
  if(!st||st.pct<0.7){d=addDays(d,-1)}
  for(var i=0;i<400;i++){var s=dayStat(keyOf(d));if(s&&s.pct>=0.7){n++;d=addDays(d,-1)}else break}
  return n;
}

/* ---------- body log: cycle and symptoms ---------- */
var SYM=[["cramp","گرفتگی و دل‌درد"],["migraine","میگرن یا سردرد شدید"],["gut","درد یا نفخ معده و روده"],["loose","اسهال"],["constip","یبوست"],["nausea","تهوع"],["fatigue","خستگی شدید"],["lowmood","حال بد یا بی‌انگیزگی"],["insomnia","بی‌خوابی"],["back","کمردرد"]];
var FLOW=["نیست","لکه‌بینی","کم","متوسط","زیاد"];
function cycleInfo(){
  var ks=Object.keys(days).filter(function(k){return /^\d{4}-/.test(k)&&days[k].flow>0}).sort();
  var starts=[];
  ks.forEach(function(k){var prev=keyOf(addDays(parseKey(k),-1));if(!(days[prev]&&days[prev].flow>0))starts.push(k)});
  if(!starts.length)return null;
  var lens=[];
  for(var i=1;i<starts.length;i++){var l=Math.round((parseKey(starts[i])-parseKey(starts[i-1]))/864e5);if(l>=18&&l<=60)lens.push(l)}
  lens=lens.slice(-4);
  var avg=lens.length?Math.round(lens.reduce(function(a,b){return a+b},0)/lens.length):null;
  var last=starts[starts.length-1];
  var dayN=Math.round((parseKey(today)-parseKey(last))/864e5)+1;
  var next=avg?keyOf(addDays(parseKey(last),avg)):null;
  var daysTo=next?Math.round((parseKey(next)-parseKey(today))/864e5):null;
  return {starts:starts,avg:avg,n:lens.length,last:last,dayN:dayN,next:next,daysTo:daysTo};
}
function isHard(doc){
  if(!doc)return false;
  return doc.pain>=4||doc.flow>=4||(doc.sym&&(doc.sym.migraine||doc.sym.fatigue))||(doc.energy&&doc.energy<=1);
}
function foodAdvice(doc,cyc){
  var out=[],add=function(t,x){out.push({t:t,x:x})};
  doc=doc||{};var sym=doc.sym||{};
  var any=doc.flow>0||doc.pain>0||doc.mood>0||Object.keys(sym).length>0;
  if(doc.flow>0||(cyc&&cyc.daysTo!==null&&cyc.daysTo>=0&&cyc.daysTo<=2)){
    add("محتمل","آهن را بالا ببر: عدس، لوبیا، گوشت قرمز کم‌چرب، سبزی‌های تیره. کنارش چیزی با ویتامین C بخور (پرتقال، گوجه، فلفل دلمه‌ای) تا جذب بهتر شود.");
    add("حدسی","منیزیم‌دارها (موز، بادام، نان کامل، سبزی برگ‌دار) ممکن است گرفتگی و میگرن مرتبط با چرخه را کمی سبک کنند. اثرشان متوسط و در افراد مختلف فرق می‌کند.");
    add("محتمل","نمک و کافئین اضافه را کم کن. دمنوش گرم (زنجبیل، بابونه) و آب کافی بخور.");
  }
  if(doc.pain>=3||sym.cramp||sym.back){
    add("محتمل","کیسهٔ آب گرم روی شکم یا کمر و وعده‌های کوچک‌تر ولی منظم. از فست‌فود و غذای خیلی شور دوری کن.");
  }
  if(doc.pain>=4){
    add("قطعی","اگر درد با روش‌های همیشگی‌ات کنترل نمی‌شود یا کار و خوابت را به هم می‌زند، با پزشک زنان در میان بگذار. نوع و دوز مسکن را از خودت حدس نزن.");
  }
  if(doc.flow>=4){
    add("قطعی","اگر چند ساعت پیاپی هر یک تا دو ساعت یک پد کامل پر می‌شود یا سرگیجه داری، همان روز پزشک را ببین.");
  }
  if(sym.migraine){
    add("محتمل","وعده را جا نینداز و فاصلهٔ غذا را بیشتر از ۴ ساعت نکن. آب کافی بخور و کافئین را ثابت نگه دار: همان آیس‌کافی صبح، نه بیشتر و نه قطع ناگهانی.");
    add("حدسی","در بعضی افراد غذای فرآوری‌شده، پنیر کهنه، غذای خیلی شور یا نیتریت‌دار محرک است. در یادداشت بنویس قبل از حمله چه خورده‌ای تا الگو پیدا شود.");
    add("قطعی","اگر سردرد ناگهانی و بسیار شدید است یا با ضعف یک طرف بدن، اختلال گفتار یا دید همراه است، فوراً اورژانس.");
  }
  if(sym.gut){
    add("محتمل","امروز غذای ساده، کم‌چرب و پخته: برنج، مرغ آب‌پز، سیب‌زمینی، هویج و کدوی پخته. فعلاً حبوبات، کلم، نوشابه و غذای تند را کنار بگذار.");
  }
  if(sym.loose){
    add("محتمل","مایعات کافی و غذای ملایم: سوپ ساده، موز، برنج، ماست کم‌چرب. قهوه و لبنیات پرچرب را کم کن.");
  }
  if(sym.constip){
    add("محتمل","آب بیشتر، میوهٔ کامل (کیوی، آلو)، جو دوسر و نیم ساعت حرکت.");
  }
  if(sym.nausea){
    add("محتمل","وعدهٔ کوچک و مکرر، دمنوش زنجبیل یا نعنا و غذای ولرم یا سرد.");
  }
  if(sym.gut||sym.loose||sym.constip){
    add("حدسی","ماست یا کفیر برای بعضی افراد معدهٔ حساس کمک می‌کند. اگر نفخ بدتر شد قطعش کن.");
  }
  if(sym.fatigue||sym.lowmood||(doc.mood&&doc.mood<=2)||(doc.energy&&doc.energy<=2)){
    add("محتمل","صبحانه را جا نینداز و پروتئین بگذار (تخم‌مرغ، پنیر، ماست). ۱۰ دقیقه نور روز و راه رفتن کوتاه معمولاً انرژی را بهتر می‌کند.");
    add("محتمل","ماهی یا گردو و کربوهیدرات کامل به‌جای قند سریع، نوسان انرژی را کمتر می‌کند.");
  }
  if(sym.lowmood){
    add("قطعی","اگر حال بد چند روز ادامه دارد یا سنگین‌تر شده، با درمانگر یا پزشک خودت در میان بگذار. این برنامه جای او را نمی‌گیرد.");
  }
  if(sym.insomnia){
    add("محتمل","کافئین بعد از ساعت ۱۴:۰۰ نه، شام سبک و حداقل دو ساعت قبل از خواب، و ساعت ثابت برای روتین شب.");
  }
  return {list:out,any:any};
}

/* ---------- render: shared ---------- */
var P={
  sun:"M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z",
  brief:"M3 8h18v11H3zM9 8V5h6v3M3 13h18",
  home:"M4 11l8-7 8 7v9H4zM10 20v-6h4v6",
  moon:"M20 14.5A8.5 8.5 0 1 1 9.5 4 6.5 6.5 0 0 0 20 14.5z",
  road:"M7 3l-3 18M17 3l3 18M12 4v3M12 11v3M12 18v3",
  campus:"M3 10l9-5 9 5-9 5zM7 12v5c0 1.5 3 3 5 3s5-1.5 5-3v-5",
  cal:"M4 6h16v14H4zM4 10h16M8 3v4M16 3v4",
  plus:"M12 5v14M5 12h14",
  flame:"M12 3c1 3 5 5 5 10a5 5 0 0 1-10 0c0-2 1-3 2-4 0 2 1 3 2 3 0-3-1-5 1-9z",
  bed:"M3 18V6M3 14h18v4M21 14v-2a3 3 0 0 0-3-3h-7v5",
  warn:"M12 4l9 16H3zM12 10v4M12 17h.01",
  spark:"M12 3l2 6 6 2-6 2-2 6-2-6-6-2 6-2z",
  inbox:"M4 13l2-8h12l2 8M4 13v6h16v-6M4 13h5l1 2h4l1-2h5",
  heart:"M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.5-7 10-7 10z",
  wallet:"M3 7h16a2 2 0 0 1 2 2v9H5a2 2 0 0 1-2-2zM3 7l2-3h12M16 13h3"
};
function ic(n){return '<svg class="i" viewBox="0 0 24 24"><path d="'+P[n]+'"/></svg>'}
var ICON={
  back:'<svg class="i" viewBox="0 0 24 24"><path d="M9 6l6 6-6 6"/></svg>',
  fwd:'<svg class="i" viewBox="0 0 24 24"><path d="M15 6l-6 6 6 6"/></svg>',
  check:'<svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
  x:'<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg>'
};
function phaseIcon(t){
  if(/صبح/.test(t))return "sun";if(/شرکت/.test(t))return "brief";if(/دانشگاه/.test(t))return "campus";
  if(/برگشت/.test(t))return "road";if(/روز/.test(t))return "sun";if(/شب/.test(t)&&!/عصر/.test(t))return "moon";return "home";
}
function greeting(){var h=new Date().getHours();return h<5?"شب بخیر":h<12?"صبح بخیر":h<17?"ظهر بخیر":h<20?"عصر بخیر":"شب بخیر"}
var toastT;
function toast(msg){var t=$("#toast");$("span",t).textContent=msg;t.classList.add("on");clearTimeout(toastT);toastT=setTimeout(function(){t.classList.remove("on")},2200)}
function segHTML(act,cur,labels,start){
  return '<div class="seg">'+labels.map(function(l,i){var v=i+(start||0);return '<button data-act="'+act+'" data-v="'+v+'" aria-pressed="'+(cur===v)+'">'+l+'</button>'}).join("")+'</div>';
}
function subnav(pane,items,cur){
  return '<div class="subnav" role="tablist">'+items.map(function(i){return '<button data-sub="'+pane+':'+i[0]+'" aria-selected="'+(cur===i[0])+'">'+i[1]+'</button>'}).join("")+'</div>';
}
function dateBar(label,sub,back,fwd,extra){
  return '<div class="datebar"><button class="iconbtn" data-act="'+back+'" aria-label="قبلی">'+ICON.back+'</button><div class="mid"><b>'+label+'</b><span class="muted" style="font-size:13px">'+sub+'</span>'+(extra||"")+'</div><button class="iconbtn" data-act="'+fwd+'" aria-label="بعدی">'+ICON.fwd+'</button></div>';
}
function callout(icon,html){return '<div class="callout">'+ic(icon)+'<div>'+html+'</div></div>'}
function empty(icon,title,text){return '<div class="empty">'+ic(icon)+'<b>'+title+'</b><span>'+text+'</span></div>'}
function shortDate(dt){return fmtDate.format(dt).split(" ").slice(0,2).join(" ")}
var subWeek="plan",subBody="log",lastToggled=null;
var SLOTS=[["b","صبحانه"],["s","میان‌وعده"],["l","ناهار"],["a","عصرانه"],["d","شام"],["o","سایر"]];
var REACT=["بدون مشکل","نفخ یا درد معده","سردرد یا میگرن","تهوع"];
var foodR=0,foodSlot="b";
function foodPatterns(){
  var map={},i;
  for(i=0;i<21;i++){
    var dd=days[keyOf(addDays(parseKey(today),-i))];if(!dd||!dd.food)continue;
    dd.food.forEach(function(f){
      var n=String(f.x||"").trim().replace(/\s+/g," ");if(!n)return;
      var o=map[n]||(map[n]={n:n,tot:0,bad:0});o.tot++;if(f.r>0)o.bad++;
    });
  }
  return Object.keys(map).map(function(k){return map[k]}).filter(function(o){return o.bad>=2}).sort(function(a,b){return b.bad-a.bad}).slice(0,5);
}
function ateHTML(){
  var d=parseKey(sel),dow=d.getDay(),doc=days[sel]||{},fl=doc.food||[];
  var h=dateBar(DAY[dow]+(sel===today?" · امروز":""),shortDate(d),"dayback","dayfwd");
  var entry=function(f){return '<div class="foodrow"><span class="x">'+esc(f.x)+(f.r?' <span class="pill bad">'+REACT[f.r]+'</span>':'')+'</span><button class="skp" data-act="delfood" data-id="'+f.id+'" aria-label="حذف">'+ICON.x+'</button></div>'};
  h+='<div class="card"><h3>برنامه در برابر آنچه خوردم</h3><div style="margin-top:6px">';
  SLOTS.forEach(function(sl,i){
    var got=fl.filter(function(f){return f.m===sl[0]}),plan=i<4?MEALS[dow][i]:null;
    h+='<div class="cmp"><div class="cmp-h"><b>'+sl[1]+'</b>'+(plan&&plan!=="—"&&!got.length?'<button class="btn small ghost" data-act="foodplan" data-v="'+i+'">طبق برنامه خوردم</button>':'')+'</div>'+
       (plan?'<div class="note">برنامه: '+esc(plan)+'</div>':'')+got.map(entry).join("")+'</div>';
  });
  h+='</div></div>';
  h+='<div class="card stack tight"><h3>چیزی دیگر خوردم</h3>'+
    '<div class="grid2"><div><label for="foodSlot">وعده</label><select id="foodSlot">'+SLOTS.map(function(s2){return '<option value="'+s2[0]+'"'+(s2[0]===foodSlot?' selected':'')+'>'+s2[1]+'</option>'}).join("")+'</select></div>'+
    '<div><label for="foodText">چی خوردی؟</label><input type="text" id="foodText" placeholder="مثلا نان و پنیر و چای"></div></div>'+
    '<div><span class="lb">حالم بعدش</span>'+segHTML("foodr",foodR,REACT,0)+'</div>'+
    '<button class="btn block" data-act="addfood">'+ic("plus")+'ثبت</button></div>';
  var pat=foodPatterns();
  h+='<div class="card"><h3>الگوهای احتمالی</h3><div style="margin-top:8px">';
  if(!pat.length)h+='<p class="muted">با ثبت غذا و حالت بعدش، اگر غذایی چند بار با ناراحتی همراه شد اینجا نشان داده می‌شود.</p>';
  else h+='<ul class="rules">'+pat.map(function(o){return '<li><span class="tag h">حدسی</span><span>«'+esc(o.n)+'»: '+fa(o.bad)+' بار از '+fa(o.tot)+' بار، بعدش ناراحتی ثبت کرده‌ای. این فقط همبستگی است، نه اثبات. می‌توانی یک هفته آن را کنار بگذاری و مقایسه کنی.</span></li>'}).join("")+'</ul>';
  h+='</div></div>';
  return h;
}
var welcomeDismissed=false;
try{welcomeDismissed=localStorage.getItem("mentor.welcome")==="1"}catch(e){}

/* ---------- render: today ---------- */
function renderToday(){
  var d=parseKey(sel),dow=d.getDay(),doc=days[sel]||{done:{},skip:{},light:false,energy:0,sleep:"",note:"",flow:0,sym:{}};
  var isToday=sel===today;
  var all=planFor(sel),light=!!doc.light;
  var vis=visible(sel,light),done=0;
  vis.forEach(function(x){if(doc.done&&doc.done[x.id])done++});
  var pct=vis.length?Math.round(done/vis.length*100):0;
  var C=2*Math.PI*36,off=C*(1-pct/100);
  var now=new Date(),nowM=now.getHours()*60+now.getMinutes();
  var curId=null;
  if(isToday){all.forEach(function(x){if(!x.h&&mins(x.t)<=nowM)curId=x.id})}
  var nextT=null;
  if(isToday){nextT=all.filter(function(x){return !x.h&&!x.info&&!(light&&x.opt)&&!(doc.done&&doc.done[x.id])&&!(doc.skip&&doc.skip[x.id])&&mins(x.t)>=nowM-10})[0]}
  var bed=bedOf(dow),nw=wakeOf((dow+1)%7),st=streak(),nev=eventsOn(sel).length;

  var h='<div class="stack">';
  if(!welcomeDismissed&&!Object.keys(days).length){
    h+='<div class="welcome"><b style="font-family:var(--f-display);font-size:21px">از اینجا شروع کن</b><ol><li>هر کاری انجام شد را تیک بزن و اگر نشد، ضربدر را بزن.</li><li>آخر روز انرژی و خواب را در همین صفحه ثبت کن.</li><li>از بخش «مربی» بخواه روزت را ارزیابی کند.</li></ol><div><button class="btn small" data-act="dismisswelcome">متوجه شدم</button></div></div>';
  }
  h+='<section class="hero"><div class="hero-top"><button class="hbtn" data-act="dayback" aria-label="روز قبل">'+ICON.back+'</button>'+
     '<div class="hero-date"><span class="greet">'+(isToday?greeting():"روز انتخاب‌شده")+'</span><b>'+DAY[dow]+' '+shortDate(d)+'</b>'+(isToday?'':'<button class="hlink" data-act="gotoday">برگرد به امروز</button>')+'</div>'+
     '<button class="hbtn" data-act="dayfwd" aria-label="روز بعد">'+ICON.fwd+'</button></div>';
  h+='<div class="hero-main"><div class="ring"><svg viewBox="0 0 84 84"><circle class="bg" cx="42" cy="42" r="36"/><circle class="fg" cx="42" cy="42" r="36" stroke-dasharray="'+C.toFixed(1)+'" stroke-dashoffset="'+off.toFixed(1)+'"/></svg><b class="num">'+fa(pct)+'٪</b></div>'+
     '<div class="hero-text"><span class="big">'+fa(done)+' از '+fa(vis.length)+' کار انجام شد</span>'+
     (isToday&&nextT?'<div class="nextpill"><small>کار بعدی · <bdi>'+fa(nextT.t)+'</bdi></small><b>'+esc(nextT.title)+'</b></div>':(pct===100?'<div class="nextpill"><b>همهٔ کارهای این روز تمام شد</b></div>':'<div class="nextpill"><small>برای ثبت، کارها را پایین‌تر تیک بزن</small></div>'))+
     '</div></div>';
  h+='<div class="chiprow"><span class="hchip">'+ic("bed")+'خواب <bdi>'+fa(bed)+'</bdi> تا <bdi>'+fa(nw)+'</bdi></span><span class="hchip">'+dur(sleepMins(dow))+' خواب</span>'+(st>0?'<span class="hchip">'+ic("flame")+fa(st)+' روز پیاپی</span>':'')+(nev?'<span class="hchip">'+ic("cal")+fa(nev)+' رویداد</span>':'')+'</div>';
  h+='<button class="toggle" data-act="light" aria-pressed="'+(light?"true":"false")+'"><span class="sw"></span><span><b>روز سخت</b><small>فقط خواب، غذا، مکمل و مراقبت پایه</small></span></button></section>';

  var cyc=cycleInfo();
  if(doc.flow>0)h+=callout("heart",'پریود ثبت شده است. اگر امروز سخت است «روز سخت» را روشن کن. <button data-act="gobody">پیشنهاد غذا</button>');
  else if(cyc&&cyc.daysTo!==null&&cyc.daysTo>=0&&cyc.daysTo<=2&&isToday)h+=callout("heart",'[محتمل] پریود '+(cyc.daysTo?'حدود '+fa(cyc.daysTo)+' روز دیگر':'امروز')+' شروع می‌شود. غذاهای آهن‌دار را از الان بگذار. <button data-act="gobody">جزئیات</button>');
  else if(isHard(doc)&&!light)h+=callout("warn",'این روز را سخت ثبت کرده‌ای. <button data-act="light">روز سخت را روشن کن</button>');
  if(all.moved&&all.moved.length)h+=callout("cal",'برای رویداد کنار گذاشته شد: '+all.moved.map(esc).join("، "));

  h+='<div class="card flush">';
  all.forEach(function(x){
    if(x.h){h+='<div class="phase"><span class="pi">'+ic(phaseIcon(x.h))+'</span><b>'+x.h+'</b></div>';return}
    if(light&&x.opt)return;
    var isD=!!(doc.done&&doc.done[x.id]),isS=!!(doc.skip&&doc.skip[x.id]);
    var cls="row"+(x.info?" info":"")+(x.ev?" ev":"")+(isD?" done":"")+(isS?" skip":"")+(x.id===curId?" cur":"")+(x.id===lastToggled&&isD?" pop":"");
    var past=isToday&&!x.info&&!isD&&!isS&&mins(x.t)<nowM-30;
    h+='<div class="'+cls+'" data-tag="'+(x.tag||"")+'"><span class="nd"><i></i></span><div class="tt"><span class="tm"><bdi>'+fa(x.t)+'</bdi></span><span class="ti">'+(past?'<i class="dot" title="هنوز گزارش نشده"></i>':'')+esc(x.title)+(x.conflict?'<span class="badge">هم‌زمان با رویداد</span>':'')+'</span>'+(x.note?'<span class="n">'+esc(x.note)+'</span>':'')+'</div>';
    if(x.info)h+='<span></span>';
    else h+='<div class="acts"><button class="skp" data-act="skip" data-id="'+x.id+'" aria-label="انجام نشد" aria-pressed="'+isS+'">'+ICON.x+'</button><button class="chk" data-act="done" data-id="'+x.id+'" aria-label="انجام شد" aria-pressed="'+isD+'">'+ICON.check+'</button></div>';
    h+='</div>';
  });
  h+='</div>';
  h+='<button class="btn ghost block" data-act="addev">'+ic("plus")+'رویداد خارج از روتین برای این روز</button>';

  h+='<div class="card report"><h3>گزارش پایان روز</h3>'+
     '<div><span class="lb">انرژی امروز</span><div class="seg">'+[1,2,3,4,5].map(function(n){return '<button data-act="energy" data-v="'+n+'" aria-pressed="'+(doc.energy===n)+'">'+fa(n)+'</button>'}).join("")+'</div></div>'+
     '<div><label for="sleepInput">چند ساعت دیشب خوابیدی؟</label><input type="text" id="sleepInput" inputmode="decimal" placeholder="مثلا ۷٫۵" value="'+esc(doc.sleep||"")+'"></div>'+
     '<div><label for="noteInput">یادداشت برای مربی</label><textarea id="noteInput" placeholder="چه چیزی کار کرد؟ چه چیزی نشد؟ چرا؟"></textarea></div></div>';
  h+='</div>';
  $("#pane-today").innerHTML=h;
  var nb=$("#noteInput");if(nb)nb.value=doc.note||"";
  lastToggled=null;
}

/* ---------- render: week ---------- */
function weekPlanHTML(){
  var ws=weekStart(sel),h='<div class="card flush">';
  ORDER.forEach(function(dow,i){
    var dt=addDays(ws,i),k=keyOf(dt),st=dayStat(k),nev=eventsOn(k).length,m=sleepMins(dow),pc=m<420?"bad":m<450?"warn":"";
    var p=st?Math.round(st.pct*100):0;
    h+='<div class="dayrow'+(k===today?" today":"")+'" data-act="openday" data-k="'+k+'" role="button" tabindex="0">'+
      '<div><b>'+DAY[dow]+'</b> <span class="muted" style="font-size:12.5px">'+shortDate(dt)+'</span>'+(nev?'<span class="badge">'+fa(nev)+' رویداد</span>':'')+'</div>'+
      '<div class="times muted" style="font-size:13px;text-align:end">بیداری <bdi>'+fa(wakeOf(dow))+'</bdi> · خواب <bdi>'+fa(bedOf(dow))+'</bdi></div>'+
      '<div><span class="pill '+pc+'">خواب '+dur(m)+'</span></div><div class="num muted" style="font-size:13px;text-align:end">'+(st?fa(p)+'٪':'بدون گزارش')+'</div>'+
      '<div class="prog"><i style="width:'+p+'%"></i></div></div>';
  });
  h+='</div>';
  h+='<div class="card"><h3>خواب چهارشنبه‌شب</h3><p style="margin-top:6px">چهارشنبه ساعت ۲۳:۳۰ به خانه می‌رسی و پنجشنبه ۶:۰۵ بیدار می‌شوی. این تنها شب کوتاه هفته است. <span class="tag m">محتمل</span> برای جبران، پنجشنبه‌شب و جمعه‌شب را سر ساعت بخواب و جمعه صبح بعد از ۷:۰۰ بیدار نشو.</p></div>';
  return h;
}
function eventsHTML(){
  var dflt=evDefaultDate||sel,h='';
  h+='<div class="card stack tight" id="evForm" style="padding-top:16px"><h3>رویداد خارج از روتین</h3><p class="muted" style="font-size:14px">ناخن، فیشیال، دکتر، دیت یا هر قرار دیگر را اضافه کن. برنامهٔ همان روز خودش تغییر می‌کند: کارهای اختیاری کنار می‌روند و اگر رویداد دیر تمام شود برای خواب هشدار می‌گیری.</p>'+
   '<div class="grid2"><div><label for="evType">نوع</label><select id="evType">'+EVT.map(function(t){return '<option value="'+t[0]+'">'+t[1]+'</option>'}).join("")+'</select></div>'+
   '<div><label for="evTitle">عنوان (اختیاری)</label><input type="text" id="evTitle" placeholder="مثلا ناخن ژل"></div></div>'+
   '<div class="grid2"><div><label for="evDate">تاریخ</label><input type="date" id="evDate" value="'+dflt+'"></div>'+
   '<div><label for="evTime">ساعت شروع</label><input type="time" id="evTime" value="17:00"></div></div>'+
   '<div class="grid2"><div><label for="evDur">مدت</label><select id="evDur">'+[30,45,60,90,120,150,180,240].map(function(m){return '<option value="'+m+'"'+(m===90?' selected':'')+'>'+dur(m)+'</option>'}).join("")+'</select></div>'+
   '<div><label for="evNote">یادداشت</label><input type="text" id="evNote"></div></div>'+
   '<button class="btn block" data-act="saveev">'+ic("plus")+'افزودن به برنامه</button><span class="note" id="evMsg"></span></div>';
  var from=keyOf(addDays(parseKey(today),-7));
  var list=Object.keys(events).map(function(i){var e=events[i];e.id=i;return e}).filter(function(e){return e.d>=from}).sort(function(a,b){return a.d<b.d?-1:a.d>b.d?1:mins(a.t)-mins(b.t)});
  h+='<div class="card flush"><h3 style="padding-top:10px">رویدادها</h3>';
  if(!list.length)h+=empty("cal","هنوز رویدادی ثبت نشده","اولین قرارت را از فرم بالا اضافه کن.");
  list.forEach(function(e){
    var pl=planFor(e.d),dt=parseKey(e.d),imp=[];
    if(pl.moved.length)imp.push("کنار می‌رود: "+pl.moved.join("، "));
    if(pl.conf)imp.push(fa(pl.conf)+" کار ضروری هم‌زمان است");
    pl.warns.forEach(function(w){imp.push(w)});
    h+='<div class="evrow"><div><b>'+esc(e.title)+'</b><br><span class="muted" style="font-size:13px">'+DAY[dt.getDay()]+" "+shortDate(dt)+' · '+fa(e.t)+' · '+dur(e.dur||60)+'</span></div>'+
      '<div><button class="btn small'+(confirmDel===e.id?' danger':' ghost')+'" data-act="delev" data-id="'+e.id+'">'+(confirmDel===e.id?'تأیید حذف':'حذف')+'</button></div>'+
      '<div class="sub">'+(imp.length?esc(imp.join(" · ")):"با کارهای ضروری تداخلی ندارد")+'</div></div>';
  });
  h+='</div>';
  return h;
}
function growthHTML(){
  var ws=weekStart(today),c=weekCounts(ws),pcts=[],i;
  for(i=13;i>=0;i--){var k=keyOf(addDays(parseKey(today),-i));pcts.push({k:k,s:dayStat(k),d:parseKey(k)})}
  var have=pcts.filter(function(p){return p.s});
  var avg=have.length?Math.round(have.reduce(function(a,p){return a+p.s.pct},0)/have.length*100):0;
  var h='<div class="stats"><div class="stat"><b class="num">'+fa(avg)+'٪</b><span>میانگین ۱۴ روز</span></div><div class="stat"><b class="num">'+fa(streak())+'</b><span>روز پیاپی بالای ۷۰٪</span></div><div class="stat"><b class="num">'+fa(have.length)+'</b><span>روز گزارش‌شده</span></div></div>';
  if(!have.length)h+='<div class="card">'+empty("spark","هنوز گزارشی نیست","با تیک زدن کارهای امروز، نمودار رشد اینجا ساخته می‌شود.")+'</div>';
  h+='<div class="card"><h3>درصد انجام، ۱۴ روز اخیر</h3><div class="chart"><div class="tgt" style="bottom:70%"><span>هدف '+fa(70)+'٪</span></div>';
  pcts.forEach(function(p){
    var v=p.s?Math.round(p.s.pct*100):0;
    h+='<div class="b" title="'+shortDate(p.d)+'"><i class="'+(p.s?(v<70?"low":""):"none")+'" style="height:'+(p.s?Math.max(v,2):2)+'%"></i></div>';
  });
  h+='</div><div class="axis">'+pcts.map(function(p){return '<span>'+DAY[p.d.getDay()].slice(0,1)+'</span>'}).join("")+'</div>';
  h+='<div class="energy">'+pcts.map(function(p){var e=p.s&&days[p.k]&&days[p.k].energy;return '<span>'+(e?fa(e):'·')+'</span>'}).join("")+'</div><p class="note" style="margin-top:4px">ردیف پایین: انرژی هر روز از ۱ تا ۵</p></div>';

  var start=addDays(weekStart(today),-21);
  h+='<div class="card"><h3>تقویم چهار هفته</h3><div class="heat">'+ORDER.map(function(d){return '<div class="hh">'+DAY[d].slice(0,1)+'</div>'}).join("");
  for(i=0;i<28;i++){
    var dt=addDays(start,i),k2=keyOf(dt),s2=dayStat(k2),cls="";
    if(k2>today)cls="hf";else if(s2){var pp=s2.pct*100;cls=pp>=70?"h3":pp>=40?"h2":"h1"}
    h+='<div class="'+cls+'" title="'+shortDate(dt)+'"'+(k2===today?' style="outline:2px solid var(--gold);outline-offset:1px"':'')+'>'+fa(pparts(dt).day)+'</div>';
  }
  h+='</div><p class="note" style="margin-top:8px">هر خانه یک روز است. هرچه پررنگ‌تر، درصد انجام بیشتر.</p></div>';

  h+='<div class="card"><h3>هدف‌های این هفته</h3>';
  GOALS.forEach(function(g){
    var n=c[g[0]]||0,p=Math.min(100,Math.round(n/g[2]*100));
    h+='<div class="goal'+(n>=g[2]?" met":"")+'"><span>'+g[1]+'</span><span class="num muted">'+fa(n)+' از '+fa(g[2])+'</span><div class="bar"><i style="width:'+p+'%"></i></div></div>';
  });
  h+='</div>';
  var sl=pcts.filter(function(p){return days[p.k]&&days[p.k].sleep});
  if(sl.length)h+='<div class="card"><h3>خواب گزارش‌شده</h3><div class="scroll"><table><tbody>'+sl.map(function(p){return '<tr><td>'+DAY[p.d.getDay()]+'</td><td class="num">'+esc(days[p.k].sleep)+' ساعت</td></tr>'}).join("")+'</tbody></table></div></div>';
  return h;
}
function renderWeek(){
  var h='<div class="stack"><div class="ph"><h2>هفته</h2><p>برنامه، رویدادهای خارج از روتین و روند رشد.</p></div>'+subnav("week",[["plan","برنامه"],["events","رویدادها"],["growth","رشد"]],subWeek);
  h+=subWeek==="plan"?weekPlanHTML():subWeek==="events"?eventsHTML():growthHTML();
  h+='</div>';
  $("#pane-week").innerHTML=h;
  evDefaultDate=null;
}

/* ---------- render: body and food ---------- */
function adviceList(list){return '<ul class="rules">'+list.map(function(a){return '<li><span class="tag'+(a.t==="محتمل"?" m":a.t==="حدسی"?" h":"")+'">'+a.t+'</span><span>'+a.x+'</span></li>'}).join("")+'</ul>'}
function logHTML(){
  var d=parseKey(sel),doc=days[sel]||{flow:0,pain:0,mood:0,sym:{},energy:0},sym=doc.sym||{},cyc=cycleInfo();
  var h=dateBar(DAY[d.getDay()]+(sel===today?" · امروز":""),shortDate(d),"dayback","dayfwd");
  h+='<div class="card stack tight"><div><span class="lb">پریود</span>'+segHTML("flow",doc.flow||0,FLOW,0)+'</div>'+
     '<div><span class="lb">شدت درد (۰ تا ۵)</span>'+segHTML("pain",doc.pain||0,["۰","۱","۲","۳","۴","۵"],0)+'</div>'+
     '<div><span class="lb">حال و حوصله (۱ بد تا ۵ خوب)</span>'+segHTML("mood",doc.mood||0,["۱","۲","۳","۴","۵"],1)+'</div>'+
     '<div><span class="lb">علائم امروز</span><div class="chips">'+SYM.map(function(s){return '<button class="chip" data-act="sym" data-v="'+s[0]+'" aria-pressed="'+(!!sym[s[0]])+'">'+s[1]+'</button>'}).join("")+'</div></div></div>';
  if(isHard(doc)&&!doc.light)h+=callout("warn",'این روز سخت به نظر می‌رسد. <button data-act="light">روز سخت را روشن کن</button> تا فقط خواب، غذا، مکمل و مراقبت پایه بماند.');
  var adv=foodAdvice(doc,cyc);
  h+='<div class="card"><h3>چه بخورم</h3><div style="margin-top:10px">';
  if(!adv.list.length)h+='<p class="muted">برای این روز چیزی ثبت نشده. اگر علامتی داری، بالا انتخاب کن تا پیشنهاد دقیق‌تر بگیری.</p>';
  else h+=adviceList(adv.list);
  h+='</div></div>';
  h+='<div class="card"><h3>چرخه</h3>';
  if(!cyc)h+='<p class="muted" style="margin-top:6px">با ثبت روزهای پریود، میانگین طول چرخه و تاریخ احتمالی پریود بعدی اینجا نشان داده می‌شود.</p>';
  else{
    h+='<p style="margin-top:6px">آخرین شروع: '+fmtDate.format(parseKey(cyc.last))+' (روز '+fa(cyc.dayN)+' چرخه)</p>';
    if(cyc.avg)h+='<p>میانگین طول چرخه: '+fa(cyc.avg)+' روز، از '+fa(cyc.n)+' چرخه. پریود بعدی حدود '+fmtDate.format(parseKey(cyc.next))+' <span class="tag '+(cyc.n>=3?"m":"h")+'">'+(cyc.n>=3?"محتمل":"حدسی")+'</span></p>';
    else h+='<p class="muted">برای پیش‌بینی حداقل دو شروع پریود لازم است.</p>';
  }
  h+='</div>';
  return h;
}
var MEALS={
  6:["جو دوسر با موز و گردو + تخم‌مرغ آبپز","سیب یا پرتقال + چند بادام","برنج + مرغ آب‌پز یا گریل + کدو و هویج پخته","ماست + موز"],
  0:["نان سنگک + پنیر + خیار و گردو","موز + کمی بادام","خوراک عدس یا مرغ با سبزیجات پخته + برنج","کفیر یا ماست + چند خرما"],
  1:["نیمرو یا املت با سبزی + نان","خرما + گردو","کتلت مرغ یا ماهی + پوره سیب‌زمینی","میوه + ماست"],
  2:["ساندویچ نان کامل با تخم‌مرغ و پنیر","میوه + مغزها","ماهی یا مرغ + برنج + سبزی بخارپز","ماست و عسل"],
  3:["جو دوسر یا نان و پنیر و گردو","موز + ساندویچ کوچک (قبل از رانندگی)","غذای آماده از خانه در ظرف (برنج و مرغ یا عدس‌پلو)","ماست یا میوه یا آجیل (با قهوه)"],
  4:["نان + تخم‌مرغ آبپز + خیار و گردو","سیب + بادام","خوراک مرغ و سبزیجات + برنج","میوه + ماست"],
  5:["املت یا نیمرو + نان و سبزی","—","غذای خانگی","میوه + آجیل"]
};
var MEAL_COLS=["صبحانه (۷:۳۰)","میان‌وعده","ناهار","عصرانه"];
function foodHTML(){
  var d=parseKey(sel),dow=d.getDay(),doc=days[sel],cyc=cycleInfo(),adv=foodAdvice(doc,cyc),h='';
  h+=dateBar(DAY[dow]+(sel===today?" · امروز":""),shortDate(d),"dayback","dayfwd");
  h+='<div class="card"><h3>وعده‌های این روز</h3><div class="meal4" style="margin-top:10px">'+MEALS[dow].map(function(m,i){return '<div><small>'+MEAL_COLS[i]+'</small>'+m+'</div>'}).join("")+'</div><p class="note" style="margin-top:10px">شام با خانواده، از ساعت ۲۰:۰۰ به بعد. پیشنهادها ساده و کم‌ریسک برای معده‌اند و می‌توانی جایگزین کنی.</p></div>';
  if(adv.list.length){
    h+='<div class="card"><h3>بر اساس ثبت تن</h3><div style="margin-top:10px">'+adviceList(adv.list.slice(0,4))+'</div>'+(adv.list.length>4?'<p style="margin-top:8px"><button class="linkbtn" data-sub="body:log">همهٔ پیشنهادها</button></p>':'')+'</div>';
  }
  if(dow===2)h+=callout("inbox",'فردا چهارشنبه است. ساعت ۱۹:۲۵ بستهٔ ماشین را آماده کن: ناهار، میان‌وعدهٔ ۱۰:۳۰ و ۱۶:۳۰، شام سبک، آب و کیسهٔ خنک.');
  h+='<div class="card"><h3>زمان مکمل‌ها</h3><div style="margin-top:10px"><ul class="rules">'+
    '<li><span class="tag">برنامه</span><span>هر چهار مکمل بعد از صبحانه ساعت ۷:۴۰ (امگا۳، مولتی‌ویتامین، زینک، ویتامین D).</span></li>'+
    '<li><span class="tag m">محتمل</span><span>امگا۳ و ویتامین D با غذای دارای چربی بهتر جذب می‌شوند.</span></li>'+
    '<li><span class="tag m">محتمل</span><span>زینک روی معدهٔ خالی ممکن است حالت تهوع بدهد. اگر مولتی‌ویتامین هم زینک دارد، مجموع زینک را از برچسب‌ها جمع کن.</span></li>'+
    '<li><span class="tag h">حدسی</span><span>برای ژل گل مغربی شواهد درد پریود ضعیف و متناقض است. قبل از شروع با پزشک یا داروساز هماهنگ کن.</span></li></ul></div></div>';
  h+='<div class="card"><h3>قاعده‌های غذا و نوشیدنی</h3><div style="margin-top:10px"><ul class="rules">'+
    '<li><span class="tag m">محتمل</span><span>وعده‌های ثابت و آب کافی (حدود ۲ لیتر پخش‌شده در روز) احتمال محرک‌های میگرن را کم می‌کند.</span></li>'+
    '<li><span class="tag m">محتمل</span><span>آیس‌کافی ۸:۳۰ تا ۹:۰۰ مناسب است. بعد از ۱۴:۰۰ کافئین نخور، جز چهارشنبه برای قهوهٔ ۱۶:۳۰ که آخرین است.</span></li>'+
    '<li><span class="tag h">حدسی</span><span>در روزهای معده‌حساس غذای تند، خیلی چرب و خیلی پرفیبر را کم کن. هر غذایی که بعدش بد شدی را در یادداشت بنویس تا الگو پیدا شود.</span></li>'+
    '<li><span class="tag">قطعی</span><span>صبحانه قبل از ۸:۰۰ و میان‌وعدهٔ ۱۰:۳۰ بدون استثنا. عصرانهٔ ۱۷:۳۰ فاصلهٔ ناهار ۱۳:۳۰ تا شام ۲۰:۰۰ را پر می‌کند.</span></li></ul></div></div>';
  h+='<div class="card"><details><summary>برنامهٔ غذای کل هفته</summary><div class="scroll"><table><thead><tr><th>روز</th>'+MEAL_COLS.map(function(c){return '<th>'+c+'</th>'}).join("")+'</tr></thead><tbody>'+
    ORDER.map(function(x){return '<tr'+(x===dow?' class="today"':'')+'><td><b>'+DAY[x]+'</b></td>'+MEALS[x].map(function(c){return '<td style="min-width:130px">'+c+'</td>'}).join("")+'</tr>'}).join("")+'</tbody></table></div></details></div>';
  return h;
}
function renderBody(){
  var h='<div class="stack"><div class="ph"><h2>تن و تغذیه</h2><p>هر روز چند ثانیه ثبت کن تا پیشنهاد غذا و برنامهٔ سبک‌تر بگیری. این اطلاعات فقط برای خودت است و تشخیص پزشکی نیست.</p></div>'+subnav("body",[["log","ثبت تن"],["food","برنامهٔ غذا"],["ate","خوردم"]],subBody);
  h+=subBody==="log"?logHTML():subBody==="food"?foodHTML():ateHTML();
  h+='</div>';
  $("#pane-body").innerHTML=h;
}

/* ---------- money ---------- */
var EXP=["خوراک","حمل‌ونقل","سلامت و دارو","زیبایی و مراقبت","پوشاک و خرید","دوستان و تفریح","آموزش و زبان","خانه و قبض","اشتراک و دیجیتال","کسب‌وکار","قسط و بدهی","هدیه","سایر"];
var INC=["حقوق","پاداش","هدیه","کسب‌وکار","بازگشت پول","سایر"];
var finM=pmOf(new Date());
var unit="rial";
try{unit=localStorage.getItem("mentor.unit")||"rial"}catch(e){}
var smsText="",smsDraft=[],smsMsg="";
var finForm={t:"out",amt:"",cat:"خوراک",note:"",d:""};

function normText(s){
  return s.replace(/[۰-۹]/g,function(d){return "۰۱۲۳۴۵۶۷۸۹".indexOf(d)}).replace(/[٠-٩]/g,function(d){return "٠١٢٣٤٥٦٧٨٩".indexOf(d)}).replace(/[٬،]/g,",").replace(/ي/g,"ی").replace(/ك/g,"ک");
}
var CATRULES=[
  [/اسنپ\s?فود|رستوران|کافه|قنادی|شیرینی|سوپرمارکت|سوپر|میوه|نانوایی|فست/,"خوراک"],
  [/اسنپ|تپسی|مترو|بنزین|پارکینگ|عوارض|تاکسی|اتوبوس/,"حمل‌ونقل"],
  [/دارو|درمانگاه|دکتر|بیمارستان|آزمایشگاه|کلینیک|پزشک/,"سلامت و دارو"],
  [/آرایش|سالن|ناخن|زیبایی|فیشیال|پوست|مو/,"زیبایی و مراقبت"],
  [/پوشاک|لباس|مانتو|کفش|دیجی\s?کالا|دیجیکالا/,"پوشاک و خرید"],
  [/برق|گاز|قبض|آب و فاضلاب/,"خانه و قبض"],
  [/اشتراک|اینترنت|شارژ|ایرانسل|همراه اول|رایتل|فیلیمو|نماوا|گوگل|اپل/,"اشتراک و دیجیتال"],
  [/قسط|وام|تسهیلات/,"قسط و بدهی"]
];
function guessCat(s,type){
  if(type==="in"){if(/حقوق|مزایا/.test(s))return "حقوق";if(/پاداش|عیدی/.test(s))return "پاداش";return "سایر"}
  for(var i=0;i<CATRULES.length;i++)if(CATRULES[i][0].test(s))return CATRULES[i][1];
  return "سایر";
}
function parseSMS(raw){
  var blocks=raw.split(/\n\s*\n/).map(function(b){return b.trim()}).filter(Boolean),out=[];
  blocks.forEach(function(b){
    var s=normText(b),re=/(\d{1,3}(?:,\d{3})+|\d{5,})\s*([+\-]?)/g,m,cands=[];
    while((m=re.exec(s))){
      var tok=m[1],digits=tok.replace(/,/g,""),pre=s.slice(Math.max(0,m.index-14),m.index),post=s.slice(m.index+m[0].length,m.index+m[0].length+8);
      if(/مانده|موجودی|balance/i.test(pre))continue;
      if(tok.indexOf(",")<0&&digits.length>=9)continue;
      if(/(کارت|حساب|شماره|پیگیری|\*)\s*:?\s*$/.test(pre))continue;
      var um=/^\s*(ریال|تومان)/.exec(post);
      cands.push({amt:Number(digits),sign:m[2],unit:um?um[1]:""});
    }
    if(!cands.length){out.push({t:"out",amt:0,cat:"سایر",note:"",bad:true});return}
    var c=cands.filter(function(x){return x.unit})[0]||cands[0];
    var type="out";
    if(c.sign==="+")type="in";else if(c.sign==="-")type="out";
    else if(/واریز|دریافت|ایجاد|سپرده\s?گذاری|برگشت/.test(s)&&!/برداشت|خرید|پرداخت/.test(s))type="in";
    var u=c.unit||(/ریال/.test(s)?"ریال":/تومان/.test(s)?"تومان":(unit==="rial"?"ریال":"تومان"));
    var amt=u==="ریال"?Math.round(c.amt/10):c.amt;
    out.push({t:type,amt:amt,cat:guessCat(s,type),note:""});
  });
  return out;
}
function addTx(o){
  var id="tx_"+rid(),d=o.d||today;
  txs[id]={t:o.t,amt:Math.round(o.amt),cat:o.cat,note:o.note||"",d:d,pm:pmOf(parseKey(d)),src:o.src||"manual"};
  persist(id);
}
function monthTx(k){return Object.keys(txs).map(function(i){var t=txs[i];t.id=i;return t}).filter(function(t){return t.pm===k})}
function sumBy(list,type){var o={},tot=0;list.forEach(function(t){if(t.t!==type)return;o[t.cat]=(o[t.cat]||0)+t.amt;tot+=t.amt});return {by:o,tot:tot}}
function catOptions(type,cur){return (type==="in"?INC:EXP).map(function(c){return '<option'+(c===cur?' selected':'')+'>'+c+'</option>'}).join("")}
function statNum(n){return n>=1e6?fa((n/1e6).toFixed(1).replace(/\.0$/,""))+' <small>میلیون</small>':fa(String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g,","))+' <small>تومان</small>'}
function compact(n){return n>=1e6?fa((n/1e6).toFixed(1).replace(/\.0$/,""))+" میلیون":money(n).replace(" تومان","")}
function donut(by,tot){
  var cats=Object.keys(by).sort(function(a,b){return by[b]-by[a]}),items=[],rest=0;
  cats.forEach(function(c,i){if(i<6)items.push([c,by[c]]);else rest+=by[c]});
  if(rest)items.push(["سایر دسته‌ها",rest]);
  var off=0,arcs='',leg='';
  items.forEach(function(it,i){
    var p=it[1]/tot*100,col="var(--c"+(i+1)+")";
    arcs+='<circle cx="18" cy="18" r="15.9155" style="stroke:'+col+'" stroke-dasharray="'+Math.max(p-0.6,0.1).toFixed(2)+' '+(100-Math.max(p-0.6,0.1)).toFixed(2)+'" stroke-dashoffset="'+(-off).toFixed(2)+'"/>';
    off+=p;
    leg+='<div><i style="background:'+col+'"></i><span>'+it[0]+'</span><span class="v">'+compact(it[1])+' · '+fa(Math.round(p))+'٪</span></div>';
  });
  return '<div class="donutwrap"><div class="donut"><svg viewBox="0 0 36 36"><circle cx="18" cy="18" r="15.9155" style="stroke:var(--soft)"/>'+arcs+'</svg><div class="ctr"><div><b>'+compact(tot)+'</b>خرج ماه</div></div></div><div class="legend">'+leg+'</div></div>';
}
function renderMoney(){
  var list=monthTx(finM),ex=sumBy(list,"out"),inc=sumBy(list,"in");
  var prev=sumBy(monthTx(shiftPM(finM,-1)),"out");
  var net=inc.tot-ex.tot;
  var h='<div class="stack"><div class="ph"><h2>دخل و خرج</h2><p>ببین پولت از کجا آمده و برای چه خرج شده.</p></div>';
  h+=dateBar(pmLabel(finM),"ماه شمسی","mback","mfwd");
  h+='<div class="stats"><div class="stat in"><b class="num">'+statNum(inc.tot)+'</b><span>درآمد</span></div><div class="stat out"><b class="num">'+statNum(ex.tot)+'</b><span>خرج</span></div><div class="stat"><b class="num">'+(net<0?"−":"")+statNum(Math.abs(net))+'</b><span>مانده</span></div></div>';

  h+='<div class="card"><h3>خرج‌ها برای چه بوده</h3><div style="margin-top:12px">';
  if(!ex.tot)h+=empty("wallet","در این ماه خرجی ثبت نشده","از پیامک بانک یا فرم دستی پایین ثبت کن.");
  else{
    h+=donut(ex.by,ex.tot);
    var top=Object.keys(ex.by).sort(function(a,b){return ex.by[b]-ex.by[a]})[0];
    var tip="بیشترین خرج این ماه «"+top+"» است ("+fa(Math.round(ex.by[top]/ex.tot*100))+"٪ از کل).";
    if(prev.tot>0){var ch=Math.round((ex.tot-prev.tot)/prev.tot*100);tip+=" کل خرج نسبت به ماه قبل "+fa(Math.abs(ch))+"٪ "+(ch>=0?"بیشتر":"کمتر")+" است."}
    h+='<p class="note" style="margin-top:12px">'+tip+'</p>';
  }
  h+='</div></div>';

  h+='<div class="card stack tight"><h3>ثبت از پیامک بانک</h3><p class="muted" style="font-size:14px">برنامه نمی‌تواند خودش پیامک‌های گوشی را بخواند. متن پیامک‌ها را کپی کن و اینجا بچسبان (چند پیامک را با یک خط خالی جدا کن). مبلغ و نوع را تشخیص می‌دهد و تو دسته را انتخاب می‌کنی. متن پیامک و شمارهٔ کارت ذخیره نمی‌شود.</p>'+
   '<div class="grid2"><div><label for="smsUnit">واحد مبلغ، اگر در پیامک ننوشته باشد</label><select id="smsUnit"><option value="rial"'+(unit==="rial"?" selected":"")+'>ریال</option><option value="toman"'+(unit==="toman"?" selected":"")+'>تومان</option></select></div>'+
   '<div><label for="smsDate">تاریخ</label><input type="date" id="smsDate" value="'+(finForm.sd||today)+'"></div></div>'+
   '<textarea id="smsText" placeholder="متن پیامک را اینجا بچسبان">'+esc(smsText)+'</textarea>'+
   '<button class="btn block" data-act="parsesms">'+ic("spark")+'تشخیص مبلغ</button>'+(smsMsg?'<span class="note">'+esc(smsMsg)+'</span>':'');
  if(smsDraft.length){
    h+='<div>';
    smsDraft.forEach(function(r,i){
      h+='<div class="draft">'+(r.bad?'<span class="note">مبلغی پیدا نشد. اگر خواستی دستی وارد کن.</span>':'')+
        '<div class="twocol"><select data-di="'+i+'" data-f="t" aria-label="نوع"><option value="out"'+(r.t==="out"?" selected":"")+'>خرج</option><option value="in"'+(r.t==="in"?" selected":"")+'>درآمد</option></select>'+
        '<input type="text" inputmode="numeric" data-di="'+i+'" data-f="amt" aria-label="مبلغ به تومان" value="'+(r.amt||"")+'" placeholder="مبلغ (تومان)"></div>'+
        '<div class="twocol"><select data-di="'+i+'" data-f="cat" aria-label="دسته">'+catOptions(r.t,r.cat)+'</select>'+
        '<input type="text" data-di="'+i+'" data-f="note" aria-label="یادداشت" value="'+esc(r.note||"")+'" placeholder="برای چه؟ (اختیاری)"></div>'+
        '<div class="note">'+(r.amt?money(r.amt):"")+'</div></div>';
    });
    h+='<div style="display:flex;gap:8px;flex-wrap:wrap;padding-top:12px"><button class="btn" data-act="savesms">ثبت همه</button><button class="btn ghost" data-act="clearsms">پاک کردن</button></div></div>';
  }
  h+='</div>';

  h+='<div class="card stack tight"><h3>ثبت دستی</h3>'+
   '<div class="seg"><button data-act="ftype" data-v="out" aria-pressed="'+(finForm.t==="out")+'">خرج</button><button data-act="ftype" data-v="in" aria-pressed="'+(finForm.t==="in")+'">درآمد</button></div>'+
   '<div class="grid2"><div><label for="fAmt">مبلغ (تومان)</label><input type="text" id="fAmt" inputmode="numeric" value="'+esc(finForm.amt)+'"></div>'+
   '<div><label for="fCat">'+(finForm.t==="in"?"منبع پول":"برای چه")+'</label><select id="fCat">'+catOptions(finForm.t,finForm.cat)+'</select></div></div>'+
   '<div class="grid2"><div><label for="fDate">تاریخ</label><input type="date" id="fDate" value="'+(finForm.d||today)+'"></div>'+
   '<div><label for="fNote">یادداشت</label><input type="text" id="fNote" value="'+esc(finForm.note)+'"></div></div>'+
   '<button class="btn block" data-act="savetx">'+ic("plus")+'ثبت</button><span class="note" id="fMsg"></span></div>';

  var rows=list.sort(function(a,b){return a.d<b.d?1:a.d>b.d?-1:(a.id<b.id?1:-1)}).slice(0,40);
  h+='<div class="card flush"><h3 style="padding-top:10px">ثبت‌های '+PM[+finM.split("-")[1]-1]+'</h3>';
  if(!rows.length)h+=empty("inbox","ثبتی در این ماه نیست","اولین مورد را از پیامک یا فرم دستی اضافه کن.");
  rows.forEach(function(t){
    var dt=parseKey(t.d);
    h+='<div class="txrow"><div><select data-txid="'+t.id+'" aria-label="دسته">'+catOptions(t.t,t.cat)+'</select>'+(t.note?' <span class="muted">'+esc(t.note)+'</span>':'')+'</div><div class="amt '+t.t+'">'+(t.t==="in"?"+":"−")+money(t.amt)+'</div>'+
      '<div class="sub">'+shortDate(dt)+(t.src==="sms"?" · از پیامک":"")+'</div><div><button class="btn small'+(confirmDel===t.id?' danger':' ghost')+'" data-act="deltx" data-id="'+t.id+'">'+(confirmDel===t.id?"تأیید حذف":"حذف")+'</button></div></div>';
  });
  if(list.length>40)h+='<p class="note" style="padding:6px 0 10px">۴۰ ثبت آخر نمایش داده شد.</p>';
  h+='</div></div>';
  $("#pane-money").innerHTML=h;
}

var TABS=["today","week","body","money","mentor","about"];
function renderAll(){
  $("#subtitle").textContent=DAY[parseKey(today).getDay()]+" "+fmtDate.format(parseKey(today));
  if(tab==="today")renderToday();
  else if(tab==="week")renderWeek();
  else if(tab==="body")renderBody();
  else if(tab==="money")renderMoney();
}
function showTab(t,keepScroll){
  tab=t;confirmDel=null;
  document.querySelectorAll("[data-tab]").forEach(function(b){b.setAttribute("aria-selected",b.dataset.tab===t?"true":"false")});
  document.querySelectorAll(".pane").forEach(function(p){p.hidden=p.id!=="pane-"+t});
  try{history.replaceState(null,"","#"+t)}catch(e){}
  renderAll();
  if(!keepScroll)window.scrollTo(0,0);
}

/* ---------- events (clicks) ---------- */
document.addEventListener("click",function(e){
  var t=e.target.closest("[data-tab],[data-act],[data-sub]");if(!t)return;
  if(t.dataset.tab){showTab(t.dataset.tab);return}
  if(t.dataset.sub){
    var sp=t.dataset.sub.split(":");
    if(sp[0]==="week")subWeek=sp[1];else subBody=sp[1];
    confirmDel=null;
    if(sp[0]==="body"&&tab!=="body")showTab("body");else renderAll();
    return;
  }
  var a=t.dataset.act,doc,v=t.dataset.v;
  if(a!=="delev"&&a!=="deltx")confirmDel=null;
  if(a==="dayback"){sel=keyOf(addDays(parseKey(sel),-1));renderAll();return}
  if(a==="dayfwd"){sel=keyOf(addDays(parseKey(sel),1));renderAll();return}
  if(a==="gotoday"){sel=today;renderAll();return}
  if(a==="openday"){sel=t.dataset.k;showTab("today");return}
  if(a==="gobody"){subBody="food";showTab("body");return}
  if(a==="dismisswelcome"){welcomeDismissed=true;try{localStorage.setItem("mentor.welcome","1")}catch(x){}renderAll();return}
  if(a==="addev"){evDefaultDate=sel;subWeek="events";showTab("week",true);var f=$("#evForm");if(f&&f.scrollIntoView)f.scrollIntoView({block:"start"});return}
  if(a==="bkmake"){
    var bx=$("#bkBox"),bm=$("#bkMsg");bx.value=JSON.stringify({v:2,days:days,events:events,txs:txs});bx.focus();bx.select();
    var okc=false;try{if(navigator.clipboard)navigator.clipboard.writeText(bx.value);okc=true}catch(x){}
    bm.textContent=okc?"پشتیبان ساخته و کپی شد. آن را در یادداشت یا پیام به خودت ذخیره کن.":"پشتیبان ساخته شد. متن را کپی و نگه دار.";return;
  }
  if(a==="bkrestore"){
    var bm2=$("#bkMsg");
    try{
      var o=JSON.parse($("#bkBox").value);
      if(!o||typeof o!=="object"||!o.days)throw 0;
      var n=0;
      Object.keys(o.days||{}).forEach(function(k){days[k]=o.days[k];n++;persist(k)});
      Object.keys(o.events||{}).forEach(function(k){events[k]=o.events[k];n++;persist(k)});
      Object.keys(o.txs||{}).forEach(function(k){txs[k]=o.txs[k];n++;persist(k)});
      saveLocal();renderAll();toast(fa(n)+" مورد بازیابی شد");
    }catch(x){bm2.textContent="متن پشتیبان معتبر نیست."}
    return;
  }
  if(a==="light"){doc=ensure(sel);doc.light=!doc.light;persist(sel);renderAll();toast(doc.light?"روز سخت روشن شد: فقط ضروری‌ها":"برنامهٔ کامل برگشت");return}
  if(a==="done"||a==="skip"){
    doc=ensure(sel);var id=t.dataset.id;
    if(a==="done"){if(doc.done[id])delete doc.done[id];else{doc.done[id]=1;delete doc.skip[id];lastToggled=id}}
    else{if(doc.skip[id])delete doc.skip[id];else{doc.skip[id]=1;delete doc.done[id]}}
    persist(sel);renderAll();
    var st=dayStat(sel);if(a==="done"&&st&&st.total&&st.done===st.total)toast("همهٔ کارهای این روز تمام شد");
    return;
  }
  if(a==="energy"||a==="flow"||a==="pain"||a==="mood"){
    doc=ensure(sel);var n=Number(v);
    doc[a]=(doc[a]===n&&(a==="energy"||a==="mood"))?0:n;
    persist(sel);renderAll();return;
  }
  if(a==="foodr"){foodR=Number(v);var fs=$("#foodSlot"),ft=$("#foodText");if(fs)foodSlot=fs.value;var keep=ft?ft.value:"";renderAll();var ft2=$("#foodText");if(ft2)ft2.value=keep;return}
  if(a==="addfood"){
    var tx0=($("#foodText").value||"").trim().slice(0,80);foodSlot=$("#foodSlot").value;
    if(!tx0){toast("بنویس چه خوردی");return}
    doc=ensure(sel);doc.food.push({id:rid(),m:foodSlot,x:tx0,r:foodR});foodR=0;
    persist(sel);renderAll();toast("ثبت شد");return;
  }
  if(a==="foodplan"){
    doc=ensure(sel);var ix=Number(v),dw=parseKey(sel).getDay();
    doc.food.push({id:rid(),m:SLOTS[ix][0],x:MEALS[dw][ix],r:0});
    persist(sel);renderAll();toast("ثبت شد");return;
  }
  if(a==="delfood"){doc=ensure(sel);doc.food=doc.food.filter(function(f){return f.id!==t.dataset.id});persist(sel);renderAll();return}
  if(a==="sym"){doc=ensure(sel);if(doc.sym[v])delete doc.sym[v];else doc.sym[v]=1;persist(sel);renderAll();return}

  if(a==="saveev"){
    var ty=$("#evType").value,date=$("#evDate").value,tm=$("#evTime").value,msg=$("#evMsg");
    if(!/^\d{4}-\d{2}-\d{2}$/.test(date)||!/^\d{2}:\d{2}$/.test(tm)){if(msg)msg.textContent="تاریخ و ساعت را کامل وارد کن.";return}
    var title=$("#evTitle").value.trim()||evType(ty)[1];
    var id2="ev_"+rid();
    events[id2]={title:title.slice(0,60),type:ty,d:date,t:tm,dur:Number($("#evDur").value)||60,note:$("#evNote").value.trim().slice(0,120)};
    persist(id2);
    sel=date;renderAll();
    toast("اضافه شد. برنامهٔ "+DAY[parseKey(date).getDay()]+" تغییر کرد");
    return;
  }
  if(a==="delev"||a==="deltx"){
    var did=t.dataset.id;
    if(confirmDel===did){confirmDel=null;removeDoc(did);renderAll();toast("حذف شد")}
    else{confirmDel=did;renderAll()}
    return;
  }
  if(a==="mback"){finM=shiftPM(finM,-1);renderMoney();return}
  if(a==="mfwd"){finM=shiftPM(finM,1);renderMoney();return}
  if(a==="ftype"){finForm.t=v;finForm.cat=v==="in"?"حقوق":"خوراک";renderMoney();return}
  if(a==="parsesms"){
    smsDraft=parseSMS(smsText);
    smsMsg=smsDraft.length?fa(smsDraft.length)+" مورد پیدا شد. مبلغ و دسته را بررسی کن.":"متنی برای تشخیص نیست.";
    renderMoney();return;
  }
  if(a==="clearsms"){smsDraft=[];smsText="";smsMsg="";renderMoney();return}
  if(a==="savesms"){
    var okN=0,sd=$("#smsDate").value||today;
    smsDraft.forEach(function(r){if(r.amt>0){addTx({t:r.t,amt:r.amt,cat:r.cat,note:r.note,d:sd,src:"sms"});okN++}});
    smsDraft=[];smsText="";smsMsg="";
    finM=pmOf(parseKey(sd));renderMoney();toast(fa(okN)+" مورد ثبت شد");return;
  }
  if(a==="savetx"){
    var amt=Number(normText($("#fAmt").value).replace(/[^\d]/g,""));
    if(!amt){var fm0=$("#fMsg");if(fm0)fm0.textContent="مبلغ را وارد کن.";return}
    var dd=$("#fDate").value||today;
    addTx({t:finForm.t,amt:amt,cat:$("#fCat").value,note:$("#fNote").value.trim().slice(0,80),d:dd});
    finForm.amt="";finForm.note="";finM=pmOf(parseKey(dd));renderMoney();toast("ثبت شد");
    return;
  }
});
document.addEventListener("keydown",function(e){
  if((e.key==="Enter"||e.key===" ")&&e.target.classList&&e.target.classList.contains("dayrow")){e.preventDefault();e.target.click()}
});
document.addEventListener("input",function(e){
  var el=e.target,id=el.id;
  if(id==="sleepInput"){ensure(sel).sleep=el.value.slice(0,12);persistSoon(sel);return}
  if(id==="noteInput"){ensure(sel).note=el.value.slice(0,1500);persistSoon(sel);return}
  if(id==="smsText"){smsText=el.value;return}
  if(id==="fAmt"){finForm.amt=el.value;return}
  if(id==="fNote"){finForm.note=el.value;return}
  if(id==="fCat"){finForm.cat=el.value;return}
  if(id==="fDate"){finForm.d=el.value;return}
  if(id==="smsDate"){finForm.sd=el.value;return}
  if(id==="smsUnit"){unit=el.value;try{localStorage.setItem("mentor.unit",unit)}catch(x){}return}
  if(id==="evType"){var ty=evType(el.value),dsel=$("#evDur");if(dsel)dsel.value=String(ty[2]);return}
  if(el.dataset&&el.dataset.di!==undefined){
    var r=smsDraft[Number(el.dataset.di)];if(!r)return;
    var f=el.dataset.f;
    if(f==="amt")r.amt=Number(normText(el.value).replace(/[^\d]/g,""))||0;
    else if(f==="t"){r.t=el.value;if(el.value==="in"&&INC.indexOf(r.cat)<0)r.cat="سایر";if(el.value==="out"&&EXP.indexOf(r.cat)<0)r.cat="سایر";renderMoney()}
    else r[f]=el.value;
    return;
  }
  if(el.dataset&&el.dataset.txid){var tx=txs[el.dataset.txid];if(tx){tx.cat=el.value;persist(el.dataset.txid)}return}
});

/* ---------- demo seed data (fictional) ---------- */
function mulberry32(a){return function(){a|=0;a=a+0x6D2B79F5|0;var t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
function seedDemo(){
  var rnd=mulberry32(11),base=parseKey(today),i,k;
  days={};events={};txs={};
  /* cycle: three starts, 28 days apart, the last one 27 days ago */
  [83,55,27].forEach(function(off){[2,3,3,2,1].forEach(function(f,j){
    var kk=keyOf(addDays(base,-off+j)),dd=ensure(kk);
    dd.flow=f;dd.pain=j<2?2+Math.floor(rnd()*3):1;if(j<2)dd.sym.cramp=1;
  })});
  var foods=[["b","نان و پنیر و گردو"],["b","جو دوسر با موز"],["l","برنج و مرغ آب‌پز"],["l","قرمه‌سبزی"],["a","ماست و میوه"],["d","املت با سبزی"],["s","سیب و بادام"]];
  for(i=1;i<=27;i++){
    var d=addDays(base,-i);k=keyOf(d);
    var doc=ensure(k),ts=visible(k,false),rate=0.5+0.4*rnd();
    ts.forEach(function(x){if(rnd()<rate)doc.done[x.id]=1;else if(rnd()<0.2)doc.skip[x.id]=1});
    doc.energy=1+Math.floor(rnd()*5);
    doc.sleep=String(6+Math.floor(rnd()*3)+(rnd()<0.5?0.5:0));
    doc.mood=2+Math.floor(rnd()*4);
    if(rnd()<0.18)doc.sym.migraine=1;
    if(rnd()<0.22)doc.sym.gut=1;
    if(i<=14){
      for(var n=0;n<2+Math.floor(rnd()*2);n++){
        var f=foods[Math.floor(rnd()*foods.length)];
        var bad=f[1]==="قرمه‌سبزی"&&rnd()<0.8;
        doc.food.push({id:rid(),m:f[0],x:f[1],r:bad?1:0});
      }
    }
  }
  var td=ensure(today);td.energy=3;td.sleep="7";
  /* events */
  events["ev_demo1"]={title:"ناخن",type:"nail",d:keyOf(addDays(base,2)),t:"17:00",dur:90,note:""};
  events["ev_demo2"]={title:"دیدن دوستان",type:"friends",d:keyOf(addDays(base,5)),t:"18:00",dur:180,note:"کافه"};
  events["ev_demo3"]={title:"دکتر",type:"doctor",d:keyOf(addDays(base,-3)),t:"16:30",dur:60,note:""};
  /* transactions, amounts in toman */
  var EXPT=[["خوراک",[180,95,240,60,310]],["حمل‌ونقل",[85,120,60]],["زیبایی و مراقبت",[650,420]],["سلامت و دارو",[300,150]],["اشتراک و دیجیتال",[120]],["پوشاک و خرید",[890]],["دوستان و تفریح",[350,260]]];
  var cnt={};
  for(i=0;i<=60;i++){
    var dt=addDays(base,-i),kd=keyOf(dt);
    if(rnd()<0.6){
      var c=EXPT[Math.floor(rnd()*EXPT.length)],amt=c[1][Math.floor(rnd()*c[1].length)]*1000,pm=pmOf(dt);
      txs["tx_d"+i]={t:"out",amt:amt,cat:c[0],note:"",d:kd,pm:pm,src:rnd()<0.5?"sms":"manual"};
      cnt[pm]=(cnt[pm]||0)+1;
    }
  }
  [[21,"حقوق",12000000],[51,"حقوق",12000000],[9,"هدیه",1500000]].forEach(function(r,j){
    var dt=addDays(base,-r[0]);txs["tx_in"+j]={t:"in",amt:r[2],cat:r[1],note:"",d:keyOf(dt),pm:pmOf(dt),src:"manual"};
  });
  var best=Object.keys(cnt).sort(function(a,b){return cnt[b]-cnt[a]})[0];
  if(best)finM=best;
}

/* ---------- offline coach (rule based) ---------- */
function pctTxt(p){return fa(Math.round(p*100))+"٪"}
function coach(kind){
  var L=[],d0=parseKey(today),doc=days[today]||{},st=dayStat(today),now=new Date(),nowM=now.getHours()*60+now.getMinutes(),i;
  if(kind==="today"){
    if(!st){L.push("[قطعی] امروز هنوز گزارشی ثبت نشده. کارهای انجام‌شده را تیک بزن تا ارزیابی بدهم.")}
    else{
      L.push("[قطعی] تا الان "+fa(st.done)+" از "+fa(st.total)+" کار انجام شده ("+pctTxt(st.pct)+").");
      var done=doc.done||{},missed=visible(today,!!doc.light).filter(function(x){return mins(x.t)<nowM-30&&!done[x.id]&&!(doc.skip&&doc.skip[x.id])});
      if(missed.length)L.push("[قطعی] "+fa(missed.length)+" کار گذشته هنوز گزارش نشده. مثلا: «"+missed[0].title+"».");
      if(doc.energy&&doc.energy<=2)L.push("[محتمل] انرژی امروز کم ثبت شده. «روز سخت» را روشن کن و کارهای اختیاری را رها کن.");
      else if(st.pct>=0.7)L.push("[محتمل] امروز بالای هدف ۷۰٪ هستی. فردا همین ریتم را نگه دار.");
      else L.push("[محتمل] اگر امروز عقب افتاده‌ای، فقط خواب، غذا، مکمل و مراقبت پایه را کامل کن.");
    }
    L.push("[قطعی] امشب خواب را سر ساعت "+fa(bedOf(d0.getDay()))+" نگه دار.");
  }
  else if(kind==="week"){
    var ps=[],sl=[],en=[];
    for(i=0;i<7;i++){var k=keyOf(addDays(d0,-i)),s=dayStat(k),dd=days[k];if(s)ps.push({d:parseKey(k).getDay(),p:s.pct});if(dd&&dd.sleep)sl.push(parseFloat(dd.sleep));if(dd&&dd.energy)en.push(dd.energy)}
    if(!ps.length)L.push("[قطعی] هفتهٔ اخیر گزارشی ندارد.");
    else{
      var avg=ps.reduce(function(a,x){return a+x.p},0)/ps.length;
      ps.sort(function(a,b){return b.p-a.p});
      L.push("[قطعی] میانگین ۷ روز اخیر "+pctTxt(avg)+" است. بهترین روز "+DAY[ps[0].d]+" و ضعیف‌ترین "+DAY[ps[ps.length-1].d]+" بود.");
    }
    if(sl.length){var sa=sl.reduce(function(a,b){return a+b},0)/sl.length;L.push("[محتمل] میانگین خواب گزارش‌شده "+fa(sa.toFixed(1))+" ساعت است"+(sa<7?"؛ کمتر از ۷ ساعت. خواب را از ساعت خوابیدن اصلاح کن، نه از صبح.":"؛ در محدودهٔ خوب."))}
    var c=weekCounts(weekStart(today)),weak=GOALS.map(function(g){return {g:g,r:(c[g[0]]||0)/g[2]}}).sort(function(a,b){return a.r-b.r})[0];
    L.push("[محتمل] ضعیف‌ترین هدف این هفته «"+weak.g[1]+"» است ("+fa(c[weak.g[0]]||0)+" از "+fa(weak.g[2])+"). هفتهٔ بعد فقط روی همین یک مورد تمرکز کن.");
  }
  else if(kind==="tomorrow"){
    var tm=addDays(d0,1),tk=keyOf(tm),tdw=tm.getDay(),pl=planFor(tk);
    L.push("[قطعی] فردا "+DAY[tdw]+": بیداری "+fa(wakeOf(tdw))+"، خواب شب "+fa(bedOf(tdw))+" ("+dur(sleepMins(tdw))+").");
    eventsOn(tk).forEach(function(ev){L.push("[قطعی] رویداد: "+ev.title+" ساعت "+fa(ev.t)+" ("+dur(ev.dur)+").")});
    if(pl.moved.length)L.push("[قطعی] این کارها برای رویداد کنار می‌روند: "+pl.moved.join("، ")+".");
    pl.warns.forEach(function(w){L.push("[محتمل] "+w+".")});
    if(FOCUS[tdw])L.push("[قطعی] تمرکز وقت آزاد: "+FOCUS[tdw]+".");
    if(isHard(doc))L.push("[محتمل] امروز سخت بوده؛ فردا هم «روز سخت» را در نظر بگیر.");
  }
  else if(kind==="food"){
    var adv=foodAdvice(doc,cycleInfo());
    if(!adv.list.length)L.push("[قطعی] چیزی در ثبت تن امروز نیست. اگر علامتی داری ثبت کن تا پیشنهاد دقیق‌تر بدهم.");
    adv.list.slice(0,4).forEach(function(a){L.push("["+a.t+"] "+a.x)});
    foodPatterns().forEach(function(o){L.push("[حدسی] «"+o.n+"» "+fa(o.bad)+" بار از "+fa(o.tot)+" بار با ناراحتی همراه بوده. یک هفته کنارش بگذار و مقایسه کن.")});
  }
  else if(kind==="money"){
    var pmk=pmOf(d0),tx=monthTx(pmk),ex=sumBy(tx,"out"),pv=sumBy(monthTx(shiftPM(pmk,-1)),"out");
    if(!ex.tot)L.push("[قطعی] در این ماه خرجی ثبت نشده.");
    else{
      var cats=Object.keys(ex.by).sort(function(a,b){return ex.by[b]-ex.by[a]});
      L.push("[قطعی] خرج این ماه "+money(ex.tot)+" است. بیشترین دسته: "+cats.slice(0,3).map(function(c2){return c2+" ("+fa(Math.round(ex.by[c2]/ex.tot*100))+"٪)"}).join("، ")+".");
      if(pv.tot)L.push("[قطعی] نسبت به ماه قبل "+fa(Math.abs(Math.round((ex.tot-pv.tot)/pv.tot*100)))+"٪ "+(ex.tot>=pv.tot?"بیشتر":"کمتر")+" است.");
      L.push("[محتمل] کم کردن ۱۰٪ از «"+cats[0]+"» حدود "+money(ex.by[cats[0]]*0.1)+" در ماه صرفه‌جویی می‌کند.");
    }
  }
  return L.join("\n");
}
function addMsg(cls,text){var m=document.createElement("div");m.className="msg "+cls;m.textContent=text;$("#chat").appendChild(m);return m}
var QUICK=[["ارزیابی امروز","today"],["ارزیابی هفته","week"],["برنامهٔ فردا","tomorrow"],["غذا بر اساس حالم","food"],["تحلیل خرج‌ها","money"]];
function initMentor(){
  var q=$("#quick");
  QUICK.forEach(function(x){var b=document.createElement("button");b.className="chip";b.textContent=x[0];b.onclick=function(){addMsg("me",x[0]);addMsg("ai",coach(x[1]));window.scrollTo(0,document.body.scrollHeight)};q.appendChild(b)});
}

/* ---------- boot ---------- */
function busyEl(){var ae=document.activeElement;return ae&&(ae.tagName==="INPUT"||ae.tagName==="TEXTAREA"||ae.tagName==="SELECT")}
function setDemoBar(){var b=$("#demoBar");if(b)b.hidden=false}
function start(){
  var h=(location.hash||"").replace("#","");
  if(h==="meals"){h="body";subBody="food"}
  if(h==="growth"){h="week";subWeek="growth"}
  if(TABS.indexOf(h)>=0)tab=h;
  initMentor();
  loadLocal();
  var cleared=false;try{cleared=localStorage.getItem("demo.cleared")==="1"}catch(e){}
  if(!Object.keys(days).length&&!Object.keys(events).length&&!Object.keys(txs).length&&!cleared){seedDemo();saveLocal()}
  setSync(false,"نسخهٔ نمایشی · ذخیره در همین مرورگر");
  setDemoBar();
  showTab(tab);
}
document.addEventListener("click",function(e){
  var t=e.target.closest("[data-demo]");if(!t)return;
  if(t.dataset.demo==="clear"){days={};events={};txs={};try{localStorage.setItem("demo.cleared","1")}catch(x){}saveLocal();renderAll();toast("داده‌های نمونه پاک شد")}
  if(t.dataset.demo==="seed"){try{localStorage.removeItem("demo.cleared")}catch(x){}seedDemo();saveLocal();renderAll();toast("داده‌های نمونه برگشت")}
});
start();
setInterval(function(){var n=keyOf(new Date());if(n!==today){if(sel===today)sel=n;today=n}if(busyEl())return;if(tab==="today")renderToday()},60000);
})();

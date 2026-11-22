/* ============ CONFIG — edit these ============ */
const CONFIG=Object.assign({brand:'Lectern',contactEmail:'',formEndpoint:'',stripeLink:'',trialDays:7,supabaseUrl:'',supabaseKey:'',workerUrl:'',enforcePaywall:false,billingPortalUrl:''},window.LECTERN_CONFIG||{});
/* ============ DEMO DATA LAYER ============
   Uses localStorage so you can test the whole flow with zero backend.
   To go live, replace LS.get/LS.set calls with Supabase (see guide). */
const $ = s => document.querySelector(s);
const LS = {
  get:(k,d)=>{try{return JSON.parse(localStorage.getItem('lc_'+k))??d}catch{return d}},
  set:(k,v)=>localStorage.setItem('lc_'+k,JSON.stringify(v))
};
const esc = s => String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const RECOVERY=/type=recovery/.test(location.hash);
let U=null,SP=[];
const SB=(CONFIG.supabaseUrl&&window.supabase)?supabase.createClient(CONFIG.supabaseUrl,CONFIG.supabaseKey):null;
const me = () => U;
const speakers = () => SP;
const fmt = d => d ? new Date(d+'T12:00').toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric',year:'numeric'}) : '—';
const uid = () => Math.random().toString(36).slice(2,10);
const fld = (l,n,t='text',req=true,ph='') => `<label>${l}</label><input name="${n}" type="${t}" ${req?'required':''} placeholder="${ph}">`;

/* ============ PAGES ============ */
function home(){return `
<section class="hero rv"><h1>Every campus guest,<br><span>handled.</span></h1>
<p>${CONFIG.brand} replaces the email chains behind guest speakers, alumni panels and company info sessions with one beautiful link. Dates, details, parking, reminders and thank-you notes, all automatic.</p>
<a class="btn" href="signup.html">Start free trial</a><a class="btn ghost" href="pricing.html">See pricing</a>
<div class="mock"><div class="bar"><i></i><i></i><i></i></div><div class="body">
<aside><b>${CONFIG.brand}</b><div class="on">Dashboard</div><div>Guests</div><div>Calendar</div><div>Settings</div></aside>
<div class="main"><div class="stats"><div class="stat"><b>24</b><span>Guests this term</span></div><div class="stat"><b>5</b><span>Awaiting reply</span></div><div class="stat"><b>3</b><span>Events this week</span></div></div>
<table><tr><th>Speaker</th><th>Class</th><th>Date</th><th>Status</th></tr>
<tr><td>Priya Nair<br><small style="color:#6e6e73">VP Finance, Delta</small></td><td>MARK 4000</td><td>Mar 12</td><td><span class="chip ok">Confirmed</span></td></tr>
<tr><td>James Carter<br><small style="color:#6e6e73">Alumni '09, Coca-Cola</small></td><td>MGMT 3000</td><td>Mar 14</td><td><span class="chip wait">Awaiting reply</span></td></tr>
<tr><td>Elena Ruiz<br><small style="color:#6e6e73">Founder, Ponce Labs</small></td><td>Pitch Night</td><td>Mar 19</td><td><span class="chip ok">Confirmed</span></td></tr><tr><td>Northwind Consulting<br><small style="color:#6e6e73">4 recruiters</small></td><td>Info session</td><td>Mar 21</td><td><span class="chip ok">Confirmed</span></td></tr></table></div></div></div></section>
<section class="sec"><div class="wrap rv"><h2>Three steps. Zero chasing.</h2><p class="sub">You enter a name and a topic. We do the rest.</p>
<div class="grid"><div class="card"><div class="n">01</div><h3>Invite</h3><p>Add a guest's name, email and what they'll cover. Pick academic or recruitment and Lectern asks for the right details.</p></div>
<div class="card"><div class="n">02</div><h3>They self-onboard</h3><p>A branded link lets them pick a date, upload a headshot and bio, share dietary needs and register a plate for parking.</p></div>
<div class="card"><div class="n">03</div><h3>Automatic follow-ups</h3><p>Three days out: directions, room details and parking instructions. The morning after: a personal thank-you.</p></div></div></div></section>
<section class="sec"><div class="wrap rv"><div style="color:var(--blue);font-weight:600;margin-bottom:10px">NEW · RECRUITING SEASON</div><h2>Info sessions by the dozen.</h2><p class="sub">Every semester, dozens of employers visit for info sessions, career fairs and recruiting days. Lectern handles them in bulk.</p><div class="grid"><div class="card"><div class="n">One link</div><h3>One contact, whole team</h3><p>Invite one recruiter. They add their colleagues, with roles and food preferences, from the same link.</p></div><div class="card"><div class="n">Groups</div><h3>Teams, not just individuals</h3><p>Collect how many representatives are coming, who they are, food plans, room setup and parking for the whole team.</p></div><div class="card"><div class="n">Tracking</div><h3>Every visit in one place</h3><p>Filter academic guests and recruiters, see who has confirmed and which parking passes are still open.</p></div></div><p style="margin-top:36px"><a class="btn" href="signup.html">Start your free trial</a></p></div></section>
<section class="sec gray"><div class="wrap rv"><h2>One dashboard for every event.</h2><p class="sub">Coordinators see every upcoming talk, panel and pitch judging at a glance — who's confirmed, who's pending, who needs a parking pass.</p>
<div class="grid"><div class="card"><h3>Any number of speakers</h3><p>No per-speaker fees. Ever.</p></div><div class="card"><h3>Built for campus</h3><p>Buildings, rooms, parking and dietary needs are part of the form.</p></div><div class="card"><h3>Looks like you</h3><p>Speakers get a clean, professional experience that reflects well on your school.</p></div></div>
<p style="margin-top:44px"><a class="btn" href="signup.html">Start your 7-day free trial</a></p></div></section>`}

function pricing(){return `
<section class="sec"><div class="wrap rv"><h2>Simple pricing.</h2><p class="sub">One plan. Everything included. Cancel anytime.</p>
<div class="card price"><div class="n">${CONFIG.trialDays}-DAY FREE TRIAL, THEN</div><div class="amt">$49.99<small>/month</small></div>
<p style="color:var(--mute)">That's less than $2 a day.</p>
<ul><li>Unlimited guests: speakers, alumni and employers</li><li>Academic and recruitment visits</li><li>Unlimited events &amp; classes</li><li>Branded speaker onboarding links</li><li>Automatic reminders &amp; thank-you notes</li><li>Coordinator dashboard</li></ul>
<a class="btn" href="signup.html">Start free trial</a></div></div></section>`}

function contact(){return `
<form class="form rv in" data-act="contact"><h1>Get in touch</h1><p class="lead">Questions or want to see a demo? We'll reply within a day.</p>
${fld('Name','name')}${fld('Position','position','text',true,'e.g. Director of Events')}${fld('Email','email','email')}${fld('Phone number','phone','tel')}
<label>Your query</label><textarea name="query" required></textarea><button class="btn">Send message</button><div id="msg"></div></form>`}

function signup(){return `
<form class="form" data-act="signup"><h1>Create your account</h1><p class="lead">Start your ${CONFIG.trialDays}-day free trial.</p>
${fld('Full name','name')}${fld('University / organization','org')}
<div class="row"><div>${fld('Department / college','dept','text',false,'e.g. Terry College')}</div><div><label>Your role</label><select name="role"><option>Professor</option><option>Program coordinator</option><option>Events staff</option><option>Alumni relations</option><option>Other</option></select></div></div>
${fld('Work email','email','email')}${fld('Phone number','phone','tel')}${fld('Password (min 8 characters)','password','password')}
<button class="btn">Continue</button><p class="note">Already have an account? <a href="login.html">Log in</a></p><div id="msg"></div></form>`}

function login(){return `
<form class="form" data-act="login"><h1>Log in</h1><p class="lead">Welcome back.</p>${fld('Email','email','email')}${fld('Password','password','password')}
<button class="btn">Log in</button><p class="note"><a href="reset.html">Forgot your password?</a></p><p class="note">New here? <a href="signup.html">Create an account</a></p><div id="msg"></div></form>`}

function checkout(){const u=me();return `
<div class="form"><h1>Start your free trial</h1><p class="lead">Hi ${esc(u.name.split(' ')[0])} — you're one step away.</p>
<div class="card" style="box-shadow:0 2px 14px rgba(0,0,0,.08);text-align:center"><h3>${CONFIG.brand} Pro</h3><p style="margin:8px 0">${CONFIG.trialDays} days free, then <b>$49.99/month</b>.<br>Unlimited speakers. Cancel anytime.</p>
<p class="note" style="margin-top:0">${CONFIG.stripeLink?'You\'ll enter your card on a secure checkout page. You won\'t be charged until the trial ends.':'<b>Demo mode:</b> no card is collected. Add a payment link in CONFIG to go live.'}</p></div>
<button class="btn" data-act="trial">Start free trial</button></div>`}

function addForm(){return `<h2>Add a guest</h2><form data-act="addsp">
<label>What kind of guest?</label>
<div class="row"><label class="opt cat"><input type="radio" name="category" value="academic" required><span><b>Academic</b><br><small>Guest lecture, alumni panel, pitch judge, workshop</small></span></label>
<label class="opt cat"><input type="radio" name="category" value="recruit"><span><b>Recruitment</b><br><small>Info session, recruiting visit, career fair</small></span></label></div>
<div id="fbody" style="display:none">
<div class="row"><div>${fld('Guest name','name')}</div><div>${fld('Guest email','email','email')}</div></div>
<div class="row"><div><label data-a="Title &amp; company" data-r="Job title">Title &amp; company</label><input name="title" required></div><div><label>Type</label><select name="type"></select></div></div>
<div class="rec-only" style="display:none"><label>Company</label><input name="company"></div>
<div class="row"><div><label data-a="Course / event" data-r="Event name">Course / event</label><input name="course" required></div><div><label data-a="Host professor" data-r="Host (staff or professor)">Host professor</label><input name="host" required></div></div>
<label data-a="Topic of talk" data-r="Session topic">Topic of talk</label><input name="topic" required>
<label>What they'll cover</label><textarea name="about" placeholder="What should the guest cover? This appears on their invitation."></textarea>
<div class="row"><div>${fld('Building / room','room','text',false,'Moore-Rooker 101')}</div><div>${fld('Expected audience size','size','number',false)}</div></div>
<div class="rec-only" style="display:none"><div class="row"><div>${fld('Target students / majors','audience','text',false,'e.g. Finance seniors')}</div><div><label>Food for students</label><select name="food"><option value="">Not decided</option><option>Company provides food</option><option>School provides food</option><option>No food</option></select></div></div></div>
${peopleBlock([])}
<label>Offer up to 3 dates (the guest picks one)</label><div class="row" style="grid-template-columns:1fr 1fr 1fr"><input type="date" name="d1" required><input type="date" name="d2"><input type="date" name="d3"></div>
<label>Arrival &amp; parking instructions (emailed to the guest 3 days before)</label><textarea name="directions" placeholder="Where to park, which entrance to use, who to ask for…"></textarea>
<label>Confirmed date (only if you already agreed one)</label><input type="date" name="date">
<label>Internal notes</label><textarea name="notes"></textarea>
<div style="display:flex;gap:10px;margin-top:20px"><button class="btn" style="flex:1">Create &amp; get link</button><a class="btn gray" href="dashboard.html" style="text-align:center">Cancel</a></div><div id="msg"></div></div></form>`}

const parkTxt=s=>`Subject: Visitor parking request — ${fmt(s.date)}\n\nHello,\n\nWe're hosting a guest speaker and would like to arrange visitor parking.\n\nSpeaker: ${s.name} (${s.title})\nDate: ${fmt(s.date)}\nEvent: ${s.course}, ${s.room}\n${(s.people||[]).length?'People attending: '+(1+s.people.length)+'\n':''}Vehicle plate: ${s.plate||'to be confirmed'}\n\nCould you let us know the process or send a visitor permit?\n\nThank you,\n${me().name}\n${me().org}`;
const parkPanel=all=>{const t=new Date().toISOString().slice(0,10);
const p=all.filter(s=>s.status==='Confirmed'&&s.date>=t&&['To arrange','Requested'].includes(s.parking||'To arrange')).sort((a,b)=>a.date.localeCompare(b.date));
return p.length?`<h3 style="margin:26px 0 4px">Parking to arrange (${p.length})</h3><div class="panel"><table><tr><th>Guest</th><th>Date</th><th>Plate</th><th>Status</th><th></th></tr>${p.map(s=>`<tr><td><b>${esc(s.name)}</b></td><td>${fmt(s.date)}</td><td>${esc(s.plate||'—')}</td><td>${esc(s.parking||'To arrange')}</td><td style="white-space:nowrap"><button class="btn sm gray" data-act="parkreq" data-id="${s.id}">Copy request email</button> <button class="btn sm gray" data-act="parkdone" data-id="${s.id}">Mark done</button></td></tr>`).join('')}</table></div>`:''};
function detail(s){const first=esc(s.name.split(' ')[0]),P=['Not needed','To arrange','Requested','Done'];
const row=(k,v)=>v?`<br>${k}: <b>${esc(v)}</b>`:'';
return `<h2>${esc(s.name)}</h2><p style="color:var(--mute)">${esc(s.title)} · ${esc(s.type)} · ${stChip(s)}</p>
<div class="ev"><b>${esc(s.course)}</b> · Host: ${esc(s.host)}<br>${fmt(s.date)} · ${esc(s.room)}<br>${esc(s.email)}<br>Topic: ${esc(s.topic)}${row('Company',s.company)}${(s.people||[]).length?'<br>Additional people:<br>'+s.people.map(x=>'• <b>'+esc(x.name)+'</b>'+(x.title?', '+esc(x.title):'')+(x.diet?' ('+esc(x.diet)+')':'')).join('<br>'):''}${row('Target students',s.audience)}${row('Food',s.food)}</div>
<b>Added by the speaker</b><div class="ev">${s.photo?`<img class="thumb" src="${esc(s.photo)}"><br>`:''}${s.bio?esc(s.bio):'<span style="color:var(--mute)">Nothing yet</span>'}${row('Dietary',s.diet)}${row('Plate',s.plate)}${row('Accessibility',s.access)}${row('Presentation needs',s.av)}${row('Note to host',s.msg)}</div>
<b>Parking</b> <select data-park="${s.id}" style="width:auto;padding:6px 10px">${P.map(o=>`<option ${o===(s.parking||'To arrange')?'selected':''}>${o}</option>`).join('')}</select> <button class="btn sm gray" data-act="parkreq" data-id="${s.id}">Copy parking request email</button>
<pre>Reminder email (sent 3 days before) — preview\n\nHi ${first},\n\nLooking forward to ${fmt(s.date)}! You'll be in ${esc(s.room||'[room]')} for ${esc(s.course)}.\n${esc(s.directions||'[Your arrival & parking instructions appear here]')}</pre>
<div style="display:flex;gap:8px;flex-wrap:wrap"><a class="btn" href="add-speaker.html?id=${s.id}">Edit</a><button class="btn gray" data-act="copy" data-id="${s.id}">Copy speaker link</button><button class="btn gray" data-act="close">Close</button></div>`}
function speakerPortal(id){
const s=speakers().find(x=>x.id===id);
if(!s)return '<div class="sp"><h1>Link not found</h1><p>This invitation link is invalid.</p></div>';
const ds=[...new Set([s.date,...(s.dates||[])].filter(Boolean))],v=x=>esc(s[x]||''),ok=s.status==='Confirmed';
return `<form class="sp" data-act="portal" data-id="${esc(s.id)}"><div style="color:var(--blue);font-weight:600">${CONFIG.brand}</div><h1>Welcome, ${esc(s.name.split(' ')[0])}.</h1>
<p style="color:var(--mute)">${esc(s.host)} would love to have you join ${esc(s.course)}. ${ok?"You're confirmed. Update anything below, any time.":'Pick a date and tell us a bit about yourself.'}</p>
<div class="ev"><b>${esc(s.topic)}</b><br>${esc(s.about)}<br>${esc(s.room)}</div>
<label>Date</label>${ds.map(d=>`<label class="opt"><input type="radio" name="date" value="${d}" ${d===s.date?'checked':''} required>${fmt(d)}</label>`).join('')}
<label>${isRec(s.type)?'About your company':'Short bio'}</label><textarea name="bio" required>${v('bio')}</textarea>
<label>${isRec(s.type)?'Company logo (optional)':'Headshot'}</label><input type="file" name="photo" accept="image/*"><div id="prev">${s.photo?`<img class="thumb" src="${esc(s.photo)}">`:''}</div>
<div class="row"><div><label>Dietary preference</label><select name="diet">${['No restrictions','Vegetarian','Vegan','Gluten-free','Halal','Kosher','Other'].map(o=>`<option ${o===s.diet?'selected':''}>${o}</option>`).join('')}</select></div><div><label>Vehicle plate (optional, for parking)</label><input name="plate" value="${v('plate')}" placeholder="ABC1234"></div></div>
<label>Presentation needs</label><input name="av" value="${v('av')}" placeholder="Laptop, clicker, projector, slides to send…">${isRec(s.type)?`<label>Food for students</label><select name="food">${['','Company provides food','School provides food','No food'].map(o=>`<option value="${o}" ${o===s.food?'selected':''}>${o||'Not decided'}</option>`).join('')}</select>`:''}${peopleBlock(s.people)}
<label>Accessibility needs</label><input name="access" value="${v('access')}">
<label>Anything else for the host?</label><textarea name="msg">${v('msg')}</textarea>
<button class="btn">${ok?'Save changes':'Confirm my visit'}</button></form>`}

/* ============ GUEST CATEGORIES / ADDITIONAL PEOPLE / HELP ============ */
const isRec=t=>/info session|recruit|career fair/i.test(t||'');
const who=s=>s.company?`${s.company}${(s.people||[]).length?' · '+(1+s.people.length)+' reps':''}`:(s.title||'');
const DIETS=['No restrictions','Vegetarian','Vegan','Gluten-free','Halal','Kosher','Other'];
const TYPES={academic:['Guest lecture','Alumni panel','Pitch event judge','Workshop'],recruit:['Employer info session','Recruiting visit','Career fair booth']};
const personRow=(p={})=>`<div class="prow"><input data-p="name" placeholder="Name" value="${esc(p.name||'')}"><input data-p="title" placeholder="Designation" value="${esc(p.title||'')}"><select data-p="diet">${DIETS.map(o=>`<option ${o===p.diet?'selected':''}>${o}</option>`).join('')}</select><button type="button" class="btn sm gray" data-act="rmperson" aria-label="Remove">✕</button></div>`;
const peopleBlock=l=>`<label>Additional people (optional)</label><p class="note" style="text-align:left;margin:0 0 8px">Only the main guest gets the link. They can add or edit these people too.</p><div id="ppl">${(l||[]).map(p=>personRow(p)).join('')}</div><button type="button" class="btn sm gray" data-act="addperson" style="margin-top:8px">+ Add another person</button>`;
const getPeople=f=>[...f.querySelectorAll('.prow')].map(r=>({name:r.querySelector('[data-p=name]').value.trim(),title:r.querySelector('[data-p=title]').value.trim(),diet:r.querySelector('[data-p=diet]').value})).filter(x=>x.name);
function catToggle(f,cat){const b=$('#fbody');if(!b)return;b.style.display='';const r=cat==='recruit',cur=f.elements.type.value;
f.elements.type.innerHTML=TYPES[cat].map(o=>`<option>${o}</option>`).join('');
if(TYPES[cat].includes(cur))f.elements.type.value=cur;
b.querySelectorAll('[data-a]').forEach(l=>l.textContent=r?l.dataset.r:l.dataset.a);
b.querySelectorAll('.rec-only').forEach(x=>x.style.display=r?'':'none');
f.elements.company.required=r;
const rd=f.querySelector(`input[name=category][value=${cat}]`);if(rd)rd.checked=true}
document.addEventListener('change',e=>{const el=e.target;if(el.name==='category'&&el.form)catToggle(el.form,el.value)});
document.addEventListener('click',e=>{const t=e.target.closest('[data-act]');if(!t)return;const a=t.dataset.act;
if(a==='flt'){FLT=t.dataset.v;route()}
if(a==='addperson')$('#ppl').insertAdjacentHTML('beforeend',personRow());
if(a==='rmperson')t.closest('.prow').remove()});
function helpPg(){const u=me();return `<form class="form" data-act="help"><h1>How can we help?</h1><p class="lead">Send us your question and we'll reply by email.</p>
<label>Your name</label><input value="${esc(u.name)}" disabled><label>Your email</label><input value="${esc(u.email)}" disabled>
<label>Topic</label><select name="topic"><option>Question</option><option>Something isn't working</option><option>Billing</option><option>Feature request</option></select>
<label>Your message</label><textarea name="message" required style="min-height:140px"></textarea>
<button class="btn">Send message</button><div id="msg"></div><p class="note">Or email us directly at <a href="mailto:${CONFIG.contactEmail}">${CONFIG.contactEmail}</a></p></form>`}

/* ============ DASHBOARD / GUESTS / PROFILE / APP SHELL ============ */
const today=()=>new Date().toISOString().slice(0,10);
const inWeek=s=>{if(!s.date)return false;const a=new Date();a.setHours(0,0,0,0);const e=new Date(a);e.setDate(e.getDate()+7);const d=new Date(s.date+'T12:00');return d>=a&&d<e};
const FILT={all:()=>true,acad:s=>!isRec(s.type),rec:s=>isRec(s.type),await:s=>s.status!=='Confirmed',conf:s=>s.status==='Confirmed'&&s.date>=today(),week:inWeek,park:s=>s.status==='Confirmed'&&s.date>=today()&&['To arrange','Requested'].includes(s.parking||'To arrange')};
const APP_PAGES={dashboard:'dashboard',speakers:'speakers','add-speaker':'speakers',calendar:'calendar',help:'help',profile:'profile'};
const shell=(p,u,h)=>{if(!u||!APP_PAGES[p])return h;const act=APP_PAGES[p],it=(k,href,t)=>`<a class="si ${act===k?'on':''}" href="${href}">${t}</a>`;
return `<div class="shell"><aside class="side"><div class="sb">${esc(CONFIG.brand)}</div>${it('dashboard','dashboard.html','Dashboard')}${it('speakers','speakers.html','Guests')}${it('calendar','calendar.html','Calendar')}</aside><div class="content">${h}</div></div>`};
function dash(){
const u=me(),all=mine(),left=Math.max(0,Math.ceil((new Date(u.trialEnds)-Date.now())/864e5));
const hr=new Date().getHours(),greet=hr<12?'Good morning':hr<17?'Good afternoon':'Good evening';
const up=all.filter(FILT.conf).sort((a,b)=>a.date.localeCompare(b.date)),wait=all.filter(FILT.await);
const k=[['Total guests',all.length,'all','blue'],['Awaiting reply',wait.length,'await','orange'],['Upcoming confirmed',up.length,'conf','green'],['Events this week',all.filter(FILT.week).length,'week','purple'],['Parking to arrange',all.filter(FILT.park).length,'park','amber']];
const rows=a=>a.length?`<table><tr><th>Guest</th><th>Topic</th><th>Event</th><th>Date</th><th>Status</th><th></th></tr>${a.map(s=>`<tr><td><b>${esc(s.name)}</b><br><small style="color:#6e6e73">${esc(who(s))}</small></td><td>${esc(s.topic)}</td><td>${esc(s.course)}<br><small style="color:#6e6e73">${esc(s.room)}</small></td><td>${fmt(s.date)}</td><td>${stChip(s)}</td><td style="white-space:nowrap"><button class="btn sm gray" data-act="copy" data-id="${s.id}">Copy link</button> <button class="btn sm gray" data-act="view" data-id="${s.id}">Details</button> <a class="btn sm gray" href="add-speaker.html?id=${s.id}">Edit</a></td></tr>`).join('')}</table>`:'<div class="empty">Nothing here yet.</div>';
return `<div class="dash"><div class="top"><div><h1>${greet}, ${esc((u.name||'').split(' ')[0])}</h1><span style="color:var(--mute)">${[u.dept,u.org].filter(Boolean).map(esc).join(' · ')}</span></div><a class="btn" href="add-speaker.html">+ Add guest</a></div>
<div class="banner">Free trial: <b>${left} day${left==1?'':'s'}</b> left. Then $49.99/month.</div>
<div class="kpis">${k.map(([l,n,f,c])=>`<a class="kpi ${c}" href="speakers.html?f=${f}"><span>${l}</span><b>${n}</b></a>`).join('')}</div>
<h3 class="sh">Upcoming events</h3><div class="panel">${rows(up)}</div>
${parkPanel(all)}
${wait.length?`<h3 class="sh">Awaiting reply (${wait.length})</h3><div class="panel">${rows(wait)}</div>`:''}
<p style="margin-top:22px"><a href="speakers.html">View all guests →</a></p></div>`}
let FLT=new URLSearchParams(location.search).get('f')||'all';
function speakersPg(){const all=mine().filter(FILT[FLT]||FILT.all);
const chips=[['all','All'],['acad','Academic'],['rec','Recruiting'],['await','Awaiting reply'],['conf','Upcoming confirmed'],['week','This week'],['park','Parking open']];
return `<div class="dash"><div class="top"><h1>Guests</h1><div><button class="btn gray" data-act="xlsx">Export to Excel</button> <a class="btn" href="add-speaker.html">+ Add guest</a></div></div>
<div class="chips">${chips.map(([k,l])=>`<button class="btn sm ${FLT===k?'':'gray'}" data-act="flt" data-v="${k}">${l}</button>`).join('')}</div>
<div class="panel">${all.length?`<table><tr><th>Guest</th><th>Email</th><th>Event</th><th>Date</th><th>Plate</th><th>Dietary</th><th>Status</th><th></th></tr>${all.map(s=>`<tr><td><b>${esc(s.name)}</b><br><small style="color:#6e6e73">${esc(who(s))}</small></td><td>${esc(s.email)}</td><td>${esc(s.course)}</td><td>${fmt(s.date)}</td><td>${esc(s.plate||'—')}</td><td>${esc(s.diet||'—')}</td><td>${stChip(s)}</td><td style="white-space:nowrap"><button class="btn sm gray" data-act="copy" data-id="${s.id}">Copy link</button> <button class="btn sm gray" data-act="view" data-id="${s.id}">Details</button> <a class="btn sm gray" href="add-speaker.html?id=${s.id}">Edit</a> <button class="btn sm danger" data-act="delguest" data-id="${s.id}">Delete</button></td></tr>`).join('')}</table>`:'<div class="empty">No guests here. <a href="add-speaker.html">Add a guest</a>.</div>'}</div></div>`}
function profilePg(){const u=me(),v=x=>esc(u[x]||'');
return `<form class="form" data-act="profile" style="margin:40px auto"><h1>Your profile</h1><p class="lead">Update your details any time.</p>
<div class="row"><div><label>Full name</label><input name="name" required value="${v('name')}"></div><div><label>Work email</label><input value="${v('email')}" disabled></div></div>
<label>University / organization</label><input name="org" required value="${v('org')}">
<div class="row"><div><label>Department / college</label><input name="dept" value="${v('dept')}"></div><div><label>Your role</label><select name="role">${['Professor','Program coordinator','Events staff','Alumni relations','Other'].map(o=>`<option ${o===u.role?'selected':''}>${o}</option>`).join('')}</select></div></div>
<label>Phone number</label><input name="phone" type="tel" required value="${v('phone')}">
<label>New password (leave blank to keep your current one)</label><input name="password" type="password" autocomplete="new-password">
<button class="btn">Save changes</button><div id="msg"></div><p class="note">To change your email address, contact us from the Help page.</p></form>${billingCard(u)}`}
async function delSp(id){
if(SB){const r=await SB.from('speakers').delete().eq('id',id).select('id');if(r.error)throw r.error;if(!r.data||!r.data.length)throw new Error('Could not delete this guest (permission missing). Run supabase-fix-permissions.sql again.')}
else LS.set('speakers',LS.get('speakers',[]).filter(s=>s.id!==id));
await loadData()}
document.addEventListener('click',async e=>{const t=e.target.closest('[data-act=delguest]');if(!t)return;
const s=speakers().find(x=>x.id===t.dataset.id);
if(!s||!confirm(`Delete ${s.name}?\n\nThis removes their invitation link and all their details. This can't be undone.`))return;
try{await delSp(s.id);route()}catch(x){alert(x.message)}});

/* ============ MOBILE LABELS / EXCEL / RESET / BILLING ============ */
function labelTables(){document.querySelectorAll('#app table').forEach(t=>{const h=[...t.querySelectorAll('tr:first-child th')].map(x=>x.textContent.trim());t.querySelectorAll('tr').forEach(r=>[...r.children].forEach((c,i)=>{if(c.tagName==='TD'&&h[i])c.dataset.l=h[i]}))})}
async function exportXlsx(){
if(!window.XLSX){try{await new Promise((ok,no)=>{const s=document.createElement('script');s.src='https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js';s.onload=ok;s.onerror=no;document.head.appendChild(s)})}catch{return alert("Couldn't load the Excel exporter. Check your connection and try again.")}}
const list=mine().filter(FILT[FLT]||FILT.all);
const rows=[['Name','Email','Company','Type','Event','Date','Status','Room','Plate','Dietary','Parking','Number of people','Additional people'],...list.map(s=>[s.name,s.email,s.company||'',s.type,s.course,s.date,s.status==='Confirmed'?'Confirmed':'Awaiting reply',s.room||'',s.plate||'',s.diet||'',s.parking||'',1+(s.people||[]).length,(s.people||[]).map(x=>x.name+(x.title?' ('+x.title+')':'')+(x.diet?' - '+x.diet:'')).join('; ')])];
const ws=XLSX.utils.aoa_to_sheet(rows);ws['!cols']=[22,28,20,20,26,12,14,18,12,16,14,10,50].map(w=>({wch:w}));
const wb=XLSX.utils.book_new();XLSX.utils.book_append_sheet(wb,ws,'Guests');XLSX.writeFile(wb,'lectern-guests.xlsx')}
document.addEventListener('click',e=>{if(e.target.closest('[data-act=xlsx]'))exportXlsx()});
function resetPg(){if(!SB)return '<div class="form"><h1>Reset password</h1><p class="lead">Password reset needs the live database connection.</p></div>';
return RECOVERY?`<form class="form" data-act="reset-set"><h1>Choose a new password</h1><p class="lead">Enter a new password for your account.</p>${fld('New password (min 8 characters)','password','password')}<button class="btn">Update password</button><div id="msg"></div></form>`
:`<form class="form" data-act="reset-ask"><h1>Reset your password</h1><p class="lead">Enter your email and we'll send you a link.</p>${fld('Email','email','email')}<button class="btn">Send reset link</button><p class="note"><a href="login.html">Back to log in</a></p><div id="msg"></div></form>`}
const planOk=u=>u.plan==='active'||(u.trialEnds&&new Date(u.trialEnds)>Date.now());
const billingWall=u=>{const pay=CONFIG.stripeLink?CONFIG.stripeLink+(CONFIG.stripeLink.includes('?')?'&':'?')+'prefilled_email='+encodeURIComponent(u.email):'';
return `<div class="form" style="text-align:center"><h1>Your free trial has ended</h1><p class="lead">Subscribe to keep managing your guests. Your data is safe and waiting for you.</p>${pay?`<a class="btn" href="${esc(pay)}">Subscribe for $49.99/month</a>`:'<a class="btn" href="help.html">Contact us to subscribe</a>'}<p class="note">You can still view your <a href="profile.html">profile and billing</a>.</p></div>`};
const billingCard=u=>{const act=u.plan==='active',left=u.trialEnds?Math.ceil((new Date(u.trialEnds)-Date.now())/864e5):0;
const st=act?'Active subscription ($49.99/month)':left>0?`Free trial: ${left} day${left==1?'':'s'} left`:'Trial ended';
const btn=CONFIG.billingPortalUrl?`<a class="btn gray" target="_blank" rel="noopener" href="${esc(CONFIG.billingPortalUrl)}">Manage or cancel subscription</a>`:act?`<a class="btn gray" href="mailto:${esc(CONFIG.contactEmail)}?subject=Cancel%20my%20subscription">Request cancellation</a>`:(CONFIG.stripeLink?`<a class="btn" href="${esc(CONFIG.stripeLink)}">Subscribe</a>`:'');
return `<div class="form" style="margin:0 auto 40px"><div class="card" style="box-shadow:0 2px 14px rgba(0,0,0,.08)"><h3>Billing</h3><p style="margin:6px 0 14px;color:var(--mute)">${st}</p>${btn}</div></div>`};

/* ============ EXTRA PAGES ============ */
const plink=id=>{const s=SP.find(x=>x.id===id);return new URL('speaker.html?'+(s&&s.token?'t='+s.token:'id='+id),location.href).href};
const mine=()=>speakers().filter(s=>s.owner===me().email);
const stChip=s=>`<span class="chip ${s.status==='Confirmed'?'ok':'wait'}">${s.status==='Confirmed'?'Confirmed':'Awaiting reply'}</span>`;
function addPg(id){const e=id&&speakers().find(x=>x.id===id);let h=addForm().replace('<h2>Add a guest</h2>','');if(e)h=h.replace('Create &amp; get link','Save changes');return `<div class="dash" style="max-width:700px"><div class="top"><h1>${e?'Edit guest':'Add a guest'}</h1></div>${h}</div>`}
let calM=new Date();calM.setDate(1);
function calPg(){const all=mine(),y=calM.getFullYear(),m=calM.getMonth(),first=new Date(y,m,1).getDay(),n=new Date(y,m+1,0).getDate();let c='';
for(let i=0;i<first;i++)c+='<div class="cd off"></div>';
for(let d=1;d<=n;d++){const k=`${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
const ev=all.filter(s=>s.status==='Confirmed'?s.date===k:(s.dates||[]).includes(k));
c+=`<div class="cd"><b>${d}</b>${ev.map(s=>`<div class="ce ${s.status==='Confirmed'?'ok':'wait'}" data-act="view" data-id="${s.id}">${esc(s.name)}</div>`).join('')}</div>`}
return `<div class="dash"><div class="top"><h1>${calM.toLocaleDateString('en-US',{month:'long',year:'numeric'})}</h1><div><button class="btn gray sm" data-act="cal" data-d="-1">‹</button> <button class="btn gray sm" data-act="cal" data-d="1">›</button> <a class="btn sm" href="add-speaker.html">+ Add guest</a></div></div><div class="cal">${['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d=>`<div class="ch">${d}</div>`).join('')}${c}</div><p class="note">Solid green = confirmed · Dashed = date offered, awaiting reply</p></div>`}
document.addEventListener('click',e=>{const t=e.target.closest('[data-act]');if(!t)return;
if(t.dataset.act==='cal'){calM.setMonth(calM.getMonth()+ +t.dataset.d);route()}
if(t.dataset.act==='csv-old'){const r=[['Name','Email','Company','Reps','Event','Date','Plate','Dietary','Status'],...mine().map(s=>[s.name,s.email,s.company||'',1+(s.people||[]).length,s.course,s.date,s.plate||'',s.diet||'',s.status])];
const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([r.map(x=>x.map(c=>'"'+String(c).replace(/"/g,'""')+'"').join(',')).join('\n')],{type:'text/csv'}));a.download='speakers.csv';a.click()}});
/* ============ ROUTER (one file per page, set by <body data-page>) ============ */
const PG={home,pricing,contact,signup,login,checkout,dashboard:dash,speakers:speakersPg,'add-speaker':addPg,help:helpPg,profile:profilePg,reset:resetPg,calendar:calPg,speaker:speakerPortal};
const PRIV=['checkout','dashboard','speakers','add-speaker','help','profile','calendar'];
async function route(){await loadData();
const p=document.body.dataset.page,u=me(),q=new URLSearchParams(location.search),arg=q.get('t')||q.get('id');
if(PRIV.includes(p)&&!u&&sessionStorage.getItem('jl')){sessionStorage.removeItem('jl');const dg={...window.DIAG,supabaseConfigured:!!CONFIG.supabaseUrl,libraryLoaded:!!window.supabase,usingSupabase:!!SB};$('#app').innerHTML='<div class="form"><h1>Login check</h1><p class="lead">Copy this box and send it to Claude:</p><pre style="white-space:pre-wrap;background:#f5f5f7;padding:14px;border-radius:12px">'+esc(JSON.stringify(dg,null,1))+'</pre><p class="note"><a href="login.html">Back to login</a></p></div>';return}
if(PRIV.includes(p)&&!u&&window.NOPROF){$('#app').innerHTML='<div class="form"><h1>Account setup incomplete</h1><p class="lead">You are logged in, but your profile row is missing in the database. Run the profile fix SQL from the guide, then <a data-act="logout">log out</a> and log in again.</p></div>';return}
if(PRIV.includes(p)){if(!u){location.href='login.html';return}if(p!=='checkout'&&!u.trialEnds){location.href='checkout.html';return}}
if(u)sessionStorage.removeItem('jl');$('#app').innerHTML=shell(p,u,(CONFIG.enforcePaywall&&u&&PRIV.includes(p)&&!['checkout','profile','help'].includes(p)&&!planOk(u))?billingWall(u):PG[p](arg));labelTables();if(window.LOADERR)$('#app').insertAdjacentHTML('afterbegin','<div class="banner" style="margin:16px 22px">'+esc(window.LOADERR)+'</div>');
if(p==='add-speaker'&&arg){const s=speakers().find(x=>x.id===arg),f=$('form[data-act=addsp]');
if(s&&f){f.dataset.edit=arg;catToggle(f,isRec(s.type)?'recruit':'academic');[...f.elements].forEach(el=>{if(el.name&&s[el.name]!=null)el.value=s[el.name]});['d1','d2','d3'].forEach((k,i)=>f.elements[k].value=(s.dates||[])[i]||'');$('#ppl').innerHTML=(s.people||[]).map(p=>personRow(p)).join('')}}
const cur=location.pathname.split('/').pop()||'index.html',L=(h,t)=>`<a class="${cur===h?'on':''}" href="${h}">${t}</a>`;
$('#navLinks').innerHTML=u?L('help.html','Help')+L('profile.html','Profile')+'<a data-act="logout">Log out</a>':L('index.html','Home')+L('pricing.html','Pricing')+L('contact.html','Contact')+'<a href="login.html">Log in</a><a class="btn sm" href="signup.html">Start free trial</a>';
const lg=document.querySelector('nav .logo');if(lg)lg.setAttribute('href',u?'dashboard.html':'index.html');
const io=new IntersectionObserver(x=>x.forEach(i=>i.isIntersecting&&i.target.classList.add('in')),{threshold:.1});
document.querySelectorAll('.rv').forEach(el=>io.observe(el))}
async function loadData(){
const q=new URLSearchParams(location.search);
if(SB&&document.body.dataset.page==='speaker'){const t=q.get('t'),r=t?await SB.rpc('get_speaker',{t}):{};U=null;SP=r.data?[{...r.data,id:t,date:r.data.date||''}]:[];return}
if(!SB){U=LS.get('users',[]).find(u=>u.email===LS.get('me'))||null;SP=LS.get('speakers',[]);return}
const {data:{session}}=await SB.auth.getSession();
if(!session){window.DIAG={session:false};U=null;SP=[];return}
const {data:p,error:pe}=await SB.from('profiles').select('*').eq('id',session.user.id).single();
window.DIAG={session:true,profile:pe?(pe.code+': '+pe.message):(p?'found':'no row'),trial_ends:p?String(p.trial_ends):null};
U=p?{...p,email:session.user.email,trialEnds:p.trial_ends}:null;window.NOPROF=!p;
const {data:r,error:re}=await SB.from('speakers').select('*').order('created_at',{ascending:false});
window.LOADERR=re?('Could not load guests: '+re.message):'';
SP=(r||[]).map(x=>({...x,date:x.date||'',owner:session.user.email}))}
async function addSp(row){
if(SB){const {data:{session}}=await SB.auth.getSession();
const r=await SB.from('speakers').insert({...row,owner:session.user.id,token:crypto.randomUUID().replace(/-/g,'')}).select().single();if(r.error)throw r.error;
let sent=false;if(CONFIG.workerUrl){try{sent=(await fetch(CONFIG.workerUrl+'/invite',{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+session.access_token},body:JSON.stringify({speaker_id:r.data.id})})).ok}catch{}}
await loadData();return {...r.data,sent}}
const s={...row,id:uid(),owner:U.email};LS.set('speakers',[...LS.get('speakers',[]),s]);await loadData();return s}
async function updSp(id,patch){
if(SB){const r=await SB.from('speakers').update(patch).eq('id',id);if(r.error)throw r.error}
else LS.set('speakers',LS.get('speakers',[]).map(s=>s.id===id?{...s,...patch}:s));
await loadData()}

/* ============ ACTIONS ============ */
const msg=(t,ok)=>{const m=$('#msg');if(!m){alert(t);return}m.innerHTML=`<div class="${ok?'okbox':'err'}">${t}</div>`};
document.addEventListener('submit',async e=>{
const f=e.target,a=f.dataset.act;if(!a)return;e.preventDefault();
const d=Object.fromEntries(new FormData(f)),b=f.querySelector('button:not([type])');if(b)b.disabled=true;
try{await submitAct(a,f,d)}catch(x){msg(x.message||'Something went wrong. Please try again.')}
if(b)b.disabled=false});
async function submitAct(a,f,d){
if(a==='contact'){
if(SB){const r=await SB.from('contact_messages').insert(d);if(r.error)throw r.error}
if(CONFIG.formEndpoint){await fetch(CONFIG.formEndpoint,{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify(d)})}
else LS.set('contact',[...LS.get('contact',[]),d]);
f.reset();return msg("Thanks! We'll be in touch shortly.",1)}
if(a==='help'){const u=me(),row={name:u.name,position:'Help: '+d.topic,email:u.email,phone:u.phone||'',query:d.message};
if(SB){const r=await SB.from('contact_messages').insert(row);if(r.error)throw r.error}else LS.set('contact',[...LS.get('contact',[]),row]);
if(CONFIG.formEndpoint){try{await fetch(CONFIG.formEndpoint,{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify(row)})}catch{}}
f.reset();return msg("Thanks! We've got your message and will reply to "+esc(u.email)+" soon.",1)}
if(a==='profile'){const u=me(),p={name:d.name,org:d.org,dept:d.dept,role:d.role,phone:d.phone};
if(SB){const r=await SB.from('profiles').update(p).eq('id',u.id);if(r.error)throw r.error;
if(d.password){if(d.password.length<8)return msg('New password must be at least 8 characters.');const x=await SB.auth.updateUser({password:d.password});if(x.error)throw x.error}}
else{const us=LS.get('users',[]),i=us.findIndex(x=>x.email===u.email);us[i]={...us[i],...p,...(d.password?{password:d.password}:{})};LS.set('users',us)}
await loadData();f.elements.password.value='';return msg('Saved.',1)}
if(a==='reset-ask'){const r=await SB.auth.resetPasswordForEmail(d.email,{redirectTo:new URL('reset.html',location.href).href});if(r.error)throw r.error;return msg('If an account exists for that email, a reset link is on its way. Check your inbox and spam folder.',1)}
if(a==='reset-set'){if(d.password.length<8)return msg('Password must be at least 8 characters.');const r=await SB.auth.updateUser({password:d.password});if(r.error)throw r.error;msg('Password updated. Taking you to your dashboard…',1);setTimeout(()=>location.href='dashboard.html',1200);return}
if(a==='signup'){
if(d.password.length<8)return msg('Password must be at least 8 characters.');
if(SB){const {data,error}=await SB.auth.signUp({email:d.email,password:d.password,options:{data:{name:d.name,org:d.org,dept:d.dept,role:d.role,phone:d.phone}}});if(error)throw error;
if(!data.session)return msg('Check your inbox to confirm your email, then log in.',1);location.href='checkout.html';return}
const us=LS.get('users',[]);if(us.some(u=>u.email===d.email))return msg('An account with this email already exists.');
LS.set('users',[...us,d]);LS.set('me',d.email);location.href='checkout.html';return}
if(a==='login'){
if(SB){const {error}=await SB.auth.signInWithPassword({email:d.email,password:d.password});if(error)throw error;sessionStorage.setItem('jl','1');location.href='dashboard.html';return}
const u=LS.get('users',[]).find(u=>u.email===d.email&&u.password===d.password);if(!u)return msg('Incorrect email or password.');
LS.set('me',u.email);location.href='dashboard.html';return}
if(a==='addsp'){
const row={name:d.name,email:d.email,title:d.title,type:d.type,course:d.course,host:d.host,topic:d.topic,about:d.about,room:d.room,size:d.size,notes:d.notes,directions:d.directions,company:d.company||'',people:getPeople(f),audience:d.audience||'',food:d.food||'',dates:[d.d1,d.d2,d.d3].filter(Boolean)};
if(d.date){row.date=d.date;row.status='Confirmed'}
if(f.dataset.edit){await updSp(f.dataset.edit,row);location.href='dashboard.html';return}
const s=await addSp({status:'Invited',parking:'To arrange',...row});
$('#dlg').innerHTML=`<h2>Guest added</h2><p>${s.sent?'We emailed the invitation to '+esc(s.name)+'. ':''}You can also share this link. ${esc(s.name)} can add their details and update them any time:</p><pre>${plink(s.id)}</pre><a class="btn" href="dashboard.html">Go to dashboard</a>`;$('#dlg').showModal();return}
if(a==='portal'){
const id=f.dataset.id,s0=speakers().find(x=>x.id===id),photo=f.dataset.photo||'';
const p={date:d.date||s0.date||'',bio:d.bio,diet:d.diet,plate:d.plate,access:d.access,av:d.av,msg:d.msg,people:getPeople(f),...(d.food!==undefined?{food:d.food}:{})};
if(SB){if(photo){const bl=await (await fetch(photo)).blob(),path=id+'/'+Date.now()+'.jpg',up=await SB.storage.from('headshots').upload(path,bl,{contentType:'image/jpeg'});if(up.error)throw up.error;p.photo=SB.storage.from('headshots').getPublicUrl(path).data.publicUrl}
const r=await SB.rpc('save_speaker',{t:id,p});if(r.error)throw r.error}
else{if(photo)p.photo=photo;p.status=p.date?'Confirmed':'Invited';LS.set('speakers',LS.get('speakers',[]).map(s=>s.id===id?{...s,...p}:s))}
await route();$('#app').insertAdjacentHTML('afterbegin','<div class="sp" style="margin-bottom:0"><div class="okbox">Saved. Thank you! You can reopen this link any time to update your details.</div></div>')}}

document.addEventListener('click',e=>{
  const t=e.target.closest('[data-act]'); if(!t||t.tagName==='FORM')return; const a=t.dataset.act;
  if(a==='logout'){LS.set('me','');(SB?SB.auth.signOut():Promise.resolve()).then(()=>location.href='index.html');}
  if(a==='trial'){
    if(CONFIG.stripeLink){location.href=CONFIG.stripeLink+'?prefilled_email='+encodeURIComponent(me().email);return}
    if(SB){location.href='dashboard.html';return}const us=LS.get('users',[]);us.find(u=>u.email===me().email).trialEnds=new Date(Date.now()+CONFIG.trialDays*864e5).toISOString();LS.set('users',us);location.href='dashboard.html';
  }
  if(a==='add'){$('#dlg').innerHTML=addForm();$('#dlg').showModal();}
  if(a==='close')$('#dlg').close();
  if(a==='copy'){const l=plink(t.dataset.id);navigator.clipboard?.writeText(l);t.textContent='Copied!';}
  if(a==='view'){$('#dlg').innerHTML=detail(speakers().find(s=>s.id===t.dataset.id));$('#dlg').showModal();}
});
document.addEventListener('click',async e=>{const t=e.target.closest('[data-act]');if(!t)return;const a=t.dataset.act;
if(a==='parkreq'){await navigator.clipboard?.writeText(parkTxt(speakers().find(s=>s.id===t.dataset.id)));t.textContent='Copied!'}
if(a==='parkdone'){await updSp(t.dataset.id,{parking:'Done'});route()}});
document.addEventListener('change',async e=>{const el=e.target;
if(el.dataset.park){await updSp(el.dataset.park,{parking:el.value});route();return}
if(el.name==='photo'&&el.files[0]){const r=new FileReader();r.onload=()=>{const im=new Image();im.onload=()=>{const s=Math.min(im.width,im.height),c=document.createElement('canvas');c.width=c.height=600;c.getContext('2d').drawImage(im,(im.width-s)/2,(im.height-s)/2,s,s,0,0,600,600);const u=c.toDataURL('image/jpeg',.85);el.form.dataset.photo=u;$('#prev').innerHTML=`<img class="thumb" src="${u}">`};im.src=r.result};r.readAsDataURL(el.files[0])}});
$('#yr').textContent=new Date().getFullYear();
route();

/* ============ CONFIG — edit these ============ */
const CONFIG = {
  brand: 'Lectern',
  contactEmail: 'hello@yourdomain.com',          // where contact messages go (mailto fallback)
  formEndpoint: '',                               // e.g. Formspree URL: https://formspree.io/f/xxxxxx
  stripeLink: '',                                 // Stripe/Lemon Squeezy payment link with 7-day trial. Empty = demo mode
  trialDays: 7,
  supabaseUrl: '',   // from Supabase > Project Settings > API
  supabaseKey: '',   // the anon/public key (never the service_role key)
  workerUrl: ''      // your Cloudflare Worker URL (sends invitation emails)
};
/* ============ DEMO DATA LAYER ============
   Uses localStorage so you can test the whole flow with zero backend.
   To go live, replace LS.get/LS.set calls with Supabase (see guide). */
const $ = s => document.querySelector(s);
const LS = {
  get:(k,d)=>{try{return JSON.parse(localStorage.getItem('lc_'+k))??d}catch{return d}},
  set:(k,v)=>localStorage.setItem('lc_'+k,JSON.stringify(v))
};
const esc = s => String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
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
<aside><b>${CONFIG.brand}</b><div class="on">Dashboard</div><div>Speakers</div><div>Calendar</div><div>Settings</div></aside>
<div class="main"><div class="stats"><div class="stat"><b>24</b><span>Speakers this term</span></div><div class="stat"><b>5</b><span>Awaiting reply</span></div><div class="stat"><b>3</b><span>Events this week</span></div></div>
<table><tr><th>Speaker</th><th>Class</th><th>Date</th><th>Status</th></tr>
<tr><td>Priya Nair<br><small style="color:#6e6e73">VP Finance, Delta</small></td><td>MARK 4000</td><td>Mar 12</td><td><span class="chip ok">Confirmed</span></td></tr>
<tr><td>James Carter<br><small style="color:#6e6e73">Alumni '09, Coca-Cola</small></td><td>MGMT 3000</td><td>Mar 14</td><td><span class="chip wait">Awaiting reply</span></td></tr>
<tr><td>Elena Ruiz<br><small style="color:#6e6e73">Founder, Ponce Labs</small></td><td>Pitch Night</td><td>Mar 19</td><td><span class="chip ok">Confirmed</span></td></tr><tr><td>Northwind Consulting<br><small style="color:#6e6e73">4 recruiters</small></td><td>Info session</td><td>Mar 21</td><td><span class="chip ok">Confirmed</span></td></tr></table></div></div></div></section>
<section class="sec"><div class="wrap rv"><h2>Three steps. Zero chasing.</h2><p class="sub">You enter a name and a topic. We do the rest.</p>
<div class="grid"><div class="card"><div class="n">01</div><h3>Invite</h3><p>Add a guest's name, email and what they'll cover, or bulk-import a whole recruiting calendar from a spreadsheet.</p></div>
<div class="card"><div class="n">02</div><h3>They self-onboard</h3><p>A branded link lets them pick a date, upload a headshot and bio, share dietary needs and register a plate for parking.</p></div>
<div class="card"><div class="n">03</div><h3>Automatic follow-ups</h3><p>Three days out: directions, room details and parking instructions. The morning after: a personal thank-you.</p></div></div></div></section>
<section class="sec"><div class="wrap rv"><div style="color:var(--blue);font-weight:600;margin-bottom:10px">NEW · RECRUITING SEASON</div><h2>Info sessions by the dozen.</h2><p class="sub">Every semester, dozens of employers visit for info sessions, career fairs and recruiting days. Lectern handles them in bulk.</p><div class="grid"><div class="card"><div class="n">Import</div><h3>Paste your whole calendar</h3><p>Drop in a spreadsheet of companies and Lectern creates every visit and invites every recruiter.</p></div><div class="card"><div class="n">Groups</div><h3>Teams, not just individuals</h3><p>Collect how many representatives are coming, who they are, food plans, room setup and parking for the whole team.</p></div><div class="card"><div class="n">Tracking</div><h3>Every visit in one place</h3><p>Filter academic guests and recruiters, see who has confirmed and which parking passes are still open.</p></div></div><p style="margin-top:36px"><a class="btn" href="signup.html">Start your free trial</a></p></div></section>
<section class="sec gray"><div class="wrap rv"><h2>One dashboard for every event.</h2><p class="sub">Coordinators see every upcoming talk, panel and pitch judging at a glance — who's confirmed, who's pending, who needs a parking pass.</p>
<div class="grid"><div class="card"><h3>Any number of speakers</h3><p>No per-speaker fees. Ever.</p></div><div class="card"><h3>Built for campus</h3><p>Buildings, rooms, parking and dietary needs are part of the form.</p></div><div class="card"><h3>Looks like you</h3><p>Speakers get a clean, professional experience that reflects well on your school.</p></div></div>
<p style="margin-top:44px"><a class="btn" href="signup.html">Start your 7-day free trial</a></p></div></section>`}

function pricing(){return `
<section class="sec"><div class="wrap rv"><h2>Simple pricing.</h2><p class="sub">One plan. Everything included. Cancel anytime.</p>
<div class="card price"><div class="n">${CONFIG.trialDays}-DAY FREE TRIAL, THEN</div><div class="amt">$49.99<small>/month</small></div>
<p style="color:var(--mute)">That's less than $2 a day.</p>
<ul><li>Unlimited guests: speakers, alumni and employers</li><li>Bulk import for recruiting season</li><li>Unlimited events &amp; classes</li><li>Branded speaker onboarding links</li><li>Automatic reminders &amp; thank-you notes</li><li>Coordinator dashboard</li></ul>
<a class="btn" href="signup.html">Start free trial</a></div></div></section>`}

function contact(){return `
<form class="form rv in" data-act="contact"><h1>Get in touch</h1><p class="lead">Questions, a demo, or a custom setup? We'll reply within a day.</p>
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
<button class="btn">Log in</button><p class="note">New here? <a href="signup.html">Create an account</a></p><div id="msg"></div></form>`}

function checkout(){const u=me();return `
<div class="form"><h1>Start your free trial</h1><p class="lead">Hi ${esc(u.name.split(' ')[0])} — you're one step away.</p>
<div class="card" style="box-shadow:0 2px 14px rgba(0,0,0,.08);text-align:center"><h3>${CONFIG.brand} Pro</h3><p style="margin:8px 0">${CONFIG.trialDays} days free, then <b>$49.99/month</b>.<br>Unlimited speakers. Cancel anytime.</p>
<p class="note" style="margin-top:0">${CONFIG.stripeLink?'You\'ll enter your card on a secure checkout page. You won\'t be charged until the trial ends.':'<b>Demo mode:</b> no card is collected. Add a payment link in CONFIG to go live.'}</p></div>
<button class="btn" data-act="trial">Start free trial</button></div>`}

function dash(){
  const u=me(), all=speakers().filter(s=>s.owner===u.email);
  const left=Math.max(0,Math.ceil((new Date(u.trialEnds)-Date.now())/864e5));
  const up=all.filter(s=>s.status==='Confirmed'&&s.date>=new Date().toISOString().slice(0,10)).sort((a,b)=>a.date.localeCompare(b.date));
  const chip=s=>`<span class="chip ${s.status==='Confirmed'?'ok':'wait'}">${s.status==='Confirmed'?'Confirmed':'Awaiting reply'}</span>`;
  const rows=a=>a.length?`<table><tr><th>Speaker</th><th>Topic</th><th>Class / event</th><th>Date</th><th>Status</th><th></th></tr>${a.map(s=>`<tr><td><b>${esc(s.name)}</b><br><small style="color:#6e6e73">${esc(who(s))}</small></td><td>${esc(s.topic)}</td><td>${esc(s.course)}<br><small style="color:#6e6e73">${esc(s.room)}</small></td><td>${fmt(s.date)}</td><td>${chip(s)}</td>
  <td style="white-space:nowrap"><button class="btn sm gray" data-act="copy" data-id="${s.id}">Copy link</button> <button class="btn sm gray" data-act="view" data-id="${s.id}">Details</button> <a class="btn sm gray" href="add-speaker.html?id=${s.id}">Edit</a></td></tr>`).join('')}</table>`:'<div class="empty">Nothing here yet.</div>';
  return `<div class="dash"><div class="top"><div><h1>Dashboard</h1><span style="color:var(--mute)">${esc(u.org)}</span></div><a class="btn gray" href="bulk-add.html">Bulk add</a> <a class="btn" href="add-speaker.html">+ Add guest</a></div>
  <div class="banner">Free trial: <b>${left} day${left==1?'':'s'}</b> left. Then $49.99/month.</div>
  <div class="stats"><div class="stat"><b>${all.length}</b><span>Total guests</span></div><div class="stat"><b>${all.filter(s=>s.status!=='Confirmed').length}</b><span>Awaiting reply</span></div><div class="stat"><b>${up.length}</b><span>Upcoming confirmed</span></div></div>
  ${parkPanel(all)}<h3 style="margin:26px 0 4px">Upcoming events</h3><div class="panel">${rows(up)}</div>
  <h3 style="margin:26px 0 4px">All guests</h3><div class="panel">${rows(all)}</div>
  </div>`}

function addForm(){return `<h2>Add a speaker</h2><form data-act="addsp">
<div class="row"><div>${fld('Speaker name','name')}</div><div>${fld('Speaker email','email','email')}</div></div>
<div class="row"><div>${fld('Title &amp; company','title','text',true,'VP Finance, Delta')}</div><div><label>Type</label><select name="type"><optgroup label="Academic"><option>Guest lecture</option><option>Alumni panel</option><option>Pitch event judge</option><option>Workshop</option></optgroup><optgroup label="Recruiting"><option>Employer info session</option><option>Recruiting visit</option><option>Career fair booth</option></optgroup></select></div></div>
<div class="row"><div>${fld('Course / event','course','text',true,'MARK 4000')}</div><div>${fld('Host professor','host')}</div></div>
${fld('Topic of talk','topic','text',true,'Brand strategy in a downturn')}
<label>What they'll speak about</label><textarea name="about" placeholder="What should the speaker cover? This appears on their invitation."></textarea>

<div class="row"><div>${fld('Building / room','room','text',false,'Moore-Rooker 101')}</div><div>${fld('Expected audience size','size','number',false)}</div></div>
<label>Offer up to 3 dates (speaker picks one)</label><div class="row" style="grid-template-columns:1fr 1fr 1fr"><input type="date" name="d1" required><input type="date" name="d2"><input type="date" name="d3"></div>
<div id="recf" style="display:none"><label>Company</label><input name="company"><div class="row"><div>${fld('Representatives attending','headcount','number',false)}</div><div>${fld('Target students / majors','audience','text',false,'e.g. Finance seniors')}</div></div><label>Representative names (one per line)</label><textarea name="reps"></textarea><label>Food for students</label><select name="food"><option value="">Not decided</option><option>Company provides food</option><option>School provides food</option><option>No food</option></select></div>
<label>Arrival &amp; parking instructions (emailed to the speaker 3 days before)</label><textarea name="directions" placeholder="Where to park, which entrance to use, who to ask for…"></textarea>
<label>Confirmed date (only if you already agreed one)</label><input type="date" name="date">
<label>Internal notes</label><textarea name="notes"></textarea>
<div style="display:flex;gap:10px;margin-top:20px"><button class="btn" style="flex:1">Create &amp; get link</button><a class="btn gray" href="dashboard.html" style="text-align:center">Cancel</a></div><div id="msg"></div></form>`}

const parkTxt=s=>`Subject: Visitor parking request — ${fmt(s.date)}\n\nHello,\n\nWe're hosting a guest speaker and would like to arrange visitor parking.\n\nSpeaker: ${s.name} (${s.title})\nDate: ${fmt(s.date)}\nEvent: ${s.course}, ${s.room}\n${s.headcount?'Representatives attending: '+s.headcount+'\n':''}Vehicle plate: ${s.plate||'to be confirmed'}\n\nCould you let us know the process or send a visitor permit?\n\nThank you,\n${me().name}\n${me().org}`;
const parkPanel=all=>{const t=new Date().toISOString().slice(0,10);
const p=all.filter(s=>s.status==='Confirmed'&&s.date>=t&&['To arrange','Requested'].includes(s.parking||'To arrange')).sort((a,b)=>a.date.localeCompare(b.date));
return p.length?`<h3 style="margin:26px 0 4px">Parking to arrange (${p.length})</h3><div class="panel"><table><tr><th>Speaker</th><th>Date</th><th>Plate</th><th>Status</th><th></th></tr>${p.map(s=>`<tr><td><b>${esc(s.name)}</b></td><td>${fmt(s.date)}</td><td>${esc(s.plate||'—')}</td><td>${esc(s.parking||'To arrange')}</td><td style="white-space:nowrap"><button class="btn sm gray" data-act="parkreq" data-id="${s.id}">Copy request email</button> <button class="btn sm gray" data-act="parkdone" data-id="${s.id}">Mark done</button></td></tr>`).join('')}</table></div>`:''};
function detail(s){const first=esc(s.name.split(' ')[0]),P=['Not needed','To arrange','Requested','Done'];
const row=(k,v)=>v?`<br>${k}: <b>${esc(v)}</b>`:'';
return `<h2>${esc(s.name)}</h2><p style="color:var(--mute)">${esc(s.title)} · ${esc(s.type)} · ${stChip(s)}</p>
<div class="ev"><b>${esc(s.course)}</b> · Host: ${esc(s.host)}<br>${fmt(s.date)} · ${esc(s.room)}<br>${esc(s.email)}<br>Topic: ${esc(s.topic)}${row('Company',s.company)}${row('Reps attending',s.headcount)}${row('Rep names',s.reps)}${row('Target students',s.audience)}${row('Food',s.food)}</div>
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
<label>Presentation needs</label><input name="av" value="${v('av')}" placeholder="Laptop, clicker, projector, slides to send…">${isRec(s.type)?`<div class="row"><div><label>Representatives attending</label><input type="number" name="headcount" value="${v('headcount')}"></div><div><label>Food for students</label><select name="food">${['','Company provides food','School provides food','No food'].map(o=>`<option value="${o}" ${o===s.food?'selected':''}>${o||'Not decided'}</option>`).join('')}</select></div></div><label>Names of representatives (one per line)</label><textarea name="reps">${v('reps')}</textarea>`:''}
<label>Accessibility needs</label><input name="access" value="${v('access')}">
<label>Anything else for the host?</label><textarea name="msg">${v('msg')}</textarea>
<button class="btn">${ok?'Save changes':'Confirm my visit'}</button></form>`}

/* ============ INFO SESSIONS / RECRUITING ============ */
const isRec=t=>/info session|recruit|career fair/i.test(t||'');
const who=s=>s.company?`${s.company}${s.headcount?' · '+s.headcount+' reps':''}`:(s.title||'');
const recToggle=f=>{const r=isRec(f.elements.type.value),b=$('#recf');if(b){b.style.display=r?'':'none';f.elements.company.required=r}};
document.addEventListener('change',e=>{const el=e.target;if(el.name==='type'&&el.form&&el.form.dataset.act==='addsp')recToggle(el.form)});
function bulkPg(){return `<div class="dash" style="max-width:820px"><div class="top"><h1>Bulk add guests</h1><a class="btn gray" href="dashboard.html">Back</a></div>
<p style="color:var(--mute);margin-bottom:12px">Paste rows from Excel or Google Sheets, one guest per line, with these columns in this order:</p>
<pre style="white-space:pre-wrap;background:var(--soft);padding:12px;border-radius:12px;font-size:13px">Company | Contact name | Contact email | Type | Date (YYYY-MM-DD) | Room | Reps attending | Expected students</pre>
<p class="note" style="text-align:left">Type can be: Employer info session, Recruiting visit, Career fair booth, Guest lecture, Alumni panel, Pitch event judge, Workshop. Leave it blank for "Employer info session". Date is optional.</p>
<textarea id="bulk" style="min-height:220px;margin-top:10px" placeholder="Northwind Consulting&#9;Jane Doe&#9;jane@northwind.com&#9;Employer info session&#9;2027-02-03&#9;Benson 101&#9;3&#9;80"></textarea>
<label class="opt" style="margin-top:12px"><input type="checkbox" id="bulkmail" ${CONFIG.workerUrl?'checked':'disabled'}> Email invitations right away ${CONFIG.workerUrl?'':'(needs the Worker, see setup guide)'}</label>
<div style="display:flex;gap:10px;margin-top:14px"><button class="btn" data-act="bulkgo">Import</button><button class="btn gray" data-act="bulktpl">Download CSV template</button></div><div id="msg"></div></div>`}
const bulkRows=txt=>txt.split(/\r?\n/).map(l=>l.trim()).filter(Boolean).map(l=>l.split(l.includes('\t')?'\t':',').map(c=>c.trim().replace(/^"|"$/g,''))).filter((c,i)=>!(i===0&&/email/i.test(c.join(' '))&&!c.join(' ').includes('@')));
async function addMany(list,mail){
if(SB){const {data:{session}}=await SB.auth.getSession();
const r=await SB.from('speakers').insert(list.map(x=>({...x,owner:session.user.id,token:crypto.randomUUID().replace(/-/g,'')}))).select('id');if(r.error)throw r.error;
let n=0;if(mail&&CONFIG.workerUrl)for(const x of r.data){try{if((await fetch(CONFIG.workerUrl+'/invite',{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+session.access_token},body:JSON.stringify({speaker_id:x.id})})).ok)n++}catch{}}
await loadData();return n}
LS.set('speakers',[...LS.get('speakers',[]),...list.map(x=>({...x,id:uid(),owner:U.email}))]);await loadData();return 0}
document.addEventListener('click',async e=>{const t=e.target.closest('[data-act]');if(!t)return;const a=t.dataset.act;
if(a==='flt'){FLT=t.dataset.v;route()}
if(a==='bulktpl'){const l=document.createElement('a');l.href=URL.createObjectURL(new Blob(['Company,Contact name,Contact email,Type,Date,Room,Reps attending,Expected students\nNorthwind Consulting,Jane Doe,jane@example.com,Employer info session,2027-02-03,Benson 101,3,80\n'],{type:'text/csv'}));l.download='lectern-bulk-template.csv';l.click()}
if(a==='bulkgo'){const rows=bulkRows($('#bulk').value);if(!rows.length)return msg('Paste at least one row.');
const bad=rows.filter(c=>!c[0]||!/.+@.+\..+/.test(c[2]||''));
if(bad.length)return msg(`${bad.length} row(s) are missing a company or a valid email. First problem: ${esc(bad[0].join(' / '))}`);
if(!confirm(`Import ${rows.length} guests?`))return;
const list=rows.map(c=>{const ty=c[3]||'Employer info session';return{company:c[0],name:c[1]||c[0],email:c[2],type:ty,dates:/^\d{4}-\d\d-\d\d$/.test(c[4]||'')?[c[4]]:[],room:c[5]||'',headcount:c[6]||'',size:c[7]||'',course:c[0]+' · '+ty,host:me().name,topic:ty,title:'',status:'Invited',parking:'To arrange'}});
t.disabled=true;try{const n=await addMany(list,$('#bulkmail')&&$('#bulkmail').checked);msg(`Imported ${list.length} guests${n?', emailed '+n+' invitations':''}. <a href="speakers.html">View all guests</a>`,1)}catch(x){msg(x.message)}t.disabled=false}});

/* ============ EXTRA PAGES ============ */
const plink=id=>{const s=SP.find(x=>x.id===id);return new URL('speaker.html?'+(s&&s.token?'t='+s.token:'id='+id),location.href).href};
const mine=()=>speakers().filter(s=>s.owner===me().email);
const stChip=s=>`<span class="chip ${s.status==='Confirmed'?'ok':'wait'}">${s.status==='Confirmed'?'Confirmed':'Awaiting reply'}</span>`;
function addPg(id){const e=id&&speakers().find(x=>x.id===id);let h=addForm().replace('<h2>Add a speaker</h2>','');if(e)h=h.replace('Create &amp; get link','Save changes');return `<div class="dash" style="max-width:700px"><div class="top"><h1>${e?'Edit guest':'Add a guest'}</h1></div>${h}</div>`}
let FLT='all';function speakersPg(){const all=mine().filter(s=>FLT==='all'||(FLT==='rec')===isRec(s.type));return `<div class="dash"><div class="top"><h1>All guests</h1><div><button class="btn gray" data-act="csv">Export CSV (parking list)</button> <a class="btn gray" href="bulk-add.html">Bulk add</a> <a class="btn" href="add-speaker.html">+ Add guest</a></div></div><div style="margin:0 0 12px;display:flex;gap:8px">${[['all','All'],['acad','Academic'],['rec','Recruiting']].map(([k,l])=>`<button class="btn sm ${FLT===k?'':'gray'}" data-act="flt" data-v="${k}">${l}</button>`).join('')}</div><div class="panel">${all.length?`<table><tr><th>Speaker</th><th>Email</th><th>Event</th><th>Date</th><th>Plate</th><th>Dietary</th><th>Status</th><th></th></tr>${all.map(s=>`<tr><td><b>${esc(s.name)}</b><br><small style="color:#6e6e73">${esc(who(s))}</small></td><td>${esc(s.email)}</td><td>${esc(s.course)}</td><td>${fmt(s.date)}</td><td>${esc(s.plate||'—')}</td><td>${esc(s.diet||'—')}</td><td>${stChip(s)}</td><td style="white-space:nowrap"><button class="btn sm gray" data-act="copy" data-id="${s.id}">Copy link</button> <button class="btn sm gray" data-act="view" data-id="${s.id}">Details</button> <a class="btn sm gray" href="add-speaker.html?id=${s.id}">Edit</a></td></tr>`).join('')}</table>`:'<div class="empty">No guests yet. <a href="add-speaker.html">Add your first one</a>.</div>'}</div></div>`}
let calM=new Date();calM.setDate(1);
function calPg(){const all=mine(),y=calM.getFullYear(),m=calM.getMonth(),first=new Date(y,m,1).getDay(),n=new Date(y,m+1,0).getDate();let c='';
for(let i=0;i<first;i++)c+='<div class="cd off"></div>';
for(let d=1;d<=n;d++){const k=`${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
const ev=all.filter(s=>s.status==='Confirmed'?s.date===k:(s.dates||[]).includes(k));
c+=`<div class="cd"><b>${d}</b>${ev.map(s=>`<div class="ce ${s.status==='Confirmed'?'ok':'wait'}" data-act="view" data-id="${s.id}">${esc(s.name)}</div>`).join('')}</div>`}
return `<div class="dash"><div class="top"><h1>${calM.toLocaleDateString('en-US',{month:'long',year:'numeric'})}</h1><div><button class="btn gray sm" data-act="cal" data-d="-1">‹</button> <button class="btn gray sm" data-act="cal" data-d="1">›</button> <a class="btn sm" href="add-speaker.html">+ Add guest</a></div></div><div class="cal">${['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d=>`<div class="ch">${d}</div>`).join('')}${c}</div><p class="note">Solid green = confirmed · Dashed = date offered, awaiting reply</p></div>`}
document.addEventListener('click',e=>{const t=e.target.closest('[data-act]');if(!t)return;
if(t.dataset.act==='cal'){calM.setMonth(calM.getMonth()+ +t.dataset.d);route()}
if(t.dataset.act==='csv'){const r=[['Name','Email','Company','Reps','Event','Date','Plate','Dietary','Status'],...mine().map(s=>[s.name,s.email,s.company||'',s.headcount||'',s.course,s.date,s.plate||'',s.diet||'',s.status])];
const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([r.map(x=>x.map(c=>'"'+String(c).replace(/"/g,'""')+'"').join(',')).join('\n')],{type:'text/csv'}));a.download='speakers.csv';a.click()}});
/* ============ ROUTER (one file per page, set by <body data-page>) ============ */
const PG={home,pricing,contact,signup,login,checkout,dashboard:dash,speakers:speakersPg,'add-speaker':addPg,'bulk-add':bulkPg,calendar:calPg,speaker:speakerPortal};
const PRIV=['checkout','dashboard','speakers','add-speaker','bulk-add','calendar'];
async function route(){await loadData();
const p=document.body.dataset.page,u=me(),q=new URLSearchParams(location.search),arg=q.get('t')||q.get('id');
if(PRIV.includes(p)&&!u&&sessionStorage.getItem('jl')){sessionStorage.removeItem('jl');const dg={...window.DIAG,supabaseConfigured:!!CONFIG.supabaseUrl,libraryLoaded:!!window.supabase,usingSupabase:!!SB};$('#app').innerHTML='<div class="form"><h1>Login check</h1><p class="lead">Copy this box and send it to Claude:</p><pre style="white-space:pre-wrap;background:#f5f5f7;padding:14px;border-radius:12px">'+esc(JSON.stringify(dg,null,1))+'</pre><p class="note"><a href="login.html">Back to login</a></p></div>';return}
if(PRIV.includes(p)&&!u&&window.NOPROF){$('#app').innerHTML='<div class="form"><h1>Account setup incomplete</h1><p class="lead">You are logged in, but your profile row is missing in the database. Run the profile fix SQL from the guide, then <a data-act="logout">log out</a> and log in again.</p></div>';return}
if(PRIV.includes(p)){if(!u){location.href='login.html';return}if(p!=='checkout'&&!u.trialEnds){location.href='checkout.html';return}}
if(u)sessionStorage.removeItem('jl');$('#app').innerHTML=PG[p](arg);
if(p==='add-speaker'&&arg){const s=speakers().find(x=>x.id===arg),f=$('form[data-act=addsp]');
if(s&&f){f.dataset.edit=arg;[...f.elements].forEach(el=>{if(el.name&&s[el.name]!=null)el.value=s[el.name]});['d1','d2','d3'].forEach((k,i)=>f.elements[k].value=(s.dates||[])[i]||'');recToggle(f)}}
$('#navAuth').innerHTML=u?'<a href="dashboard.html">Dashboard</a><a class="nav-sp" href="speakers.html">Guests</a><a class="nav-sp" href="calendar.html">Calendar</a><a class="nav-sp" data-act="logout">Log out</a>':'<a href="login.html">Log in</a><a class="btn sm nav-sp" href="signup.html">Start free trial</a>';
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
const {data:r}=await SB.from('speakers').select('*').order('created_at',{ascending:false});
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
else if(CONFIG.formEndpoint){await fetch(CONFIG.formEndpoint,{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify(d)})}
else LS.set('contact',[...LS.get('contact',[]),d]);
f.reset();return msg("Thanks! We'll be in touch shortly.",1)}
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
const row={name:d.name,email:d.email,title:d.title,type:d.type,course:d.course,host:d.host,topic:d.topic,about:d.about,room:d.room,size:d.size,notes:d.notes,directions:d.directions,company:d.company||'',headcount:d.headcount||'',reps:d.reps||'',audience:d.audience||'',food:d.food||'',dates:[d.d1,d.d2,d.d3].filter(Boolean)};
if(d.date){row.date=d.date;row.status='Confirmed'}
if(f.dataset.edit){await updSp(f.dataset.edit,row);location.href='dashboard.html';return}
const s=await addSp({status:'Invited',parking:'To arrange',...row});
$('#dlg').innerHTML=`<h2>Guest added</h2><p>${s.sent?'We emailed the invitation to '+esc(s.name)+'. ':''}You can also share this link. ${esc(s.name)} can add their details and update them any time:</p><pre>${plink(s.id)}</pre><a class="btn" href="dashboard.html">Go to dashboard</a>`;$('#dlg').showModal();return}
if(a==='portal'){
const id=f.dataset.id,s0=speakers().find(x=>x.id===id),photo=f.dataset.photo||'';
const p={date:d.date||s0.date||'',bio:d.bio,diet:d.diet,plate:d.plate,access:d.access,av:d.av,msg:d.msg,...(d.headcount!==undefined?{headcount:d.headcount,reps:d.reps,food:d.food}:{})};
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
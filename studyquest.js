
const KEY='studyquest_v1';
const seed={courses:[
{id:1,name:'Abnormal Psychology',icon:'🧠'},{id:2,name:'Cultural Psychology',icon:'🌍'},{id:3,name:'Principles of Learning',icon:'🧪'}
],current:1,chapters:[],resources:[],cards:[
{id:11,course:1,front:'What is differential diagnosis?',back:'The process of distinguishing among conditions that may produce similar symptoms.',tag:'Foundations',right:0,wrong:0},
{id:12,course:1,front:'Why does duration matter in diagnosis?',back:'Many syndromes require a particular duration and pattern; symptoms alone may be insufficient.',tag:'Assessment',right:0,wrong:0}
],questions:[
{id:21,course:1,prompt:'A symptom occurs only during substance use. What must be considered?',answer:'substance-induced',explain:'Substance or medication effects should be considered before assuming a primary disorder.'}
],mistakes:[]};
let data=JSON.parse(localStorage.getItem(KEY)||'null')||seed, cardIndex=0, cardBack=false, caseStep=0;
const $=id=>document.getElementById(id), esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
function save(){localStorage.setItem(KEY,JSON.stringify(data));render()}
function current(){return data.courses.find(c=>c.id===Number(data.current))}
function showTab(id){document.querySelectorAll('.tabpage').forEach(x=>x.classList.add('hide'));$(id).classList.remove('hide');document.querySelectorAll('.tabs button').forEach(b=>b.classList.toggle('on',b.dataset.tab===id))}
document.querySelectorAll('.tabs button').forEach(b=>b.onclick=()=>showTab(b.dataset.tab));
function addCourse(){let n=$('newCourse').value.trim();if(!n)return;data.courses.push({id:Date.now(),name:n,icon:$('courseEmoji').value.trim()||'📘'});$('newCourse').value='';save()}
function delCourse(id){if(!confirm('Delete this course and its StudyQuest material?'))return;['chapters','resources','cards','questions'].forEach(k=>data[k]=data[k].filter(x=>x.course!==id));data.courses=data.courses.filter(c=>c.id!==id);data.current=data.courses[0]?.id||null;save()}
function addChapter(){if(!data.current)return;data.chapters.push({id:Date.now(),course:Number(data.current),title:$('chapterTitle').value.trim()||'Untitled chapter',status:$('chapterStatus').value,objectives:$('chapterObjectives').value.trim()});$('chapterTitle').value='';$('chapterObjectives').value='';save()}
function addResource(){if(!data.current)return;data.resources.push({id:Date.now(),course:Number(data.current),title:$('resTitle').value.trim()||'Resource',url:$('resUrl').value.trim(),type:$('resType').value,notes:$('resNotes').value.trim(),watched:false});$('resTitle').value=$('resUrl').value=$('resNotes').value='';save()}
function addCard(){if(!data.current)return;data.cards.push({id:Date.now(),course:Number(data.current),front:$('cardFront').value.trim(),back:$('cardBack').value.trim(),tag:$('cardTag').value.trim(),right:0,wrong:0});$('cardFront').value=$('cardBack').value=$('cardTag').value='';save()}
function addQuestion(){if(!data.current)return;data.questions.push({id:Date.now(),course:Number(data.current),prompt:$('qPrompt').value.trim(),answer:$('qAnswer').value.trim(),explain:$('qExplain').value.trim()});$('qPrompt').value=$('qAnswer').value=$('qExplain').value='';save()}
function remove(kind,id){if(confirm('Delete this item?')){data[kind]=data[kind].filter(x=>x.id!==id);save()}}
function flipCard(){cardBack=!cardBack;renderCard()}
function deck(){return data.cards.filter(c=>c.course===Number(data.current))}
function nextCard(){let d=deck();if(d.length){cardIndex=(cardIndex+1)%d.length;cardBack=false;renderCard()}}
function prevCard(){let d=deck();if(d.length){cardIndex=(cardIndex-1+d.length)%d.length;cardBack=false;renderCard()}}
function rateCard(ok){let d=deck(),c=d[cardIndex];if(!c)return;if(ok)c.right++;else{c.wrong++;data.mistakes.push({id:Date.now(),course:c.course,text:`Flashcard: ${c.front}`,note:`Review: ${c.back}`})}save()}
function renderCard(){let d=deck(),c=d[cardIndex%d.length];$('flashcard').innerHTML=c?esc(cardBack?c.back:c.front):'Add cards to begin.';$('cardMeta').textContent=c?`${c.tag||'Unsorted'} · Known ${c.right} · Review ${c.wrong}`:''}
function answerQ(id,val){let q=data.questions.find(x=>x.id===id);let ok=val.trim().toLowerCase().includes(q.answer.toLowerCase());if(!ok)data.mistakes.push({id:Date.now(),course:q.course,text:q.prompt,note:q.explain||`Correct answer: ${q.answer}`});alert(ok?'Correct. Nicely caught.':`Not quite. ${q.explain||'Review the answer and try again.'}`);save()}
const caseStages=[
{q:'What should you investigate first?',opts:['Episode duration','Favorite color','Handedness'],correct:0,feed:'Duration helps distinguish a brief change from a sustained syndrome.'},
{q:'Which additional factor is essential?',opts:['Substance and medication use','Music preference','Birth order'],correct:0,feed:'Substances, medications, and medical conditions can imitate psychiatric symptoms.'},
{q:'What is the best final approach?',opts:['Choose a diagnosis immediately','Form a differential and identify missing evidence','Ignore functional impairment'],correct:1,feed:'Good reasoning weighs alternatives, exclusions, duration, context, and impairment.'}
];
function resetCase(){caseStep=0;renderCase()}
function chooseCase(i){let s=caseStages[caseStep],ok=i===s.correct;$('caseFeedback').classList.remove('hide');$('caseFeedback').innerHTML=(ok?'✓ ':'Review: ')+s.feed;if(!ok)data.mistakes.push({id:Date.now(),course:Number(data.current),text:s.q,note:s.feed});caseStep=Math.min(caseStep+1,caseStages.length);save();setTimeout(renderCase,700)}
function renderCase(){if(caseStep>=caseStages.length){$('caseOptions').innerHTML='<div class="item good"><b>Case complete.</b> You gathered duration, exclusions, and differential evidence before concluding.</div>';return}let s=caseStages[caseStep];$('caseOptions').innerHTML=`<h3>${esc(s.q)}</h3>`+s.opts.map((o,i)=>`<button class="choice" onclick="chooseCase(${i})">${esc(o)}</button>`).join('')}
function localTutor(){let p=$('tutorPrompt').value.trim(),m=$('tutorMode').value;if(!p){$('tutorReply').textContent='Add a concept or question first.';return}let lead={ 'Teach Me':'Start by defining the concept in one sentence. Then identify its mechanism, an example, and a common confusion.', 'Socratic Tutor':'Before I explain, what do you already believe is true about this topic, and what evidence supports that?', 'Quiz Coach':'Write three facts you can recall without notes. Then turn the weakest fact into a question.', 'Case Supervisor':'List the observations, missing information, alternative explanations, and the next best question.', 'Exam Professor':'State the learning objective, then answer it at definition, application, and comparison levels.', 'Study Rescue':'Name the exam date, topics, and weakest area. Prioritize active recall and one application set.'}[m];$('tutorReply').innerHTML=`<b>${esc(m)}</b><p>${esc(lead)}</p><p><b>Your topic:</b> ${esc(p)}</p><p class="muted">The hosted AI layer will turn this structured prompt into an interactive conversation.</p>`}
function render(){
$('courseSelect').innerHTML=data.courses.map(c=>`<option value="${c.id}" ${c.id===Number(data.current)?'selected':''}>${esc(c.icon)} ${esc(c.name)}</option>`).join('');
$('courseSelect').onchange=e=>{data.current=Number(e.target.value);cardIndex=0;save()};
$('courseList').innerHTML=data.courses.map(c=>`<div class="card"><h3>${esc(c.icon)} ${esc(c.name)}</h3><button class="btn primary" onclick="data.current=${c.id};save();showTab('dashboard')">Open</button> <button class="btn red" onclick="delCourse(${c.id})">Delete</button></div>`).join('');
let ch=data.chapters.filter(x=>x.course===Number(data.current));
$('chapterList').innerHTML=ch.length?ch.map(x=>`<div class="item"><b>${esc(x.title)}</b> <span class="pill">${esc(x.status)}</span><p class="muted">${esc(x.objectives)}</p><button class="btn red" onclick="remove('chapters',${x.id})">Delete</button></div>`).join(''):'<div class="item muted">No chapters yet.</div>';
$('pathList').innerHTML=ch.length?ch.map(x=>`<div class="item"><b>${esc(x.title)}</b><div class="muted">${esc(x.status)}</div></div>`).join(''):'<div class="item muted">Build your first learning path in Chapters.</div>';
let rs=data.resources.filter(x=>x.course===Number(data.current));
$('resourceList').innerHTML=rs.length?rs.map(x=>`<div class="item"><span class="pill">${esc(x.type)}</span> <b>${esc(x.title)}</b><p class="muted">${esc(x.notes)}</p>${x.url?`<a class="btn blue" target="_blank" rel="noopener" href="${esc(x.url)}">Open</a>`:''} <button class="btn red" onclick="remove('resources',${x.id})">Delete</button></div>`).join(''):'<div class="item muted">No resources yet.</div>';
let cd=deck();$('cardList').innerHTML=cd.map(x=>`<div class="item"><b>${esc(x.front)}</b><p class="muted">${esc(x.tag)}</p><button class="btn red" onclick="remove('cards',${x.id})">Delete</button></div>`).join('');renderCard();
let qs=data.questions.filter(x=>x.course===Number(data.current));$('practiceBox').innerHTML=qs.length?qs.map(q=>`<div class="item"><b>${esc(q.prompt)}</b><input id="ans${q.id}" placeholder="Type your answer"><button class="btn primary" onclick="answerQ(${q.id},$('ans${q.id}').value)">Check</button> <button class="btn red" onclick="remove('questions',${q.id})">Delete</button></div>`).join(''):'<div class="item muted">Add practice questions to begin.</div>';
let ms=data.mistakes.filter(x=>x.course===Number(data.current));$('mistakeList').innerHTML=ms.length?ms.slice().reverse().map(x=>`<div class="item"><b>${esc(x.text)}</b><p class="muted">${esc(x.note)}</p><button class="btn red" onclick="remove('mistakes',${x.id})">Delete</button></div>`).join(''):'<div class="item muted">No mistakes logged yet. Suspiciously pristine.</div>';
let mastered=ch.filter(x=>x.status==='Mastered').length, pct=ch.length?Math.round(mastered/ch.length*100):0;$('masteryBar').style.width=pct+'%';$('masteryText').textContent=pct+'% demonstrated';
$('recommendation').textContent=ms.length?'Review the newest item in your Mistake Journal.':cd.length?'Run a flashcard review and rate each card honestly.':'Add the first chapter and learning objective.';
$('snapshot').innerHTML=`<p><b>${ch.length}</b> chapters</p><p><b>${cd.length}</b> flashcards</p><p><b>${rs.length}</b> resources</p><p><b>${ms.length}</b> review items</p>`;
renderCase()
}
render();

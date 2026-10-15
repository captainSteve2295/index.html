const KEY='fittrack77.v1';
const defaults={profile:{name:'',age:21,sex:'unspecified',height:166,start:77,goal:65,activity:'sedentary'},weights:[],routine:{},workouts:{},officeMove:false};
let state=load();
function load(){try{return {...structuredClone(defaults),...JSON.parse(localStorage.getItem(KEY)||'{}')}}catch(e){return structuredClone(defaults)}}
function save(){localStorage.setItem(KEY,JSON.stringify(state))}
const $=id=>document.getElementById(id);
const routines=[
['6:30 AM','Wake up + water','Drink water and stretch gently for 5 minutes.'],
['7:15 AM','Eat breakfast','Choose one breakfast option in the Diet tab.'],
['9:00 AM','Start work','Keep water nearby; move briefly each hour.'],
['12:45 PM','Lunch + short walk','Eat a balanced meal and walk for 10 minutes if possible.'],
['4:00 PM','Planned snack','Choose fruit, curd, eggs or roasted chana.'],
['6:30–7:00 PM','Workout / walk','Follow today’s workout or take an easy walk.'],
['10:30 PM','Wind down','Aim for 7–9 hours of sleep.']
];
const meals=[
['7:00–7:30 AM','Breakfast','3 medium idlis + 1 bowl sambar + 2 boiled eggs. Alternative: 40–50 g oats + 200 ml milk + small banana + 2 eggs.','350–500 kcal • 20–25 g protein'],
['12:30–1:30 PM','Lunch','1 cup cooked rice (150–180 g) + 100–120 g cooked chicken or fish + 1–2 cups vegetables + ½–1 bowl sambar/dal.','500–650 kcal • 30–40 g protein'],
['4:00 PM','Office snack','Choose: 2 boiled eggs + fruit; OR 30 g roasted chana + 250 ml milk; OR plain curd + fruit.','180–300 kcal • 10–18 g protein'],
['7:00–8:00 PM','Dinner','2 medium chapatis OR 1 cup cooked rice + 2 eggs in a vegetable omelette OR 100 g cooked chicken/fish + vegetables.','450–600 kcal • 25–35 g protein'],
['If needed','Optional snack','Milk, curd or fruit if you need it to meet your energy needs. Count it in your daily total.','Portion depends on your needs']
];
const grains=[
['Monday','Idli + sambar + eggs','Rice','Chapati'],
['Tuesday','Oats + milk + eggs','Thinai / foxtail millet','Dosa + sambar'],
['Wednesday','Dosa + eggs','Rice','Chapati'],
['Thursday','Ragi dosa + sambar','Brown or red rice','Egg dosa'],
['Friday','Oats + milk','Rice','Chapati + chicken'],
['Saturday','Vegetable upma + eggs','Kambu or thinai','Rice + fish'],
['Sunday','Idli + sambar','Rice + chicken or fish','Chapati + dal']
];
const proteins=[
['1 large egg','6–7 g'],['100 g cooked chicken','27–31 g'],['100 g cooked fish','20–25 g'],['250 ml milk','~8 g'],['200 g plain curd','7–10 g'],['1 cup cooked dal','7–10 g'],['30 g roasted chana','~6 g']
];
const workouts=[
['Monday','20–25 min brisk walk + 10 min strength'],
['Tuesday','25–30 min brisk walk'],
['Wednesday','20 min walk + 10–15 min strength'],
['Thursday','25–30 min brisk walk + stretching'],
['Friday','20 min walk + 10–15 min strength'],
['Saturday','35–45 min comfortable walk'],
['Sunday','Rest or gentle walking']
];
const strength=[
['Squats','10 reps','Feet about shoulder-width; sit back as if lowering onto a chair.'],
['Wall push-ups','10 reps','Hands on wall, body straight; bend elbows and push back.'],
['Glute bridges','12 reps','Lie on back with knees bent; lift hips gently.'],
['Plank','15–20 seconds','Keep body aligned and breathe normally.']
];
function todayKey(){return new Date().toISOString().slice(0,10)}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function renderRoutine(){
 $('routineList').innerHTML=routines.map((r,i)=>`<label class="checkrow"><input type="checkbox" data-routine="${i}" ${state.routine[todayKey()]?.includes(i)?'checked':''}><span><strong>${r[0]} · ${r[1]}</strong><small>${r[2]}</small></span></label>`).join('');
 $('routineCount').textContent=`${(state.routine[todayKey()]||[]).length}/7`;
 $('routineList').querySelectorAll('[data-routine]').forEach(el=>el.addEventListener('change',()=>{const arr=state.routine[todayKey()]||[];const i=+el.dataset.routine;state.routine[todayKey()]=el.checked?[...new Set([...arr,i])]:arr.filter(x=>x!==i);save();renderRoutine()}));
}
function renderDiet(){
 $('mealList').innerHTML=meals.map(m=>`<div class="meal"><div class="time">${m[0]}</div><div><h3>${m[1]}</h3><p>${m[2]}</p><div class="kcal">${m[3]}</div></div></div>`).join('');
 $('grainList').innerHTML=grains.map(g=>`<div style="padding:10px 0;border-bottom:1px solid var(--line)"><strong>${g[0]}</strong><div class="muted">Breakfast: ${g[1]}<br>Lunch: ${g[2]}<br>Dinner: ${g[3]}</div></div>`).join('');
 $('proteinList').innerHTML=proteins.map(p=>`<div class="row" style="justify-content:space-between;padding:9px 0;border-bottom:1px solid var(--line)"><span>${p[0]}</span><strong>${p[1]}</strong></div>`).join('')+'<p class="muted">Food values vary by type and cooking. A starting goal of 90–110 g/day may be useful for a healthy adult while losing weight, but individual needs differ.</p>';
}
function renderWorkout(){
 $('weeklyWorkout').innerHTML=workouts.map((w,i)=>`<label class="checkrow"><input type="checkbox" data-workout="${i}" ${state.workouts[`${todayKey()}-${i}`]?'checked':''}><span><strong>${w[0]}</strong><small>${w[1]}</small></span></label>`).join('');
 const count=workouts.filter((_,i)=>state.workouts[`${todayKey()}-${i}`]).length;$('workoutCount').textContent=`${count}/7 days`;
 $('weeklyWorkout').querySelectorAll('[data-workout]').forEach(el=>el.addEventListener('change',()=>{state.workouts[`${todayKey()}-${el.dataset.workout}`]=el.checked;save();renderWorkout()}));
 $('strengthList').innerHTML=strength.map(s=>`<div class="checkrow"><span style="font-size:21px">💪</span><span><strong>${s[0]} · ${s[1]}</strong><small>${s[2]}</small></span></div>`).join('');
 $('officeMove').checked=!!state.officeMove;$('officeMove').onchange=()=>{state.officeMove=$('officeMove').checked;save()};
}
function sortedWeights(){return [...state.weights].sort((a,b)=>a.date.localeCompare(b.date))}
function currentWeight(){const arr=sortedWeights();return arr.length?arr[arr.length-1].weight:Number(state.profile.start)||77}
function renderProgress(){
 const arr=sortedWeights(),cur=currentWeight(),start=Number(state.profile.start)||77,goal=Number(state.profile.goal)||65;
 $('heroWeight').textContent=cur.toFixed(1);$('progressText').textContent=`Goal: ${goal} kg`;
 const progress=Math.max(0,Math.min(100,((start-cur)/(start-goal||1))*100));$('progressFill').style.width=progress+'%';
 $('lossMetric').textContent=(start-cur>=0?'':'−')+Math.abs(start-cur).toFixed(1)+' kg';
 $('remainingMetric').textContent=Math.max(0,cur-goal).toFixed(1)+' kg';
 $('weightHistory').innerHTML=arr.length?arr.slice().reverse().slice(0,10).map(w=>`<div class="row" style="justify-content:space-between;padding:10px 0;border-bottom:1px solid var(--line)"><span>${new Date(w.date+'T12:00:00').toLocaleDateString(undefined,{day:'numeric',month:'short',year:'numeric'})}</span><strong>${w.weight.toFixed(1)} kg</strong><button class="delete" data-delete="${w.date}">Delete</button></div>`).join(''):'<div class="empty">No weight entries yet. Add your first measurement above.</div>';
 $('weightHistory').querySelectorAll('[data-delete]').forEach(b=>b.onclick=()=>{state.weights=state.weights.filter(w=>w.date!==b.dataset.delete);save();renderProgress()});
 const recent=arr.slice(-7);const values=recent.map(w=>w.weight),min=values.length?Math.min(...values)-1:0,max=values.length?Math.max(...values)+1:1;
 $('weightChart').innerHTML=recent.length?recent.map((w,i)=>`<div class="barwrap"><div class="bar ${i===recent.length-1?'latest':''}" style="height:${Math.max(6,((w.weight-min)/(max-min))*72)}px"></div>${new Date(w.date+'T12:00:00').toLocaleDateString(undefined,{day:'numeric',month:'short'})}<br>${w.weight.toFixed(1)}</div>`).join(''):'<div class="empty" style="width:100%">Your chart will appear after you log your weight.</div>';
}
function fillProfile(){const p=state.profile;$('nameInput').value=p.name||'';$('ageInput').value=p.age||21;$('sexInput').value=p.sex||'unspecified';$('heightInput').value=p.height||166;$('startInput').value=p.start||77;$('goalInput').value=String(p.goal||65);$('activityInput').value=p.activity||'sedentary';}
function saveProfile(){const p={name:$('nameInput').value.trim(),age:+$('ageInput').value||21,sex:$('sexInput').value,height:+$('heightInput').value||166,start:+$('startInput').value||77,goal:+$('goalInput').value,activity:$('activityInput').value};if(p.height<100||p.height>230||p.start<30||p.start>300||p.goal<30||p.goal>=p.start){$('profileMessage').textContent='Check height and weight values. Goal weight should be below starting weight.';return}state.profile=p;save();$('profileMessage').textContent='Profile saved on this device.';renderAll();}
function renderAll(){const p=state.profile;$('greeting').textContent=p.name?`You’ve got this, ${p.name}!`:'Let’s build healthy habits.';$('todayDate').textContent=new Date().toLocaleDateString(undefined,{weekday:'long',day:'numeric',month:'long'});$('targetLabel').textContent=`${p.goal===60?'60':p.goal===65?'65':p.goal} kg`;renderRoutine();renderDiet();renderWorkout();renderProgress();fillProfile();}
function showTab(tab){document.querySelectorAll('.section').forEach(s=>s.classList.toggle('active',s.id===tab));document.querySelectorAll('[data-tab]').forEach(b=>b.classList.toggle('active',b.dataset.tab===tab));window.scrollTo({top:0,behavior:'smooth'})}
document.querySelectorAll('[data-tab]').forEach(b=>b.addEventListener('click',()=>showTab(b.dataset.tab)));
$('saveWeight').onclick=()=>{const w=Number($('weightInput').value);if(!w||w<30||w>300){$('weightMessage').textContent='Enter a valid weight in kg.';return}const date=todayKey();state.weights=state.weights.filter(x=>x.date!==date);state.weights.push({date,weight:w});save();$('weightMessage').textContent='Weight saved on this device.';$('weightInput').value='';renderProgress()};
$('saveProfile').onclick=saveProfile;
$('exportData').onclick=()=>{const blob=new Blob([JSON.stringify(state,null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='fittrack77-backup.json';a.click();URL.revokeObjectURL(url)};
$('resetData').onclick=()=>{if(confirm('Delete all FitTrack 77 profile, checklist and weight history stored on this device?')){localStorage.removeItem(KEY);state=structuredClone(defaults);renderAll();$('profileMessage').textContent='App data reset.'}};
if('serviceWorker' in navigator && location.protocol.startsWith('http'))navigator.serviceWorker.register('./sw.js').catch(()=>{});
renderAll();
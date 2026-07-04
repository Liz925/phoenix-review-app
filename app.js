
(function(){
  var KEY='phoenix_review_app_v1_data';
  var state={reviews:[],thoughts:[],settings:{}};
  var selectedTags=[];
  var mood=3, energy=3;
  function $(id){return document.getElementById(id)}
  function today(){var d=new Date(); var m=String(d.getMonth()+1).padStart(2,'0'); var day=String(d.getDate()).padStart(2,'0'); return d.getFullYear()+'-'+m+'-'+day}
  function nowTime(){var d=new Date(); return String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0')}
  function esc(s){return String(s||'').replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
  function toast(msg){var t=$('toast'); if(!t) return; t.textContent=msg; t.classList.add('show'); setTimeout(function(){t.classList.remove('show')},1600)}
  function load(){try{var raw=localStorage.getItem(KEY); if(raw){state=JSON.parse(raw)||state}}catch(e){console.warn(e)} }
  function save(){try{localStorage.setItem(KEY,JSON.stringify(state)); return true}catch(e){console.warn(e); return false}}
  function nl(v){return (v||'').trim() || '未填写'}
  function collectReview(){
    return {id:'r_'+Date.now(),date:$('r_date').value||today(),mood:mood,energy:energy,tags:selectedTags.slice(),
      done:$('r_done').value,valuable:$('r_valuable').value,job:$('r_job').value,ability:$('r_ability').value,
      body:$('r_body').value,emotion:$('r_emotion').value,low:$('r_low').value,tomorrow:$('r_tomorrow').value,
      createdAt:new Date().toISOString()}
  }
  function promptForReview(r){
    return '【Phoenix 每日复盘】\n日期：'+r.date+'\n情绪：'+r.mood+'/5｜精力：'+r.energy+'/5\n标签：'+(r.tags&&r.tags.length?r.tags.join('、'):'无')+'\n\n1. 今天做了什么：\n'+nl(r.done)+'\n\n2. 今天真正有价值的动作：\n'+nl(r.valuable)+'\n\n3. 求职 / 面试 / 投递推进：\n'+nl(r.job)+'\n\n4. 案例库 / 专业能力 / 英语：\n'+nl(r.ability)+'\n\n5. 身体 / 健身 / 作息：\n'+nl(r.body)+'\n\n6. 情绪 / 家庭边界 / 社交状态：\n'+nl(r.emotion)+'\n\n7. 低价值消耗：\n'+nl(r.low)+'\n\n8. 明天最重要的3件事：\n'+nl(r.tomorrow)+'\n\n请你基于以上内容，按“行动质量、低价值消耗、情绪信号、是否偏离求职跃迁主线、明天1-3个关键动作”帮我复盘，并直接给出可执行建议。';
  }
  function promptForThought(t){
    return '【Phoenix 随机想法结构化】\n日期：'+t.date+' '+t.time+'\n分类：'+t.type+'\n\n原始想法：\n'+nl(t.text)+'\n\n我初步判断背后的信号：\n'+nl(t.signal)+'\n\n下一步：\n'+nl(t.next)+'\n\n请帮我判断这个想法属于行动线索、内容素材、情绪信号还是低价值噪音，并把它结构化成：真实信号、可执行行动、是否适合发小红书/抖音、推荐表达版本。';
  }
  function bindTabs(){
    Array.prototype.forEach.call(document.querySelectorAll('.tab'),function(btn){btn.onclick=function(){
      Array.prototype.forEach.call(document.querySelectorAll('.tab'),function(b){b.classList.remove('active')});
      Array.prototype.forEach.call(document.querySelectorAll('.view'),function(v){v.classList.remove('active')});
      btn.classList.add('active'); $(btn.getAttribute('data-view')).classList.add('active');
      renderHistory(); if(btn.getAttribute('data-view')==='data') renderData();
    }});
  }
  function bindSegments(){
    function seg(id, setter){ Array.prototype.forEach.call(document.querySelectorAll('[data-seg="'+id+'"]'),function(b){b.onclick=function(){Array.prototype.forEach.call(document.querySelectorAll('[data-seg="'+id+'"]'),function(x){x.classList.remove('active')}); b.classList.add('active'); setter(parseInt(b.getAttribute('data-val'),10));}})}
    seg('mood',function(v){mood=v}); seg('energy',function(v){energy=v});
  }
  function bindChips(){
    Array.prototype.forEach.call(document.querySelectorAll('.chip[data-tag]'),function(c){c.onclick=function(){var tag=c.getAttribute('data-tag'); var i=selectedTags.indexOf(tag); if(i>=0){selectedTags.splice(i,1);c.classList.remove('active')}else{selectedTags.push(tag);c.classList.add('active')}}})
  }
  function fillToday(){ $('r_date').value=today(); $('t_date').value=today(); $('t_time').value=nowTime(); $('today_text').textContent=today(); }
  function clearReview(){['r_done','r_valuable','r_job','r_ability','r_body','r_emotion','r_low','r_tomorrow'].forEach(function(id){$(id).value=''})}
  function clearThought(){['t_text','t_signal','t_next'].forEach(function(id){$(id).value=''}); $('t_type').value='行动线索'; $('t_time').value=nowTime()}
  function copyText(txt){
    if(navigator.clipboard && window.isSecureContext){return navigator.clipboard.writeText(txt).then(function(){toast('已复制')}).catch(function(){fallbackCopy(txt)})}
    fallbackCopy(txt)
  }
  function fallbackCopy(txt){var ta=document.createElement('textarea');ta.value=txt;ta.style.position='fixed';ta.style.left='-9999px';document.body.appendChild(ta);ta.focus();ta.select();try{document.execCommand('copy');toast('已复制')}catch(e){toast('复制失败，已生成文本')}document.body.removeChild(ta)}
  function download(filename, text, type){var a=document.createElement('a');a.href=URL.createObjectURL(new Blob([text],{type:type||'text/plain'}));a.download=filename;document.body.appendChild(a);a.click();setTimeout(function(){URL.revokeObjectURL(a.href);document.body.removeChild(a)},100)}
  function renderHistory(){
    var box=$('history_list'); if(!box) return; var all=[];
    state.reviews.forEach(function(r){all.push({kind:'review',date:r.date,time:'',title:'每日复盘',body:(r.valuable||r.done||'').slice(0,80),obj:r})});
    state.thoughts.forEach(function(t){all.push({kind:'thought',date:t.date,time:t.time,title:'随机想法 · '+t.type,body:(t.text||'').slice(0,80),obj:t})});
    all.sort(function(a,b){return (b.date+' '+b.time).localeCompare(a.date+' '+a.time)});
    if(!all.length){box.innerHTML='<div class="empty">还没有记录。先从“今天”或“想法”开始。</div>';return}
    box.innerHTML=all.slice(0,40).map(function(x,i){return '<div class="item"><div class="between"><div><div class="item-title">'+esc(x.title)+'</div><div class="small">'+esc(x.date+(x.time?' '+x.time:''))+'</div></div><button class="chip blue" data-copy-history="'+i+'">复制</button></div><div class="small" style="margin-top:8px">'+esc(x.body||'未填写')+'</div></div>'}).join('');
    Array.prototype.forEach.call(box.querySelectorAll('[data-copy-history]'),function(btn){btn.onclick=function(){var x=all[parseInt(btn.getAttribute('data-copy-history'),10)]; copyText(x.kind==='review'?promptForReview(x.obj):promptForThought(x.obj))}})
  }
  function renderData(){
    $('stat_reviews').textContent=state.reviews.length; $('stat_thoughts').textContent=state.thoughts.length;
    var last='无'; var dates=state.reviews.map(function(r){return r.date}).sort(); if(dates.length) last=dates[dates.length-1]; $('stat_last').textContent=last;
  }
  function weeklyText(){
    var end=$('w_end').value||today(); var days=parseInt($('w_days').value||'7',10); var startDate=new Date(end+'T00:00:00'); startDate.setDate(startDate.getDate()-days+1); var start=startDate.toISOString().slice(0,10);
    var rs=state.reviews.filter(function(r){return r.date>=start && r.date<=end}).sort(function(a,b){return a.date.localeCompare(b.date)});
    var ts=state.thoughts.filter(function(t){return t.date>=start && t.date<=end}).sort(function(a,b){return (a.date+a.time).localeCompare(b.date+b.time)});
    var avg=function(arr,key){if(!arr.length)return '无'; return (arr.reduce(function(s,x){return s+(Number(x[key])||0)},0)/arr.length).toFixed(1)};
    return '【Phoenix 阶段复盘】\n范围：'+start+' 至 '+end+'（'+days+'天）\n记录天数：'+rs.length+'｜随机想法：'+ts.length+'｜平均情绪：'+avg(rs,'mood')+'/5｜平均精力：'+avg(rs,'energy')+'/5\n\n一、每日记录摘要：\n'+(rs.length?rs.map(function(r){return '\n【'+r.date+'】\n有效动作：'+nl(r.valuable)+'\n求职推进：'+nl(r.job)+'\n能力建设：'+nl(r.ability)+'\n低价值消耗：'+nl(r.low)+'\n明日计划：'+nl(r.tomorrow)}).join('\n'):'未记录')+'\n\n二、随机想法摘要：\n'+(ts.length?ts.map(function(t){return '\n【'+t.date+' '+t.time+'｜'+t.type+'】'+nl(t.text)+'\n信号：'+nl(t.signal)+'\n下一步：'+nl(t.next)}).join('\n'):'未记录')+'\n\n请你帮我做阶段复盘：\n1. 判断这段时间真正有效的行动；\n2. 找出低价值消耗和反复出现的情绪噪音；\n3. 判断我是否靠近技术采购/战略采购/海外供应链主线；\n4. 给出下一阶段最重要的3个动作；\n5. 帮我压缩成一份可以放进Apple备忘录的复盘结论。';
  }
  function bindActions(){
    $('save_review').onclick=function(){var r=collectReview(); state.reviews=state.reviews.filter(function(x){return x.date!==r.date}); state.reviews.push(r); save(); toast('今日复盘已保存'); renderData();};
    $('generate_review').onclick=function(){var r=collectReview(); var txt=promptForReview(r); $('chatgpt_output').textContent=txt; $('chatgpt_card').classList.remove('hidden'); location.hash='output';};
    $('copy_review').onclick=function(){copyText($('chatgpt_output').textContent||promptForReview(collectReview()))};
    $('clear_review').onclick=function(){clearReview(); toast('已清空本页输入')};
    $('save_thought').onclick=function(){var t={id:'t_'+Date.now(),date:$('t_date').value||today(),time:$('t_time').value||nowTime(),type:$('t_type').value,text:$('t_text').value,signal:$('t_signal').value,next:$('t_next').value,createdAt:new Date().toISOString()}; state.thoughts.push(t); save(); $('thought_output').textContent=promptForThought(t); $('thought_output_card').classList.remove('hidden'); clearThought(); toast('想法已保存')};
    $('copy_thought').onclick=function(){var latest=state.thoughts[state.thoughts.length-1]; if(latest) copyText(promptForThought(latest)); else copyText(promptForThought({date:$('t_date').value,time:$('t_time').value,type:$('t_type').value,text:$('t_text').value,signal:$('t_signal').value,next:$('t_next').value}))};
    $('clear_thought').onclick=function(){clearThought(); toast('已清空')};
    $('w_end').value=today(); $('make_weekly').onclick=function(){var txt=weeklyText(); $('weekly_output').textContent=txt; $('weekly_card').classList.remove('hidden')};
    $('copy_weekly').onclick=function(){copyText($('weekly_output').textContent||weeklyText())};
    $('export_json').onclick=function(){download('phoenix-review-backup-'+today()+'.json',JSON.stringify(state,null,2),'application/json')};
    $('export_txt').onclick=function(){var txt='【Phoenix Review 全量导出】\n导出日期：'+today()+'\n\n复盘记录：\n'+state.reviews.map(promptForReview).join('\n\n---\n\n')+'\n\n随机想法：\n'+state.thoughts.map(promptForThought).join('\n\n---\n\n'); download('phoenix-review-export-'+today()+'.txt',txt,'text/plain')};
    $('import_file').onchange=function(e){var f=e.target.files&&e.target.files[0]; if(!f)return; var reader=new FileReader(); reader.onload=function(){try{var data=JSON.parse(reader.result); if(data.reviews&&data.thoughts){state=data; save(); renderData(); renderHistory(); toast('导入成功')}else toast('文件格式不对')}catch(err){toast('导入失败')}}; reader.readAsText(f)};
    $('clear_all').onclick=function(){if(confirm('确认清空所有本地记录？请先导出备份。')){state={reviews:[],thoughts:[],settings:{}}; save(); renderData(); renderHistory(); toast('已清空')}};
  }
  function init(){load(); fillToday(); bindTabs(); bindSegments(); bindChips(); bindActions(); renderData(); renderHistory();}
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init); else init();
})();

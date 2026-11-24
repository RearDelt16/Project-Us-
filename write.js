/* Adds a "Write to me" tile. Her letters are emailed to you through Web3Forms. Needs "web3formsKey" in site.json. */
(()=>{
const st=document.createElement('style');
st.textContent='.wr textarea,.wr input{font:inherit;color:var(--ink);background:var(--card);border:1.5px solid var(--line);border-radius:14px;padding:12px 14px;width:100%;margin-bottom:12px}.wr textarea{min-height:220px;font-family:Caveat,cursive;font-size:24px;line-height:1.3;resize:vertical}';
document.head.appendChild(st);

const key=()=>(D.site&&D.site.web3formsKey)||'';
if(!TILES.some(t=>t[0]==='write'))TILES.push(['write','✍️','Write to me']);

R.write=()=>{
  const head='<div class="head"><h2>Write to me</h2><p>Say anything you like. I’ll read every word.</p></div>';
  if(!key())return head+'<p class="empty">This page isn’t set up yet.</p>';
  const sent=LS.get('sent',[]);
  return head+'<div class="wr"><input id="wt" placeholder="Title (optional)"><textarea id="wx" placeholder="Dear you…"></textarea><div class="center"><button class="btn" data-act="send">Send</button><div class="hint" id="ws"></div></div></div>'+
    (sent.length?'<div class="sub">Letters you’ve sent</div>'+sent.map(s=>`<article class="card"><time>${esc(s.when)}</time><h3>${esc(s.title)}</h3><p>${esc(s.text)}</p></article>`).join(''):'');
};

document.addEventListener('click',async e=>{
  const b=e.target.closest('[data-act="send"]');if(!b)return;
  const x=$('#wx').value.trim(),t=$('#wt').value.trim()||'A letter',s=$('#ws');
  if(!x){s.textContent='Write something first 💕';return}
  b.disabled=true;s.textContent='Sending…';
  try{
    const r=await fetch('https://api.web3forms.com/submit',{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},
      body:JSON.stringify({access_key:key(),subject:'💌 '+t,from_name:'Your website',message:x})});
    const j=await r.json();
    if(!r.ok||j.success===false)throw 0;
    const sent=LS.get('sent',[]);
    sent.unshift({title:t,text:x,when:new Date().toLocaleDateString('en-AU',{day:'numeric',month:'long',year:'numeric'})});
    LS.set('sent',sent);render();$('#ws').textContent='Sent 💌 I’ll read it soon.';
  }catch(err){s.textContent='Couldn’t send. Please try again.';b.disabled=false}
});
})();

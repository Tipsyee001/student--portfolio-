(function(){
var root=document.documentElement,$=function(i){return document.getElementById(i);};
/* theme */
var tb=$('themeToggle');
function setBtn(){if(!tb)return;var l=root.dataset.theme==='light';tb.innerHTML=l?'&#9790;':'&#9728;';tb.setAttribute('aria-label',l?'Switch to dark theme':'Switch to light theme');}
setBtn();
if(tb)tb.addEventListener('click',function(){var n=root.dataset.theme==='light'?'dark':'light';root.dataset.theme=n;try{localStorage.setItem('theme',n);}catch(e){}setBtn();});
/* menu */
var mb=$('menuBtn'),menu=$('menu');
if(mb&&menu)mb.addEventListener('click',function(){var o=menu.classList.toggle('open');mb.setAttribute('aria-expanded',o);});
/* cursor glow */
var glow=$('glow');
if(glow&&!window.matchMedia('(prefers-reduced-motion: reduce)').matches){
  var x=0,y=0,t=false;
  var move=function(a,b){x=a;y=b;glow.classList.add('on');if(!t){t=true;requestAnimationFrame(function(){glow.style.transform='translate('+x+'px,'+y+'px)';t=false;});}};
  window.addEventListener('pointermove',function(e){move(e.clientX,e.clientY);});
  window.addEventListener('touchstart',function(e){move(e.touches[0].clientX,e.touches[0].clientY);},{passive:true});
  window.addEventListener('touchmove',function(e){move(e.touches[0].clientX,e.touches[0].clientY);},{passive:true});
  document.addEventListener('mouseleave',function(){glow.classList.remove('on');});
}
/* contact form */
var form=$('contactForm');
if(form){
  var status=$('formStatus');
  var rules={
    fullName:function(v){return v.trim()===''?'Enter your name.':'';},
    email:function(v){return v.trim()===''?'Enter your email address.':(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())?'':'Enter a valid email, like name@example.com.');},
    phone:function(v){return v.trim()===''?'Enter your phone number.':(/^\d+$/.test(v.trim())?'':'Use digits only, with no spaces, + or dashes.');},
    message:function(v){return v.trim()===''?'Enter a message.':'';}
  };
  var check=function(f){var el=$(f),m=rules[f](el.value);$(f+'Error').textContent=m;el.closest('.field').classList.toggle('invalid',m!=='');return m==='';};
  Object.keys(rules).forEach(function(f){$(f).addEventListener('input',function(){check(f);});});
  form.addEventListener('submit',function(e){
    e.preventDefault();
    var ok=Object.keys(rules).map(check).every(Boolean);
    if(ok){status.className='ok';status.textContent='Thank you, '+$('fullName').value.trim()+'. Your message has been received.';form.reset();}
    else{status.className='bad';status.textContent='Please correct the highlighted fields.';var first=form.querySelector('.invalid input, .invalid textarea');if(first)first.focus();}
  });
}
/* planner */
var tf=$('taskForm');
if(tf){
  var input=$('taskInput'),course=$('courseSelect'),list=$('taskList'),counter=$('taskCounter'),msg=$('taskMsg'),tasks=[];
  try{tasks=JSON.parse(localStorage.getItem('planner-tasks'))||[];}catch(e){tasks=[];}
  var save=function(){try{localStorage.setItem('planner-tasks',JSON.stringify(tasks));}catch(e){}};
  var render=function(){
    list.innerHTML='';
    if(!tasks.length){var li=document.createElement('li');li.className='empty';li.textContent='No tasks yet. Add your first task above.';list.appendChild(li);}
    tasks.forEach(function(t){
      var li=document.createElement('li');if(t.done)li.classList.add('done');
      var cb=document.createElement('input');cb.type='checkbox';cb.checked=t.done;cb.setAttribute('aria-label','Mark "'+t.text+'" as completed');
      cb.addEventListener('change',function(){t.done=!t.done;save();render();});
      var lb=document.createElement('span');lb.className='label';lb.textContent=t.text;
      var s=document.createElement('small');s.className='course';s.textContent=t.course;lb.appendChild(s);
      var del=document.createElement('button');del.className='del';del.type='button';del.textContent='Delete';del.setAttribute('aria-label','Delete "'+t.text+'"');
      del.addEventListener('click',function(){tasks=tasks.filter(function(x){return x.id!==t.id;});save();render();});
      li.appendChild(cb);li.appendChild(lb);li.appendChild(del);list.appendChild(li);
    });
    var left=tasks.filter(function(t){return !t.done;}).length;
    counter.textContent=left+(left===1?' task remaining':' tasks remaining');
  };
  tf.addEventListener('submit',function(e){
    e.preventDefault();var text=input.value.trim();
    if(!text){msg.textContent='Enter a task before adding it.';input.focus();return;}
    msg.textContent='';tasks.push({id:Date.now(),text:text,course:course.value,done:false});save();render();input.value='';input.focus();
  });
  $('clearCompleted').addEventListener('click',function(){tasks=tasks.filter(function(t){return !t.done;});save();render();});
  render();
}
})();

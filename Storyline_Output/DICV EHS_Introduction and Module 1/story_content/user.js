window.InitUserScripts = function()
{
var player = GetPlayer();
var object = player.object;
var once = player.once;
var addToTimeline = player.addToTimeline;
var setVar = player.SetVar;
var getVar = player.GetVar;
var update = player.update;
var pointerX = player.pointerX;
var pointerY = player.pointerY;
var showPointer = player.showPointer;
var hidePointer = player.hidePointer;
var slideWidth = player.slideWidth;
var slideHeight = player.slideHeight;
var getKeyDown = player.getKeyDown;
var keydown = player.keydown;
var keyup = player.keyup;
window.Script2 = function()
{
  (function(r){if(r.__H1__)return;r.__H1__=1;r.addEventListener('message',function(e){var d=e&&e.data;if(!d||d.source!=='DICV_HEADER1_WEBOBJECT'||d.type!=='HEADER1_READY')return;r.__DICV_HEADER1_WIN__=e.source;try{var p=GetPlayer();e.source.postMessage({source:'DICV_STORYLINE_HOST',type:'HEADER1_SET_PROFILE',profile:(p?p.GetVar('HeaderProfile'):'A')||'A'},'*');e.source.postMessage({source:'DICV_STORYLINE_HOST',type:'HEADER1_SYNC'},'*');}catch(x){}});})(window);
}

window.Script3 = function()
{
  (function(r){if(r.DICV_CourseMapHost)return;var C=[{id:1,p:[],t:[{m:101,p:[]},{m:103,p:[101]},{m:102,p:[103]},{m:104,p:[102]},{m:105,p:[104]},{m:106,p:[105]}]}];function b(v){return v===true||v==='true'||v===1||v==='1';}function pr(s){try{var o=JSON.parse(s||'{}');return{v:1,t:(o&&o.t)||{},last:o.last||null};}catch(e){return{v:1,t:{},last:null};}}function rd(){var p=GetPlayer();return{nm:b(p.GetVar('NavigationMode')),pr:pr(p.GetVar('CourseProgressData'))};}function pf(t,pl){var fs=document.querySelectorAll('iframe');for(var i=0;i<fs.length;i++)if(fs[i].contentWindow)fs[i].contentWindow.postMessage({source:'DICV_STORYLINE_HOST',type:t,payload:pl},'*');}r.addEventListener('message',function(e){var d=e&&e.data;if(!d||d.source!=='DICV_COURSEMAP_WEBOBJECT')return;var s=rd(),p=GetPlayer();if(d.type==='READY')e.source.postMessage({source:'DICV_STORYLINE_HOST',type:'STATE',payload:{navigationMode:s.nm,progress:s.pr}},'*');else if(d.type==='OPEN_MISSION'&&d.payload){var id=Number(d.payload.missionId),tp=C[0].t.filter(function(x){return x.m===id;})[0];if(!tp||(!s.nm&&tp.p.some(function(q){return Number(s.pr.t[String(q)])!==2;}))){e.source.postMessage({source:'DICV_STORYLINE_HOST',type:'NAVIGATION_DENIED',payload:{missionId:id,reason:'Complete prerequisite first.'}},'*');return;}s.pr.last=id;if(!s.pr.t[String(id)])s.pr.t[String(id)]=1;p.SetVar('CourseProgressData',JSON.stringify(s.pr));p.SetVar('RequestedMission',0);setTimeout(function(){p.SetVar('RequestedMission',id);},20);}else if(d.type==='CHANGE_MODE'){var nx=!s.nm;p.SetVar('NavigationMode',nx);pf('STATE',{navigationMode:nx,progress:s.pr});}});r.DICV_CourseMapHost={ok:1};})(window);
}

window.Script4 = function()
{
  (function (root) {
  try {
    var p = typeof root.GetPlayer === 'function' ? root.GetPlayer() : null;
    var prof = p ? (p.GetVar('HeaderProfile') || 'C') : 'C';
    if (root.__DICV_HEADER1_WIN__ && typeof root.__DICV_HEADER1_WIN__.postMessage === 'function') {
      root.__DICV_HEADER1_WIN__.postMessage({ source: 'DICV_STORYLINE_HOST', type: 'HEADER1_SET_PROFILE', profile: prof }, '*');
    }
  } catch (e) {}
})(window);
}

window.Script5 = function()
{
  (function(r){if(r.__H1__)return;r.__H1__=1;r.addEventListener('message',function(e){var d=e&&e.data;if(!d||d.source!=='DICV_HEADER1_WEBOBJECT'||d.type!=='HEADER1_READY')return;r.__DICV_HEADER1_WIN__=e.source;try{var p=GetPlayer();e.source.postMessage({source:'DICV_STORYLINE_HOST',type:'HEADER1_SET_PROFILE',profile:(p?p.GetVar('HeaderProfile'):'A')||'A'},'*');e.source.postMessage({source:'DICV_STORYLINE_HOST',type:'HEADER1_SYNC'},'*');}catch(x){}});})(window);
}

window.Script6 = function()
{
  (function(r){if(r.DICV_CourseMapHost)return;var C=[{id:1,p:[],t:[{m:101,p:[]},{m:103,p:[101]},{m:102,p:[103]},{m:104,p:[102]},{m:105,p:[104]},{m:106,p:[105]}]}];function b(v){return v===true||v==='true'||v===1||v==='1';}function pr(s){try{var o=JSON.parse(s||'{}');return{v:1,t:(o&&o.t)||{},last:o.last||null};}catch(e){return{v:1,t:{},last:null};}}function rd(){var p=GetPlayer();return{nm:b(p.GetVar('NavigationMode')),pr:pr(p.GetVar('CourseProgressData'))};}function pf(t,pl){var fs=document.querySelectorAll('iframe');for(var i=0;i<fs.length;i++)if(fs[i].contentWindow)fs[i].contentWindow.postMessage({source:'DICV_STORYLINE_HOST',type:t,payload:pl},'*');}r.addEventListener('message',function(e){var d=e&&e.data;if(!d||d.source!=='DICV_COURSEMAP_WEBOBJECT')return;var s=rd(),p=GetPlayer();if(d.type==='READY')e.source.postMessage({source:'DICV_STORYLINE_HOST',type:'STATE',payload:{navigationMode:s.nm,progress:s.pr}},'*');else if(d.type==='OPEN_MISSION'&&d.payload){var id=Number(d.payload.missionId),tp=C[0].t.filter(function(x){return x.m===id;})[0];if(!tp||(!s.nm&&tp.p.some(function(q){return Number(s.pr.t[String(q)])!==2;}))){e.source.postMessage({source:'DICV_STORYLINE_HOST',type:'NAVIGATION_DENIED',payload:{missionId:id,reason:'Complete prerequisite first.'}},'*');return;}s.pr.last=id;if(!s.pr.t[String(id)])s.pr.t[String(id)]=1;p.SetVar('CourseProgressData',JSON.stringify(s.pr));p.SetVar('RequestedMission',0);setTimeout(function(){p.SetVar('RequestedMission',id);},20);}else if(d.type==='CHANGE_MODE'){var nx=!s.nm;p.SetVar('NavigationMode',nx);pf('STATE',{navigationMode:nx,progress:s.pr});}});r.DICV_CourseMapHost={ok:1};})(window);
}

window.Script7 = function()
{
  (function (root) {
  try {
    var p = typeof root.GetPlayer === 'function' ? root.GetPlayer() : null;
    var prof = p ? (p.GetVar('HeaderProfile') || 'C') : 'C';
    if (root.__DICV_HEADER1_WIN__ && typeof root.__DICV_HEADER1_WIN__.postMessage === 'function') {
      root.__DICV_HEADER1_WIN__.postMessage({ source: 'DICV_STORYLINE_HOST', type: 'HEADER1_SET_PROFILE', profile: prof }, '*');
    }
  } catch (e) {}
})(window);
}

window.Script8 = function()
{
  (function(r){if(r.__H1__)return;r.__H1__=1;r.addEventListener('message',function(e){var d=e&&e.data;if(!d||d.source!=='DICV_HEADER1_WEBOBJECT'||d.type!=='HEADER1_READY')return;r.__DICV_HEADER1_WIN__=e.source;try{var p=GetPlayer();e.source.postMessage({source:'DICV_STORYLINE_HOST',type:'HEADER1_SET_PROFILE',profile:(p?p.GetVar('HeaderProfile'):'A')||'A'},'*');e.source.postMessage({source:'DICV_STORYLINE_HOST',type:'HEADER1_SYNC'},'*');}catch(x){}});})(window);
}

window.Script9 = function()
{
  (function(r){if(r.DICV_CourseMapHost)return;var C=[{id:1,p:[],t:[{m:101,p:[]},{m:103,p:[101]},{m:102,p:[103]},{m:104,p:[102]},{m:105,p:[104]},{m:106,p:[105]}]}];function b(v){return v===true||v==='true'||v===1||v==='1';}function pr(s){try{var o=JSON.parse(s||'{}');return{v:1,t:(o&&o.t)||{},last:o.last||null};}catch(e){return{v:1,t:{},last:null};}}function rd(){var p=GetPlayer();return{nm:b(p.GetVar('NavigationMode')),pr:pr(p.GetVar('CourseProgressData'))};}function pf(t,pl){var fs=document.querySelectorAll('iframe');for(var i=0;i<fs.length;i++)if(fs[i].contentWindow)fs[i].contentWindow.postMessage({source:'DICV_STORYLINE_HOST',type:t,payload:pl},'*');}r.addEventListener('message',function(e){var d=e&&e.data;if(!d||d.source!=='DICV_COURSEMAP_WEBOBJECT')return;var s=rd(),p=GetPlayer();if(d.type==='READY')e.source.postMessage({source:'DICV_STORYLINE_HOST',type:'STATE',payload:{navigationMode:s.nm,progress:s.pr}},'*');else if(d.type==='OPEN_MISSION'&&d.payload){var id=Number(d.payload.missionId),tp=C[0].t.filter(function(x){return x.m===id;})[0];if(!tp||(!s.nm&&tp.p.some(function(q){return Number(s.pr.t[String(q)])!==2;}))){e.source.postMessage({source:'DICV_STORYLINE_HOST',type:'NAVIGATION_DENIED',payload:{missionId:id,reason:'Complete prerequisite first.'}},'*');return;}s.pr.last=id;if(!s.pr.t[String(id)])s.pr.t[String(id)]=1;p.SetVar('CourseProgressData',JSON.stringify(s.pr));p.SetVar('RequestedMission',0);setTimeout(function(){p.SetVar('RequestedMission',id);},20);}else if(d.type==='CHANGE_MODE'){var nx=!s.nm;p.SetVar('NavigationMode',nx);pf('STATE',{navigationMode:nx,progress:s.pr});}});r.DICV_CourseMapHost={ok:1};})(window);
}

window.Script10 = function()
{
  (function (root) {
  try {
    var p = typeof root.GetPlayer === 'function' ? root.GetPlayer() : null;
    var prof = p ? (p.GetVar('HeaderProfile') || 'C') : 'C';
    if (root.__DICV_HEADER1_WIN__ && typeof root.__DICV_HEADER1_WIN__.postMessage === 'function') {
      root.__DICV_HEADER1_WIN__.postMessage({ source: 'DICV_STORYLINE_HOST', type: 'HEADER1_SET_PROFILE', profile: prof }, '*');
    }
  } catch (e) {}
})(window);
}

window.Script11 = function()
{
  (function(r){if(r.__H1__)return;r.__H1__=1;r.addEventListener('message',function(e){var d=e&&e.data;if(!d||d.source!=='DICV_HEADER1_WEBOBJECT'||d.type!=='HEADER1_READY')return;r.__DICV_HEADER1_WIN__=e.source;try{var p=GetPlayer();e.source.postMessage({source:'DICV_STORYLINE_HOST',type:'HEADER1_SET_PROFILE',profile:(p?p.GetVar('HeaderProfile'):'A')||'A'},'*');e.source.postMessage({source:'DICV_STORYLINE_HOST',type:'HEADER1_SYNC'},'*');}catch(x){}});})(window);
}

window.Script12 = function()
{
  (function(r){if(r.DICV_CourseMapHost)return;var C=[{id:1,p:[],t:[{m:101,p:[]},{m:103,p:[101]},{m:102,p:[103]},{m:104,p:[102]},{m:105,p:[104]},{m:106,p:[105]}]}];function b(v){return v===true||v==='true'||v===1||v==='1';}function pr(s){try{var o=JSON.parse(s||'{}');return{v:1,t:(o&&o.t)||{},last:o.last||null};}catch(e){return{v:1,t:{},last:null};}}function rd(){var p=GetPlayer();return{nm:b(p.GetVar('NavigationMode')),pr:pr(p.GetVar('CourseProgressData'))};}function pf(t,pl){var fs=document.querySelectorAll('iframe');for(var i=0;i<fs.length;i++)if(fs[i].contentWindow)fs[i].contentWindow.postMessage({source:'DICV_STORYLINE_HOST',type:t,payload:pl},'*');}r.addEventListener('message',function(e){var d=e&&e.data;if(!d||d.source!=='DICV_COURSEMAP_WEBOBJECT')return;var s=rd(),p=GetPlayer();if(d.type==='READY')e.source.postMessage({source:'DICV_STORYLINE_HOST',type:'STATE',payload:{navigationMode:s.nm,progress:s.pr}},'*');else if(d.type==='OPEN_MISSION'&&d.payload){var id=Number(d.payload.missionId),tp=C[0].t.filter(function(x){return x.m===id;})[0];if(!tp||(!s.nm&&tp.p.some(function(q){return Number(s.pr.t[String(q)])!==2;}))){e.source.postMessage({source:'DICV_STORYLINE_HOST',type:'NAVIGATION_DENIED',payload:{missionId:id,reason:'Complete prerequisite first.'}},'*');return;}s.pr.last=id;if(!s.pr.t[String(id)])s.pr.t[String(id)]=1;p.SetVar('CourseProgressData',JSON.stringify(s.pr));p.SetVar('RequestedMission',0);setTimeout(function(){p.SetVar('RequestedMission',id);},20);}else if(d.type==='CHANGE_MODE'){var nx=!s.nm;p.SetVar('NavigationMode',nx);pf('STATE',{navigationMode:nx,progress:s.pr});}});r.DICV_CourseMapHost={ok:1};})(window);
}

window.Script13 = function()
{
  (function (root) {
  try {
    var p = typeof root.GetPlayer === 'function' ? root.GetPlayer() : null;
    var prof = p ? (p.GetVar('HeaderProfile') || 'C') : 'C';
    if (root.__DICV_HEADER1_WIN__ && typeof root.__DICV_HEADER1_WIN__.postMessage === 'function') {
      root.__DICV_HEADER1_WIN__.postMessage({ source: 'DICV_STORYLINE_HOST', type: 'HEADER1_SET_PROFILE', profile: prof }, '*');
    }
  } catch (e) {}
})(window);
}

window.Script14 = function()
{
  (function(r){if(r.__H1__)return;r.__H1__=1;r.addEventListener('message',function(e){var d=e&&e.data;if(!d||d.source!=='DICV_HEADER1_WEBOBJECT'||d.type!=='HEADER1_READY')return;r.__DICV_HEADER1_WIN__=e.source;try{var p=GetPlayer();e.source.postMessage({source:'DICV_STORYLINE_HOST',type:'HEADER1_SET_PROFILE',profile:(p?p.GetVar('HeaderProfile'):'A')||'A'},'*');e.source.postMessage({source:'DICV_STORYLINE_HOST',type:'HEADER1_SYNC'},'*');}catch(x){}});})(window);
}

window.Script15 = function()
{
  (function(r){if(r.DICV_CourseMapHost)return;var C=[{id:1,p:[],t:[{m:101,p:[]},{m:103,p:[101]},{m:102,p:[103]},{m:104,p:[102]},{m:105,p:[104]},{m:106,p:[105]}]}];function b(v){return v===true||v==='true'||v===1||v==='1';}function pr(s){try{var o=JSON.parse(s||'{}');return{v:1,t:(o&&o.t)||{},last:o.last||null};}catch(e){return{v:1,t:{},last:null};}}function rd(){var p=GetPlayer();return{nm:b(p.GetVar('NavigationMode')),pr:pr(p.GetVar('CourseProgressData'))};}function pf(t,pl){var fs=document.querySelectorAll('iframe');for(var i=0;i<fs.length;i++)if(fs[i].contentWindow)fs[i].contentWindow.postMessage({source:'DICV_STORYLINE_HOST',type:t,payload:pl},'*');}r.addEventListener('message',function(e){var d=e&&e.data;if(!d||d.source!=='DICV_COURSEMAP_WEBOBJECT')return;var s=rd(),p=GetPlayer();if(d.type==='READY')e.source.postMessage({source:'DICV_STORYLINE_HOST',type:'STATE',payload:{navigationMode:s.nm,progress:s.pr}},'*');else if(d.type==='OPEN_MISSION'&&d.payload){var id=Number(d.payload.missionId),tp=C[0].t.filter(function(x){return x.m===id;})[0];if(!tp||(!s.nm&&tp.p.some(function(q){return Number(s.pr.t[String(q)])!==2;}))){e.source.postMessage({source:'DICV_STORYLINE_HOST',type:'NAVIGATION_DENIED',payload:{missionId:id,reason:'Complete prerequisite first.'}},'*');return;}s.pr.last=id;if(!s.pr.t[String(id)])s.pr.t[String(id)]=1;p.SetVar('CourseProgressData',JSON.stringify(s.pr));p.SetVar('RequestedMission',0);setTimeout(function(){p.SetVar('RequestedMission',id);},20);}else if(d.type==='CHANGE_MODE'){var nx=!s.nm;p.SetVar('NavigationMode',nx);pf('STATE',{navigationMode:nx,progress:s.pr});}});r.DICV_CourseMapHost={ok:1};})(window);
}

window.Script16 = function()
{
  (function (root) {
  try {
    var p = typeof root.GetPlayer === 'function' ? root.GetPlayer() : null;
    var prof = p ? (p.GetVar('HeaderProfile') || 'C') : 'C';
    if (root.__DICV_HEADER1_WIN__ && typeof root.__DICV_HEADER1_WIN__.postMessage === 'function') {
      root.__DICV_HEADER1_WIN__.postMessage({ source: 'DICV_STORYLINE_HOST', type: 'HEADER1_SET_PROFILE', profile: prof }, '*');
    }
  } catch (e) {}
})(window);
}

window.Script17 = function()
{
  (function(r){if(r.__H1__)return;r.__H1__=1;r.addEventListener('message',function(e){var d=e&&e.data;if(!d||d.source!=='DICV_HEADER1_WEBOBJECT'||d.type!=='HEADER1_READY')return;r.__DICV_HEADER1_WIN__=e.source;try{var p=GetPlayer();e.source.postMessage({source:'DICV_STORYLINE_HOST',type:'HEADER1_SET_PROFILE',profile:(p?p.GetVar('HeaderProfile'):'A')||'A'},'*');e.source.postMessage({source:'DICV_STORYLINE_HOST',type:'HEADER1_SYNC'},'*');}catch(x){}});})(window);
}

window.Script18 = function()
{
  (function(r){if(r.DICV_CourseMapHost)return;var C=[{id:1,p:[],t:[{m:101,p:[]},{m:103,p:[101]},{m:102,p:[103]},{m:104,p:[102]},{m:105,p:[104]},{m:106,p:[105]}]}];function b(v){return v===true||v==='true'||v===1||v==='1';}function pr(s){try{var o=JSON.parse(s||'{}');return{v:1,t:(o&&o.t)||{},last:o.last||null};}catch(e){return{v:1,t:{},last:null};}}function rd(){var p=GetPlayer();return{nm:b(p.GetVar('NavigationMode')),pr:pr(p.GetVar('CourseProgressData'))};}function pf(t,pl){var fs=document.querySelectorAll('iframe');for(var i=0;i<fs.length;i++)if(fs[i].contentWindow)fs[i].contentWindow.postMessage({source:'DICV_STORYLINE_HOST',type:t,payload:pl},'*');}r.addEventListener('message',function(e){var d=e&&e.data;if(!d||d.source!=='DICV_COURSEMAP_WEBOBJECT')return;var s=rd(),p=GetPlayer();if(d.type==='READY')e.source.postMessage({source:'DICV_STORYLINE_HOST',type:'STATE',payload:{navigationMode:s.nm,progress:s.pr}},'*');else if(d.type==='OPEN_MISSION'&&d.payload){var id=Number(d.payload.missionId),tp=C[0].t.filter(function(x){return x.m===id;})[0];if(!tp||(!s.nm&&tp.p.some(function(q){return Number(s.pr.t[String(q)])!==2;}))){e.source.postMessage({source:'DICV_STORYLINE_HOST',type:'NAVIGATION_DENIED',payload:{missionId:id,reason:'Complete prerequisite first.'}},'*');return;}s.pr.last=id;if(!s.pr.t[String(id)])s.pr.t[String(id)]=1;p.SetVar('CourseProgressData',JSON.stringify(s.pr));p.SetVar('RequestedMission',0);setTimeout(function(){p.SetVar('RequestedMission',id);},20);}else if(d.type==='CHANGE_MODE'){var nx=!s.nm;p.SetVar('NavigationMode',nx);pf('STATE',{navigationMode:nx,progress:s.pr});}});r.DICV_CourseMapHost={ok:1};})(window);
}

window.Script19 = function()
{
  (function (root) {
  try {
    var p = typeof root.GetPlayer === 'function' ? root.GetPlayer() : null;
    var prof = p ? (p.GetVar('HeaderProfile') || 'C') : 'C';
    if (root.__DICV_HEADER1_WIN__ && typeof root.__DICV_HEADER1_WIN__.postMessage === 'function') {
      root.__DICV_HEADER1_WIN__.postMessage({ source: 'DICV_STORYLINE_HOST', type: 'HEADER1_SET_PROFILE', profile: prof }, '*');
    }
  } catch (e) {}
})(window);
}

window.Script20 = function()
{
  (function(r){if(r.__H1__)return;r.__H1__=1;r.addEventListener('message',function(e){var d=e&&e.data;if(!d||d.source!=='DICV_HEADER1_WEBOBJECT'||d.type!=='HEADER1_READY')return;r.__DICV_HEADER1_WIN__=e.source;try{var p=GetPlayer();e.source.postMessage({source:'DICV_STORYLINE_HOST',type:'HEADER1_SET_PROFILE',profile:(p?p.GetVar('HeaderProfile'):'A')||'A'},'*');e.source.postMessage({source:'DICV_STORYLINE_HOST',type:'HEADER1_SYNC'},'*');}catch(x){}});})(window);
}

window.Script21 = function()
{
  (function(r){if(r.DICV_CourseMapHost)return;var C=[{id:1,p:[],t:[{m:101,p:[]},{m:103,p:[101]},{m:102,p:[103]},{m:104,p:[102]},{m:105,p:[104]},{m:106,p:[105]}]}];function b(v){return v===true||v==='true'||v===1||v==='1';}function pr(s){try{var o=JSON.parse(s||'{}');return{v:1,t:(o&&o.t)||{},last:o.last||null};}catch(e){return{v:1,t:{},last:null};}}function rd(){var p=GetPlayer();return{nm:b(p.GetVar('NavigationMode')),pr:pr(p.GetVar('CourseProgressData'))};}function pf(t,pl){var fs=document.querySelectorAll('iframe');for(var i=0;i<fs.length;i++)if(fs[i].contentWindow)fs[i].contentWindow.postMessage({source:'DICV_STORYLINE_HOST',type:t,payload:pl},'*');}r.addEventListener('message',function(e){var d=e&&e.data;if(!d||d.source!=='DICV_COURSEMAP_WEBOBJECT')return;var s=rd(),p=GetPlayer();if(d.type==='READY')e.source.postMessage({source:'DICV_STORYLINE_HOST',type:'STATE',payload:{navigationMode:s.nm,progress:s.pr}},'*');else if(d.type==='OPEN_MISSION'&&d.payload){var id=Number(d.payload.missionId),tp=C[0].t.filter(function(x){return x.m===id;})[0];if(!tp||(!s.nm&&tp.p.some(function(q){return Number(s.pr.t[String(q)])!==2;}))){e.source.postMessage({source:'DICV_STORYLINE_HOST',type:'NAVIGATION_DENIED',payload:{missionId:id,reason:'Complete prerequisite first.'}},'*');return;}s.pr.last=id;if(!s.pr.t[String(id)])s.pr.t[String(id)]=1;p.SetVar('CourseProgressData',JSON.stringify(s.pr));p.SetVar('RequestedMission',0);setTimeout(function(){p.SetVar('RequestedMission',id);},20);}else if(d.type==='CHANGE_MODE'){var nx=!s.nm;p.SetVar('NavigationMode',nx);pf('STATE',{navigationMode:nx,progress:s.pr});}});r.DICV_CourseMapHost={ok:1};})(window);
}

window.Script22 = function()
{
  (function (root) {
  try {
    var p = typeof root.GetPlayer === 'function' ? root.GetPlayer() : null;
    var prof = p ? (p.GetVar('HeaderProfile') || 'C') : 'C';
    if (root.__DICV_HEADER1_WIN__ && typeof root.__DICV_HEADER1_WIN__.postMessage === 'function') {
      root.__DICV_HEADER1_WIN__.postMessage({ source: 'DICV_STORYLINE_HOST', type: 'HEADER1_SET_PROFILE', profile: prof }, '*');
    }
  } catch (e) {}
})(window);
}

window.Script23 = function()
{
  (function(r){if(r.__H1__)return;r.__H1__=1;r.addEventListener('message',function(e){var d=e&&e.data;if(!d||d.source!=='DICV_HEADER1_WEBOBJECT'||d.type!=='HEADER1_READY')return;r.__DICV_HEADER1_WIN__=e.source;try{var p=GetPlayer();e.source.postMessage({source:'DICV_STORYLINE_HOST',type:'HEADER1_SET_PROFILE',profile:(p?p.GetVar('HeaderProfile'):'A')||'A'},'*');e.source.postMessage({source:'DICV_STORYLINE_HOST',type:'HEADER1_SYNC'},'*');}catch(x){}});})(window);
}

window.Script24 = function()
{
  (function(r){if(r.DICV_CourseMapHost)return;var C=[{id:1,p:[],t:[{m:101,p:[]},{m:103,p:[101]},{m:102,p:[103]},{m:104,p:[102]},{m:105,p:[104]},{m:106,p:[105]}]}];function b(v){return v===true||v==='true'||v===1||v==='1';}function pr(s){try{var o=JSON.parse(s||'{}');return{v:1,t:(o&&o.t)||{},last:o.last||null};}catch(e){return{v:1,t:{},last:null};}}function rd(){var p=GetPlayer();return{nm:b(p.GetVar('NavigationMode')),pr:pr(p.GetVar('CourseProgressData'))};}function pf(t,pl){var fs=document.querySelectorAll('iframe');for(var i=0;i<fs.length;i++)if(fs[i].contentWindow)fs[i].contentWindow.postMessage({source:'DICV_STORYLINE_HOST',type:t,payload:pl},'*');}r.addEventListener('message',function(e){var d=e&&e.data;if(!d||d.source!=='DICV_COURSEMAP_WEBOBJECT')return;var s=rd(),p=GetPlayer();if(d.type==='READY')e.source.postMessage({source:'DICV_STORYLINE_HOST',type:'STATE',payload:{navigationMode:s.nm,progress:s.pr}},'*');else if(d.type==='OPEN_MISSION'&&d.payload){var id=Number(d.payload.missionId),tp=C[0].t.filter(function(x){return x.m===id;})[0];if(!tp||(!s.nm&&tp.p.some(function(q){return Number(s.pr.t[String(q)])!==2;}))){e.source.postMessage({source:'DICV_STORYLINE_HOST',type:'NAVIGATION_DENIED',payload:{missionId:id,reason:'Complete prerequisite first.'}},'*');return;}s.pr.last=id;if(!s.pr.t[String(id)])s.pr.t[String(id)]=1;p.SetVar('CourseProgressData',JSON.stringify(s.pr));p.SetVar('RequestedMission',0);setTimeout(function(){p.SetVar('RequestedMission',id);},20);}else if(d.type==='CHANGE_MODE'){var nx=!s.nm;p.SetVar('NavigationMode',nx);pf('STATE',{navigationMode:nx,progress:s.pr});}});r.DICV_CourseMapHost={ok:1};})(window);
}

window.Script25 = function()
{
  (function (root) {
  try {
    var p = typeof root.GetPlayer === 'function' ? root.GetPlayer() : null;
    var prof = p ? (p.GetVar('HeaderProfile') || 'C') : 'C';
    if (root.__DICV_HEADER1_WIN__ && typeof root.__DICV_HEADER1_WIN__.postMessage === 'function') {
      root.__DICV_HEADER1_WIN__.postMessage({ source: 'DICV_STORYLINE_HOST', type: 'HEADER1_SET_PROFILE', profile: prof }, '*');
    }
  } catch (e) {}
})(window);
}

window.Script26 = function()
{
  (function(r){if(r.__H1__)return;r.__H1__=1;r.addEventListener('message',function(e){var d=e&&e.data;if(!d||d.source!=='DICV_HEADER1_WEBOBJECT'||d.type!=='HEADER1_READY')return;r.__DICV_HEADER1_WIN__=e.source;try{var p=GetPlayer();e.source.postMessage({source:'DICV_STORYLINE_HOST',type:'HEADER1_SET_PROFILE',profile:(p?p.GetVar('HeaderProfile'):'A')||'A'},'*');e.source.postMessage({source:'DICV_STORYLINE_HOST',type:'HEADER1_SYNC'},'*');}catch(x){}});})(window);
}

window.Script27 = function()
{
  (function(r){if(r.DICV_CourseMapHost)return;var C=[{id:1,p:[],t:[{m:101,p:[]},{m:103,p:[101]},{m:102,p:[103]},{m:104,p:[102]},{m:105,p:[104]},{m:106,p:[105]}]}];function b(v){return v===true||v==='true'||v===1||v==='1';}function pr(s){try{var o=JSON.parse(s||'{}');return{v:1,t:(o&&o.t)||{},last:o.last||null};}catch(e){return{v:1,t:{},last:null};}}function rd(){var p=GetPlayer();return{nm:b(p.GetVar('NavigationMode')),pr:pr(p.GetVar('CourseProgressData'))};}function pf(t,pl){var fs=document.querySelectorAll('iframe');for(var i=0;i<fs.length;i++)if(fs[i].contentWindow)fs[i].contentWindow.postMessage({source:'DICV_STORYLINE_HOST',type:t,payload:pl},'*');}r.addEventListener('message',function(e){var d=e&&e.data;if(!d||d.source!=='DICV_COURSEMAP_WEBOBJECT')return;var s=rd(),p=GetPlayer();if(d.type==='READY')e.source.postMessage({source:'DICV_STORYLINE_HOST',type:'STATE',payload:{navigationMode:s.nm,progress:s.pr}},'*');else if(d.type==='OPEN_MISSION'&&d.payload){var id=Number(d.payload.missionId),tp=C[0].t.filter(function(x){return x.m===id;})[0];if(!tp||(!s.nm&&tp.p.some(function(q){return Number(s.pr.t[String(q)])!==2;}))){e.source.postMessage({source:'DICV_STORYLINE_HOST',type:'NAVIGATION_DENIED',payload:{missionId:id,reason:'Complete prerequisite first.'}},'*');return;}s.pr.last=id;if(!s.pr.t[String(id)])s.pr.t[String(id)]=1;p.SetVar('CourseProgressData',JSON.stringify(s.pr));p.SetVar('RequestedMission',0);setTimeout(function(){p.SetVar('RequestedMission',id);},20);}else if(d.type==='CHANGE_MODE'){var nx=!s.nm;p.SetVar('NavigationMode',nx);pf('STATE',{navigationMode:nx,progress:s.pr});}});r.DICV_CourseMapHost={ok:1};})(window);
}

window.Script28 = function()
{
  (function (root) {
  try {
    var p = typeof root.GetPlayer === 'function' ? root.GetPlayer() : null;
    var prof = p ? (p.GetVar('HeaderProfile') || 'C') : 'C';
    if (root.__DICV_HEADER1_WIN__ && typeof root.__DICV_HEADER1_WIN__.postMessage === 'function') {
      root.__DICV_HEADER1_WIN__.postMessage({ source: 'DICV_STORYLINE_HOST', type: 'HEADER1_SET_PROFILE', profile: prof }, '*');
    }
  } catch (e) {}
})(window);
}

window.Script29 = function()
{
  (function(r){if(!r.__CM_T__){r.__CM_T__=1;r.addEventListener('message',function(e){var d=e&&e.data;if(!d||d.source!=='DICV_COURSEMAP_WEBOBJECT')return;if(d.type==='READY'){r.__CM_W__=e.source;r.DICV_CM_CMD('START_MODULE_INTRO',{moduleId:1});}if(d.type==='TRANSITION_CONTINUE'&&r.GetPlayer)r.GetPlayer().SetVar('TransitionContinueClicked',true);});}r.DICV_CM_CMD=function(t,p){if(r.__CM_W__)r.__CM_W__.postMessage({source:'DICV_STORYLINE_HOST',type:t,payload:p||{}},'*');};r.DICV_CM_CMD('START_MODULE_INTRO',{moduleId:1});})(window);
}

window.Script30 = function()
{
  window.DICV_CM_CMD('HIGHLIGHT_MODULE', { moduleId: 1 });
window.DICV_CM_CMD('REVEAL_TOPICS', { moduleId: 1 });
}

window.Script31 = function()
{
  window.DICV_CM_CMD('TRANSITION_COMPLETE');
}

window.Script32 = function()
{
  (function(r){if(r.__H1__)return;r.__H1__=1;r.addEventListener('message',function(e){var d=e&&e.data;if(!d||d.source!=='DICV_HEADER1_WEBOBJECT'||d.type!=='HEADER1_READY')return;r.__DICV_HEADER1_WIN__=e.source;try{var p=GetPlayer();e.source.postMessage({source:'DICV_STORYLINE_HOST',type:'HEADER1_SET_PROFILE',profile:(p?p.GetVar('HeaderProfile'):'A')||'A'},'*');e.source.postMessage({source:'DICV_STORYLINE_HOST',type:'HEADER1_SYNC'},'*');}catch(x){}});})(window);
}

window.Script33 = function()
{
  (function(r){if(r.DICV_CourseMapHost)return;var C=[{id:1,p:[],t:[{m:101,p:[]},{m:103,p:[101]},{m:102,p:[103]},{m:104,p:[102]},{m:105,p:[104]},{m:106,p:[105]}]}];function b(v){return v===true||v==='true'||v===1||v==='1';}function pr(s){try{var o=JSON.parse(s||'{}');return{v:1,t:(o&&o.t)||{},last:o.last||null};}catch(e){return{v:1,t:{},last:null};}}function rd(){var p=GetPlayer();return{nm:b(p.GetVar('NavigationMode')),pr:pr(p.GetVar('CourseProgressData'))};}function pf(t,pl){var fs=document.querySelectorAll('iframe');for(var i=0;i<fs.length;i++)if(fs[i].contentWindow)fs[i].contentWindow.postMessage({source:'DICV_STORYLINE_HOST',type:t,payload:pl},'*');}r.addEventListener('message',function(e){var d=e&&e.data;if(!d||d.source!=='DICV_COURSEMAP_WEBOBJECT')return;var s=rd(),p=GetPlayer();if(d.type==='READY')e.source.postMessage({source:'DICV_STORYLINE_HOST',type:'STATE',payload:{navigationMode:s.nm,progress:s.pr}},'*');else if(d.type==='OPEN_MISSION'&&d.payload){var id=Number(d.payload.missionId),tp=C[0].t.filter(function(x){return x.m===id;})[0];if(!tp||(!s.nm&&tp.p.some(function(q){return Number(s.pr.t[String(q)])!==2;}))){e.source.postMessage({source:'DICV_STORYLINE_HOST',type:'NAVIGATION_DENIED',payload:{missionId:id,reason:'Complete prerequisite first.'}},'*');return;}s.pr.last=id;if(!s.pr.t[String(id)])s.pr.t[String(id)]=1;p.SetVar('CourseProgressData',JSON.stringify(s.pr));p.SetVar('RequestedMission',0);setTimeout(function(){p.SetVar('RequestedMission',id);},20);}else if(d.type==='CHANGE_MODE'){var nx=!s.nm;p.SetVar('NavigationMode',nx);pf('STATE',{navigationMode:nx,progress:s.pr});}});r.DICV_CourseMapHost={ok:1};})(window);
}

window.Script34 = function()
{
  (function (root) {
  try {
    var p = typeof root.GetPlayer === 'function' ? root.GetPlayer() : null;
    var prof = p ? (p.GetVar('HeaderProfile') || 'C') : 'C';
    if (root.__DICV_HEADER1_WIN__ && typeof root.__DICV_HEADER1_WIN__.postMessage === 'function') {
      root.__DICV_HEADER1_WIN__.postMessage({ source: 'DICV_STORYLINE_HOST', type: 'HEADER1_SET_PROFILE', profile: prof }, '*');
    }
  } catch (e) {}
})(window);
}

window.Script35 = function()
{
  if (window.DICV_CourseMapHost) window.DICV_CourseMapHost.markTopicStatus(103, 1);
}

window.Script36 = function()
{
  document.querySelectorAll('iframe').forEach(function (f) {
  if (f.contentWindow) f.contentWindow.postMessage({ source: 'DICV_STORYLINE_HOST', type: 'Q002_MEDIA_COMPLETE' }, '*');
});
}

window.Script37 = function()
{
  (function(r){if(r.__H1__)return;r.__H1__=1;r.addEventListener('message',function(e){var d=e&&e.data;if(!d||d.source!=='DICV_HEADER1_WEBOBJECT'||d.type!=='HEADER1_READY')return;r.__DICV_HEADER1_WIN__=e.source;try{var p=GetPlayer();e.source.postMessage({source:'DICV_STORYLINE_HOST',type:'HEADER1_SET_PROFILE',profile:(p?p.GetVar('HeaderProfile'):'A')||'A'},'*');e.source.postMessage({source:'DICV_STORYLINE_HOST',type:'HEADER1_SYNC'},'*');}catch(x){}});})(window);
}

window.Script38 = function()
{
  (function(r){if(r.DICV_CourseMapHost)return;var C=[{id:1,p:[],t:[{m:101,p:[]},{m:103,p:[101]},{m:102,p:[103]},{m:104,p:[102]},{m:105,p:[104]},{m:106,p:[105]}]}];function b(v){return v===true||v==='true'||v===1||v==='1';}function pr(s){try{var o=JSON.parse(s||'{}');return{v:1,t:(o&&o.t)||{},last:o.last||null};}catch(e){return{v:1,t:{},last:null};}}function rd(){var p=GetPlayer();return{nm:b(p.GetVar('NavigationMode')),pr:pr(p.GetVar('CourseProgressData'))};}function pf(t,pl){var fs=document.querySelectorAll('iframe');for(var i=0;i<fs.length;i++)if(fs[i].contentWindow)fs[i].contentWindow.postMessage({source:'DICV_STORYLINE_HOST',type:t,payload:pl},'*');}r.addEventListener('message',function(e){var d=e&&e.data;if(!d||d.source!=='DICV_COURSEMAP_WEBOBJECT')return;var s=rd(),p=GetPlayer();if(d.type==='READY')e.source.postMessage({source:'DICV_STORYLINE_HOST',type:'STATE',payload:{navigationMode:s.nm,progress:s.pr}},'*');else if(d.type==='OPEN_MISSION'&&d.payload){var id=Number(d.payload.missionId),tp=C[0].t.filter(function(x){return x.m===id;})[0];if(!tp||(!s.nm&&tp.p.some(function(q){return Number(s.pr.t[String(q)])!==2;}))){e.source.postMessage({source:'DICV_STORYLINE_HOST',type:'NAVIGATION_DENIED',payload:{missionId:id,reason:'Complete prerequisite first.'}},'*');return;}s.pr.last=id;if(!s.pr.t[String(id)])s.pr.t[String(id)]=1;p.SetVar('CourseProgressData',JSON.stringify(s.pr));p.SetVar('RequestedMission',0);setTimeout(function(){p.SetVar('RequestedMission',id);},20);}else if(d.type==='CHANGE_MODE'){var nx=!s.nm;p.SetVar('NavigationMode',nx);pf('STATE',{navigationMode:nx,progress:s.pr});}});r.DICV_CourseMapHost={ok:1};})(window);
}

window.Script39 = function()
{
  (function (root) {
  try {
    var p = typeof root.GetPlayer === 'function' ? root.GetPlayer() : null;
    var prof = p ? (p.GetVar('HeaderProfile') || 'C') : 'C';
    if (root.__DICV_HEADER1_WIN__ && typeof root.__DICV_HEADER1_WIN__.postMessage === 'function') {
      root.__DICV_HEADER1_WIN__.postMessage({ source: 'DICV_STORYLINE_HOST', type: 'HEADER1_SET_PROFILE', profile: prof }, '*');
    }
  } catch (e) {}
})(window);
}

window.Script40 = function()
{
  if (window.DICV_CourseMapHost) window.DICV_CourseMapHost.markTopicStatus(103, 2);
}

window.Script41 = function()
{
  (function(r){if(r.__H1__)return;r.__H1__=1;r.addEventListener('message',function(e){var d=e&&e.data;if(!d||d.source!=='DICV_HEADER1_WEBOBJECT'||d.type!=='HEADER1_READY')return;r.__DICV_HEADER1_WIN__=e.source;try{var p=GetPlayer();e.source.postMessage({source:'DICV_STORYLINE_HOST',type:'HEADER1_SET_PROFILE',profile:(p?p.GetVar('HeaderProfile'):'A')||'A'},'*');e.source.postMessage({source:'DICV_STORYLINE_HOST',type:'HEADER1_SYNC'},'*');}catch(x){}});})(window);
}

window.Script42 = function()
{
  (function(r){if(r.DICV_CourseMapHost)return;var C=[{id:1,p:[],t:[{m:101,p:[]},{m:103,p:[101]},{m:102,p:[103]},{m:104,p:[102]},{m:105,p:[104]},{m:106,p:[105]}]}];function b(v){return v===true||v==='true'||v===1||v==='1';}function pr(s){try{var o=JSON.parse(s||'{}');return{v:1,t:(o&&o.t)||{},last:o.last||null};}catch(e){return{v:1,t:{},last:null};}}function rd(){var p=GetPlayer();return{nm:b(p.GetVar('NavigationMode')),pr:pr(p.GetVar('CourseProgressData'))};}function pf(t,pl){var fs=document.querySelectorAll('iframe');for(var i=0;i<fs.length;i++)if(fs[i].contentWindow)fs[i].contentWindow.postMessage({source:'DICV_STORYLINE_HOST',type:t,payload:pl},'*');}r.addEventListener('message',function(e){var d=e&&e.data;if(!d||d.source!=='DICV_COURSEMAP_WEBOBJECT')return;var s=rd(),p=GetPlayer();if(d.type==='READY')e.source.postMessage({source:'DICV_STORYLINE_HOST',type:'STATE',payload:{navigationMode:s.nm,progress:s.pr}},'*');else if(d.type==='OPEN_MISSION'&&d.payload){var id=Number(d.payload.missionId),tp=C[0].t.filter(function(x){return x.m===id;})[0];if(!tp||(!s.nm&&tp.p.some(function(q){return Number(s.pr.t[String(q)])!==2;}))){e.source.postMessage({source:'DICV_STORYLINE_HOST',type:'NAVIGATION_DENIED',payload:{missionId:id,reason:'Complete prerequisite first.'}},'*');return;}s.pr.last=id;if(!s.pr.t[String(id)])s.pr.t[String(id)]=1;p.SetVar('CourseProgressData',JSON.stringify(s.pr));p.SetVar('RequestedMission',0);setTimeout(function(){p.SetVar('RequestedMission',id);},20);}else if(d.type==='CHANGE_MODE'){var nx=!s.nm;p.SetVar('NavigationMode',nx);pf('STATE',{navigationMode:nx,progress:s.pr});}});r.DICV_CourseMapHost={ok:1};})(window);
}

window.Script43 = function()
{
  (function (root) {
  try {
    var p = typeof root.GetPlayer === 'function' ? root.GetPlayer() : null;
    var prof = p ? (p.GetVar('HeaderProfile') || 'C') : 'C';
    if (root.__DICV_HEADER1_WIN__ && typeof root.__DICV_HEADER1_WIN__.postMessage === 'function') {
      root.__DICV_HEADER1_WIN__.postMessage({ source: 'DICV_STORYLINE_HOST', type: 'HEADER1_SET_PROFILE', profile: prof }, '*');
    }
  } catch (e) {}
})(window);
}

window.Script44 = function()
{
  if (window.DICV_CourseMapHost) window.DICV_CourseMapHost.markTopicStatus(102, 1);
}

window.Script45 = function()
{
  (function(r){if(r.__H1__)return;r.__H1__=1;r.addEventListener('message',function(e){var d=e&&e.data;if(!d||d.source!=='DICV_HEADER1_WEBOBJECT'||d.type!=='HEADER1_READY')return;r.__DICV_HEADER1_WIN__=e.source;try{var p=GetPlayer();e.source.postMessage({source:'DICV_STORYLINE_HOST',type:'HEADER1_SET_PROFILE',profile:(p?p.GetVar('HeaderProfile'):'A')||'A'},'*');e.source.postMessage({source:'DICV_STORYLINE_HOST',type:'HEADER1_SYNC'},'*');}catch(x){}});})(window);
}

window.Script46 = function()
{
  (function(r){if(r.DICV_CourseMapHost)return;var C=[{id:1,p:[],t:[{m:101,p:[]},{m:103,p:[101]},{m:102,p:[103]},{m:104,p:[102]},{m:105,p:[104]},{m:106,p:[105]}]}];function b(v){return v===true||v==='true'||v===1||v==='1';}function pr(s){try{var o=JSON.parse(s||'{}');return{v:1,t:(o&&o.t)||{},last:o.last||null};}catch(e){return{v:1,t:{},last:null};}}function rd(){var p=GetPlayer();return{nm:b(p.GetVar('NavigationMode')),pr:pr(p.GetVar('CourseProgressData'))};}function pf(t,pl){var fs=document.querySelectorAll('iframe');for(var i=0;i<fs.length;i++)if(fs[i].contentWindow)fs[i].contentWindow.postMessage({source:'DICV_STORYLINE_HOST',type:t,payload:pl},'*');}r.addEventListener('message',function(e){var d=e&&e.data;if(!d||d.source!=='DICV_COURSEMAP_WEBOBJECT')return;var s=rd(),p=GetPlayer();if(d.type==='READY')e.source.postMessage({source:'DICV_STORYLINE_HOST',type:'STATE',payload:{navigationMode:s.nm,progress:s.pr}},'*');else if(d.type==='OPEN_MISSION'&&d.payload){var id=Number(d.payload.missionId),tp=C[0].t.filter(function(x){return x.m===id;})[0];if(!tp||(!s.nm&&tp.p.some(function(q){return Number(s.pr.t[String(q)])!==2;}))){e.source.postMessage({source:'DICV_STORYLINE_HOST',type:'NAVIGATION_DENIED',payload:{missionId:id,reason:'Complete prerequisite first.'}},'*');return;}s.pr.last=id;if(!s.pr.t[String(id)])s.pr.t[String(id)]=1;p.SetVar('CourseProgressData',JSON.stringify(s.pr));p.SetVar('RequestedMission',0);setTimeout(function(){p.SetVar('RequestedMission',id);},20);}else if(d.type==='CHANGE_MODE'){var nx=!s.nm;p.SetVar('NavigationMode',nx);pf('STATE',{navigationMode:nx,progress:s.pr});}});r.DICV_CourseMapHost={ok:1};})(window);
}

window.Script47 = function()
{
  (function (root) {
  try {
    var p = typeof root.GetPlayer === 'function' ? root.GetPlayer() : null;
    var prof = p ? (p.GetVar('HeaderProfile') || 'C') : 'C';
    if (root.__DICV_HEADER1_WIN__ && typeof root.__DICV_HEADER1_WIN__.postMessage === 'function') {
      root.__DICV_HEADER1_WIN__.postMessage({ source: 'DICV_STORYLINE_HOST', type: 'HEADER1_SET_PROFILE', profile: prof }, '*');
    }
  } catch (e) {}
})(window);
}

window.Script48 = function()
{
  if (window.DICV_CourseMapHost) window.DICV_CourseMapHost.markTopicStatus(102, 2);
}

window.Script49 = function()
{
  (function(r){if(r.__H1__)return;r.__H1__=1;r.addEventListener('message',function(e){var d=e&&e.data;if(!d||d.source!=='DICV_HEADER1_WEBOBJECT'||d.type!=='HEADER1_READY')return;r.__DICV_HEADER1_WIN__=e.source;try{var p=GetPlayer();e.source.postMessage({source:'DICV_STORYLINE_HOST',type:'HEADER1_SET_PROFILE',profile:(p?p.GetVar('HeaderProfile'):'A')||'A'},'*');e.source.postMessage({source:'DICV_STORYLINE_HOST',type:'HEADER1_SYNC'},'*');}catch(x){}});})(window);
}

window.Script50 = function()
{
  (function(r){if(r.DICV_CourseMapHost)return;var C=[{id:1,p:[],t:[{m:101,p:[]},{m:103,p:[101]},{m:102,p:[103]},{m:104,p:[102]},{m:105,p:[104]},{m:106,p:[105]}]}];function b(v){return v===true||v==='true'||v===1||v==='1';}function pr(s){try{var o=JSON.parse(s||'{}');return{v:1,t:(o&&o.t)||{},last:o.last||null};}catch(e){return{v:1,t:{},last:null};}}function rd(){var p=GetPlayer();return{nm:b(p.GetVar('NavigationMode')),pr:pr(p.GetVar('CourseProgressData'))};}function pf(t,pl){var fs=document.querySelectorAll('iframe');for(var i=0;i<fs.length;i++)if(fs[i].contentWindow)fs[i].contentWindow.postMessage({source:'DICV_STORYLINE_HOST',type:t,payload:pl},'*');}r.addEventListener('message',function(e){var d=e&&e.data;if(!d||d.source!=='DICV_COURSEMAP_WEBOBJECT')return;var s=rd(),p=GetPlayer();if(d.type==='READY')e.source.postMessage({source:'DICV_STORYLINE_HOST',type:'STATE',payload:{navigationMode:s.nm,progress:s.pr}},'*');else if(d.type==='OPEN_MISSION'&&d.payload){var id=Number(d.payload.missionId),tp=C[0].t.filter(function(x){return x.m===id;})[0];if(!tp||(!s.nm&&tp.p.some(function(q){return Number(s.pr.t[String(q)])!==2;}))){e.source.postMessage({source:'DICV_STORYLINE_HOST',type:'NAVIGATION_DENIED',payload:{missionId:id,reason:'Complete prerequisite first.'}},'*');return;}s.pr.last=id;if(!s.pr.t[String(id)])s.pr.t[String(id)]=1;p.SetVar('CourseProgressData',JSON.stringify(s.pr));p.SetVar('RequestedMission',0);setTimeout(function(){p.SetVar('RequestedMission',id);},20);}else if(d.type==='CHANGE_MODE'){var nx=!s.nm;p.SetVar('NavigationMode',nx);pf('STATE',{navigationMode:nx,progress:s.pr});}});r.DICV_CourseMapHost={ok:1};})(window);
}

window.Script51 = function()
{
  (function (root) {
  try {
    var p = typeof root.GetPlayer === 'function' ? root.GetPlayer() : null;
    var prof = p ? (p.GetVar('HeaderProfile') || 'C') : 'C';
    if (root.__DICV_HEADER1_WIN__ && typeof root.__DICV_HEADER1_WIN__.postMessage === 'function') {
      root.__DICV_HEADER1_WIN__.postMessage({ source: 'DICV_STORYLINE_HOST', type: 'HEADER1_SET_PROFILE', profile: prof }, '*');
    }
  } catch (e) {}
})(window);
}

window.Script52 = function()
{
  if (window.DICV_CourseMapHost) window.DICV_CourseMapHost.markTopicStatus(104, 1);
}

window.Script53 = function()
{
  (function(r){if(r.__H1__)return;r.__H1__=1;r.addEventListener('message',function(e){var d=e&&e.data;if(!d||d.source!=='DICV_HEADER1_WEBOBJECT'||d.type!=='HEADER1_READY')return;r.__DICV_HEADER1_WIN__=e.source;try{var p=GetPlayer();e.source.postMessage({source:'DICV_STORYLINE_HOST',type:'HEADER1_SET_PROFILE',profile:(p?p.GetVar('HeaderProfile'):'A')||'A'},'*');e.source.postMessage({source:'DICV_STORYLINE_HOST',type:'HEADER1_SYNC'},'*');}catch(x){}});})(window);
}

window.Script54 = function()
{
  (function(r){if(r.DICV_CourseMapHost)return;var C=[{id:1,p:[],t:[{m:101,p:[]},{m:103,p:[101]},{m:102,p:[103]},{m:104,p:[102]},{m:105,p:[104]},{m:106,p:[105]}]}];function b(v){return v===true||v==='true'||v===1||v==='1';}function pr(s){try{var o=JSON.parse(s||'{}');return{v:1,t:(o&&o.t)||{},last:o.last||null};}catch(e){return{v:1,t:{},last:null};}}function rd(){var p=GetPlayer();return{nm:b(p.GetVar('NavigationMode')),pr:pr(p.GetVar('CourseProgressData'))};}function pf(t,pl){var fs=document.querySelectorAll('iframe');for(var i=0;i<fs.length;i++)if(fs[i].contentWindow)fs[i].contentWindow.postMessage({source:'DICV_STORYLINE_HOST',type:t,payload:pl},'*');}r.addEventListener('message',function(e){var d=e&&e.data;if(!d||d.source!=='DICV_COURSEMAP_WEBOBJECT')return;var s=rd(),p=GetPlayer();if(d.type==='READY')e.source.postMessage({source:'DICV_STORYLINE_HOST',type:'STATE',payload:{navigationMode:s.nm,progress:s.pr}},'*');else if(d.type==='OPEN_MISSION'&&d.payload){var id=Number(d.payload.missionId),tp=C[0].t.filter(function(x){return x.m===id;})[0];if(!tp||(!s.nm&&tp.p.some(function(q){return Number(s.pr.t[String(q)])!==2;}))){e.source.postMessage({source:'DICV_STORYLINE_HOST',type:'NAVIGATION_DENIED',payload:{missionId:id,reason:'Complete prerequisite first.'}},'*');return;}s.pr.last=id;if(!s.pr.t[String(id)])s.pr.t[String(id)]=1;p.SetVar('CourseProgressData',JSON.stringify(s.pr));p.SetVar('RequestedMission',0);setTimeout(function(){p.SetVar('RequestedMission',id);},20);}else if(d.type==='CHANGE_MODE'){var nx=!s.nm;p.SetVar('NavigationMode',nx);pf('STATE',{navigationMode:nx,progress:s.pr});}});r.DICV_CourseMapHost={ok:1};})(window);
}

window.Script55 = function()
{
  (function (root) {
  try {
    var p = typeof root.GetPlayer === 'function' ? root.GetPlayer() : null;
    var prof = p ? (p.GetVar('HeaderProfile') || 'C') : 'C';
    if (root.__DICV_HEADER1_WIN__ && typeof root.__DICV_HEADER1_WIN__.postMessage === 'function') {
      root.__DICV_HEADER1_WIN__.postMessage({ source: 'DICV_STORYLINE_HOST', type: 'HEADER1_SET_PROFILE', profile: prof }, '*');
    }
  } catch (e) {}
})(window);
}

window.Script56 = function()
{
  if (window.DICV_CourseMapHost) window.DICV_CourseMapHost.markTopicStatus(104, 2);
}

window.Script57 = function()
{
  (function(r){if(r.__H1__)return;r.__H1__=1;r.addEventListener('message',function(e){var d=e&&e.data;if(!d||d.source!=='DICV_HEADER1_WEBOBJECT'||d.type!=='HEADER1_READY')return;r.__DICV_HEADER1_WIN__=e.source;try{var p=GetPlayer();e.source.postMessage({source:'DICV_STORYLINE_HOST',type:'HEADER1_SET_PROFILE',profile:(p?p.GetVar('HeaderProfile'):'A')||'A'},'*');e.source.postMessage({source:'DICV_STORYLINE_HOST',type:'HEADER1_SYNC'},'*');}catch(x){}});})(window);
}

window.Script58 = function()
{
  (function(r){if(r.DICV_CourseMapHost)return;var C=[{id:1,p:[],t:[{m:101,p:[]},{m:103,p:[101]},{m:102,p:[103]},{m:104,p:[102]},{m:105,p:[104]},{m:106,p:[105]}]}];function b(v){return v===true||v==='true'||v===1||v==='1';}function pr(s){try{var o=JSON.parse(s||'{}');return{v:1,t:(o&&o.t)||{},last:o.last||null};}catch(e){return{v:1,t:{},last:null};}}function rd(){var p=GetPlayer();return{nm:b(p.GetVar('NavigationMode')),pr:pr(p.GetVar('CourseProgressData'))};}function pf(t,pl){var fs=document.querySelectorAll('iframe');for(var i=0;i<fs.length;i++)if(fs[i].contentWindow)fs[i].contentWindow.postMessage({source:'DICV_STORYLINE_HOST',type:t,payload:pl},'*');}r.addEventListener('message',function(e){var d=e&&e.data;if(!d||d.source!=='DICV_COURSEMAP_WEBOBJECT')return;var s=rd(),p=GetPlayer();if(d.type==='READY')e.source.postMessage({source:'DICV_STORYLINE_HOST',type:'STATE',payload:{navigationMode:s.nm,progress:s.pr}},'*');else if(d.type==='OPEN_MISSION'&&d.payload){var id=Number(d.payload.missionId),tp=C[0].t.filter(function(x){return x.m===id;})[0];if(!tp||(!s.nm&&tp.p.some(function(q){return Number(s.pr.t[String(q)])!==2;}))){e.source.postMessage({source:'DICV_STORYLINE_HOST',type:'NAVIGATION_DENIED',payload:{missionId:id,reason:'Complete prerequisite first.'}},'*');return;}s.pr.last=id;if(!s.pr.t[String(id)])s.pr.t[String(id)]=1;p.SetVar('CourseProgressData',JSON.stringify(s.pr));p.SetVar('RequestedMission',0);setTimeout(function(){p.SetVar('RequestedMission',id);},20);}else if(d.type==='CHANGE_MODE'){var nx=!s.nm;p.SetVar('NavigationMode',nx);pf('STATE',{navigationMode:nx,progress:s.pr});}});r.DICV_CourseMapHost={ok:1};})(window);
}

window.Script59 = function()
{
  (function (root) {
  try {
    var p = typeof root.GetPlayer === 'function' ? root.GetPlayer() : null;
    var prof = p ? (p.GetVar('HeaderProfile') || 'C') : 'C';
    if (root.__DICV_HEADER1_WIN__ && typeof root.__DICV_HEADER1_WIN__.postMessage === 'function') {
      root.__DICV_HEADER1_WIN__.postMessage({ source: 'DICV_STORYLINE_HOST', type: 'HEADER1_SET_PROFILE', profile: prof }, '*');
    }
  } catch (e) {}
})(window);
}

window.Script60 = function()
{
  if (window.DICV_CourseMapHost) window.DICV_CourseMapHost.markTopicStatus(105, 1);
}

window.Script61 = function()
{
  (function(r){if(r.__H1__)return;r.__H1__=1;r.addEventListener('message',function(e){var d=e&&e.data;if(!d||d.source!=='DICV_HEADER1_WEBOBJECT'||d.type!=='HEADER1_READY')return;r.__DICV_HEADER1_WIN__=e.source;try{var p=GetPlayer();e.source.postMessage({source:'DICV_STORYLINE_HOST',type:'HEADER1_SET_PROFILE',profile:(p?p.GetVar('HeaderProfile'):'A')||'A'},'*');e.source.postMessage({source:'DICV_STORYLINE_HOST',type:'HEADER1_SYNC'},'*');}catch(x){}});})(window);
}

window.Script62 = function()
{
  (function(r){if(r.DICV_CourseMapHost)return;var C=[{id:1,p:[],t:[{m:101,p:[]},{m:103,p:[101]},{m:102,p:[103]},{m:104,p:[102]},{m:105,p:[104]},{m:106,p:[105]}]}];function b(v){return v===true||v==='true'||v===1||v==='1';}function pr(s){try{var o=JSON.parse(s||'{}');return{v:1,t:(o&&o.t)||{},last:o.last||null};}catch(e){return{v:1,t:{},last:null};}}function rd(){var p=GetPlayer();return{nm:b(p.GetVar('NavigationMode')),pr:pr(p.GetVar('CourseProgressData'))};}function pf(t,pl){var fs=document.querySelectorAll('iframe');for(var i=0;i<fs.length;i++)if(fs[i].contentWindow)fs[i].contentWindow.postMessage({source:'DICV_STORYLINE_HOST',type:t,payload:pl},'*');}r.addEventListener('message',function(e){var d=e&&e.data;if(!d||d.source!=='DICV_COURSEMAP_WEBOBJECT')return;var s=rd(),p=GetPlayer();if(d.type==='READY')e.source.postMessage({source:'DICV_STORYLINE_HOST',type:'STATE',payload:{navigationMode:s.nm,progress:s.pr}},'*');else if(d.type==='OPEN_MISSION'&&d.payload){var id=Number(d.payload.missionId),tp=C[0].t.filter(function(x){return x.m===id;})[0];if(!tp||(!s.nm&&tp.p.some(function(q){return Number(s.pr.t[String(q)])!==2;}))){e.source.postMessage({source:'DICV_STORYLINE_HOST',type:'NAVIGATION_DENIED',payload:{missionId:id,reason:'Complete prerequisite first.'}},'*');return;}s.pr.last=id;if(!s.pr.t[String(id)])s.pr.t[String(id)]=1;p.SetVar('CourseProgressData',JSON.stringify(s.pr));p.SetVar('RequestedMission',0);setTimeout(function(){p.SetVar('RequestedMission',id);},20);}else if(d.type==='CHANGE_MODE'){var nx=!s.nm;p.SetVar('NavigationMode',nx);pf('STATE',{navigationMode:nx,progress:s.pr});}});r.DICV_CourseMapHost={ok:1};})(window);
}

window.Script63 = function()
{
  (function (root) {
  try {
    var p = typeof root.GetPlayer === 'function' ? root.GetPlayer() : null;
    var prof = p ? (p.GetVar('HeaderProfile') || 'C') : 'C';
    if (root.__DICV_HEADER1_WIN__ && typeof root.__DICV_HEADER1_WIN__.postMessage === 'function') {
      root.__DICV_HEADER1_WIN__.postMessage({ source: 'DICV_STORYLINE_HOST', type: 'HEADER1_SET_PROFILE', profile: prof }, '*');
    }
  } catch (e) {}
})(window);
}

window.Script64 = function()
{
  if (window.DICV_CourseMapHost) window.DICV_CourseMapHost.markTopicStatus(105, 2);
}

window.Script65 = function()
{
  (function(r){if(r.__H1__)return;r.__H1__=1;r.addEventListener('message',function(e){var d=e&&e.data;if(!d||d.source!=='DICV_HEADER1_WEBOBJECT'||d.type!=='HEADER1_READY')return;r.__DICV_HEADER1_WIN__=e.source;try{var p=GetPlayer();e.source.postMessage({source:'DICV_STORYLINE_HOST',type:'HEADER1_SET_PROFILE',profile:(p?p.GetVar('HeaderProfile'):'A')||'A'},'*');e.source.postMessage({source:'DICV_STORYLINE_HOST',type:'HEADER1_SYNC'},'*');}catch(x){}});})(window);
}

window.Script66 = function()
{
  (function(r){if(r.DICV_CourseMapHost)return;var C=[{id:1,p:[],t:[{m:101,p:[]},{m:103,p:[101]},{m:102,p:[103]},{m:104,p:[102]},{m:105,p:[104]},{m:106,p:[105]}]}];function b(v){return v===true||v==='true'||v===1||v==='1';}function pr(s){try{var o=JSON.parse(s||'{}');return{v:1,t:(o&&o.t)||{},last:o.last||null};}catch(e){return{v:1,t:{},last:null};}}function rd(){var p=GetPlayer();return{nm:b(p.GetVar('NavigationMode')),pr:pr(p.GetVar('CourseProgressData'))};}function pf(t,pl){var fs=document.querySelectorAll('iframe');for(var i=0;i<fs.length;i++)if(fs[i].contentWindow)fs[i].contentWindow.postMessage({source:'DICV_STORYLINE_HOST',type:t,payload:pl},'*');}r.addEventListener('message',function(e){var d=e&&e.data;if(!d||d.source!=='DICV_COURSEMAP_WEBOBJECT')return;var s=rd(),p=GetPlayer();if(d.type==='READY')e.source.postMessage({source:'DICV_STORYLINE_HOST',type:'STATE',payload:{navigationMode:s.nm,progress:s.pr}},'*');else if(d.type==='OPEN_MISSION'&&d.payload){var id=Number(d.payload.missionId),tp=C[0].t.filter(function(x){return x.m===id;})[0];if(!tp||(!s.nm&&tp.p.some(function(q){return Number(s.pr.t[String(q)])!==2;}))){e.source.postMessage({source:'DICV_STORYLINE_HOST',type:'NAVIGATION_DENIED',payload:{missionId:id,reason:'Complete prerequisite first.'}},'*');return;}s.pr.last=id;if(!s.pr.t[String(id)])s.pr.t[String(id)]=1;p.SetVar('CourseProgressData',JSON.stringify(s.pr));p.SetVar('RequestedMission',0);setTimeout(function(){p.SetVar('RequestedMission',id);},20);}else if(d.type==='CHANGE_MODE'){var nx=!s.nm;p.SetVar('NavigationMode',nx);pf('STATE',{navigationMode:nx,progress:s.pr});}});r.DICV_CourseMapHost={ok:1};})(window);
}

window.Script67 = function()
{
  (function (root) {
  try {
    var p = typeof root.GetPlayer === 'function' ? root.GetPlayer() : null;
    var prof = p ? (p.GetVar('HeaderProfile') || 'C') : 'C';
    if (root.__DICV_HEADER1_WIN__ && typeof root.__DICV_HEADER1_WIN__.postMessage === 'function') {
      root.__DICV_HEADER1_WIN__.postMessage({ source: 'DICV_STORYLINE_HOST', type: 'HEADER1_SET_PROFILE', profile: prof }, '*');
    }
  } catch (e) {}
})(window);
}

window.Script68 = function()
{
  if (window.DICV_CourseMapHost) window.DICV_CourseMapHost.markTopicStatus(106, 1);
}

window.Script69 = function()
{
  (function(r){if(r.__H1__)return;r.__H1__=1;r.addEventListener('message',function(e){var d=e&&e.data;if(!d||d.source!=='DICV_HEADER1_WEBOBJECT'||d.type!=='HEADER1_READY')return;r.__DICV_HEADER1_WIN__=e.source;try{var p=GetPlayer();e.source.postMessage({source:'DICV_STORYLINE_HOST',type:'HEADER1_SET_PROFILE',profile:(p?p.GetVar('HeaderProfile'):'A')||'A'},'*');e.source.postMessage({source:'DICV_STORYLINE_HOST',type:'HEADER1_SYNC'},'*');}catch(x){}});})(window);
}

window.Script70 = function()
{
  (function(r){if(r.DICV_CourseMapHost)return;var C=[{id:1,p:[],t:[{m:101,p:[]},{m:103,p:[101]},{m:102,p:[103]},{m:104,p:[102]},{m:105,p:[104]},{m:106,p:[105]}]}];function b(v){return v===true||v==='true'||v===1||v==='1';}function pr(s){try{var o=JSON.parse(s||'{}');return{v:1,t:(o&&o.t)||{},last:o.last||null};}catch(e){return{v:1,t:{},last:null};}}function rd(){var p=GetPlayer();return{nm:b(p.GetVar('NavigationMode')),pr:pr(p.GetVar('CourseProgressData'))};}function pf(t,pl){var fs=document.querySelectorAll('iframe');for(var i=0;i<fs.length;i++)if(fs[i].contentWindow)fs[i].contentWindow.postMessage({source:'DICV_STORYLINE_HOST',type:t,payload:pl},'*');}r.addEventListener('message',function(e){var d=e&&e.data;if(!d||d.source!=='DICV_COURSEMAP_WEBOBJECT')return;var s=rd(),p=GetPlayer();if(d.type==='READY')e.source.postMessage({source:'DICV_STORYLINE_HOST',type:'STATE',payload:{navigationMode:s.nm,progress:s.pr}},'*');else if(d.type==='OPEN_MISSION'&&d.payload){var id=Number(d.payload.missionId),tp=C[0].t.filter(function(x){return x.m===id;})[0];if(!tp||(!s.nm&&tp.p.some(function(q){return Number(s.pr.t[String(q)])!==2;}))){e.source.postMessage({source:'DICV_STORYLINE_HOST',type:'NAVIGATION_DENIED',payload:{missionId:id,reason:'Complete prerequisite first.'}},'*');return;}s.pr.last=id;if(!s.pr.t[String(id)])s.pr.t[String(id)]=1;p.SetVar('CourseProgressData',JSON.stringify(s.pr));p.SetVar('RequestedMission',0);setTimeout(function(){p.SetVar('RequestedMission',id);},20);}else if(d.type==='CHANGE_MODE'){var nx=!s.nm;p.SetVar('NavigationMode',nx);pf('STATE',{navigationMode:nx,progress:s.pr});}});r.DICV_CourseMapHost={ok:1};})(window);
}

window.Script71 = function()
{
  (function (root) {
  try {
    var p = typeof root.GetPlayer === 'function' ? root.GetPlayer() : null;
    var prof = p ? (p.GetVar('HeaderProfile') || 'C') : 'C';
    if (root.__DICV_HEADER1_WIN__ && typeof root.__DICV_HEADER1_WIN__.postMessage === 'function') {
      root.__DICV_HEADER1_WIN__.postMessage({ source: 'DICV_STORYLINE_HOST', type: 'HEADER1_SET_PROFILE', profile: prof }, '*');
    }
  } catch (e) {}
})(window);
}

window.Script72 = function()
{
  (function(r){if(r.__H1__)return;r.__H1__=1;r.addEventListener('message',function(e){var d=e&&e.data;if(!d||d.source!=='DICV_HEADER1_WEBOBJECT'||d.type!=='HEADER1_READY')return;r.__DICV_HEADER1_WIN__=e.source;try{var p=GetPlayer();e.source.postMessage({source:'DICV_STORYLINE_HOST',type:'HEADER1_SET_PROFILE',profile:(p?p.GetVar('HeaderProfile'):'A')||'A'},'*');e.source.postMessage({source:'DICV_STORYLINE_HOST',type:'HEADER1_SYNC'},'*');}catch(x){}});})(window);
}

window.Script73 = function()
{
  (function(r){if(r.DICV_CourseMapHost)return;var C=[{id:1,p:[],t:[{m:101,p:[]},{m:103,p:[101]},{m:102,p:[103]},{m:104,p:[102]},{m:105,p:[104]},{m:106,p:[105]}]}];function b(v){return v===true||v==='true'||v===1||v==='1';}function pr(s){try{var o=JSON.parse(s||'{}');return{v:1,t:(o&&o.t)||{},last:o.last||null};}catch(e){return{v:1,t:{},last:null};}}function rd(){var p=GetPlayer();return{nm:b(p.GetVar('NavigationMode')),pr:pr(p.GetVar('CourseProgressData'))};}function pf(t,pl){var fs=document.querySelectorAll('iframe');for(var i=0;i<fs.length;i++)if(fs[i].contentWindow)fs[i].contentWindow.postMessage({source:'DICV_STORYLINE_HOST',type:t,payload:pl},'*');}r.addEventListener('message',function(e){var d=e&&e.data;if(!d||d.source!=='DICV_COURSEMAP_WEBOBJECT')return;var s=rd(),p=GetPlayer();if(d.type==='READY')e.source.postMessage({source:'DICV_STORYLINE_HOST',type:'STATE',payload:{navigationMode:s.nm,progress:s.pr}},'*');else if(d.type==='OPEN_MISSION'&&d.payload){var id=Number(d.payload.missionId),tp=C[0].t.filter(function(x){return x.m===id;})[0];if(!tp||(!s.nm&&tp.p.some(function(q){return Number(s.pr.t[String(q)])!==2;}))){e.source.postMessage({source:'DICV_STORYLINE_HOST',type:'NAVIGATION_DENIED',payload:{missionId:id,reason:'Complete prerequisite first.'}},'*');return;}s.pr.last=id;if(!s.pr.t[String(id)])s.pr.t[String(id)]=1;p.SetVar('CourseProgressData',JSON.stringify(s.pr));p.SetVar('RequestedMission',0);setTimeout(function(){p.SetVar('RequestedMission',id);},20);}else if(d.type==='CHANGE_MODE'){var nx=!s.nm;p.SetVar('NavigationMode',nx);pf('STATE',{navigationMode:nx,progress:s.pr});}});r.DICV_CourseMapHost={ok:1};})(window);
}

window.Script74 = function()
{
  (function (root) {
  try {
    var p = typeof root.GetPlayer === 'function' ? root.GetPlayer() : null;
    var prof = p ? (p.GetVar('HeaderProfile') || 'C') : 'C';
    if (root.__DICV_HEADER1_WIN__ && typeof root.__DICV_HEADER1_WIN__.postMessage === 'function') {
      root.__DICV_HEADER1_WIN__.postMessage({ source: 'DICV_STORYLINE_HOST', type: 'HEADER1_SET_PROFILE', profile: prof }, '*');
    }
  } catch (e) {}
})(window);
}

window.Script75 = function()
{
  (function(r){if(r.__H1__)return;r.__H1__=1;r.addEventListener('message',function(e){var d=e&&e.data;if(!d||d.source!=='DICV_HEADER1_WEBOBJECT'||d.type!=='HEADER1_READY')return;r.__DICV_HEADER1_WIN__=e.source;try{var p=GetPlayer();e.source.postMessage({source:'DICV_STORYLINE_HOST',type:'HEADER1_SET_PROFILE',profile:(p?p.GetVar('HeaderProfile'):'A')||'A'},'*');e.source.postMessage({source:'DICV_STORYLINE_HOST',type:'HEADER1_SYNC'},'*');}catch(x){}});})(window);
}

window.Script76 = function()
{
  (function(r){if(r.DICV_CourseMapHost)return;var C=[{id:1,p:[],t:[{m:101,p:[]},{m:103,p:[101]},{m:102,p:[103]},{m:104,p:[102]},{m:105,p:[104]},{m:106,p:[105]}]}];function b(v){return v===true||v==='true'||v===1||v==='1';}function pr(s){try{var o=JSON.parse(s||'{}');return{v:1,t:(o&&o.t)||{},last:o.last||null};}catch(e){return{v:1,t:{},last:null};}}function rd(){var p=GetPlayer();return{nm:b(p.GetVar('NavigationMode')),pr:pr(p.GetVar('CourseProgressData'))};}function pf(t,pl){var fs=document.querySelectorAll('iframe');for(var i=0;i<fs.length;i++)if(fs[i].contentWindow)fs[i].contentWindow.postMessage({source:'DICV_STORYLINE_HOST',type:t,payload:pl},'*');}r.addEventListener('message',function(e){var d=e&&e.data;if(!d||d.source!=='DICV_COURSEMAP_WEBOBJECT')return;var s=rd(),p=GetPlayer();if(d.type==='READY')e.source.postMessage({source:'DICV_STORYLINE_HOST',type:'STATE',payload:{navigationMode:s.nm,progress:s.pr}},'*');else if(d.type==='OPEN_MISSION'&&d.payload){var id=Number(d.payload.missionId),tp=C[0].t.filter(function(x){return x.m===id;})[0];if(!tp||(!s.nm&&tp.p.some(function(q){return Number(s.pr.t[String(q)])!==2;}))){e.source.postMessage({source:'DICV_STORYLINE_HOST',type:'NAVIGATION_DENIED',payload:{missionId:id,reason:'Complete prerequisite first.'}},'*');return;}s.pr.last=id;if(!s.pr.t[String(id)])s.pr.t[String(id)]=1;p.SetVar('CourseProgressData',JSON.stringify(s.pr));p.SetVar('RequestedMission',0);setTimeout(function(){p.SetVar('RequestedMission',id);},20);}else if(d.type==='CHANGE_MODE'){var nx=!s.nm;p.SetVar('NavigationMode',nx);pf('STATE',{navigationMode:nx,progress:s.pr});}});r.DICV_CourseMapHost={ok:1};})(window);
}

window.Script77 = function()
{
  (function (root) {
  try {
    var p = typeof root.GetPlayer === 'function' ? root.GetPlayer() : null;
    var prof = p ? (p.GetVar('HeaderProfile') || 'C') : 'C';
    if (root.__DICV_HEADER1_WIN__ && typeof root.__DICV_HEADER1_WIN__.postMessage === 'function') {
      root.__DICV_HEADER1_WIN__.postMessage({ source: 'DICV_STORYLINE_HOST', type: 'HEADER1_SET_PROFILE', profile: prof }, '*');
    }
  } catch (e) {}
})(window);
}

window.Script78 = function()
{
  if (window.DICV_CourseMapHost) window.DICV_CourseMapHost.markTopicStatus(106, 2);
}

window.Script79 = function()
{
  (function(r){if(r.__H1__)return;r.__H1__=1;r.addEventListener('message',function(e){var d=e&&e.data;if(!d||d.source!=='DICV_HEADER1_WEBOBJECT'||d.type!=='HEADER1_READY')return;r.__DICV_HEADER1_WIN__=e.source;try{var p=GetPlayer();e.source.postMessage({source:'DICV_STORYLINE_HOST',type:'HEADER1_SET_PROFILE',profile:(p?p.GetVar('HeaderProfile'):'A')||'A'},'*');e.source.postMessage({source:'DICV_STORYLINE_HOST',type:'HEADER1_SYNC'},'*');}catch(x){}});})(window);
}

window.Script80 = function()
{
  (function(r){if(r.DICV_CourseMapHost)return;var C=[{id:1,p:[],t:[{m:101,p:[]},{m:103,p:[101]},{m:102,p:[103]},{m:104,p:[102]},{m:105,p:[104]},{m:106,p:[105]}]}];function b(v){return v===true||v==='true'||v===1||v==='1';}function pr(s){try{var o=JSON.parse(s||'{}');return{v:1,t:(o&&o.t)||{},last:o.last||null};}catch(e){return{v:1,t:{},last:null};}}function rd(){var p=GetPlayer();return{nm:b(p.GetVar('NavigationMode')),pr:pr(p.GetVar('CourseProgressData'))};}function pf(t,pl){var fs=document.querySelectorAll('iframe');for(var i=0;i<fs.length;i++)if(fs[i].contentWindow)fs[i].contentWindow.postMessage({source:'DICV_STORYLINE_HOST',type:t,payload:pl},'*');}r.addEventListener('message',function(e){var d=e&&e.data;if(!d||d.source!=='DICV_COURSEMAP_WEBOBJECT')return;var s=rd(),p=GetPlayer();if(d.type==='READY')e.source.postMessage({source:'DICV_STORYLINE_HOST',type:'STATE',payload:{navigationMode:s.nm,progress:s.pr}},'*');else if(d.type==='OPEN_MISSION'&&d.payload){var id=Number(d.payload.missionId),tp=C[0].t.filter(function(x){return x.m===id;})[0];if(!tp||(!s.nm&&tp.p.some(function(q){return Number(s.pr.t[String(q)])!==2;}))){e.source.postMessage({source:'DICV_STORYLINE_HOST',type:'NAVIGATION_DENIED',payload:{missionId:id,reason:'Complete prerequisite first.'}},'*');return;}s.pr.last=id;if(!s.pr.t[String(id)])s.pr.t[String(id)]=1;p.SetVar('CourseProgressData',JSON.stringify(s.pr));p.SetVar('RequestedMission',0);setTimeout(function(){p.SetVar('RequestedMission',id);},20);}else if(d.type==='CHANGE_MODE'){var nx=!s.nm;p.SetVar('NavigationMode',nx);pf('STATE',{navigationMode:nx,progress:s.pr});}});r.DICV_CourseMapHost={ok:1};})(window);
}

window.Script81 = function()
{
  (function (root) {
  try {
    var p = typeof root.GetPlayer === 'function' ? root.GetPlayer() : null;
    var prof = p ? (p.GetVar('HeaderProfile') || 'C') : 'C';
    if (root.__DICV_HEADER1_WIN__ && typeof root.__DICV_HEADER1_WIN__.postMessage === 'function') {
      root.__DICV_HEADER1_WIN__.postMessage({ source: 'DICV_STORYLINE_HOST', type: 'HEADER1_SET_PROFILE', profile: prof }, '*');
    }
  } catch (e) {}
})(window);
}

window.Script82 = function()
{
  (function(r){r.__CM_MODE__={mode:'m1_to_m2',moduleId:1};if(!r.__CM_T__){r.__CM_T__=1;r.addEventListener('message',function(e){var d=e&&e.data;if(!d||d.source!=='DICV_COURSEMAP_WEBOBJECT')return;if(d.type==='READY'){r.__CM_W__=e.source;r.DICV_CM_CMD('START_MODULE_INTRO',r.__CM_MODE__);}if(d.type==='TRANSITION_CONTINUE'&&r.GetPlayer)r.GetPlayer().SetVar('TransitionContinueClicked',true);});}r.DICV_CM_CMD=function(t,p){if(r.__CM_W__)r.__CM_W__.postMessage({source:'DICV_STORYLINE_HOST',type:t,payload:p||{}},'*');};r.DICV_CM_CMD('START_MODULE_INTRO',r.__CM_MODE__);})(window);
}

window.Script83 = function()
{
  window.DICV_CM_CMD('SHOW_EARNED_STAR', { moduleId: 1 });
if (window.__DICV_HEADER1_WIN__) {
  window.__DICV_HEADER1_WIN__.postMessage({ source: 'DICV_STORYLINE_HOST', type: 'HEADER1_SYNC' }, '*');
}
}

window.Script84 = function()
{
  window.DICV_CM_CMD('MOVE_CONVEYOR_HIGHLIGHT', { fromModule: 1, toModule: 2, durationMs: 1400 });
}

window.Script85 = function()
{
  window.DICV_CM_CMD('REVEAL_TOPICS', { moduleId: 2 });
}

window.Script86 = function()
{
  window.DICV_CM_CMD('TRANSITION_COMPLETE');
}

};

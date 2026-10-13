// Animated objects are separate from the clean background plate.
// All coordinates use the same 960 × 540 scene, including on cropped mobile views.
const effectsCanvas=document.getElementById('weather');effectsCanvas.width=960;effectsCanvas.height=540;const fx=effectsCanvas.getContext('2d');fx.imageSmoothingEnabled=false;
const exteriorPolygons=[
  // Left opening: keep the roof, cables, posts, railing and plants in front.
  [[0,72],[65,72],[120,53],[171,0],[315,0],[365,66],[399,113],[400,289],[0,289]],
  // Upper glass panes, below the awning; leave the center mullion uncovered.
  [[451,148],[623,148],[623,299],[451,299]],
  [[644,143],[780,143],[780,280],[755,286],[745,299],[644,299]],
  // Lower panes: cut around the record player, table and armchair.
  [[451,314],[623,314],[623,414],[527,414],[527,403],[505,390],[477,380],[451,376]],
  [[646,315],[742,315],[727,359],[675,372],[646,397]]
];
function clipExterior(){fx.beginPath();for(const polygon of exteriorPolygons){fx.moveTo(...polygon[0]);for(const point of polygon.slice(1))fx.lineTo(...point);fx.closePath()}fx.clip()}
let randomSeed=2099;function random(){randomSeed=(randomSeed*1664525+1013904223)>>>0;return randomSeed/4294967296}
const rainParticles=Array.from({length:230},()=>({x:random()*1020,y:random()*580,depth:random(),phase:random()}));
const vehicles=[{y:109,speed:17,offset:220,scale:.6,dir:1},{y:178,speed:25,offset:53,scale:1,dir:1},{y:237,speed:21,offset:524,scale:.8,dir:-1},{y:274,speed:30,offset:365,scale:1.1,dir:-1},{y:155,speed:13,offset:740,scale:.55,dir:-1}];
function pixel(x,y,w,h,color){fx.fillStyle=color;fx.fillRect(Math.round(x),Math.round(y),Math.ceil(w),Math.ceil(h))}
function car(x,y,size,direction,time){fx.save();fx.translate(Math.round(x),Math.round(y));fx.scale(direction*size,size);pixel(-13,2,31,4,'#201b37');pixel(-10,-1,24,5,'#654b80');pixel(-6,-4,12,4,'#383250');pixel(-4,-3,8,2,'#b184bd');pixel(3,-1,10,1,'#987399');pixel(-11,6,23,2,'#1b1830');pixel(-11,3,3,2,'#f58aa9');pixel(14,2,4,2,'#fcd0ed');pixel(18,2,6,1,'#ffc8df55');pixel(-21,4,9,1,'#f482b855');pixel(-13,7,4,1,Math.sin(time*7)>0?'#ac84e0':'#765196');fx.restore()}
function paintScene(time){fx.clearRect(0,0,960,540);fx.save();clipExterior();
  for(const v of vehicles){let x=(v.offset+time*v.speed)%1120-80;if(v.dir<0)x=960-x;car(x,v.y+Math.sin(time*.8+v.offset)*1.2,v.scale,v.dir,time)}
  for(const p of rainParticles){const speed=190+p.depth*210,length=4+p.depth*6,y=(p.y+time*speed)%580-20,x=(p.x-time*28-p.phase*80)%1020;fx.globalAlpha=.14+p.depth*.24;fx.fillStyle=p.depth>.65?'#dfbedb':'#b499ce';fx.fillRect(Math.round(x<0?x+1020:x),Math.round(y),1,Math.round(length))}fx.globalAlpha=1;fx.restore();
  // Steam starts at the mug's rim (59.4% / 77.7%), never at a window or roof.
  const warm=document.getElementById('world').classList.contains('tea-warm');for(let strand=0;strand<3;strand++){let phase=(time*(warm?.43:.27)+strand/3)%1;const rise=phase*30;fx.globalAlpha=Math.sin(phase*Math.PI)*.48;const x=570+strand*2+Math.sin(phase*6+strand)*2,y=419-rise;pixel(x,y,1,4,'#edc7de');pixel(x+1,y-3,1,3,'#edc7de');pixel(x+2,y-5,1,2,'#edc7de')}fx.globalAlpha=1;
  effectsCanvas.dataset.sceneTime=time.toFixed(3);
}
let sceneTime=0,lastSceneTime=null,lastPaint=-1;function sceneFrame(now){requestAnimationFrame(sceneFrame);const dt=lastSceneTime===null?0:Math.min((now-lastSceneTime)/1000,.05);lastSceneTime=now;if(!document.body.classList.contains('still'))sceneTime+=dt;if(now-lastPaint<1000/30)return;lastPaint=now;paintScene(sceneTime)}requestAnimationFrame(sceneFrame);
document.addEventListener('visibilitychange',()=>{lastSceneTime=null});

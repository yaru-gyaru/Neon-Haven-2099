// Twelve original procedural arrangements: distinct keys, tempos, voicings and melodies.
const albums=[
['Midnight in Shinjuku',72,48,[0,5,9,7],[0,2,4,7,4,2,0,-1],0],
['Last Train to Kyoto',78,45,[0,7,5,3],[7,4,2,0,2,4,9,7],1],
['Rain on Magnetic Tape',66,50,[0,3,7,5],[0,-1,4,2,-1,7,4,2],2],
['Sakura After Hours',74,53,[0,5,2,7],[9,7,4,2,0,4,2,7],0],
['Velvet Rooftops',62,44,[0,8,5,7],[0,4,-1,7,11,7,-1,4],2],
['Peach Moon',80,55,[0,7,9,5],[4,7,9,7,4,2,0,2],1],
['Sleeping Cat Waltz',68,48,[0,9,5,7],[0,4,7,12,7,4,2,0],3],
['Lavender Static',70,46,[0,5,3,7],[7,-1,4,2,0,-1,2,4],2],
['Cherry Tea at 2 AM',76,52,[0,5,7,9],[4,2,0,2,7,4,9,7],0],
['Purple Line Home',84,47,[0,3,5,7],[0,7,4,9,7,2,4,0],1],
['Window Full of Stars',60,49,[0,8,3,7],[12,-1,7,4,-1,2,4,7],2],
['Until the City Sleeps',64,43,[0,5,9,7],[7,4,2,-1,0,2,-1,0],3]
].map(([name,bpm,key,roots,melody,tone])=>({name,bpm,key,roots,melody,tone}));
const hz=n=>440*2**((n-69)/12);function musicTick(ac,bus,index,step){const song=albums[index],beat=60/song.bpm,bar=Math.floor(step/16),root=song.key+song.roots[bar%4],time=ac.currentTime+(step%2?beat*.065:0);function voice(midi,t,d,v,type='sine'){const o=ac.createOscillator(),g=ac.createGain(),f=ac.createBiquadFilter();o.type=type;o.frequency.value=hz(midi);f.type='lowpass';f.frequency.value=type==='triangle'?1100:2400;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+.02);g.gain.exponentialRampToValueAtTime(.001,t+d);o.connect(f).connect(g).connect(bus);o.start(t);o.stop(t+d+.1)}
if(step%16===0)[0,3,7,10,14].forEach((n,i)=>voice(root+n,time+i*.013,beat*7,.105,song.tone===1?'triangle':'sine'));if(step%4===0)voice(root-12,time,beat*1.7,.22);const m=song.melody[(step+Math.floor(bar/4)*2)%8];if(m>=0&&(song.tone!==2||step%2===0)){voice(root+12+m,time,beat*2,.17,song.tone===1?'triangle':'sine');voice(root+12+m,time+beat*.75,beat*1.3,.035)}
// Soft kick and brushed percussion, kept underneath the melody.
if(step%8===0){const o=ac.createOscillator(),g=ac.createGain();o.frequency.setValueAtTime(105,time);o.frequency.exponentialRampToValueAtTime(43,time+.12);g.gain.setValueAtTime(.2,time);g.gain.exponentialRampToValueAtTime(.001,time+.2);o.connect(g).connect(bus);o.start(time);o.stop(time+.22)}if(step%4===2&&song.tone!==3){const n=Math.floor(ac.sampleRate*.055),b=ac.createBuffer(1,n,ac.sampleRate),d=b.getChannelData(0);for(let i=0;i<n;i++)d[i]=(Math.random()*2-1)*(1-i/n);const src=ac.createBufferSource(),f=ac.createBiquadFilter(),g=ac.createGain();src.buffer=b;f.type='highpass';f.frequency.value=4500;g.gain.value=.025;src.connect(f).connect(g).connect(bus);src.start(time)}
}

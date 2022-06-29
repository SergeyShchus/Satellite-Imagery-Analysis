//VERSION=3 // Source: https://custom-scripts.sentinel-hub.com/sentinel-1/flood_mapping/ 
function setup() {return {
    input: ["VV","dataMask"], output: { bands: 4 }, mosaicking: "ORBIT" };}
function filterScenes (scenes) { return scenes.filter(function (scene) {
  var allowedDates = [beforeflood_date,duringflood_date]; 
  var sceneDateStr = dateformat(scene.date);
  if (allowedDates.indexOf(sceneDateStr)!= -1) return true; else return false; }); }
function dateformat(d){  
  var dd = d.getDate(); var mm = d.getMonth()+1; var yyyy = d.getFullYear();
  if(dd<10){dd='0'+dd;} if(mm<10){mm='0'+mm;} var isodate = yyyy+'-'+mm+'-'+dd; 
  return isodate; }

// Date Definition : 
var duringflood_date = "2022-06-21"; 
var beforeflood_date = "2022-06-09"; 

// Flood mapping : (6*VV~2*sqVV~1.4*dbVV)
function calcFM(sample) {
var   VV = sample.VV; 
var dbVV = (Math.max(0,Math.log(VV)*0.21714724095+1)); 
return [ 0.8*dbVV ]; } 

function evaluatePixel(samples,scenes) {  
var Bef=0; Bef=calcFM(samples[1]);
var Dur=0; Dur=calcFM(samples[0]); 
var Diff=Bef-Dur; 
var dataMask = samples[0].dataMask;
return [1.2*Dur,0.4*(2*Bef+1*Dur),1.2*Bef,dataMask];}
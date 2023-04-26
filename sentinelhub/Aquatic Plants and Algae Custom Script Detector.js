//https://apps.sentinel-hub.com/eo-browser/?zoom=10&lat=47.19205&lng=38.78448&themeId=DEFAULT-THEME&visualizationUrl=https%3A%2F%2Fservices.sentinel-hub.com%2Fogc%2Fwms%2Fbd86bcc0-f318-402b-a145-015f85b9427e&evalscript=Ly9pbmRpY2VzIHRvIGFwcGx5IGEgbWFzayB0byB3YXRlciBib2RpZXMKbGV0IG1vaXN0dXJlID0gKEI4QS1CMTEpLyhCOEErQjExKTsgCmxldCBORFdJID0gKEIwMyAtIEIwOCkvKEIwMyArIEIwOCk7CmxldCB3YXRlcl9ib2RpZXMgPSAoTkRXSS1tb2lzdHVyZSkvKE5EV0krbW9pc3R1cmUpOwovL2luZGljZXMgdG8gaWRlbnRpZnkgd2F0ZXIgcGxhbnRzIGFuZCBhbGdhZQpsZXQgd2F0ZXJfcGxhbnRzID0gKEIwNSAtIEIwNCkvKEIwNSArIEIwNCk7CmxldCBOSVIyID0gQjA0ICsgKEIxMSAtIEIwNCkqKCg4MzIsOCAtIDY2NCw2KS8oMTYxMyw3IC0gNjY0LDYpKTsKbGV0IEZBSSA9IEIwOCAtIE5JUjI7Ci8vaW5kaWNlcyB0byBhcHBseSBhIG1hc2sgb3ZlciBjbG91ZHMKLy9jb2RlIHRha2VuIGZyb20gc2VudGluZWwtMiBjdXN0b20gc2NyaXB0cyBjYnlfY2xvdWRfZGV0ZWN0aW9uIGJ5IFBldGVyIEZvZ2gKbGV0IGJSYXRpbyA9IChCMDMgLSAwLjE3NSkgLyAoMC4zOSAtIDAuMTc1KTsKbGV0IE5ER1IgPSBpbmRleChCMDMsIEIwNCk7CmxldCBnYWluID0gMi41OwovLyBuYXR1cmFsIGNvbG9yIGNvbXBvc2l0aW9uCmxldCBuYXR1cmFsX2NvbG9yID0gWzMqQjA0LCAzKkIwMywgMypCMDJdOwoKLy8gY2xvdWQgbWFzawpmdW5jdGlvbiBjbGlwKGEpIHsKIHJldHVybiBNYXRoLm1heCgwLCBNYXRoLm1pbigxLCBhKSk7Cn0KCmlmIChCMTE%2BMC4xICYmIGJSYXRpbyA%2BIDEpIHsgLy9jbG91ZAogdmFyIHYgPSAwLjUqKGJSYXRpbyAtIDEpOwogcmV0dXJuIG5hdHVyYWxfY29sb3I7Cn0KCmlmIChCMTEgPiAwLjEgJiYgYlJhdGlvID4gMCAmJiBOREdSPjApIHsgLy9jbG91ZAogdmFyIHYgPSA1ICogTWF0aC5zcXJ0KGJSYXRpbyAqIE5ER1IpOwogcmV0dXJuIG5hdHVyYWxfY29sb3I7Cn0KLy9jbGFzc2lmeSB0aGUgcHJlc2VuY2Ugb2YgYWxnYWUgYW5kIHdhdGVyIHBsYW50cyBvdmVyIHdhdGVyIHN1cmZhY2VzCmlmIChORFdJIDwgMCAmJiB3YXRlcl9ib2RpZXMgPiAwKSByZXR1cm4gbmF0dXJhbF9jb2xvcjsKZWxzZSByZXR1cm4gW0ZBSSo4LjUsIHdhdGVyX3BsYW50cyo1LjUsIE5EV0kqMV07Cgo%3D&datasetId=S2L2A&fromTime=2023-03-14T00%3A00%3A00.000Z&toTime=2023-03-14T23%3A59%3A59.999Z&demSource3D=%22MAPZEN%22#custom-script



//indices to apply a mask to water bodies
let moisture = (B8A-B11)/(B8A+B11); 
let NDWI = (B03 - B08)/(B03 + B08);
let water_bodies = (NDWI-moisture)/(NDWI+moisture);
//indices to identify water plants and algae
let water_plants = (B05 - B04)/(B05 + B04);
let NIR2 = B04 + (B11 - B04)*((832,8 - 664,6)/(1613,7 - 664,6));
let FAI = B08 - NIR2;
//indices to apply a mask over clouds
//code taken from sentinel-2 custom scripts cby_cloud_detection by Peter Fogh
let bRatio = (B03 - 0.175) / (0.39 - 0.175);
let NDGR = index(B03, B04);
let gain = 2.5;
// natural color composition
let natural_color = [3*B04, 3*B03, 3*B02];

// cloud mask
function clip(a) {
 return Math.max(0, Math.min(1, a));
}

if (B11>0.1 && bRatio > 1) { //cloud
 var v = 0.5*(bRatio - 1);
 return natural_color;
}

if (B11 > 0.1 && bRatio > 0 && NDGR>0) { //cloud
 var v = 5 * Math.sqrt(bRatio * NDGR);
 return natural_color;
}
//classify the presence of algae and water plants over water surfaces
if (NDWI < 0 && water_bodies > 0) return natural_color;
else return [FAI*8.5, water_plants*5.5, NDWI*1];


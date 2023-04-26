//VERSION=3 (auto-converted from 1)
/*
Source: @HarelDan - https://github.com/hareldunn/GIS_Repo/blob/master/Multi-Temporal%20NDVI%20for%20Sentinel%20Hub%20Custom%20Scripts
Visualizing NDVI multi-temporal trends in Sentinel-2 imagery.
Copy into Sentinel-Hub Playground 
will take the current image as baseline and calculate average NDVI for the previous 2 months
Based on:
https://twitter.com/sentinel_hub/status/922813457145221121
https://twitter.com/sentinel_hub/status/1020755996359225344
Script requires multi-temporal processing so parameter TEMPORAL=true should be added to the request.
*/

/* https://apps.sentinel-hub.com/sentinel-playground-temporal/?baseWmsUrl=services.sentinel-hub.com&instanceID=7bd7e1c0-4574-45b3-9d73-4f320e1c2e4f&source=S2&lat=47.066497210333836&lng=34.05967712402344&zoom=12&preset=CUSTOM&layers=B01,B02,B03&maxcc=30&gain=1&gamma=1&time=2015-01-01%7C2023-04-23&atmFilter=ATMCOR&showDates=false&evalscript=Ly9WRVJTSU9OPTMgKGF1dG8tY29udmVydGVkIGZyb20gMSkKLyoKU291cmNlOiBASGFyZWxEYW4gLSBodHRwczovL2dpdGh1Yi5jb20vaGFyZWxkdW5uL0dJU19SZXBvL2Jsb2IvbWFzdGVyL011bHRpLVRlbXBvcmFsJTIwTkRWSSUyMGZvciUyMFNlbnRpbmVsJTIwSHViJTIwQ3VzdG9tJTIwU2NyaXB0cwpWaXN1YWxpemluZyBORFZJIG11bHRpLXRlbXBvcmFsIHRyZW5kcyBpbiBTZW50aW5lbC0yIGltYWdlcnkuCkNvcHkgaW50byBTZW50aW5lbC1IdWIgUGxheWdyb3VuZCAKd2lsbCB0YWtlIHRoZSBjdXJyZW50IGltYWdlIGFzIGJhc2VsaW5lIGFuZCBjYWxjdWxhdGUgYXZlcmFnZSBORFZJIGZvciB0aGUgcHJldmlvdXMgMiBtb250aHMKQmFzZWQgb246Cmh0dHBzOi8vdHdpdHRlci5jb20vc2VudGluZWxfaHViL3N0YXR1cy85MjI4MTM0NTcxNDUyMjExMjEKaHR0cHM6Ly90d2l0dGVyLmNvbS9zZW50aW5lbF9odWIvc3RhdHVzLzEwMjA3NTU5OTYzNTkyMjUzNDQKU2NyaXB0IHJlcXVpcmVzIG11bHRpLXRlbXBvcmFsIHByb2Nlc3Npbmcgc28gcGFyYW1ldGVyIFRFTVBPUkFMPXRydWUgc2hvdWxkIGJlIGFkZGVkIHRvIHRoZSByZXF1ZXN0LgoqLwoKZnVuY3Rpb24gc2V0dXAoKSB7CiAgcmV0dXJuIHsKICAgIGlucHV0OiBbewogICAgICBiYW5kczogWwogICAgICAgICAgICAgICAgICAiQjA0IiwKICAgICAgICAgICJCMDgiCiAgICAgIF0KICAgIH1dLAogICAgb3V0cHV0OiB7IGJhbmRzOiAzIH0sCiAgICBtb3NhaWNraW5nOiAiT1JCSVQiCiAgfQp9CgoKZnVuY3Rpb24gY2FsY05EVkkoc2FtcGxlKSB7CiAgdmFyIGRlbm9tID0gc2FtcGxlLkIwNCtzYW1wbGUuQjA4OwogIHJldHVybiAoKGRlbm9tIT0wKSA%2FIChzYW1wbGUuQjA4LXNhbXBsZS5CMDQpIC8gZGVub20gOiAwLjApOwp9CmZ1bmN0aW9uICBzdHJldGNoKHZhbCwgbWluLCBtYXgpICB7CiByZXR1cm4gKHZhbC1taW4pLyhtYXgtbWluKTsKfQoKZnVuY3Rpb24gZXZhbHVhdGVQaXhlbChzYW1wbGVzLHNjZW5lcykgeyAgCiAgdmFyIGF2ZzEgPSAwOwogIHZhciBjb3VudDEgPSAwOwogIHZhciBhdmcyID0gMDsKICB2YXIgY291bnQyID0gMDsKICB2YXIgYXZnMyA9IDA7CiAgdmFyIGNvdW50MyA9IDA7CiAgdmFyIGVuZE1vbnRoID0gc2NlbmVzWzBdLmRhdGUuZ2V0TW9udGgoKTsKICAKICBmb3IgKHZhciBpPTA7aTxzYW1wbGVzLmxlbmd0aDtpKyspIHsKICAgICAgdmFyIG5kdmkgPSBjYWxjTkRWSShzYW1wbGVzW2ldKTsKICAgICAgaWYgKHNjZW5lc1tpXS5kYXRlLmdldE1vbnRoKCk9PWVuZE1vbnRoKQogICAgICB7CgkJYXZnMyA9IGF2ZzMgKyBuZHZpOwogICAgICAgIGNvdW50MysrOwogICAgICB9CiAgICAgIGVsc2UgaWYgKHNjZW5lc1tpXS5kYXRlLmdldE1vbnRoKCk9PShlbmRNb250aC0xKSkKICAgICAgewoJCWF2ZzIgPSBhdmcyICsgbmR2aTsKICAgICAgICBjb3VudDIrKzsKICAgICAgfQogICAgICBlbHNlCiAgICAgIHsgICAgICAKCQlhdmcxPSBhdmcxICsgbmR2aTsKICAgICAgICBjb3VudDErKzsKICAgICAgfQogICAgICAKICB9CiAgYXZnMSA9IGF2ZzEvY291bnQxOwogIGF2ZzIgPSBhdmcyL2NvdW50MjsKICBhdmczID0gYXZnMy9jb3VudDM7CiAgYXZnMSA9IHN0cmV0Y2goYXZnMSwgMC4xLCAwLjcpOwogIGF2ZzIgPSBzdHJldGNoKGF2ZzIsIDAuMSwgMC43KTsKICBhdmczID0gc3RyZXRjaChhdmczLCAwLjEsIDAuNyk7CiAgCiAgcmV0dXJuIFthdmcxLGF2ZzIsYXZnM107CgoKfQpmdW5jdGlvbiBmaWx0ZXJTY2VuZXMgKHNjZW5lcywgaW5wdXRNZXRhZGF0YSkgewogICAgcmV0dXJuIHNjZW5lcy5maWx0ZXIoZnVuY3Rpb24gKHNjZW5lKSB7CgkgIHJldHVybiBzY2VuZS5kYXRlLmdldFRpbWUoKT49KGlucHV0TWV0YWRhdGEudG8uZ2V0VGltZSgpLTMqMzEqMjQqMzYwMCoxMDAwKSA7CiAgICB9KTsKfQo%3D&temporal=true */

function setup() {
  return {
    input: [{
      bands: [
          "B04",
          "B08"
      ]
    }],
    output: { bands: 3 },
    mosaicking: "ORBIT"
  }
}


function calcNDVI(sample) {
  var denom = sample.B04+sample.B08;
  return ((denom!=0) ? (sample.B08-sample.B04) / denom : 0.0);
}
function  stretch(val, min, max)  {
 return (val-min)/(max-min);
}

function evaluatePixel(samples,scenes) {  
  var avg1 = 0;
  var count1 = 0;
  var avg2 = 0;
  var count2 = 0;
  var avg3 = 0;
  var count3 = 0;
  var endMonth = scenes[0].date.getMonth();
  
  for (var i=0;i<samples.length;i++) {
      var ndvi = calcNDVI(samples[i]);
      if (scenes[i].date.getMonth()==endMonth)
      {
		avg3 = avg3 + ndvi;
        count3++;
      }
      else if (scenes[i].date.getMonth()==(endMonth-1))
      {
		avg2 = avg2 + ndvi;
        count2++;
      }
      else
      {      
		avg1= avg1 + ndvi;
        count1++;
      }
      
  }
  avg1 = avg1/count1;
  avg2 = avg2/count2;
  avg3 = avg3/count3;
  avg1 = stretch(avg1, 0.1, 0.7);
  avg2 = stretch(avg2, 0.1, 0.7);
  avg3 = stretch(avg3, 0.1, 0.7);
  
  return [avg1,avg2,avg3];


}
function preProcessScenes (collections) {
  collections.scenes.orbits = collections.scenes.orbits.filter(function (orbit) {
      var orbitDateFrom = new Date(orbit.dateFrom)
      return orbitDateFrom.getTime() >= (collections.to.getTime()-3*31*24*3600*1000);
  })
  return collections
}

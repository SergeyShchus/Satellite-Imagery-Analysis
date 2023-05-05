//VERSION=3

//https://sentinelshare.page.link/Mua8
//https://sentinelshare.page.link/ndgF

//Normalized difference yellowness index (NDYI) formula
function A (a, b){
	return (a - b) / (a + b)
}

var NDYI = A (B03, B02)
//It is necessary to adjust the limit value NDYI if the index for the discrimination of canola crops is applied, NDYI < 0.08-0.13 turned out to be adequate
if (NDYI < 0.13) {
  return [5*B04, 5*B03, 4*B02] //true color
}

else {
  return [1, 1, 0] //yellow layer
}
//Para E. S.

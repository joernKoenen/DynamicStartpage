// Wallpaper metadatas
var imgCount = 16;
var sunriseImgNo = 6;
var sunsetImgNo = 12;

// Control status

var getSunTime = false;
var sunriseTime = 8 * 60; //8:00
var sunsetTime = 20 * 60; //20:00

var getLocation = false;
var lat = 0;
var lng = 0;

var timeCycle = [];
var updateInt = 2; //in Minutes
var imgNo = 0;

// Apply new image with number n
function applyImg(n) {
  document.getElementById('bg').style.backgroundImage = "url('img/stars2.png'), url('img/" + n + ".png')";
  this.imgNo = n;
}

function getImgNo(time) {
  for (var i = 1; i <= this.imgCount; i++) {
    var interval = Math.abs(this.timeCycle[i] - this.timeCycle[i + 1]);
    if ((time >= this.timeCycle[i] && time < this.timeCycle[i] + interval) ||
      (time >= this.timeCycle[i + 1] - interval && time < this.timeCycle[i + 1])) return i;
  }
  return this.imgNo;
}

// Check current image and update as desired
function update() {
  var d = new Date();
  var n = this.getImgNo(60 * d.getHours() + d.getMinutes());
  if (this.imgNo != n) this.applyImg(n);
}

// Calculate and fill the timeCycle array with start time for each image
function calcTimeCycle() {
  var res = new Array(this.imgCount + 1);
  var sunriseFirst = this.sunriseImgNo < this.sunsetImgNo;
  var startImgNo = sunriseFirst ? this.sunriseImgNo : this.sunsetImgNo;
  var endImgNo = sunriseFirst ? this.sunsetImgNo : this.sunriseImgNo;
  var startTime = sunriseFirst ? this.sunriseTime : this.sunsetTime;
  var endTime = sunriseFirst ? this.sunsetTime : this.sunriseTime;
  var insideInterval = (endTime - startTime) / (endImgNo - startImgNo);
  var outsideInterval = (24 * 60 - endTime + startTime) / (this.imgCount - endImgNo + startImgNo);

  res[startImgNo] = startTime;
  res[endImgNo] = endTime;
  for (var i = startImgNo - 1; i >= 1; i--) res[i] = res[i + 1] - outsideInterval;
  for (var i = startImgNo + 1; i < endImgNo; i++) res[i] = res[i - 1] + insideInterval;
  for (var i = endImgNo + 1; i <= this.imgCount + 1; i++) res[i] = res[i - 1] + outsideInterval;
  for (var i = 1; i <= this.imgCount + 1; i++) {
    if (res[i] >= 24 * 60) res[i] -= 24 * 60;
    else if (res[i] < 0) res[i] += 24 * 60;
  }
  this.timeCycle = res;
}

function updateTimeCircle() {
  this.calcTimeCycle();
  this.update();
}

function receiveSunTime() {
  if (getSunTime) {
    var requestURL = "https://api.sunrise-sunset.org/json?formatted=0&lat=" + this.lat + "&lng=" + this.lng;
    var request = new XMLHttpRequest();
    request.open('GET', requestURL);
    request.responseType = 'json';
    request.send();
    request.onload = function() {
      calcSunTime(request.response);
    };
    request.onerror = function() {
      this.sunriseTime = 5 * 60;
      this.sunsetTime = 20 * 60;
      this.updateTimeCircle();
    };
  } else this.updateTimeCircle();
}

function calcSunTime(response) {
  var sunriseDate = this.parseISOString(response.results.sunrise);
  var sunsetDate = this.parseISOString(response.results.sunset);
  this.sunriseTime = 60 * sunriseDate.getHours() + sunriseDate.getMinutes();
  this.sunsetTime = 60 * sunsetDate.getHours() + sunsetDate.getMinutes();
  this.updateTimeCircle();
}

// Convert ISO time string to Date object
function parseISOString(s) {
  var b = s.split(/\D+/);
  return new Date(Date.UTC(b[0], --b[1], b[2], b[3], b[4], b[5], b[6]));
}

this.receiveSunTime();
setInterval(this.update, this.updateInt * 60000);

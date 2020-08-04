function getOrdinalNum(n) {
  return n + (n > 0 ? ['th', 'st', 'nd', 'rd'][(n > 3 && n < 21) || n % 10 > 3 ? 0 : n % 10] : '');
}

var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var tday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function GetClock() {
  var today = new Date();
  var day = today.getDay(),
    nhour = today.getHours(),
    nmin = today.getMinutes();
  if (nmin <= 9) nmin = "0" + nmin;
  if (nhour <= 9) nhour = "0" + nhour;

  var date = getOrdinalNum(today.getDate()); //date x + ordinal number (th)
  var clocktext = tday[day] + ", " + date + " " + monthNames[today.getMonth()] + " " + nhour + ":" + nmin;
  document.getElementById('date').innerHTML = clocktext;

  var hour = today.getHours();
  if (hour >= 5 && hour <= 11) {
    document.querySelector('#greeting').innerHTML = 'Good Morning.';
  } else if (hour >= 12 && hour <= 17) {
    document.querySelector('#greeting').innerHTML = 'Good Afternoon.';
  } else if (hour >= 18 && hour <= 22) {
    document.querySelector('#greeting').innerHTML = 'Good Evening.';
  } else {
    document.querySelector('#greeting').innerHTML = 'Good Night.';
  }
}

GetClock();
setInterval(GetClock(), 30000);

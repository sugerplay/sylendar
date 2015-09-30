Math.gauce = function (value) {
  var floor = Math.floor(value);
  var delta = value - floor;
  return floor + ((delta==0)?0:1);
}

Date.prototype.yyyymmdd = function (splitter) {
  arguments[0] = (typeof arguments[0] === 'undefined')?'':arguments[0];
  
  var yyyy = this.getFullYear().toString();
  var mm = (this.getMonth() + 1).toString();
  var dd = this.getDate().toString();
  
  var size = arguments.length;
  var ret = '';
  
  var base = 0;
  ret += yyyy + arguments[base];
  base = (base+1 >= size)?base:base+1;
  ret += (mm[1] ? mm : '0'+mm[0]) + arguments[base];
  base = (base+1 >= size)?base:base+1;
  ret += (dd[1] ? dd : '0'+dd[0]);
  
  if (base != 0) {
    ret += arguments[base];
  }
  
  return ret;
}

Date.prototype.yyyymm = function (splitter) {
  splitter = (typeof splitter === 'undefined')?'':splitter;
  
  var yyyy = this.getFullYear().toString();
  var mm = (this.getMonth() + 1).toString();

  return yyyy + splitter + (mm[1] ? mm : '0'+mm[0]);
}

Date.prototype.mmdd = function (splitter) {
  splitter = (typeof splitter === 'undefined')?'':splitter;
  
  var mm = (this.getMonth() + 1).toString();
  var dd = this.getDate().toString();
  
  return (mm[1] ? mm : '0'+mm[0]) + splitter + (dd[1] ? dd : '0'+dd[0]);
}

String.prototype.date = function (splitter) {
  var str = new String(this);
  if (typeof splitter === 'undefined') {
    var interval = 
      (new Date().getFullYear().toString()[0]==str[0] && str.length > 4)?
      [4,2,2]:(str.length > 2)?[2,2]:[2];
      
    console.log(new Date().getFullYear().toString()[0]);
    
    var total = 0;
    str = _.map(interval, function (i) {
      var sub = str.substr(total, i);
      total += i;
      return sub;
    });
    
    splitter = '-';
    str = str.join('-');
  }
  
  var items = str.split(splitter);
  
  if (items.length == 1)
    items = [new Date().getMonth()+1].concat(items);
  
  if (items.length == 2)
    items = [new Date().getFullYear()].concat(items);
  
  if (items.length > 1)
      items[1]--;
      
  return new (Date.bind.apply(Date, [null].concat(items)));
}

Date.prototype.intervalByDate = function (dst) {
  var s = new Date(this.getFullYear(), this.getMonth(), this.getDate(), 0, 0, 0);
  var d = new Date(dst.getFullYear(), dst.getMonth(), dst.getDate(), 0, 0, 0);
  return Math.floor(Math.abs(s.getTime() - d.getTime()) / 1000 / 60 / 60 / 24);
}

Date.prototype.addByDate = function (days) {
  this.setDate(this.getDate() + days);
  return this;
}

Date.prototype.subByDate = function (days) {
  this.setDate(this.getDate() - days);
  return this;
}

Date.prototype.cutTimes = function () {
  this.setHours(0);
  this.setMinutes(0);
  this.setSeconds(0);
  return this;
}

function getCountOfWeek (initial, final) {
  var initialWeekDay = initial.getDay();
  var finalWeekDay = final.getDay();
  var period = final.intervalByDate(initial);
  
  var count = 0;
  var wd = initialWeekDay;
  if (wd != 0) {
    count++;
    wd = 0;
    
    period -= 7 - wd;
  }

  count += Math.gauce(period / 7);
  
  return count;
}
    
function getCountOfWeekInMonth (year, month) {
  var lastMonthDate = getLastDateOfMonth(year, month);
  var lastMonthWeekDay = weekDay(year, month, lastMonthDate);
  var firstMonthWeekDay = weekDay(year, month, 1);
  
  var count = 0;
  var wd = firstMonthWeekDay;
  if (firstMonthWeekDay == 0) {
      wd = 7;
  }
  else {
      count++;
  }
  
  var days = lastMonthDate - (7 - wd);
  count += Math.gauce(days / 7);
  
  return count;
};
    
function getLastDateOfMonth (year, month) {
  return (new Date(year,month,0)).getDate();
};
    
function weekDay (year, month, day) {
  return (new Date(year,month-1,day)).getDay();
};
    
// function stringToDateTime (str) {
//   var t = str.split(/[- :]/);
//   return new Date(t[0], t[1]-1, t[2], t[3], t[4], t[5]);
// };

// function stringToDate (str) {
//   var t = str.split(/[-]/);
//   return new Date(t[0], t[1]-1, t[2]);
// };
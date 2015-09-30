var IDAccumulator = 0;

var calendarType = {
  YEAR : 'year',
  MONTH : 'month',
  WEEK : 'week',
  DAY : 'day'
};

var d2s = function (d) {
  return d.yyyymmdd('-');
};

var s2d = function (s) {
  return s.toDate('-');
};

var generateID = function () {
  return IDAccumulator++;
};

var classWithAttrsSelector = function (c, attrs) {
  var attrString = '';
  for (var i in attrs) {
    var attr = attrs[i];
    attrString += '[' + attr.name + attr.comparison + '\'' + attr.value + '\'' + ']';
  }
  return '.' + c + attrString;
};

var eventObject = (function () {
  return {
      
  };
});
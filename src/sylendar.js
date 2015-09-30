// useful private variables
var $document = $(document),
	$window = $(window),
	$body = $('body');
  
$.fn.sylendar = new Function();
	
$.fn.sylendar = function (opts) {
  var targetElements = $(this),
		options,
		tipController;
		
	options = _.extend({}, $.fn.sylendar.defaults, opts);
	
	var now = new Date();
  var newSylendar = new $.fn.sylendarObject();
  
  if (options.type == calendarType.MONTH) {
    var lastDayInMonth = getLastDateOfMonth(options.year, options.month);
    var lastWeekDayInMonth = weekDay(options.year, options.month, lastDayInMonth);
    var firstWeekDayInMonth = weekDay(options.year, options.month, 1);
    
    var lastDayInPreMonth = getLastDateOfMonth(options.year, options.month-1);
    
    var countOfWeek = getCountOfWeekInMonth(options.year, options.month);
    
    var wdd = firstWeekDayInMonth;
    //wdd = (wdd == 0)?7:wdd;
    var d = lastDayInPreMonth - wdd + 1;
    var m = options.month - 2;
    var y = options.year;
    
    var initial = new Date(y,m,d);
    var final = new Date(initial);
    final.setDate(final.getDate() + 7*countOfWeek);

    makeCalendar(newSylendar, targetElements, initial, final, options.month);
    
    if (options.class !== '') {
      var classes = options.class.split(' ');
      for (var c in classes) {
        targetElements.addClass(classes[c]);
      }
    }
    
    newSylendar = _.extend(newSylendar, {
      getTarget: function () {
        return targetElements;
      },
      getColumnCount: function () {
        return 7;
      },
      getRowCount: function () {
        return countOfWeek;
      },
      getEventTemplate: function () {
        return options.eventTemplate;
      },
      getEllipsisTemplate: function () {
        return options.ellipsisTemplate;
      }
    });
  }
  
  return newSylendar;
};

var now = new Date();
$.fn.sylendar.defaults = {
  year: now.getFullYear(),
  month: now.getMonth() + 1,
  day: now.getDate(),
  type: calendarType.MONTH,
  class: "",
  eventTemplate: function (el, data) {
    el.text(data.summary);
  },
  ellipsisTemplate: function (el, events) {
    el.text()
  }
};
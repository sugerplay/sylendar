(function(factory) {
	// support loading the plugin as an amd module
	if (typeof define === 'function' && define.amd) {
		define([ 'jquery' ], factory);
	} else {
		factory(jQuery);
	}
}(function($) {
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
$.fn.sylendarObject = (function () {
  var _eventList = [];
  var _lastEventTopInCells = {};
  return {
    getTarget: function () {
      return null;
    },
    getColumnCount: function () {
      return 0;
    },
    getRowCount: function () {
      return 0;
    },
    getEventTemplate: function () {
      return null;
    },
    getEllipsisTemplate: function () {
      return null;
    },
    insertEvent: function (start, end, data, options) {
      var target = this.getTarget(),
        id = generateID()
        options = _.extend({
          redraw: true,
          single: false
        }, options);
          
      var e = {
        id: id,
        start: start,
        end: end,
        single: options.single
      };
      
      _eventList.push(_.extend(e, data));
      
      // sort events
      _eventList = this.sortEvents(_eventList);

      if (options.redraw) {
        this.render();
      }
      
      return _.extend(new eventObject, {
        id: id,
        $el: this.getEventEl(id)
      });
    },
    deleteEvent: function (id, options) {
      var options = _.extend({
        redraw: true
      }, options);
          
      _eventList = _.without(_eventList, _.findWhere(_eventList, {id: id}));
      
      if (options.redraw) {
        this.render(this);
      }
    },
    getEventEl: function (id) {
      var target = this.getTarget();
      return target.find(classWithAttrsSelector('event', [
        {name: 'event-id', comparison: '=', value: id}
      ]));
    },
    getEvent: function (id) {
      return _.findWhere(_eventList, {id: id});
    },
    getEllipsisEl: function (item) {
      if (typeof item === 'number') {
        return this.getTarget().find(classWithAttrsSelector('ellipsis', [
          {name: 'cell-index', comparison: '=', value: item}
        ]));
      }
      else if (typeof item === 'object') {
        var cellIndex = item.attr('cell-index');
        return this.getTarget().find(classWithAttrsSelector('ellipsis', [
          {name: 'cell-index', comparison: '=', value: cellIndex}
        ]));
      }
      return null;
    },
    toggleSingleEvent: function (id) {
      var e = this.getEvent(id);
      e.single = !e.single;
      this.render();
      return e.single;
    },
    setEventSingle: function (id) {
      var e = this.getEvent(id);
      if (!e.single) {
        e.single = true;
        this.render();
      }
    },
    setEventNonSingle: function (id) {
      var e = this.getEvent(id);
      if (e.single) {
        e.single = false;
        this.render();
      }
    },
    sortEvents: function (events) {
      events = _.sortBy(events, function (item) {
        return item.summary;
      }).reverse();
      events = _.sortBy(events, function (item) {
        return item.end.yyyymmdd();
      }).reverse();
      events = _.sortBy(events, function (item) {
        return item.start.yyyymmdd();
      });
      return events;
    },
    render: function () {
      console.log('render');
      var target = this.getTarget();
      var calendarStart = s2d(target.attr('start'));
      var calendarEnd = s2d(target.attr('end'));
      var now = new Date();
      
      var events = _.cloneDeep(_eventList);
      
      _.each(events, function (event) {
        event.isStart = true;
        event.isEnd = false;
        event.isSliced = false;
        event.isExpired = false;
        event.origStart = event.start;
        event.origEnd = event.end;
        
        if (event.start < now && event.end < now) {
          event.isExpired =  true;
        }
      });
      
      events = _.filter(events, function (event) {
        if (d2s(event.start) < d2s(calendarStart)
          && event.single) {
          return false;
        }
        if (d2s(event.start) < d2s(calendarStart)
          && d2s(event.end) <= d2s(calendarStart)) {
          return false;
        }
        if (d2s(event.start) >= d2s(calendarEnd)
          && d2s(event.end) > d2s(calendarEnd)) {
          return false;
        }
        return true;
      });
      
      _.each(events, function (event) {
        if (d2s(event.start) < d2s(calendarStart)) {
          //event.start = new Date(calendarStart);
        }
        
        if (d2s(event.end) > d2s(calendarEnd)) {
          event.end = new Date(calendarEnd);
        }
      });
      
      target.find('.event').remove();
      _lastEventTopInCells = {};

      var unit = 14.28571428571429;
      if (this.getColumnCount() != 7)
        unit = 100/this.getColumnCount();
      
      _.each(target.find('.event-board .row'), function (row, index) {
        var rowHeight = $(row).height() - 21;
        // 21 is height for cell date
        var tempEl = $('<div>').addClass('event').hide();
        $(row).append(tempEl);
        var itemHeight = tempEl.height() + 2;
        // 2 is spacing
        tempEl.remove();

        var availableCount = Math.floor(rowHeight / itemHeight);
        
        var start = s2d($(row).attr('start'));
        var end = s2d($(row).attr('end'));
        
        var dateStamp = new Date(start);
        
        var eventCountStackList = {};
        var lastCellPosition = 0;
        var cellIndex = index * this.getColumnCount();
        
        if (events.length > 0) {
          while (d2s(events[0].start) < d2s(end)
            && d2s(events[0].start) >= d2s(start)) {
            var event = events[0];
            events.shift();
            
            // split check
            if (!event.single) {
              if (d2s(event.end) > d2s(end)) {
                var newOne = _.clone(event);
                event.isSliced = true;
                newOne.isSliced = true;
                newOne.isStart = false;
                event.end = new Date(end);
                newOne.start = new Date(end);
                events.push(newOne);
                events = this.sortEvents(events);
              }
              else {
                event.isEnd = true;
              }
            }
            
            // current pos, width, top
            var left = event.start.subToDayCount(start);
            var length = event.end.subToDayCount(event.start);
            var top = 0;
            var eventStart = event.start;
            var eventEnd = event.end;
            
            if (event.single) {
              length = 1;
              eventEnd = new Date(eventStart);
              eventEnd.setDate(eventEnd.getDate() + 1);
            }
            
            // dist for current and last
            var moveDistance = left - lastCellPosition;
            cellIndex += moveDistance;
            
            // apply current event stack
            for (var i in eventCountStackList) {
              eventCountStackList[i] -= moveDistance;
              if (eventCountStackList[i] <= 0) {
                delete eventCountStackList[i];
              }
            }
            lastCellPosition = left;
            
            // top position
            for (var i in eventCountStackList) {
              if (i == top) {
                top++;
              }
              else {
                break;
              }
            }
            
            // set eventCountTable
            for (var i=0; i<length; i++) {
              var currentTop = top+1;
              
              if (typeof _lastEventTopInCells[cellIndex + i] === 'undefined')
                _lastEventTopInCells[cellIndex + i] = 0;
              
              if (_lastEventTopInCells[cellIndex + i] < currentTop)
                _lastEventTopInCells[cellIndex + i] = currentTop;
            }
            
            var eventEl = $('<div>')
              .addClass('unselectable')
              .addClass('event')
              .addClass('event-template');
                
            if (event.isStart) {
              eventEl.addClass('start-line');
            }
            
            if (event.isEnd) {
              eventEl.addClass('end-line');
            }
                
            _.bind(this.getEventTemplate(), this)(eventEl, event);
            
            $(row).append(eventEl);
            
            var height = $(eventEl).outerHeight();
            var margin = 2;
            // set left
            eventEl.css('left', 'calc(' + (unit * left) + '% + 4px)');
            // set length
            eventEl.css('width', 'calc(' + (unit * length) + '% - 7px)');
            // set top
            eventEl.css('margin-top', (height + margin) * top);
            
            // // set left
            // eventEl.css('left', 'calc(' + (unit * left) + '% + 4px)');
            
            // // set length
            // eventEl.css('width', 'calc(' + (unit * length) + '% - 7px)');
            // $(row).append(eventEl);
            
            // var height = $(eventEl).outerHeight();
            // var margin = 2;
            // eventEl.css('margin-top', (height + margin) * top);
            
            // set Event attributes
            eventEl.attr('cell-index', cellIndex);
            eventEl.attr('pos', top);
            eventEl.attr('row', index);
            eventEl.attr('column', left);
            eventEl.attr('length', length);
            eventEl.attr('start',_d2s(eventStart));
            eventEl.attr('end', d2s(eventEnd));
            eventEl.attr('event-id', event.id);
            
            if (events.length <= 0)
              break;
            
            eventCountStackList[top] = length;
          }
        }
        
        // draw ellipsis for cells
        for (var i in _lastEventTopInCells) {
          var r = parseInt(i / this.getColumnCount());
          var c = i % this.getColumnCount();
          var top = _lastEventTopInCells[i];
          
          if (r > index)
            break;
              
          if (r != index)
            continue;
          
          var ellipsisEl = $('<div>')
            .addClass('unselectable')
            .addClass('event')
            .addClass('ellipsis');
          // ellipsisEl.text('ellipsis');
          
          $(row).append(ellipsisEl);
          
          var height = $(ellipsisEl).outerHeight();
          var margin = 2;
          
          // set left
          ellipsisEl.css('left', 'calc(' + (unit * c) + '% + 4px)');
          // set top
          ellipsisEl.css('margin-top', (height + margin) * top);
          
          ellipsisEl.attr('cell-index', i);
          ellipsisEl.attr('pos', top);
          ellipsisEl.attr('row', r);
          ellipsisEl.attr('column', c);
          ellipsisEl.attr('length', 1);
          ellipsisEl.hide();
        }
      }, this);
      
      this.resize();
    },
    resize: function () {
      console.log('res');
      var target = this.getTarget();
      
      var ellipsisInCell = {};
      var dateStart = '';
      
      var events = target.find('.event');
      events.show();
      
      _.each(target.find('.event-board .row'), function (row, index) {
        var adjust = 2;
        var rowHeight = $(row).height() - 21 + adjust;
        
        if (dateStart == '')
          dateStart = $(row).attr('start').toDate();
        
        // 21 is height for cell date
        var tempEl = $('<div>').addClass('event').hide();
        $(row).append(tempEl);
        var itemHeight = tempEl.height() + 2;
        // 2 is spacing
        tempEl.remove();

        var availableCount = Math.floor(rowHeight / itemHeight);
        
        if (availableCount <= 0) {
          $(row).find('.event').hide();
          return;
        }
        
        // set ellipsis top
        _.each($(row).find('.ellipsis'), function (e) {
          var height = $(e).outerHeight();
          var margin = 2;
          $(e).css('margin-top', (height + margin) * (availableCount-1));
        });
        
        for (var c in _lastEventTopInCells) {
          // 작업중
          // if (_lastEventTopInCells[c] < availableCount-1) {
          //     availableCount = Math.floor((rowHeight+10) / itemHeight);
          // }
          
          var currentDateString = new Date(dateStart).addDateByDays(parseInt(c));
          currentDateString = currentDateString.yyyymmdd('-');
          
          var rowEvents = events.filter(function () {
            return $(this).attr("row") == index;
          }).filter(function() {
            return $(this).attr("start") <= currentDateString;
          }).filter(function() {
            return $(this).attr("end") > currentDateString;
          });
          
          // it is overed thing at calendar lines
          var overed = rowEvents.filter(function() {
            return $(this).attr("pos") >= availableCount;
          });
          overed.hide();
          
          _.each(overed, function (o, index) {
            var cellIndex = parseInt(c);
            if (typeof ellipsisInCell[cellIndex] === 'undefined') {
              ellipsisInCell[cellIndex] = [];
            }
            ellipsisInCell[cellIndex].push($(o).attr('event-id'));
          });
              
          if (_lastEventTopInCells[c] > availableCount) {
            // making ellipsis text like +1 more
            var extraSeen = rowEvents.filter(function() {
              return $(this).attr("pos") == availableCount-1;
            });
            extraSeen.hide();
            
            _.each(extraSeen, function (o, index) {
              var cellIndex = parseInt(c);
              var cellIndexForEvent = $(o).attr('cell-index');
              
              for (var i=cellIndexForEvent; i<=cellIndex; i++) {
                if (typeof ellipsisInCell[i] === 'undefined') {
                  ellipsisInCell[i] = [];
                }
                ellipsisInCell[i].push($(o).attr('event-id'));
              }
            });
          }
          else if (_lastEventTopInCells[c] == availableCount) {
          }
          
          
        }
      });
      
      // target.find('.ellipsis').remove();
      
      // making ellipsis texts
      var ellipsisSet = target.find('.ellipsis');
      ellipsisSet.hide();
      for (var i in ellipsisInCell) {
        var ellipsis = ellipsisSet.filter(function () {
          return $(this).attr('cell-index') == i;
        });
        var c = ellipsisInCell[i];
        c = _.uniq(c, true);
        // ellipsis.text('+' + c.length + ' more');
        
        _.bind(this.getEllipsisTemplate(), this)(ellipsis, c);
        
        ellipsis.show();
      }
    }
  };
});
function makeCalendar (sylendar, target, initial, final, primaryMonth) {
  var termDays = final.intervalByDate(initial);
  
  // 캘린더 가로 격자 카운트
  var daysAtHorizontal = (termDays >= 7)?7:termDays;
  
  if (termDays <= 0) {
    return null;
  }
  
  target.empty();
  target.addClass('sylendar-root').addClass('unselectable');
  target.attr('start', d2s(initial));
  target.attr('end', d2s(final));
  
  // 몇주로 구성된 캘린더 인지?
  var countOfWeek = getCountOfWeek(initial, final);
  var rowHeight = 100/countOfWeek;    // N %
  
  // index 테이블 생성
  var top = $('<div>')
    .addClass('border-line')
    .addClass('top');
  target.append(top);
  
  var dayName = ['일','월','화','수','목','금','토'];
  for (var i=0; i<7; i++) {
    var indexCell = $('<div>')
      .addClass('cell')
      .addClass('indexer');
    top.append(indexCell);
    
    if (i == 0) {
      indexCell.addClass('sunday');
    }
    
    if (i == 6) {
      indexCell.addClass('saturday');
    }
    
    indexCell.text(dayName[i]);
  }
  
  var bottom = $('<div />')
    .addClass('border-line')
    .addClass('bottom');
  target.append(bottom);
  
  // for calendar templating: event-board
  var templateBoard = $('<div>').addClass('template-board');
  bottom.append(templateBoard);
  
  // for event containing: event-board
  var eventBoard = $('<div>').addClass('event-board');
  bottom.append(eventBoard);
  
  // 캘린더 템플릿 생성
  var templateRowTop = 0;
  var eventRowTop = 0;
  var dateStamp = new Date(initial);
  while (dateStamp < final) {
    var templateRow = $('<div />')
      .addClass('row');
    var eventRow = $('<div />')
      .addClass('row');
    
    var eventTable = $('<div />')
      .addClass('row-table')
      .addClass('event-table')
      .css('position','relative');
    
    var termStartDate = new Date(dateStamp);
    var termEndDate = new Date(termStartDate);
    termEndDate.setDate(termEndDate.getDate() + daysAtHorizontal - 1);
    
    var start = new Date(dateStamp);
    
    for (var i = 0; i < daysAtHorizontal; i++) {
      // for template
      var templateCell = $('<div />')
        .addClass('cell')
        .addClass('border-line')
        .addClass('template-cell');

      var cellText = dateStamp.getDate();
      if (dateStamp.getDate() === 1) {
        cellText = (dateStamp.getMonth()+1) + '.' + cellText;
        if (dateStamp.getMonth() === 0) {
          cellText = dateStamp.getFullYear() + '.' + cellText;
        }
      }
      
      templateCell.text(cellText);
      templateRow.append(templateCell);
      
      // check for today
      if (d2s(dateStamp) === d2s(new Date())) {
        templateCell.addClass('today');
      }
      
      templateCell.attr('date', d2s(dateStamp));

      dateStamp.setDate(dateStamp.getDate()+1);
    }

    // set event row attribute
    var start = d2s(start);
    var end = d2s(dateStamp);
    eventRow.attr('start', start);
    eventRow.attr('end', end);
    
    // template row sizing
    templateRow.css('top',templateRowTop+'%');
    var adjustHeight = rowHeight;
    if (dateStamp < final) {
      //adjustHeight++;
    }
    templateRow.css('height',adjustHeight+'%');
    templateRowTop += rowHeight;
    
    // event row sizing
    eventRow.css('top',eventRowTop+'%');
    eventRow.css('height',rowHeight+'%');
    eventRowTop += rowHeight;
    
    templateBoard.append(templateRow);
    eventBoard.append(eventRow);
  }
  
  $('html').on('mousemove', function () {
    //target.find('.template-cell').removeClass('selected');
  });
  
  return target;
}
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
}));
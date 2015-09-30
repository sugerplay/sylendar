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
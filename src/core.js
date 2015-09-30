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
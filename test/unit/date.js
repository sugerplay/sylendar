$(function() {
	'use strict';
	
	module('date utility');
	
	test('Math utility', function() {
	  strictEqual(typeof Math.gauce, 'function', 'Math.gauce is defined');
	  strictEqual(Math.gauce(1.4), 2, 'Math.gauce doing correctly');
	});
	
	test('Date stringify', function() {
    var date = new Date(2015, 9-1, 29);
    var dateForMMDD = new Date(new Date().getFullYear(), 9-1, 29);
    var dateForDD
      = new Date(new Date().getFullYear(), new Date().getMonth(), 29);
	    
		strictEqual(typeof date.yyyymmdd, 'function', 'Date.yyyymmdd is defined');
		strictEqual(date.yyyymmdd(), '20150929', 'Date.yyyymmdd doing correctly');
		strictEqual(date.yyyymmdd('-'), '2015-09-29', 'Date.yyyymmdd with splitter doing correctly');
		
		strictEqual(typeof date.yyyymm, 'function', 'Date.yyyymm is defined');
		strictEqual(date.yyyymm(), '201509', 'Date.yyyymm doing correctly');
		strictEqual(date.yyyymm('-'), '2015-09', 'Date.yyyymm with splitter doing correctly');
		
		strictEqual(typeof date.mmdd, 'function', 'Date.mmdd is defined');
		strictEqual(date.mmdd(), '0929', 'Date.mmdd doing correctly');
		strictEqual(date.mmdd('-'), '09-29', 'Date.mmdd with splitter doing correctly');
		
		strictEqual(typeof '20150929'.date, 'function', 'String.toDate is defined');
		deepEqual('20150929'.date(), date, 'String.date doing correctly');
		deepEqual('2015-09-29'.date('-'), date, 'String.date with splitter doing correctly');
		deepEqual('0929'.date(), dateForMMDD, 'Testing for mmdd');
		deepEqual('09-29'.date('-'), dateForMMDD, 'Testing for mmdd with splitter');
		deepEqual('29'.date(), dateForDD, 'Testing for dd');
	});
	
	test('Date calculation', function() {
	  var src = new Date(2015, 9-1, 29)
      , dst = new Date(2015, 10-1, 3);

    strictEqual(typeof src.intervalByDate, 'function', 'Date.intervalByDate is defined');
    strictEqual(src.intervalByDate(dst), 4, 'Date.intervalByDate doing correctly');
    
    strictEqual(typeof dst.addByDate, 'function', 'Date.addByDate is defined');
    deepEqual(dst.addByDate(4), new Date(2015, 10-1, 7),
      'Date.addByDate doing correctly');
      
    strictEqual(typeof src.subByDate, 'function', 'Date.subByDate is defined');
	  deepEqual(src.subByDate(2), new Date(2015, 9-1, 27),
      'Date.subByDate doing correctly');
      
    var timeDate = new Date(2015, 9-1, 29, 22, 15, 30);
      
    strictEqual(typeof timeDate.cutTimes, 'function', 'Date.cutTimes is defined');
	  deepEqual(timeDate.cutTimes(), new Date(2015, 9-1, 29),
      'Date.cutTimes doing correctly');
    
    strictEqual(getLastDateOfMonth(2015, 9), 30, 'getLastDateOfMonth doing correctly');
    strictEqual(weekDay(2015, 9, 29), 2, 'weekDay doing correctly');
    strictEqual(getCountOfWeekInMonth(2015, 9), 5, 'getCountOfWeekInMonth doing correctly');
	});
});
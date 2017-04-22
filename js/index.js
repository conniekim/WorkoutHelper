$(document).ready(function() {

    // START JQUERY CALENDAR
    $('#calendar').fullCalendar({
        // put your options and callbacks here
    })

   	// END JQUERY CALEDNAR

    // START CUSTOM MADE CALENDAR

    var currYear = moment().format('YYYY'); //gets curr year
    var currWeek = moment().format('w');
    var today = moment().format('dddd'); //get today and don't change this
    var currDay = moment().format('dddd'); //get today (full) and this can change on selected
    // var today = moment().format('dd');

    var day = document.getElementById(currDay.toLowerCase());
    day.innerHTML = moment().day('Monday').year(currYear).week(currWeek).date();
    var startWeekDate = moment().startOf('week').date();
   

    var selectedWeekNum = 0; //clicking prev and next will increase or decrease this value and the dates SHOULD change in response??
    /* For filling in the calendar of selected week, default = curr */
    var daysArray = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    for(var i = 0; i < daysArray.length; i++) {
    	var day = document.getElementById(daysArray[i]); 
    	day.innerHTML = moment().day(i).year(currYear).week(currWeek).date();
    }

    /*For filling in current month */
    var month = document.getElementById('currMonth');
    month.innerHTML = moment().format('MMM') + " " + moment().format('YYYY'); //gets current month and year

    /* For highlighting the current day of the week */
    var todayDay = document.getElementById(currDay.toLowerCase()); 
    $(todayDay).addClass('current'); 

    /* To show the tasks for the one that has been clicked on */
    $("td.date").click(function(){
    	$('td.date').removeClass('selected');
    	$(this).addClass('selected');
    	currDay = $(this).attr('id');
    	console.log('clicked ' + currDay);
	});


    // var cal = document.getElementById('calendar-content'); 
    // cal.innerHTML = now; 
    // cal.append(currDate);
    // cal.append(currMonth);
    // cal.append(currYear);

    // END CUSTOM MADE CALENDAR LAYOUT

    /* Adding to TODO and COMPLETED tasks */
	var query = decodeURIComponent(window.location.search.split('=')[1]);
	query = query.replace(/\_/g, " ");
	if (query !== undefined) {
	}
	$.get("https://m6raqib0xd.execute-api.us-east-1.amazonaws.com/prod/ExerciseUpdate?TableName=Calendar", function(data, status) {
		var json = JSON.parse(JSON.stringify(data));
		var items = json.Items;
		var dict; 
		if (items) { 
			for (var i = 0; i < items.length; i++) {
				dict = items[i];
				// var spacedQuery = query.replace(/\_/g, " ");
				// console.log("query: " + query);
				// console.log("recipename: " + dict.RecipeName.toLowerCase()); 
				if (dict.Day.toLowerCase() === currDay.toLowerCase()) {
					var toDos = dict.ToDo;
					var completed = dict.Completed;

					for (var j = 0; j < toDos.length; j++) {
						var toDoTask = toDos[j];
						$(".to-do").append("<div class=col-xs-12><div class=task>"+ toDoTask + "</div></div>");
					}
					for (var k = 0; k < completed.length; k++) {
						var completedTask = completed[k];
						$(".completed").append("<div class=col-xs-12><div class=task>"+ completedTask + "</div></div>");
					}
				}
			}
		} else {
			$(".to-do").text("No tasks found");
		}
	});




});

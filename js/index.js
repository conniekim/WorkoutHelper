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
   

    var changeWeek = 0; //clicking prev and next will increase or decrease this value and the dates SHOULD change in response??
    $('#prev-button').click(function() {
        changeWeek--;
        console.log("changeWeek" + changeWeek);
    });

    $('#next-button').click(function() {
        changeWeek++;
        console.log("changeWeek: " + changeWeek);
    });
    /* For filling in the calendar of selected week, default = curr */
    var daysArray = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    for(var i = 0; i < daysArray.length; i++) {
    	var day = document.getElementById(daysArray[i]); 
        console.log("currWeek: " + currWeek); 
        console.log("currWeek+0: " + parseInt(currWeek)+0);
    	day.innerHTML = moment().day(i).year(currYear).week(parseInt(currWeek) + changeWeek).date();
    }

    /*For filling in current month */
    var month = document.getElementById('currMonth');
    month.innerHTML = moment().format('MMM') + " " + moment().format('YYYY'); //gets current month and year

    /* For highlighting the current day of the week */
    var todayDay = document.getElementById(currDay.toLowerCase()); 
    $(todayDay).addClass('current'); 

    var query; 
    /* To show the tasks for the one that has been clicked on */
    $("td.date").click(function(){
    	$('td.date').removeClass('selected');
    	$(this).addClass('selected');
    	var curr = $(this).attr('id');
    	console.log('clicked ' + query);
        window.location.replace("index.html?varname=" + curr);
	});

    // END CUSTOM MADE CALENDAR LAYOUT

    var query = decodeURIComponent(window.location.search.split('=')[1]);
    query = query.replace(/\_/g, " ");

    if (query === 'undefined') {
        $(todayDay).addClass('selected');
    } else {
        $('td.date').removeClass('selected');
        $('td.date#' + query).addClass('selected');
    }
    /* Adding to TODO and COMPLETED tasks */
	$.get("https://m6raqib0xd.execute-api.us-east-1.amazonaws.com/prod/ExerciseUpdate?TableName=Calendar", function(data, status) {
		var json = JSON.parse(JSON.stringify(data));
		var items = json.Items;
		var dict; 
		if (items) { 
            if (query === 'undefined') {
                console.log("query is undefined because default");
                query = moment().format('dddd'); 
                console.log('default query: ' + query);
            }

			for (var i = 0; i < items.length; i++) {
				dict = items[i];
				// var spacedQuery = query.replace(/\_/g, " ");
				console.log("query: " + query);
                console.log("day: " + dict.Day);
				if (dict.Day.toLowerCase() === query.toLowerCase()) {
                    console.log("they're matching!");
					var toDos = dict.ToDo;
					var completed = dict.Completed;
                    if(toDos) {
                        console.log("they have todos!");
    					for (var j = 0; j < toDos.length; j++) {
    						var toDoTask = toDos[j];
    						$(".to-do").append('<div class="col-xs-12"><div class="task"><div class="task-name">' + toDoTask + '</div><div class=edit><img src="img/edit.svg"></div><div class="remove"><img src="img/remove.svg"></div></div></div>');

                       }
                    }
                    if(completed) {
                        console.log("they have completed!");
    					for (var k = 0; k < completed.length; k++) {
    						var completedTask = completed[k];
    						$(".completed").append('<div class="col-xs-12"><div class="task"><div class="task-name">' + completedTask + '</div><div class=edit><img src="img/edit.svg"></div><div class="remove"><img src="img/remove.svg"></div></div></div>');
    					}
                    }
				}
			}
		} else {
			$(".to-do").text("No tasks found");
		}
	});




});

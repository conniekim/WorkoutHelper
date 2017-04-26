$(document).ready(function() {

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
        changeWeek--; //have the prev week stuff appear (already have it loaded and just display it)
        // console.log("changeWeek" + changeWeek);
        setDates(changeWeek); 
    });

    $('#next-button').click(function() {
        changeWeek++; //have next week stuff appear (already have it loaded and just display it)
        // console.log("changeWeek: " + changeWeek);
        setDates(changeWeek);
    });

    /* For filling in the calendar of selected week, default = curr */
    var daysArray = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

    function setDates(change) {
        $('td.date').removeClass('current');

        var currMonthDisplay = 0; 
        var prev = 0; 

        for(var i = 0; i < daysArray.length; i++) {
        	var day = document.getElementById(daysArray[i]); 
            var date = moment().day(i).year(currYear).week(parseInt(currWeek) + change).date();
            if((prev >= 28 && prev <= 31) && (date == 1) && (i >= 0 && i < 4)) {
                currMonthDisplay = 1; 
            } //fix this logic by showcase 

        	day.innerHTML = date;
            if(date === moment().date()) {
                /* For highlighting the current date of the week */
                 var todayDay = document.getElementById(currDay.toLowerCase()); 
                $(todayDay).addClass('current');     
            }

            prev = date; 
        }

        var month = document.getElementById('currMonth');
        if(currMonthDisplay == -1) {
            month.innerHTML = moment().add(-1, 'months').format('MMM') + " " + moment().format('YYYY');
        } else if(currMonthDisplay == 1) {
            month.innerHTML = moment().add(1, 'months').format('MMM') + " " + moment().format('YYYY');
        } else {
            month.innerHTML = moment().format('MMM') + " " + moment().format('YYYY'); //gets current month and year
        }
    }



    /* Getting database information */
    var daysMap = {}; 
    var daysUppercase = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]; 

    /* Adding to TODO and COMPLETED tasks */
    $.get("https://ykldkx5wj7.execute-api.us-east-1.amazonaws.com/prod/RecipeUpdate?TableName=WorkoutUserInfoTest", function(data, status) {
        var json = JSON.parse(JSON.stringify(data));
        var items = json.Items;
        var map;  
        if(items) {
            map = items[0]; 

            for(var i = 0; i < daysUppercase.length; i++) {
                var day = daysUppercase[i];
                if(map.mapAttr[day]) {
                    daysMap[day] = map.mapAttr[day];
                } else {
                    console.log(day + " not defined!");
                }
            }

            /* Populate the current day's tasks */
            var currDay = moment().format('dddd'); 
            placeTasks(currDay); 
            setDates(0);   
            // console.log(moment().date());             
        } else {
            $(".to-do").text("No workouts found assigned to the calendar");
        }
    });

    /* To show the tasks for the one that has been clicked on */
    var clickedDay = ""; 
    $("td.date").click(function(){
    	$('td.date').removeClass('selected');
    	$(this).addClass('selected');
    	clickedDay = $(this).attr('id');
        // window.location.replace("index.html?varname=" + curr);
        placeTasks(toTitleCase(clickedDay)); 
	});

    function placeTasks(day) {
         document.getElementById('to-do-content').innerHTML = ""; 
         var tasks = daysMap[day];
         if(tasks) {
            for(var start = 0; start < tasks.length; start++) {
                var eachTask = tasks[start]; 
                console.log(eachTask);
                $('#to-do-content').append('<div class="col-xs-12"><div class="task"><div class="task-name">' + toTitleCase(eachTask)
                    + '</div><div class=edit><img src="img/edit.svg"></div><div class="remove"><img src="img/remove.svg"></div></div></div>');
            }
        }
    }

    function toTitleCase(str)
    {
        return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
    }

    // END CUSTOM MADE CALENDAR LAYOUT



});

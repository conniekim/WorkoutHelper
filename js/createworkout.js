$(document).ready(function() {

    $.get("	https://m6raqib0xd.execute-api.us-east-1.amazonaws.com/prod/ExerciseUpdate?TableName=Exercises", function(data, status) {
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


});
/**
 * Created by triFire on 16/4/2.
 */
function getWeekNumber(d) {
    // Copy date so don't modify original
    d = new Date(+d);
    d.setHours(0,0,0);
    // Set to nearest Thursday: current date + 4 - current day number
    // Make Sunday's day number 7
    d.setDate(d.getDate() + 4 - (d.getDay()||7));
    // Get first day of year
    var yearStart = new Date(d.getFullYear(),0,1);
    // Calculate full weeks to nearest Thursday
    var weekNo = Math.ceil(( ( (d - yearStart) / 86400000) + 1)/7);
    // Return array of year and week number
    return weekNo;
}

function addEvent(event, element, func) {
    if (element.addEventListener)  // W3C DOM
        element.addEventListener(event, func);
    else if (element.attachEvent) { // IE DOM
        element.attachEvent("on"+event, func);
    }
    else { // No much to do
        element[event] = func;
    }
}
const urlParser = document.createElement('a')

export function domain (url) {
    urlParser.href = url
    return urlParser.hostname
}

export function count (arr) {
    return arr.length
}

export function prettyDate (date) {
    var a = new Date(date)
    if(isNaN(a.getTime()))
        return '';
    return a.toDateString()
}

export function MMDDYYYY (date) {
    var a = new Date(date);
    if(isNaN(a.getTime()))
        return '';
    return (a.getMonth()+1) +'/' + a.getDate() + '/' + a.getFullYear();
}

export function MMDDYYYYhhmm (date) {
    var a = new Date(date);
    if(isNaN(a.getTime()))
        return '';
    return (a.getMonth()+1) + '/' + a.getDate() + '/' + a.getFullYear() 
        + ' ' + ("00" + a.getHours()).slice(2) + ':' + ("00" + a.getMinutes()).slice(2);
}

export function localeDate (date) {
    var a = new Date(date);
    if(isNaN(a.getTime()))
        return '';
    return a.toLocaleString();
}

export function localeDateOrTimeToday (date) {
    var a = new Date(date);    
    var todayDate = new Date().toLocaleDateString();
    if(isNaN(a.getTime()))
        return '';
    if(a.toLocaleDateString() !== todayDate)
        return todayDate;
    return a.toLocaleTimeString();
}

export function reverse (value) {
    // slice to make a copy of array, then reverse the copy
    return value.slice().reverse();
}

//export function pluralize (time, label) { //see vue2-filters
//    if (time === 1) {
//        return time + label
//    }

//    return time + label + 's'
//}

export function truncate (string)
{
    return string.substring(0, 30) + '...';
}

export function noData (string)
{
     if(string === ''){
         return '[No Data]'
     }
     return string;
}
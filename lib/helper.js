module.exports = () => {
    var helpers = {};
 helpers.stringToDate = (_date,_format,_delimiter) => {

        var formatLowerCase=_format.toLowerCase();
        var formatItems=formatLowerCase.split(_delimiter);
        var dateItems=_date.split(_delimiter);
        var monthIndex=formatItems.indexOf("mm");
        var dayIndex=formatItems.indexOf("dd");
        var yearIndex=formatItems.indexOf("yyyy");
        var date1 =  parseInt(dateItems[dayIndex])+1;
        var month=parseInt(dateItems[monthIndex]);
        month-=1;
        var formatedDate = new Date(dateItems[yearIndex],month,date1);
        console.log(formatedDate);
        return formatedDate;
    }

  return helpers;
};
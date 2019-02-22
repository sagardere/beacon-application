// module.exports = () => {
//     var helpers = {};
//  helpers.stringToDate = (_date,_format,_delimiter) => {

//         var formatLowerCase=_format.toLowerCase();
//         var formatItems=formatLowerCase.split(_delimiter);
//         var dateItems=_date.split(_delimiter);
//         var monthIndex=formatItems.indexOf("mm");
//         var dayIndex=formatItems.indexOf("dd");
//         var yearIndex=formatItems.indexOf("yyyy");
//         var date1 =  parseInt(dateItems[dayIndex])+1;
//         var month=parseInt(dateItems[monthIndex]);
//         month-=1;
//         var formatedDate = new Date(dateItems[yearIndex],month,date1);
//         console.log(formatedDate);
//         return formatedDate;
//     }

//   return helpers;
// };



// var str = "29-1-2016";
// darr = str.split("-"); // ["29", "1", "2016"]
// var dobj = new Date(parseInt(darr[2]),parseInt(darr[1])-1,parseInt(darr[0]));
// // Date {Fri Jan 29 2016 00:00:00 GMT+0530(utopia standard time)
// console.log(dobj.toISOString());
// //2016-01-28T18:30:00.000Z

module.exports = () => {
    var helpers = {};
 helpers.stringToDate = (date) => {
    
    darr = date.split("-");
    console.log(darr)
    var dobj = new Date(parseInt(darr[2]),parseInt(darr[1])-1,parseInt(darr[0]));
    let ISOdate = dobj.toISOString();
    console.log(ISOdate)
    return ISOdate;
    }
  
  return helpers;
};

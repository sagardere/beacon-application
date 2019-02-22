module.exports = () => {
    var helpers = {};
 helpers.stringToDate = (date) => {
    
    darr = date.split("-");
    console.log(darr)
    var dobj = new Date(parseInt(darr[2]),parseInt(darr[1])-1,parseInt(darr[0]));
    let ISOdate = dobj.toISOString();
    //console.log(ISOdate)
    return ISOdate;
    }
  
  return helpers;
};

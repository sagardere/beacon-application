//var dateString = "15 Aug 1996";

function getAge() {		//pass dob
	var dateString = "15-08-1996";
	darr = dateString.split("-");		//dob.split()
    console.log(darr)
    var dobj = new Date(parseInt(darr[2]),parseInt(darr[1])-1,parseInt(darr[0]));
    let ISOdate = dobj.toISOString();
    //console.log(ISOdate)
	
    var today = new Date();
    var birthDate = new Date(ISOdate);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    console.log("age:"+age)
    //return age;
}
    getAge();
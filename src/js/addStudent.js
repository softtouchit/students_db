/**
 * My module:
   To add a student to the collection
 */
X.sub("init", function() {
  
  var status = X('status');
  status.innerHTML="Loaded";
  

  X('save').onclick=function() {
    var student={};
    var form = X('form');
    
    student.studentNo=form.studentNo.value;
    student.name=form.name.value;
    student.age=form.age.value;
    student.sex=form.sex.value;
    
    X.post("/students", student, function(resp) {
        status.innerHTML=resp;
    });
   
  };


});

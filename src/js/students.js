/**
 * My module:
 *  order.js
 */
X.sub("init", function() {
    
    
    var table ={
        id: "students",
        render: function(i,name, item) {
            switch (i) {
                case 0: return item.id ;
                case 1: return item.studentNo ;
                case 2: return item.name ;
                case 3: return moment(item.created * 1000).format("DD/MM/YYYY") ;
                case 4: return item.age ;
                case 5: return item.sex ;
                case 6: return '<button data-onclick="modal" data-image="' + item.name + '" class="btn btn-primary btn-sm" data-toggle="modal" data-target="#addStudent">Add Student</button> ';
              default:
                return "Unknown";
            }
        }
    };
    
    X.pub('initTable', table);
    

    function remove(dataset) {
        X.del("/json/student/" + dataset.id, function(resp) {
            X.pub("refresh",{});
        });
    }
    

    var form = X('addStudentForm');
    
    X.sub('modal', function(evt, dataset) {
        form.image.value = dataset.image;
        form.image.placeholder = dataset.image;
    });

    X.sub("submit", function() {
       X.pub('submitForm', containerForm);
    });
    
    
    var containerForm ={
        id: "addStudentForm",
        submit: function(req) {
            X('createResult').innerHTML = JSON.stringify(req);
            X.post("/json/students", req, function(resp) {
            var jres = JSON.parse(resp);
            X.pub("refresh",{});
            X('createResult').innerHTML = "<p>Created, check <a href='/json/student?id=" + jres.id + "' >here</a> to see details</p>";
        });
        }
    };

    X.sub('create', function(evt,el) {
        X.pub('validate',containerForm);
    });
    

});
var url = "http://localhost:3030";

function registerUser() {
     var email = document.getElementsByClassName("email");
     var password = document.getElementsByClassName("password");

     $.ajax({
         url: url + "/register",
         method: "post",
         data: {
             email: email[0].value,
             password: password[0].value
         }
     }).success(function(response){
         alert(response.message);
     }).error(function(response) {
         alert(response.message);
     });
}

function loginUser() {
    var email = document.getElementsByClassName("email");
    var password = document.getElementsByClassName("password");

    $.ajax({
        url: url + "/login",
        method: "post",
        data: {
            email: email[0].value,
            password: password[0].value
        }
    }).success(function(response){
     window.location.assign("/home");
 }).error(function(response) {
     alert("Incorrect username or password!");
 });
}

function getUser() {
    var email = document.getElementsByClassName("email");

    $.ajax({
        url: url + "/user",
        method: "get"
    }).success(function(response){
        document.getElementsByClassName("email")[0].innerHTML = response.email;
    }).error(function(response) {
        alert("Cannot fetch data. Please try again");
    });

    $.ajax({
    url: url + "/projects",
    method: "get"
    }).success(function(response) {

    //Loop through each row and display them in the HTML
    for(var a = 0; a < response.length; a++) {
        var project = response[a];

        //Display owner items data in the table
        $("#projecttable").append("<tr>" + 
            "<td>" + project.name + "</td>" +
            "<td>" + project.description + "</td>" + 
            "<td>" + project.startdate + "</td>" +
            "<td>" + project.enddate + "</td>" +
            '<td><button onclick="editProject(\'' + project._id + '\')">Edit</button>&nbsp&nbsp&nbsp<button href="#" onclick="deleteProject(\'' + project._id + '\')">Delete</button></td>' +            
        "</tr>");
    }
 }).error(function(response) {
     alert("Cannot fetch data. Please try again");
 });
}

function editProject(id) {
    var name = prompt("Please enter new name (" + id + ")", "");
    if(name === null) { //If cancel button was pressed don't continue
        return;
    }

    var description = prompt("Please enter new description", "");
    if(description === null) { //If cancel button was pressed don't continue
        return;
    }

    var startdate = prompt("Please enter new Start date", "");
    if(startdate === null) { //If cancel button was pressed don't continue
        return;
    }

    var enddate = prompt("Please enter new End date", "");
    if(enddate === null) { //If cancel button was pressed don't continue
        return;
    }

    if (name !== "" && description !== "" && startdate !== "" && enddate !== "") {

            $.ajax({
                url: url + "/edit",
                method: "post",
                data: {
                    _id: id,
                    name: name,
                    description: description,
                    startdate: startdate,
                    enddate: enddate
                }
           }).success(function(response){
               alert("Project edited successfully!");
               window.location.assign("/home");
           }).error(function(response) {
               alert("Cannot edit project. Please try again");
           });
        
     } else {
        alert('You cannot leave empty fields');
     }
}

function deleteProject(id) {
    var decision = confirm("You are about to delete this row (" + id + "). Are you sure you want to delete it?");

    if(decision) {
        $.ajax({
            url: url + "/delete",
            method: "post",
            data: {
                _id: id
            }
        }).success(function(response){
            alert("Project deleted successfully!");
            window.location.assign("/home");
        }).error(function(response) {
            alert("Cannot delete project. Please try again");
        });
    }
}

function editItem(id) {
    alert(id);
}

function deleteItem(id) {
    alert(id);
}

function addProject() {
    var name = document.getElementsByClassName("name");
    var descp = document.getElementsByClassName("description");
    var sdate = document.getElementsByClassName("startdate");
    var edate = document.getElementsByClassName("enddate");

    $.ajax({
        url: url + "/project",
        method: "post",
        data: {
            name: name[0].value,
            descp: descp[0].value,
            sdate: sdate[0].value,
            edate: edate[0].value
        }
    }).success(function(response){
        alert("Project added successfully!");     
    }).error(function(response) {
        alert("Cannot add project. Please try again");
    });
}



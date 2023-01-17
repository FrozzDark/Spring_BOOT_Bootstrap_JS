let allUsers;
let allRoles;

fetch('/api/roles').then(
    res => {
        res.json().then(
            roles => {
                allRoles = roles;
            })
    })

fetch('/api/admins')
    .then(res => {
        res.json()
            .then(
                data => {
                    allUsers = data;
                    createTable(allUsers);
                })
    })

function createTable(data) {
    let temp = "";
    data.forEach(u => {
        console.log(u)
        temp += "<tr id=\"" + u.id + "\">";
        temp += "<td>" + u.id + "</td>";
        temp += "<td>" + u.username + "</td>";
        temp += "<td>" + u.name + "</td>";
        temp += "<td>" + u.surname + "</td>";
        temp += "<td>" + u.age + "</td>";
        temp += "<td>" + u.email + "</td>";
        temp += "<td>";
        let rolesStr = "";
        u.roles.forEach(r => {
            rolesStr += r.name.replaceAll("ROLE_", "") + " ";
        })
        temp += rolesStr + "</td>";
        temp += "<td><button class=\"btn btn-info\" onclick=\"fEdit(" + u.id + ")\" id=\"editBtn" + u.id + "\">Edit</button></td>";
        temp += "<td><button class=\"btn btn-danger\" onclick=\"fDel(" + u.id + ")\" id=\"deleteBtn" + u.id + "\">Delete</button></td>" + "</tr>";
    })
    document.getElementById("usersTableBody").innerHTML = temp;
}

fetch('/api/users')
    .then(res => {
            res.json().then(
                data => {
                    let temp = "";
                    console.log(data)
                    temp += "<tr id=\"" + data.id + "\">";
                    temp += "<td>" + data.id + "</td>";
                    temp += "<td>" + data.username + "</td>";
                    temp += "<td>" + data.name + "</td>";
                    temp += "<td>" + data.surname + "</td>";
                    temp += "<td>" + data.age + "</td>";
                    temp += "<td>" + data.email + "</td>";
                    temp += "<td>";
                    let rolesStr = "";
                    data.roles.forEach(r => {
                        rolesStr += r.name.replaceAll("ROLE_", "") + " ";
                    })
                    temp += rolesStr + "</td>" + "</tr>";
                    document.getElementById("currentUsersTableBody").innerHTML = temp;
                }
            )
        }
    )

fetch('/api/roles').then(
    res => {
        res.json().then(
            roles => {
                let temp = "";
                console.log(roles)
                document.getElementById("rolesNew").size = roles.length;
                roles.forEach(r => {
                    temp += "<option>" + r.name + "</option>";
                })
                document.getElementById("rolesNew").innerHTML = temp;
            }
        )
    }
);
$('#addUserBtn').click(function () {
    let newUser = {
        username: "",
        name: "",
        surname: "",
        age: "",
        email: "",
        password: "",
        roles: []
    };
    newUser.username = document.getElementById("usernameNew").value;
    newUser.name = document.getElementById("nameNew").value;
    newUser.surname = document.getElementById("surnameNew").value;
    newUser.age = document.getElementById("ageNew").value;
    newUser.email = document.getElementById("emailNew").value;
    newUser.password = document.getElementById("passwordNew").value;
    newUser.roles = [];
    [].slice.call(document.getElementById("rolesNew")).forEach(op => {
        if (op.selected) {
            allRoles.forEach(r => {
                if (r.name === op.text) {
                    newUser.roles.push(r);
                }
            })
        }
    })
    fetch('/api/admins', {
        method: 'POST',
        body: JSON.stringify(newUser),
        headers: {'Content-Type': 'application/json'}
    }).then(res1 => {
        if (res1.ok) {
            res1.json().then(u => {
                allUsers.push(u);
                createTable(allUsers);
            })
            document.getElementById("usernameNew").value = "";
            document.getElementById("nameNew").value = "";
            document.getElementById("surnameNew").value = "";
            document.getElementById("ageNew").value = "";
            document.getElementById("emailNew").value = "";
            document.getElementById("passwordNew").value = "";
            document.getElementById("rolesNew").selectedIndex = -1;
        } else {
            alert("Не удалось добавить: " + res1.status);
        }
    })
})

function getUserById(id) {
    let t = null;
    allUsers.forEach(u => {
        if (u.id === id) {
            t = u;
        }
    })
    return t;
}

$('#editUserBtn').click(function () {
    let id = document.getElementById("idEdit").value;
    let edit = {
        id: -1,
        username: "",
        name: "",
        surname: "",
        age: "",
        email: "",
        password: "",
        roles: []
    };
    $('#editModal').modal('hide');
    edit.id = document.getElementById("idEdit").value;
    edit.username = document.getElementById("usernameEdit").value;
    edit.name = document.getElementById("nameEdit").value;
    edit.surname = document.getElementById("surnameEdit").value;
    edit.age = document.getElementById("ageEdit").value;
    edit.email = document.getElementById("emailEdit").value;
    edit.password = document.getElementById("passwordEdit").value;
    edit.roles = [];
    [].slice.call(document.getElementById("rolesEdit")).forEach(op => {
        if (op.selected) {
            allRoles.forEach(r => {
                if (r.name === op.text) {
                    edit.roles.push(r);
                }
            })
        }
    })
    console.log(edit)
    fetch('/api/admins/' + id, {
        method: 'PUT',
        body: JSON.stringify(edit),
        headers: {'Content-Type': 'application/json'}
    })
        .then(res => {
            if (res.ok) {
                allUsers.forEach(u => {
                    if (u.id === edit.id) {
                        u.username = edit.username;
                        u.name = edit.name;
                        u.surname = edit.surname;
                        u.age = edit.age;
                        u.email = edit.email;
                        if (edit.password !== "") {
                            u.password = edit.password;
                        }
                        u.roles = edit.roles;
                    }
                })
                createTable(allUsers);
            }
        });

})

$('#delUserBtn').click(function () {
    let id = document.getElementById("idDelete").value;
    $('#deleteModal').modal('hide');

    fetch('/api/admins/' + id, {method: 'DELETE'})
        .then(res => {
            if (res.ok) {
                document.getElementById(id).remove();
                let u = getUserById(id);
                let i = allUsers.indexOf(u);
                delete allUsers[i];
            }
        });
})

function fEdit(el) {
    console.log(el);
    let id = el;
    allUsers.forEach(u => {
        if (u.id === id) {
            console.log(u);
            document.getElementById("idEdit").value = u.id;
            document.getElementById("usernameEdit").value = u.username;
            document.getElementById("nameEdit").value = u.name;
            document.getElementById("surnameEdit").value = u.surname;
            document.getElementById("ageEdit").value = u.age;
            document.getElementById("emailEdit").value = u.email;
            document.getElementById("passwordEdit").value = u.password;
            document.getElementById("rolesEdit").size = allRoles.length;
            let temp = "";
            allRoles.forEach(r => {
                let select = "";
                u.roles.forEach(rUser => {
                    if (rUser.id === r.id) {
                        select = " selected";
                    }
                })
                temp += "<option" + select + ">" + r.name + "</option>";
            })
            document.getElementById("rolesEdit").innerHTML = temp;
        }
    });
    $('#editModal').modal('show');
}

function fDel(el) {
    console.log(el);
    let id = el;
    allUsers.forEach(u => {
        if (u.id === id) {
            console.log(u);
            document.getElementById("idDelete").value = u.id;
            document.getElementById("usernameDelete").value = u.username;
            document.getElementById("nameDelete").value = u.name;
            document.getElementById("surnameDelete").value = u.surname;
            document.getElementById("ageDelete").value = u.age;
            document.getElementById("emailDelete").value = u.email;
            document.getElementById("passwordDelete").value = u.password;
            document.getElementById("rolesDelete").size = u.roles.length.toString();
            let temp = "";
            u.roles.forEach(r => {
                temp += "<option>" + r.name.replaceAll("ROLE_", "") + "</option>";
            })
            document.getElementById("rolesDelete").innerHTML = temp;
        }
    });
    $('#deleteModal').modal('show');
}
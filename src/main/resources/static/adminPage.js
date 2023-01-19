$(async function () {
    await showUsersTable();
    await allRoles();
    await addNewUser();
    await authUser();
    await showUserById(id);
    await editUser(id);
    await deleteUser(id);
});

async function showUsersTable() {
    const table = $('#usersTableBody').empty();
    fetch("/api/admins", {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Referer': null
        }
    })
        .then((response) => response.json())
        .then(data => {
            data.forEach(user => {
                let allUsersTable = `$(
                    <tr>
                        <td>${user.id}</td>
                        <td>${user.username}</td>
                        <td>${user.name}</td>
                        <td>${user.surname}</td>
                        <td>${user.age}</td>
                        <td>${user.email}</td>
                        <td>${user.roles.map(role => " " + role.name.substring(5))}</td>
                        <td>
                             <button type="button" class="btn btn-success btn btn-info modal-open" id="editbutton"
                             onclick="editUser(${user.id})" data-toggle="modal" data-target="#editModal">
                             Edit
                             </button>
                        </td>     
                        <td>
                            <button type="button" class="btn btn-success btn btn-danger modal-open" id="deleteButton"
                             onclick="deleteUser(${user.id})" data-toggle="modal" data-target="#deleteModal">
                             Delete
                             </button>
                        </td>
                    </tr>
                )`;
                table.append(allUsersTable);
            })
        })
}

async function showUserById(id) {

    let response = await fetch("/api/admins/" + id,
        {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Referer': null
            }
        })
    return await response.json();
}

async function allRoles() {

    let response = await fetch("/api/roles",
        {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Referer': null
            }
        })

    return await response.json();
}

async function addNewUser(){

    allRoles().then(roles => {
        roles.forEach(role => {
            let option = new Option(role.name.substring(5), role.id);
            $('#rolesNew').append(option);
        })
    })

    const form = document.forms["newUserForm"];
    form.addEventListener('submit', sendData)

    async function sendData(event) {
        event.preventDefault();

        let newUser = await userData(form);

        console.log(newUser);

        fetch("/api/admins", {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Referer': null
            },
            body: newUser
        }).then(() => {
            document.forms["newUserForm"].reset();
            showUsersTable();
            $('#usersTableTab').click();
        })
    }
}

async function deleteUser(id){

    await showUserById(id).then(user => {
        $('#idDelete').val(user.id)
        $('#usernameDelete').val(user.username)
        $('#nameDelete').val(user.name)
        $('#surnameDelete').val(user.surname)
        $('#ageDelete').val(user.age)
        $('#emailDelete').val(user.email)
        user.roles.forEach(role => {
            let option = new Option(role.name.substring(5), role.id);
            $('#rolesDelete').append(option);
        })
    })

    const form = document.forms["deleteUserForm"];
    form.addEventListener('submit', delProcess)

    async function delProcess(event) {
        event.preventDefault();
        fetch("/api/admins/" + id, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Referer': null
            }
        }).then(() => {
                $('#delFormCloseButton').click();
                showUsersTable();
            }
        )
    }
}

async function editUser(id){

    const form = document.forms["editUserForm"];
    $('#rolesEdit').empty();

    await allRoles().then(roles => {
        roles.forEach(role => {
            let option = new Option(role.name.substring(5), role.id);
            option.setAttribute("id", role.name);
            $('#rolesEdit').append(option);
        })
    })

    await showUserById(id).then(user => {
        $('#idEdit').val(user.id)
        $('#usernameEdit').val(user.username)
        $('#nameEdit').val(user.name)
        $('#surnameEdit').val(user.surname)
        $('#ageEdit').val(user.age)
        $('#passwordEdit').val(user.password)
        $('#emailEdit').val(user.email)

        user.roles.forEach(role => {console.log(role.name.substring(5));
            document.getElementById(role.name).selected = true;
        })
    })
    form.addEventListener('submit', editProcess);

    async function editProcess(event){
        event.preventDefault();

        let editUser = await userData(form);

        console.log(editUser);

        fetch("/api/admins/" + id, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Referer': null
            },
            body: editUser
        }).then(() => {
            $('#editFormCloseButton').click();
            showUsersTable();
        })
    }
}

async function userData (form) {
    let user = new FormData(form);
    let userRoles = [];
    for (let i = 0; i < form.roles.options.length; i++) {
        if (form.roles.options[i].selected) userRoles.push({
            id : form.roles.options[i].value,
            name : form.roles.options[i].name
        })
    }
    user.set("roles", JSON.stringify(userRoles));
    return JSON.stringify(Object.fromEntries(user))
        .replaceAll("\\", "")
        .replaceAll("\"[{", "[{")
        .replaceAll("}]\"", "}]");
}

async function authUser() {

    fetch("/api/users", {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Referer': null
        }
    })
        .then((response) => response.json())
        .then(data => {
            $('#authUser').append(data.username);
            let roles = data.roles.map(role => " " + role.name.substring(5));
            $('#authUserRoles').append(roles);
        })
}
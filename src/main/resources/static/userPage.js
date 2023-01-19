showUserTable();

function showUserTable() {
    fetch("/api/users")
        .then(res => res.json())
        .then(data => {
            let user = `$(
                <tr>
                    <td>${data.id}</td>
                    <td>${data.username}</td>
                    <td>${data.name}</td>
                    <td>${data.surname}</td>
                    <td>${data.age}</td>   
                    <td>${data.email}</td>
                    <td>${data.roles.map(role => " " + role.name.substring(5))}</td>
                </tr>)`;
            $('#tbody').append(user);
        })
}
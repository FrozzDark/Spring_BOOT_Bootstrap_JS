fetch('/api/users').then(
    res => {
        res.json().then(
            data => {
                console.log(data)
                let temp = "";
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
                temp += rolesStr + "</td>";
                document.getElementById("tbody").innerHTML = temp;
            }
        )
    })
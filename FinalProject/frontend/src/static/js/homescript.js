
addEventListener('DOMContentLoaded', (e) => {
    let btn = document.querySelector("#create");
    btn.addEventListener('click', (e) => {
        fetch('/api/auth/login', {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify()
        }).then((res) => {
            window.location.href = '/create';
        }).catch(err => {
            console.error(err);
        });
    });
    document.getElementById('viewpokedataButton').addEventListener('click', e => {
        window.location.href = '/pokemon';
    });
    document.getElementById('viewOtherButton').addEventListener('click', e => {
        window.location.href = '/viewotherteams';
    });

    document.getElementById('viewEditButton').addEventListener('click', e => {
        window.location.href = '/vieweditteams';
    });
    
    document.getElementById('logoutButton').addEventListener('click', e => {
        fetch('/api/auth/logout', {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify()
        }).then((res) => {
            window.location.href = '/';
        }).catch(err => {
            console.error(err);
        });
    });




});

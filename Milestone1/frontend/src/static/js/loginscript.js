addEventListener('DOMContentLoaded', (e) => {
    let btn = document.querySelector("#registerbutton");
    btn.addEventListener('click', (e) => {
        fetch('/api/auth/login', {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify()
        }).then((res) => {
            window.location.href = '/register';
        }).catch(err => {
            console.error(err);
        });
    });
});

addEventListener('DOMContentLoaded', (e) => {
    let btn = document.querySelector("#Send");
    btn.addEventListener('click', (e) => {
        fetch('/api/auth/login', {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify()
        }).then((res) => {
            window.location.href = '/home';
        }).catch(err => {
            console.error(err);
        });
    });
});



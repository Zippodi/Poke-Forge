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
});

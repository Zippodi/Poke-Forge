addEventListener('DOMContentLoaded', (e) => {
    let btn = document.querySelector("#Send");
    btn.addEventListener('click', (e) => {
        fetch('/api/auth/register', {
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
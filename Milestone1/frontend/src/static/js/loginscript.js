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
        window.location.pathname = '/home.html';
    }).catch(err => {
        console.error(err);
    })
});
        
        
        
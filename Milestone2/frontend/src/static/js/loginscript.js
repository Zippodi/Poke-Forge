

addEventListener('DOMContentLoaded', (e) => {
    let buttonSelect = document.querySelector("#registerbutton");
    buttonSelect.addEventListener('click', e => {
       
          
        
          
        document.location = "/register";
    });   

});


addEventListener('DOMContentLoaded', (e) => {
    let btn = document.querySelector("#Send");
    btn.addEventListener('click', (e) => {

        let username = document.querySelector("#username");
        let password = document.querySelector("#password");
        
        let data = {
            username: username.value,
            password: password.value
        }

        fetch('/api/auth/login', {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((res) => {
            window.location.href = '/home';
        }).catch(err => {
            console.error(err);
        });
    });
});



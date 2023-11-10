addEventListener('DOMContentLoaded', (e) => {
    let btn = document.querySelector("#Send");
    btn.addEventListener('click', (e) => {

        let username = document.querySelector("#username");
        let password = document.querySelector("#password");
        let confirmpassword = document.querySelector("#confirmpassword");
        if (password.value != confirmpassword.value) {
            throw(err);
        }
        else {
            let data = {
                username: username.value,
                password: password.value,
                confirmpassword: confirmpassword.value
            }
    
            fetch('/api/auth/register', {
                method: "POST",
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then((res) => {
                //window.location.href = '/home';
            }).catch(err => {
                alert(err);
            });
        }
        
    });
});
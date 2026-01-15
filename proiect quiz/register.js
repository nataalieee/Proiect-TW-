window.onload = function() {
    
    var SERVER_URL = 'http://localhost:8000';
    var passwordInput = document.getElementById('passwordInput');
    
    if (passwordInput != null) {
        
        var reqLength = document.getElementById('req-length');
        var reqNumber = document.getElementById('req-number');
        var reqUpper = document.getElementById('req-upper');
        var reqSpecial = document.getElementById('req-special');

        passwordInput.addEventListener('input', function() {
            var val = passwordInput.value;
            if (val.length >= 7) {
                reqLength.className = 'valid';
            } else {
                reqLength.className = 'invalid';
            }
            var areCifra = /\d/.test(val);
            if (areCifra == true) {
                reqNumber.className = 'valid';
            } else {
                reqNumber.className = 'invalid';
            }
            var areMare = /[A-Z]/.test(val);
            if (areMare == true) {
                reqUpper.className = 'valid';
            } else {
                reqUpper.className = 'invalid';
            }
            var areSpecial = /[!@#$%^&*_\-+=.]/.test(val);
            if (areSpecial == true) {
                reqSpecial.className = 'valid';
            } else {
                reqSpecial.className = 'invalid';
            }
        });
    }
    var registerForm = document.getElementById('register-form');

    if (registerForm != null) {
        registerForm.addEventListener('submit', async function(e) {
            e.preventDefault(); // Opresc refresh-ul paginii

            var toateInputurile = registerForm.querySelectorAll('input');
            
            var username = toateInputurile[0].value; 
            var email = toateInputurile[1].value;
            var password = passwordInput.value; 
            var confirmPassword = toateInputurile[toateInputurile.length - 1].value;

            if (password != confirmPassword) {
                alert("Parolele introduse nu sunt identice!");
                return;
            }

            var regexFinal = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*_\-+=.]).{7,}/;
            if (regexFinal.test(password) == false) {
                alert("Parola ta este prea slabă! Respectă toate regulile din listă.");
                return;
            }

            try {
                var cerereUseri = await fetch(SERVER_URL + "/users.json");
                var listaUseri = [];
                
                if (cerereUseri.ok == true) {
                    listaUseri = await cerereUseri.json();
                }
                
                var gasit = false;
                for (var i = 0; i < listaUseri.length; i++) {
                    if (listaUseri[i].username == username) {
                        gasit = true;
                        break;
                    }
                }

                if (gasit == true) {
                    alert("Acest nume de utilizator există deja. Alege altul!");
                    return;
                }

                var dateUtilizator = {
                    username: username,
                    email: email,
                    password: password 
                };

                var raspunsSalvare = await fetch(SERVER_URL + "/register", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(dateUtilizator)
                });

                var rezultat = await raspunsSalvare.json();

                if (rezultat.success == true) {
                    alert("Contul a fost creat cu succes! Acum te poți loga.");
                    window.location.href = 'index.html';
                } else {
                    alert("Eroare: " + rezultat.message);
                }

            } catch (eroare) {
                console.log("Eroare de conexiune: ", eroare);
                alert("Nu mă pot conecta la server. Verifică dacă serverul Python este pornit!");
            }
        });
    }
};
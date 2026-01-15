window.onload = function() {
    
    var SERVER_URL = 'http://localhost:8000';
    var loginForm = document.getElementById('login-form');

    if (loginForm != null) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault(); //Opresc refreshul paginii

            var userInput = document.getElementById('login-input').value.trim();
            var passwordInput = document.getElementById('login-pass').value.trim();

            try {
                var response = await fetch(SERVER_URL + "/users.json");
                if (response.ok == false) {
                    alert("Eroare: Nu am putut găsi fișierul cu utilizatori!");
                    return;
                }
                var users = await response.json();
                var utilizatorGasit = null;
                
                for (var i = 0; i < users.length; i++) {
                    var u = users[i];
                    var numeCorect = (u.username == userInput || u.email == userInput);
                    var parolaCorecta = (u.password == passwordInput);
                    
                    if (numeCorect == true && parolaCorecta == true) {
                        utilizatorGasit = u;
                        break; 
                    }
                }

                if (utilizatorGasit != null) {
                    
                    localStorage.setItem('userLogat', utilizatorGasit.username);
                    alert("Te-ai logat cu succes! Bine ai venit, " + utilizatorGasit.username + "!");
                    window.location.href = 'home.html'; 

                } else {
                    alert("Date incorecte! Verifică username-ul și parola.");
                }

            } catch (error) {
                console.log("Eroare la logare: ", error);
                alert("Eroare de conexiune! Asigură-te că serverul Python rulează pe portul 8000.");
            }
        });
    }
};
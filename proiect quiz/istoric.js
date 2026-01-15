window.onload = function() {
    
    var tableBody = document.getElementById('history-table-body');
    var clearBtn = document.getElementById('clear-history');
    var statsContainer = document.getElementById('stats-container');
    var pageTitle = document.querySelector('h1');
    var logoutBtn = document.getElementById('logout-btn'); 
    var currentUser = localStorage.getItem('userLogat');
    
    if (currentUser == null) {
        alert("Trebuie să fii logat pentru a vedea istoricul!");
        window.location.href = 'index.html'; 
        return;
    }
    if (pageTitle != null) {
        pageTitle.innerText = "Istoricul lui " + currentUser;
    }
    var storageKey = "quizHistory_" + currentUser;
    var dateSalvate = localStorage.getItem(storageKey);
    var history = [];

    if (dateSalvate != null) {
        history = JSON.parse(dateSalvate);
    }

    function renderTable() {
       
        tableBody.innerHTML = '';
        if (history.length == 0) {
            var randGol = document.createElement('tr');
            var celulaMesaj = document.createElement('td');
            
            celulaMesaj.setAttribute('colspan', '4');
            celulaMesaj.style.textAlign = 'center';
            celulaMesaj.innerText = "Nu ai dat niciun test încă.";
            
            randGol.appendChild(celulaMesaj);
            tableBody.appendChild(randGol);

            if (statsContainer != null) {
                statsContainer.innerHTML = 'Nu există date pentru statistici.';
            }
            return;
        }

        var sumaProcente = 0;
        for (var i = history.length - 1; i >= 0; i--) {
            var entry = history[i];
            var percent = Math.round((entry.score / entry.total) * 100);
            sumaProcente = sumaProcente + percent;

            
            var row = document.createElement('tr');
            var tdNume = document.createElement('td');
            tdNume.innerText = entry.testName;
            var tdData = document.createElement('td');
            tdData.innerText = entry.date;
            var tdScor = document.createElement('td');
            tdScor.innerText = entry.score + " / " + entry.total;
            var tdProcent = document.createElement('td');
            tdProcent.innerText = percent + "%";
            
            if (percent >= 50) {
                tdProcent.style.color = "green";
                tdProcent.style.fontWeight = "bold";
            } else {
                tdProcent.style.color = "red";
                tdProcent.style.fontWeight = "bold";
            }
            row.appendChild(tdNume);
            row.appendChild(tdData);
            row.appendChild(tdScor);
            row.appendChild(tdProcent);
            tableBody.appendChild(row);
        }
        var media = Math.round(sumaProcente / history.length);
        
        if (statsContainer != null) {
            statsContainer.innerHTML = ""; 
            
            var titluStats = document.createElement('h3');
            titluStats.innerText = "Statistici Rapide:";
            var pTotal = document.createElement('p');
            var strongTotal = document.createElement('strong');
            strongTotal.innerText = "Total Teste: ";
            pTotal.appendChild(strongTotal);
            pTotal.appendChild(document.createTextNode(history.length));
            var pMedia = document.createElement('p');
            var strongMedia = document.createElement('strong');
            strongMedia.innerText = "Media Performanței: ";
            pMedia.appendChild(strongMedia);
            pMedia.appendChild(document.createTextNode(media + "%"));
            
            statsContainer.appendChild(titluStats);
            statsContainer.appendChild(pTotal);
            statsContainer.appendChild(pMedia);
        }
    }

    if (clearBtn != null) {
        clearBtn.addEventListener('click', function() {
            var confirmare = confirm("Ești sigur că vrei să ștergi tot istoricul tău?");
            
            if (confirmare == true) {
                localStorage.removeItem(storageKey);
                history = [];
                renderTable();
            }
        });
    }

    if (logoutBtn != null) {
        logoutBtn.addEventListener('click', function() {
            localStorage.removeItem('userLogat');
            alert("Te-ai deconectat cu succes!");
            window.location.href = 'index.html';
        });
    }

    
    renderTable();
};
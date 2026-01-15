window.onload = function() {
    
    var intrebarile = document.querySelectorAll('.forms');
    var butonTrimite = document.querySelector('.submit-button');
    var containerRezultat = document.getElementById('result-container');
    var cutieScorFinal = document.getElementById('final-score');

    var elementTitlu = document.querySelector('.title_q');
    var numeTest = "Test Necunoscut"; 
    if (elementTitlu != null) {
        numeTest = elementTitlu.innerText.trim();
    }

    var utilizatorCurent = localStorage.getItem('userLogat');
    if (utilizatorCurent == null) {
        utilizatorCurent = 'anonim';
    }
    
    var testFinalizat = false;
    for (var i = 0; i < intrebarile.length; i++) {
        var optiuni = intrebarile[i].querySelectorAll('.answer-option');

        for (var j = 0; j < optiuni.length; j++) {
            optiuni[j].onclick = function() {
                if (testFinalizat == true) return;

                var parinte = this.closest('.forms'); 
                var toateOptiunileDinGrup = parinte.querySelectorAll('.answer-option');
                
                for (var k = 0; k < toateOptiunileDinGrup.length; k++) {
                    toateOptiunileDinGrup[k].classList.remove('selected');
                }
                this.classList.add('selected');
            };
        }
    }

    butonTrimite.onclick = function() {
        if (testFinalizat == true) return;

    
        var toateSuntGata = true;
        for (var i = 0; i < intrebarile.length; i++) {
            var bifat = intrebarile[i].querySelector('.answer-option.selected');
            if (bifat == null) {
                toateSuntGata = false;
                break;
            }
        }

        if (toateSuntGata == false) {
            alert("Te rugăm să răspunzi la toate întrebările!");
            return;
        }

        testFinalizat = true;
        butonTrimite.innerHTML = "Se calculează scorul...";

        setTimeout(function() {
            calculeazaScorul();
        }, 1200);
    };

    function calculeazaScorul() {
        var punctaj = 0;

        for (var i = 0; i < intrebarile.length; i++) {
            var variantaSelectata = intrebarile[i].querySelector('.answer-option.selected');
            var esteCorect = variantaSelectata.getAttribute('data-correct') === 'true';

            if (esteCorect == true) {
                punctaj = punctaj + 1;
                variantaSelectata.classList.add('correct');
            } else {
                variantaSelectata.classList.add('wrong');
                var toate = intrebarile[i].querySelectorAll('.answer-option');
                for (var j = 0; j < toate.length; j++) {
                    if (toate[j].getAttribute('data-correct') === 'true') {
                        toate[j].classList.add('correct');
                    }
                }
            }
        }
        butonTrimite.style.display = 'none';
        containerRezultat.style.display = 'block';

        var culoareRandom = '#' + Math.floor(Math.random() * 16777215).toString(16);
        containerRezultat.style.border = "5px solid " + culoareRandom;
        containerRezultat.style.borderRadius = "10px";

        var dataAcum = new Date();
        var dataText = dataAcum.toLocaleDateString('ro-RO') + ' ' + dataAcum.toLocaleTimeString('ro-RO');
        salveazaRezultat(numeTest, punctaj, intrebarile.length, dataText);
        cutieScorFinal.innerHTML = "";
        
        var elementScor = document.createElement('h3');
        elementScor.innerText = "Ai obținut " + punctaj + " puncte din " + intrebarile.length;
        
        var elementNumeTest = document.createElement('p');
        elementNumeTest.innerHTML = "Test: <strong>" + numeTest + "</strong>";

        var elementData = document.createElement('p');
        elementData.innerText = "Data testului: " + dataText;

        var butonIstoric = document.createElement('a');
        butonIstoric.href = "istoric.html";
        butonIstoric.innerText = "Mergi la Istoric";
        
 
        butonIstoric.style.backgroundColor = "#4CAF50";
        butonIstoric.style.color = "white";
        butonIstoric.style.padding = "10px 15px";
        butonIstoric.style.textDecoration = "none";
        butonIstoric.style.borderRadius = "4px";
        butonIstoric.style.display = "inline-block";
        butonIstoric.style.marginTop = "15px";

        cutieScorFinal.appendChild(elementScor);
        cutieScorFinal.appendChild(elementNumeTest);
        cutieScorFinal.appendChild(elementData);
        cutieScorFinal.appendChild(butonIstoric);

        containerRezultat.scrollIntoView({ behavior: 'smooth' });
    }

    function salveazaRezultat(nume, scor, total, data) {
        var cheie = "quizHistory_" + utilizatorCurent;
        var dateVechi = localStorage.getItem(cheie);
        var listaIstoric = [];

        if (dateVechi != null) {
            listaIstoric = JSON.parse(dateVechi);
        }

        var obiectNou = {
            testName: nume,
            score: scor,
            total: total,
            date: data
        };

        listaIstoric.push(obiectNou);
        localStorage.setItem(cheie, JSON.stringify(listaIstoric));
    }
};
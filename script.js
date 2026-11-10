function updateClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const milliseconds = String(now.getMilliseconds()).padStart(3, '0');
    
    const clockElement = document.getElementById('clock');
    if (clockElement) {
        clockElement.textContent = `CZAS: ${hours}:${minutes}:${seconds}.${milliseconds}`;
    }
    requestAnimationFrame(updateClock);
}

requestAnimationFrame(updateClock);

document.addEventListener("DOMContentLoaded", () => {
    const blockquoteEl = document.querySelector("blockquote");
    if (!blockquoteEl) return;

    const boldElements = document.querySelectorAll("main section ul li b");
    let racheNameEl = null;
    let mariaNameEl = null;

    boldElements.forEach(el => {
        const text = el.textContent.trim();
        if (text.includes("Rache Bartmoss")) {
            racheNameEl = el;
        } else if (text.includes("Maria Jimenez")) {
            mariaNameEl = el;
        }
    });

    const originalText = blockquoteEl.textContent;
    const STORAGE_KEY = "netwatch_datakrash_scrambled";

    const savedText = localStorage.getItem(STORAGE_KEY);
    if (savedText) {
        blockquoteEl.textContent = savedText;
    }

    let intervalId = null;

    window.scrambler = function() {
        if (intervalId) return;

        const specialChars = "!@#$%^&*";
        let currentText = blockquoteEl.textContent;

        intervalId = setInterval(() => {
            let availableIndices = [];
            for (let i = 0; i < currentText.length; i++) {
                const char = currentText[i];
                if (char.trim() !== "" && !specialChars.includes(char)) {
                    availableIndices.push(i);
                }
            }

            if (availableIndices.length === 0) {
                clearInterval(intervalId);
                intervalId = null;
                return;
            }

            const randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
            const randomSpecialChar = specialChars[Math.floor(Math.random() * specialChars.length)];

            currentText = currentText.substring(0, randomIndex) + randomSpecialChar + currentText.substring(randomIndex + 1);
            
            blockquoteEl.textContent = currentText;
            localStorage.setItem(STORAGE_KEY, currentText);
        }, 50);
    };

    window.deScrambler = function() {
        if (intervalId) {
            clearInterval(intervalId);
            intervalId = null;
        }
        blockquoteEl.textContent = originalText;
        localStorage.removeItem(STORAGE_KEY);
    };

    if (racheNameEl) {
        racheNameEl.style.cursor = "pointer";
        racheNameEl.style.userSelect = "none";
        racheNameEl.style.webkitUserSelect = "none";
        racheNameEl.title = "Kliknij, aby uruchomić scrambler";
        
        racheNameEl.addEventListener("click", (e) => {
            e.preventDefault();
            window.scrambler();
        });
    }

    if (mariaNameEl) {
        mariaNameEl.style.cursor = "pointer";
        mariaNameEl.style.userSelect = "none";
        mariaNameEl.style.webkitUserSelect = "none";
        mariaNameEl.title = "Kliknij, aby przywrócić oryginalny tekst (deScrambler)";
        
        mariaNameEl.addEventListener("click", (e) => {
            e.preventDefault();
            window.deScrambler();
        });
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const FEATURE_KEY = "netwatch_vos_clicked";
    const isClicked = localStorage.getItem(FEATURE_KEY) === "true";

    // --- 1. Dodawanie przycisku do menu nawigacyjnego ---
    const navUl = document.querySelector("nav ul");
    function addNavLink() {
        if (navUl && !document.getElementById("extra-nav-item")) {
            const li = document.createElement("li");
            li.id = "extra-nav-item";
            const a = document.createElement("a");
            a.href = "blackwall.html";
            a.textContent = "Strefa Tajna";
            li.appendChild(a);
            navUl.appendChild(li);
        }
    }
    if (isClicked) addNavLink();

    // --- 2. Wyświetlanie napisu "00255" pod zegarem TYLKO na stronie głównej ---
    const clockDiv = document.getElementById("clock");
    function addClockCode() {
        // Sprawdzamy czy jesteśmy na stronie głównej (index.html lub pusty path / lub kończy się na index.html)
        const isIndexPage = window.location.pathname.endsWith("index.html") || window.location.pathname.endsWith("/") || window.location.pathname === "";
        
        if (isIndexPage && clockDiv && !document.getElementById("code-00255")) {
            const codeSpan = document.createElement("div");
            codeSpan.id = "code-00255";
            codeSpan.textContent = "00255";
            codeSpan.style.fontSize = "0.8rem";
            codeSpan.style.color = "var(--heading-color)";
            codeSpan.style.letterSpacing = "2px";
            codeSpan.style.marginTop = "3px";
            codeSpan.style.textShadow = "0 0 5px rgba(243, 230, 0, 0.7)";
            clockDiv.parentNode.appendChild(codeSpan);
        }
    }
    if (isClicked) addClockCode();

// --- 3. Obsługa napisu "Alt" (staje się widoczniejszy po kliknięciu) ---
    const hiddenAlt = document.getElementById("hidden-alt");
    function revealAlt() {
        if (hiddenAlt) {
            hiddenAlt.style.opacity = "1";
            hiddenAlt.style.color = "#ff06b5";
            hiddenAlt.style.textShadow = "0 0 8px rgba(255, 6, 181, 0.6)"; // opcjonalny cyber-efekt poświaty w tym samym kolorze
        }
    }
    if (isClicked) revealAlt();

    // --- 4. Globalna aktywacja po kliknięciu "Vos Videmus" w stopce ---
    const vosVidemusBtn = document.getElementById("vos-videmus-btn");
    if (vosVidemusBtn) {
        vosVidemusBtn.addEventListener("click", () => {
            localStorage.setItem(FEATURE_KEY, "true");
            addNavLink();
            addClockCode();
            revealAlt();

            // Wizualne potwierdzenie kliknięcia w stopce
            vosVidemusBtn.style.color = "var(--heading-color)";
            setTimeout(() => {
                vosVidemusBtn.style.color = "";
            }, 300);
        });
    }
    
    if (localStorage.getItem(FEATURE_KEY) === "true") {
        // Szukamy wszystkich paragrafów lub artykułów na stronie agenci.html
        const agentArticles = document.querySelectorAll("main article");
        
        agentArticles.forEach(article => {
            const h3 = article.querySelector("h3");
            // Upewniamy się, że to artykuł Magnificenta Curtisa
            if (h3 && h3.textContent.includes("Magnificent Curtis")) {
                const paragraphs = article.querySelectorAll("p");
                paragraphs.forEach(p => {
                    if (p.textContent.includes("2045")) {
                        p.textContent = p.textContent.replace("2045", "00420");
                    }
                });
            }
        });
    }
});

document.addEventListener("DOMContentLoaded", () => {
    // --- Obsługa potrójnego kliknięcia na zdjęcie Bryce'a Mosley'a oraz zmiany stopki ---
    
    const BRYCE_CLICKED_KEY = "netwatch_bryce_triple_clicked";
    const bryceImg = document.querySelector('img[alt="Agent Bryce Mosley"]');
    const footerEl = document.querySelector("footer p");

    function startFooterCycle() {
        if (!footerEl) return;
        
        // Zapisujemy stan w localStorage, aby pętla działała też po zmianie/odświeżeniu strony
        localStorage.setItem(BRYCE_CLICKED_KEY, "true");

        // Definiujemy stany pętli:
        // Stan 1 (3 sekundy): Niebieski tekst ostrzegawczy
        // Stan 2 (3 sekundy): Kody "00091 00240 00270"
        function runCycle() {
            // Stan 1
            footerEl.textContent = "Nie ma znaczenia co mu powiesz. Nie ma znaczenia co planujesz zrobić. Nic nie zmienisz.";
            footerEl.style.color = "#0055ff"; // Niebieski kolor (lub np. cyan/dodatkowy odcień niebieskiego)
            footerEl.style.fontWeight = "bold";

            setTimeout(() => {
                // Stan 2 (po 3 sekundach)
                footerEl.textContent = "00091 00240 00270";
                footerEl.style.color = "#0055ff";
                footerEl.style.fontWeight = "bold";

                setTimeout(() => {
                    // Powtórzenie cyklu po kolejnych 3 sekundach
                    runCycle();
                }, 3000);
            }, 3000);
        }

        runCycle();
    }

    // Jeśli stan został już wcześniej aktywowany (np. użytkownik kliknął i przeszedł na inną podstronę)
    // Sprawdzamy, czy aktualnie znajdujemy się na stronie agenci.html
    const isAgenciPage = window.location.pathname.endsWith("agenci.html") || window.location.pathname.includes("agenci");

    // Jeśli stan został aktywowany ORAZ jesteśmy na stronie z agentami, uruchom cykl stopki
    if (localStorage.getItem(BRYCE_CLICKED_KEY) === "true" && isAgenciPage) {
        startFooterCycle();
    }

    // Nasłuchiwanie potrójnego kliknięcia na zdjęcie Bryce'a
    if (bryceImg) {
        const article = bryceImg.closest("article");
        const areaParagraph = article ? article.querySelectorAll("p")[1] : null;

        if (areaParagraph) {
            const originalText = areaParagraph.innerHTML;
            let clickCount = 0;
            let clickTimer = null;
            let resetTimer = null;

            // Ładowanie czcionki JetBrains Mono, jeśli jeszcze nie istnieje
            if (!document.getElementById("font-jetbrains-mono")) {
                const link = document.createElement("link");
                link.id = "font-jetbrains-mono";
                link.rel = "stylesheet";
                link.href = "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&display=swap";
                document.head.appendChild(link);
            }

            bryceImg.style.cursor = "pointer";

            bryceImg.addEventListener("click", () => {
                clickCount++;

                clearTimeout(clickTimer);
                clickTimer = setTimeout(() => {
                    clickCount = 0;
                }, 800);

                if (clickCount === 3) {
                    clickCount = 0;
                    clearTimeout(clickTimer);

                    // 1. Uruchomienie cyklu stopki (jeśli jeszcze nie działał)
                    if (localStorage.getItem(BRYCE_CLICKED_KEY) !== "true") {
                        startFooterCycle();
                    }

                    // 2. Dotychczasowa logika zmiany tekstu obszaru działania Bryce'a na 4s-6s
                    if (resetTimer) {
                        clearTimeout(resetTimer);
                    }

                    areaParagraph.textContent = "00006 00181 00051";
                    areaParagraph.style.color = "#90ee90";
                    areaParagraph.style.fontFamily = "'JetBrains Mono', monospace";
                    areaParagraph.style.fontWeight = "bold";

                    const randomDelay = Math.floor(Math.random() * (3000 - 1000 + 1)) + 1000;

                    resetTimer = setTimeout(() => {
                        areaParagraph.innerHTML = originalText;
                        areaParagraph.style.color = "";
                        areaParagraph.style.fontFamily = "";
                        areaParagraph.style.fontWeight = "";
                    }, randomDelay);
                }
            });
        }
    }
});
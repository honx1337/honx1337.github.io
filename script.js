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
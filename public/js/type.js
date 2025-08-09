function typeWriter(element, text, speed = 50, callback) {
    element.textContent = "";
    let i = 0;
    function typing() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(typing, speed);
        } else if (callback) {
            callback();
        }
    }
    typing();
}

function typeExplanation(element, text, speed = 30) {
    element.innerHTML = "";
    let i = 0;
    function typing() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(typing, speed);
        }
    }
    typing();
}



document.querySelectorAll(".explain-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        const type = btn.dataset.solution;
        const container = document.getElementById(`explain-${type}`);
        container.classList.remove("hidden");
        startExplanation(type, 0);
    });
});

function startExplanation(type, index) {
    const step = explanations[type][index];
    const codeElem = document.getElementById(`explain-code-${type}`);
    const textElem = document.getElementById(`explain-text-${type}`);
    typeWriter(codeElem, step.code, 40, () => {
        typeExplanation(textElem, step.text, 25);
    });

    const container = document.getElementById(`explain-${type}`);
    container.querySelector(".prev-step").onclick = () => {
        if (index > 0) startExplanation(type, index - 1);
    };
    container.querySelector(".next-step").onclick = () => {
        if (index < explanations[type].length - 1) startExplanation(type, index + 1);
    };
}

document.addEventListener("DOMContentLoaded", () => {
    // 1. Generate Floating Fireflies
    const fireflyContainer = document.getElementById("firefly-container");
    const fireflyCount = 20;

    for (let i = 0; i < fireflyCount; i++) {
        const firefly = document.createElement("div");
        firefly.classList.add("firefly");
        
        // Random placement and delays
        firefly.style.left = `${Math.random() * 100}%`;
        firefly.style.top = `${Math.random() * 100}%`;
        firefly.style.animationDuration = `${4 + Math.random() * 4}s`;
        firefly.style.animationDelay = `${Math.random() * 3}s`;

        fireflyContainer.appendChild(firefly);
    }

    // 2. Paw Prints on Click/Tap
    document.addEventListener("click", (e) => {
        const paw = document.createElement("div");
        paw.classList.add("paw-print");
        paw.style.left = `${e.clientX - 6}px`;
        paw.style.top = `${e.clientY - 6}px`;

        document.body.appendChild(paw);

        setTimeout(() => {
            paw.remove();
        }, 1500);
    });
});

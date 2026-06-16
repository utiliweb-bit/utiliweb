const search = document.getElementById("search");
const cards = document.querySelectorAll(".card");

search.addEventListener("input", (e) => {
    const value = e.target.value.toLowerCase().trim();

    cards.forEach(card => {
        const key = card.getAttribute("data-key")?.toLowerCase() || "";
        const text = card.innerText.toLowerCase();

        const match = key.includes(value) || text.includes(value);

        card.style.display = match ? "block" : "none";
    });
});

document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('search');
  const specialtiesGrid = document.getElementById('specialties-grid');
  const emptyState = document.getElementById('empty-state');
  const emptyTerm = document.getElementById('empty-term');
  let medicalData = [];

  // Function to normalize text for search
  function normalizeText(text) {
    return text.toLowerCase().normalize('NFD').replace(/\p{M}/gu, '');
  }

  // Function to render specialties
  function renderSpecialties(filteredData) {
    specialtiesGrid.innerHTML = '';
    if (filteredData.length === 0) {
      emptyState.style.display = 'block';
    } else {
      emptyState.style.display = 'none';
      filteredData.forEach(specialty => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.innerHTML = `
          <div class="card-header">
            <div class="card-icon-box">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
            <div class="card-title-group">
              <span class="card-title">${specialty.portugues}</span>
              <span class="card-romaji">${specialty.japones} (${specialty.romaji})</span>
            </div>
          </div>
          <p class="card-description">${specialty.descricao}</p>
          <p class="card-symptoms"><strong>Sintomas:</strong> ${specialty.sintomas_chave.join(', ')}</p>
        `;
        specialtiesGrid.appendChild(card);
      });
    }
  }

  // Function to filter specialties based on search input
  function filterSpecialties() {
    const searchTerm = normalizeText(searchInput.value);
    emptyTerm.textContent = searchInput.value;

    const filtered = medicalData.filter(specialty => {
      const portuguesMatch = normalizeText(specialty.portugues).includes(searchTerm);
      const japonesMatch = normalizeText(specialty.japones).includes(searchTerm);
      const romajiMatch = normalizeText(specialty.romaji).includes(searchTerm);
      const sintomasMatch = specialty.sintomas_chave.some(symptom => normalizeText(symptom).includes(searchTerm));
      return portuguesMatch || japonesMatch || romajiMatch || sintomasMatch;
    });
    renderSpecialties(filtered);
  }

  // Load medical data - FIXED PATH to load from the SAME folder
  fetch('medical_data.json')
    .then(response => response.json())
    .then(data => {
      medicalData = data;
      renderSpecialties(medicalData);
    })
    .catch(error => {
      console.error('Erro ao carregar dados médicos:', error);
      specialtiesGrid.innerHTML = '<p style="text-align: center; color: var(--neutral-500); grid-column: 1/-1;">Não foi possível carregar as informações médicas. Certifique-se de que o arquivo medical_data.json está na mesma pasta.</p>';
    });

  // Event listener for search input
  searchInput.addEventListener('input', filterSpecialties);
});

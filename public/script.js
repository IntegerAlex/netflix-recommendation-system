document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.querySelector('.search-input');
    const dropdownContent = document.querySelector('.dropdown-content');
    const dropdownItems = dropdownContent.querySelectorAll('a');
    const recommendBtn = document.getElementById('recommend-btn');

    // Show dropdown when input is focused
    searchInput.addEventListener('focus', () => {
        dropdownContent.classList.add('show');
    });

    // Filter dropdown items based on input
    searchInput.addEventListener('input', function() {
        const filter = this.value.toLowerCase();
        dropdownItems.forEach(item => {
            const text = item.textContent.toLowerCase();
            item.style.display = text.includes(filter) ? '' : 'none';
        });
    });

    // Handle click on dropdown items
    dropdownItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            searchInput.value = item.textContent;
            dropdownContent.classList.remove('show');
        });
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.dropdown')) {
            dropdownContent.classList.remove('show');
        }
    });

    // Handle recommend button click
    recommendBtn.addEventListener('click', () => {
        const movieName = searchInput.value.trim();
        if (movieName) {
            window.location.href = `/recommendation?movieName=${encodeURIComponent(movieName)}`;
        }
    });

    // Handle Enter key press
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const movieName = searchInput.value.trim();
            if (movieName) {
                window.location.href = `/recommendation?movieName=${encodeURIComponent(movieName)}`;
            }
        }
    });
});

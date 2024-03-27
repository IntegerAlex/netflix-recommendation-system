function initializeSearchFunctionality() {
    // Search functionality
    document.querySelectorAll('.search-input').forEach(function(input) {
        input.addEventListener('input', function() { // Change 'keyup' to 'input' for immediate response
            var searchText = this.value.trim().toLowerCase(); // Trim whitespace from search text
            document.querySelectorAll('.dropdown-content a').forEach(function(link) {
                var text = link.textContent.toLowerCase();
                if (text.includes(searchText)) {
                    link.style.display = 'block';
                } else {
                    link.style.display = 'none';
                }
            });
            document.querySelector('.dropdown-content').classList.add('show');
        });
    });

    // Handle click on dropdown option
    document.querySelectorAll('.dropdown-content a').forEach(function(link) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelector('.search-input').value = this.textContent;
            document.querySelector('.dropdown-content').classList.remove('show');
        });
    });

    // Close dropdown when clicked outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.dropdown')) {
            document.querySelector('.dropdown-content').classList.remove('show');
        }
    });
}

// Call the function to initialize search functionality
initializeSearchFunctionality();

// Recommend function
document.getElementById("recommend-btn").addEventListener("click", recommend);

async function recommend() {
    document.getElementById("recommend-btn").textContent = 'Loading...';
    document.getElementById("recommend-btn").disabled = true;
    const movieName = document.querySelector('.search-input').value.trim(); // Trim whitespace from movie name
    if (movieName) { // Check if movie name is not empty
        window.location.href = `/recommendation?movieName=${encodeURIComponent(movieName)}`;
    } else {
        console.log('Please enter a movie name.');
    }
}

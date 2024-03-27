
function initializeSearchFunctionality() {
    // Search functionality
    document.querySelectorAll('.search-input').forEach(function(input) {
      input.addEventListener('keyup', function() {
        var searchText = this.value.toLowerCase();
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
    
    // Handle click on Recommend button
    document.querySelectorAll('.btn-recommend').forEach(function(button) {
      button.addEventListener('click', function() {
        var selectedTitle = document.querySelector('.search-input').value;
        // Check if the selected title exists in the titles list
        if (titles.includes(selectedTitle)) {
          // Make API call
          // Replace 'your-api-endpoint' with your actual API endpoint
          fetch('/zrecommendation', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title: selectedTitle })
          })
          .then(function(response) {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return response.json();
          })
          .then(function(data) {
            console.log('API call successful:', data);
            // Add code to handle successful API response
          })
          .catch(function(error) {
            console.error('Error making API call:', error);
            // Add code to handle error
          });
        } else {
          console.log('Selected title not found in the list.');
        }
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

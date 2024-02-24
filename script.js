// Declare excelData variable
let excelData;

// Function to fetch data from database.json
function fetchData() {
  fetch('data/database.json')
    .then(response => response.json())
    .then(data => {
      excelData = data;
    })
    .catch(error => console.error('Error fetching data:', error));
}

// Call fetchData function to fetch data when the script is loaded
fetchData();

// Function to search product using fetched data
function searchProduct() {
  const skuInput = document.getElementById("skuInput").value;
  const resultsContainer = document.getElementById("results");

  // Clear previous results
  resultsContainer.innerHTML = "";

  // Check if data is fetched before searching
  if (!excelData) {
    resultsContainer.innerHTML = "<p>Error fetching data. Please try again.</p>";
    return;
  }

  // Search the fetched data
  const matchingResults = excelData.filter(row => row[0] === skuInput);

  // Sort results based on ETA proximity to current date
  matchingResults.sort((a, b) => {
    const etaDateA = new Date(a[2]);
    const etaDateB = new Date(b[2]);
    const now = new Date();

    const timeDifferenceA = Math.abs(etaDateA.getTime() - now.getTime());
    const timeDifferenceB = Math.abs(etaDateB.getTime() - now.getTime());

    return timeDifferenceA - timeDifferenceB;
  });

  // Display the results
  if (matchingResults.length > 0) {
    resultsContainer.innerHTML = '<h3>Search Results:</h3>';
    matchingResults.forEach(result => {
      const etaDate = new Date(result[2]);
      const now = new Date();
      const timeDifference = etaDate.getTime() - now.getTime();
      const daysDifference = Math.ceil(timeDifference / (1000 * 3600 * 24));

      const documentNumber = result[4];
      const documentLink = `https://priis.cms1.co.il/priority/openmail.htm?priority:priform@DOCUMENTS_P:${documentNumber}:cms:tabula.ini:1`;

      let gapIllustration = "";

      // Adjust gap illustration based on the time difference
      if (daysDifference > 30) {
        gapIllustration = "✈️✈️✈️"; // Far gap (red)
      } else if (daysDifference > 15) {
        gapIllustration = "✈️✈️"; // Medium gap (yellow)
      } else {
        gapIllustration = "✈️"; // Close gap (green)
      }

      resultsContainer.innerHTML += `
        <p>SKU: ${result[0]}</p>
        <p>Description: ${result[1]}</p>
        <p>ETA: ${result[2]}</p>
        <p>ATA: ${result[3]}</p>
        <p>Shipment Progress: ${gapIllustration}</p>
        <p><a href="${documentLink}" target="_blank">${documentNumber}</a></p>
        <hr>`;
    });
  } else {
    resultsContainer.innerHTML = "<p>No results found.</p>";
  }
}

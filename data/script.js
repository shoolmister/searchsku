// Function to search product using embedded data
function searchProduct(excelData) {
    const skuInput = document.getElementById("skuInput").value;
    const resultsContainer = document.getElementById("results");

    // Clear previous results
    resultsContainer.innerHTML = "";

    // Search the embedded data
    const matchingResults = excelData.filter(row => row[0] === skuInput);

    // Sort results based on ETA proximity to the current date
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

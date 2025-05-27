// On transactions page load or when clicking transactions button
function fetchTransactions() {
    console.log('Current userId in localStorage:', localStorage.getItem('userId'));
    const userId = localStorage.getItem('userId');
    if (!userId) {
        // Handle case where user is not logged in
        console.error('No userId found in localStorage');
        document.getElementById('transactions-container').innerHTML = 
            '<p>Please log in to view transactions.</p>';
        return;
    }

    console.log('Attempting to retrieve transactions for userid:',userId)
    fetch(`/transactions?userId=${userId}`)
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
        .then(transactions => {
            // Handle the transactions data
            console.log(transactions);
            // Update your UI with the transactions data
            displayTransactions(transactions);
        })
        .catch(error => {console.error('Error:', error);
        document.getElementById('transactions-container').innerHTML=
        '<p>Error loading transactions. Please try again later</p>'
});
}

function displayTransactions(transactions) {
    const transactionsContainer = document.getElementById('transactions-container');
    console.log('req:', transactionsContainer);

    // Clear existing content
    transactionsContainer.innerHTML = '';
    
    // Check if there are transactions
    if (transactions.length === 0) {
        transactionsContainer.innerHTML = '<p>No transactions found.</p>';
        return;
    }

    // Create and append transactions to the container
        transactions.forEach(transaction => {
        const transactionElement = document.createElement('div');
        transactionElement.className = 'transaction-item';
        transactionElement.innerHTML = `
            <div class="transaction">
                <p>Date: ${new Date(transaction.Date).toLocaleDateString()}</p>
                <p>Symbol: ${transaction.TickerSymbol}</p>
                <p>Type: ${transaction.Type}</p>
                <p>Quantity: ${transaction.Quantity}</p>
                <p>Price: $${transaction.Price.toFixed(2)}</p>
                <p>Total Value: $${transaction.TotalValue.toFixed(2)}</p>
            </div>
        `
        transactionsContainer.appendChild(transactionElement);
    });
}

// Call the fetch function when the page loads
document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('transactions.html')) {
        fetchTransactions();
    }
});
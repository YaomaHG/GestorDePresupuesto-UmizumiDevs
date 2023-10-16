// Define categories array
let categories = [];

// Define transactions array
let transactions = [];

// Get form elements
const formCategory = document.getElementById('form-category');
const formTransaction = document.getElementById('form-transaction');

// Get table body element
const transactionTableBody = document.querySelector('#transaction-table tbody');

// Get budget summary element
const budgetSummary = document.getElementById('budget-summary');

// Get export buttons
const exportSummaryCsvButton = document.getElementById('export-summary-csv');
const exportSummaryPdfButton = document.getElementById('export-summary-pdf');
const exportTransactionsCsvButton = document.getElementById('export-transactions-csv');
const exportTransactionsPdfButton = document.getElementById('export-transactions-pdf');


// Add category
formCategory.addEventListener('submit', (e) => {
    e.preventDefault();

    // Get category name and budget
    const categoryName = document.getElementById('category-name').value;
    const categoryBudget = parseFloat(document.getElementById('category-budget').value);

    // Create category object
    const category = {
        name: categoryName,
        budget: categoryBudget,
        expenses: 0,
        income: 0
    };

    // Add category to categories array
    categories.push(category);

    // Clear form inputs
    formCategory.reset();

    // Update transaction form category select options
    updateTransactionFormCategorySelectOptions();

    // Update budget summary
    updateBudgetSummary();
});

// Add transaction
formTransaction.addEventListener('submit', (e) => {
    e.preventDefault();

    // Get transaction type, category, description, date and amount
    const transactionType = document.getElementById('transaction-type').value;
    const transactionCategory = document.getElementById('transaction-category').value;
    const transactionDescription = document.getElementById('transaction-description').value;
    const transactionDate = document.getElementById('transaction-date').value;
    const transactionAmount = parseFloat(document.getElementById('transaction-amount').value);

    // Get category object
    const category = categories.find(category => category.name === transactionCategory);

    // Create transaction object
    const transaction = {
        type: transactionType,
        category: transactionCategory,
        description: transactionDescription,
        date: transactionDate,
        amount: transactionAmount
    };

    // Add transaction to transactions array
    transactions.push(transaction);

    // Update category expenses or income and budget
    if (transactionType === 'expense') {
        category.expenses += transactionAmount;
        category.budget -= transactionAmount;
    } else if (transactionType === 'income') {
        category.income += transactionAmount;
        category.budget += transactionAmount;
    }

    // Clear form inputs
    formTransaction.reset();

    // Update transaction table
    updateTransactionTable();

    // Update budget summary
    updateBudgetSummary();
});

// Update transaction form category select options
function updateTransactionFormCategorySelectOptions() {
    // Get transaction category select element
    const transactionCategorySelect = document.getElementById('transaction-category');

    // Remove all options
    transactionCategorySelect.innerHTML = '';

    // Add default option
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = '--Seleccionar categoría--';
    transactionCategorySelect.appendChild(defaultOption);

    // Add category options
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.name;
        option.textContent = category.name;
        transactionCategorySelect.appendChild(option);
    });
}

// Update transaction table
function updateTransactionTable() {
    // Clear table body
    transactionTableBody.innerHTML = '';

    // Add transactions to table
    transactions.forEach(transaction => {
        const row = document.createElement('tr');
        const typeCell = document.createElement('td');
        const categoryCell = document.createElement('td');
        const descriptionCell = document.createElement('td');
        const dateCell = document.createElement('td');
        const amountCell = document.createElement('td');

        typeCell.textContent = transaction.type;
        categoryCell.textContent = transaction.category;
        descriptionCell.textContent = transaction.description;
        dateCell.textContent = transaction.date;
        amountCell.textContent = transaction.amount.toFixed(2);

        if (transaction.type === 'expense') {
            amountCell.classList.add('expense');
        } else if (transaction.type === 'income') {
            amountCell.classList.add('income');
        }

        row.appendChild(typeCell);
        row.appendChild(categoryCell);
        row.appendChild(descriptionCell);
        row.appendChild(dateCell);
        row.appendChild(amountCell);

        transactionTableBody.appendChild(row);
    });
}

// Update budget summary
function updateBudgetSummary() {
    // Clear budget summary
    budgetSummary.innerHTML = '';

    // Add categories to budget summary
    categories.forEach(category => {
        const categoryElement = document.createElement('div');
        const nameElement = document.createElement('h3');
        const budgetElement = document.createElement('p');
        const expensesElement = document.createElement('p');
        const incomeElement = document.createElement('p');

        nameElement.textContent = category.name;
        budgetElement.textContent = `Presupuesto: $${category.budget.toFixed(2)}`;
        expensesElement.textContent = `Gastos: $${category.expenses.toFixed(2)}`;
        incomeElement.textContent = `Ingresos: $${category.income.toFixed(2)}`;

        categoryElement.appendChild(nameElement);
        categoryElement.appendChild(budgetElement);
        categoryElement.appendChild(expensesElement);
        categoryElement.appendChild(incomeElement);

        budgetSummary.appendChild(categoryElement);

        // Check if budget limit is reached
        if (category.budget <= 0) {
            alert(`Limite presupuestal alcanzado para la categoría "${category.name}"`);
        }
    });
    // Export summary to CSV
    exportSummaryCsvButton.addEventListener('click', () => {
        const csv = categories.map(category => {
            return `${category.name},${category.budget.toFixed(2)},${category.expenses.toFixed(2)},${category.income.toFixed(2)}`;
        }).join('\n');
        downloadCsv(csv, 'budget-summary.csv');
    });

    // Export summary to PDF
    exportSummaryPdfButton.addEventListener('click', () => {
        html2canvas(budgetSummary).then(canvas => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF();
            pdf.addImage(imgData, 'PNG', 10, 10);
            pdf.save('budget-summary.pdf');
        });
    });

    // Export transactions to CSV
    exportTransactionsCsvButton.addEventListener('click', () => {
        const csv = transactions.map(transaction => {
            return `${transaction.type},${transaction.category},${transaction.description},${transaction.date},${transaction.amount.toFixed(2)}`;
        }).join('\n');
        downloadCsv(csv, 'transactions.csv');
    });

    // Export transactions to PDF
    exportTransactionsPdfButton.addEventListener('click', () => {
        html2canvas(transactionTableBody).then(canvas => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF();
            pdf.addImage(imgData, 'PNG', 10, 10);
            pdf.save('transactions.pdf');
        });
    });
}

// Download CSV file
function downloadCsv(csv, filename) {
    const csvBlob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(csvBlob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Download PDF file
exportSummaryPdfButton.addEventListener('click', () => {
    const pdf = generateSummaryPdf();
    downloadPdf(pdf, 'budget_summary.pdf');
});

exportTransactionsPdfButton.addEventListener('click', () => {
    const pdf = generateTransactionsPdf();
    downloadPdf(pdf, 'budget_transactions.pdf');
});

// Initialize transaction form category select options
updateTransactionFormCategorySelectOptions();
function downloadPdf(pdf, filename) {
    const pdfBlob = new Blob([pdf], { type: 'text/pdf;charset=utf-8;' });
    const url = URL.createObjectURL(pdfBlob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}


// Initialize transaction form category select options
updateTransactionFormCategorySelectOptions();
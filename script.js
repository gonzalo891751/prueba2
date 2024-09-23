// Obtener referencias a elementos del DOM
const expenseForm = document.getElementById('expense-form');
const expensesTableBody = document.querySelector('#expenses-table tbody');
const expensesChartCtx = document.getElementById('expensesChart').getContext('2d');

// Array para almacenar los gastos
let expenses = [];

// Función para renderizar la tabla de gastos
function renderExpenses() {
    // Limpiar la tabla
    expensesTableBody.innerHTML = '';

    expenses.forEach((expense, index) => {
        const tr = document.createElement('tr');

        tr.innerHTML = `
            <td data-label="Fecha">${expense.fecha}</td>
            <td data-label="Nombre del Gasto">${expense.nombre}</td>
            <td data-label="Gasto U$D">$${expense.gastoUSD.toFixed(2)}</td>
            <td data-label="Cuotas">${expense.cuota}</td>
            <td data-label="Tarjeta">${expense.tarjeta}</td>
            <td data-label="Acciones" class="actions">
                <button onclick="deleteExpense(${index})"><i class="fa fa-trash"></i></button>
            </td>
        `;
        expensesTableBody.appendChild(tr);
    });

    updateChart();
}

// Función para agregar un nuevo gasto
expenseForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const fecha = document.getElementById('fecha').value;
    const nombre = document.getElementById('nombre').value;
    const gastoUSD = parseFloat(document.getElementById('gastoUSD').value);
    const cuota = parseInt(document.getElementById('cuota').value);
    const tarjeta = document.getElementById('tarjeta').value;

    const newExpense = { fecha, nombre, gastoUSD, cuota, tarjeta };
    expenses.push(newExpense);

    // Limpiar el formulario
    expenseForm.reset();

    renderExpenses();
});

// Función para eliminar un gasto
function deleteExpense(index) {
    if (confirm('¿Estás seguro de que deseas eliminar este gasto?')) {
        expenses.splice(index, 1);
        renderExpenses();
    }
}

// Función para actualizar el gráfico
let expensesChart;

function updateChart() {
    // Agrupar gastos por tarjeta
    const gastosPorTarjeta = expenses.reduce((acc, curr) => {
        acc[curr.tarjeta] = (acc[curr.tarjeta] || 0) + curr.gastoUSD;
        return acc;
    }, {});

    const labels = Object.keys(gastosPorTarjeta);
    const data = Object.values(gastosPorTarjeta);

    if (expensesChart) {
        expensesChart.destroy();
    }

    expensesChart = new Chart(expensesChartCtx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                label: 'Gastos por Tarjeta',
                data: data,
                backgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56',
                    '#8BC34A',
                    '#FF9800',
                    '#9C27B0'
                ],
                hoverOffset: 4
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom',
                },
                title: {
                    display: true,
                    text: 'Distribución de Gastos por Tarjeta de Crédito'
                }
            }
        }
    });
}

// Inicializar la tabla y el gráfico
renderExpenses();

// Obtener referencias a elementos del DOM
const expenseForm = document.getElementById('expense-form');
const expensesTableBody = document.querySelector('#expenses-table tbody');
const expensesChartCtx = document.getElementById('expensesChart').getContext('2d');
const downloadExcelBtn = document.getElementById('download-excel');
const metodoPagoRadios = document.getElementsByName('metodoPago');
const cuotaGroup = document.getElementById('cuota-group');
const tarjetaGroup = document.getElementById('tarjeta-group');

// Array para almacenar los gastos
let expenses = [];

// Inicializar la fecha al cargar la página
window.addEventListener('DOMContentLoaded', () => {
    const fechaInput = document.getElementById('fecha');
    const today = new Date().toISOString().split('T')[0];
    fechaInput.value = today;

    // Cargar los gastos desde localStorage si existen
    if (localStorage.getItem('expenses')) {
        expenses = JSON.parse(localStorage.getItem('expenses'));
    }

    renderExpenses();
    addMetodoPagoListener();
});

// Función para renderizar la tabla de gastos
function renderExpenses() {
    // Limpiar la tabla
    expensesTableBody.innerHTML = '';

    expenses.forEach((expense, index) => {
        const tr = document.createElement('tr');

        tr.innerHTML = `
            <td data-label="Fecha">${expense.fecha}</td>
            <td data-label="Nombre del Gasto">${expense.nombre}</td>
            <td data-label="Gasto">${expense.gasto.toFixed(2)}</td>
            <td data-label="Moneda">${expense.moneda}</td>
            <td data-label="Método de Pago">${expense.metodoPago}</td>
            <td data-label="Cuotas">${expense.cuota !== null ? expense.cuota : '-'}</td>
            <td data-label="Tarjeta">${expense.tarjeta !== null ? expense.tarjeta : '-'}</td>
            <td data-label="Acciones" class="actions">
                <button onclick="deleteExpense(${index})"><i class="fa fa-trash"></i></button>
            </td>
        `;
        expensesTableBody.appendChild(tr);
    });

    // Guardar en localStorage
    localStorage.setItem('expenses', JSON.stringify(expenses));

    updateChart();
}

// Función para agregar un nuevo gasto
expenseForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const fecha = document.getElementById('fecha').value;
    const nombre = document.getElementById('nombre').value.trim();
    const gastoInput = document.getElementById('gasto').value;
    const gasto = gastoInput === '' ? 0 : parseFloat(gastoInput);
    const monedaTipo = document.querySelector('input[name="monedaTipo"]:checked') ? document.querySelector('input[name="monedaTipo"]:checked').value : '';
    const metodoPago = document.querySelector('input[name="metodoPago"]:checked') ? document.querySelector('input[name="metodoPago"]:checked').value : '';
    const cuota = metodoPago === 'Tarjeta de Crédito' ? (document.getElementById('cuota').value === '' ? null : parseInt(document.getElementById('cuota').value)) : null;
    const tarjeta = metodoPago === 'Tarjeta de Crédito' ? (document.getElementById('tarjeta').value === '' ? null : document.getElementById('tarjeta').value) : null;

    // Validaciones
    if (!nombre) {
        alert('Por favor, ingresa el nombre del gasto.');
        return;
    }
    if (isNaN(gasto) || gasto <= 0) {
        alert('Por favor, ingresa una cantidad válida para el gasto.');
        return;
    }
    if (!monedaTipo) {
        alert('Por favor, selecciona una moneda.');
        return;
    }
    if (!metodoPago) {
        alert('Por favor, selecciona un método de pago.');
        return;
    }
    if (metodoPago === 'Tarjeta de Crédito') {
        if (cuota === null || isNaN(cuota) || cuota <= 0) {
            alert('Por favor, ingresa un número válido de cuotas.');
            return;
        }
        if (!tarjeta) {
            alert('Por favor, selecciona una tarjeta de crédito.');
            return;
        }
    }

    const newExpense = {
        fecha,
        nombre,
        gasto,
        moneda: monedaTipo,
        metodoPago,
        cuota,
        tarjeta
    };
    expenses.push(newExpense);

    // Limpiar el formulario
    expenseForm.reset();
    // Resetear la fecha a hoy después de resetear el formulario
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('fecha').value = today;

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
    // Agrupar gastos por tarjeta y moneda, excluyendo los gastos en efectivo
    const gastosPorTarjeta = {};

    expenses.forEach(expense => {
        if (expense.metodoPago === 'Tarjeta de Crédito' && expense.tarjeta) {
            const key = `${expense.tarjeta} (${expense.moneda})`;
            gastosPorTarjeta[key] = (gastosPorTarjeta[key] || 0) + expense.gasto;
        }
    });

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
                backgroundColor: generateColors(labels.length),
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

// Función para generar colores predefinidos para el gráfico
function generateColors(num) {
    const predefinedColors = [
        '#FF6384', '#36A2EB', '#FFCE56',
        '#8BC34A', '#FF9800', '#9C27B0',
        '#00BCD4', '#E91E63', '#3F51B5',
        '#CDDC39', '#FF5722', '#607D8B'
    ];
    const colors = [];
    for (let i = 0; i < num; i++) {
        colors.push(predefinedColors[i % predefinedColors.length]);
    }
    return colors;
}

// Función para descargar la tabla como Excel
downloadExcelBtn.addEventListener('click', function() {
    if (expenses.length === 0) {
        alert('No hay gastos para descargar.');
        return;
    }

    // Crear una nueva hoja de trabajo
    const wb = XLSX.utils.book_new();
    const ws_data = [
        ["Fecha", "Nombre del Gasto", "Gasto", "Moneda", "Método de Pago", "Cuotas", "Tarjeta"]
    ];

    expenses.forEach(expense => {
        ws_data.push([
            expense.fecha,
            expense.nombre,
            expense.gasto,
            expense.moneda,
            expense.metodoPago,
            expense.cuota !== null ? expense.cuota : '',
            expense.tarjeta !== null ? expense.tarjeta : ''
        ]);
    });

    const ws = XLSX.utils.aoa_to_sheet(ws_data);
    XLSX.utils.book_append_sheet(wb, ws, "Gastos");

    // Generar y descargar el archivo
    XLSX.writeFile(wb, "Registro_de_Gastos.xlsx");
});

// Función para manejar la selección de método de pago
function addMetodoPagoListener() {
    metodoPagoRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            if (e.target.value === 'Efectivo') {
                // Ocultar o deshabilitar "Cuotas" y "Tarjeta de Crédito"
                cuotaGroup.style.display = 'none';
                tarjetaGroup.style.display = 'none';

                // Limpiar los campos deshabilitados
                document.getElementById('cuota').value = '';
                document.getElementById('tarjeta').value = '';
            } else if (e.target.value === 'Tarjeta de Crédito') {
                // Mostrar "Cuotas" y "Tarjeta de Crédito"
                cuotaGroup.style.display = 'flex';
                tarjetaGroup.style.display = 'flex';
            }
        });
    });
}

// Inicialmente ocultar "Cuotas" y "Tarjeta de Crédito" si "Efectivo" está seleccionado
function initializeMetodoPago() {
    const selectedMetodoPago = document.querySelector('input[name="metodoPago"]:checked');
    if (selectedMetodoPago) {
        if (selectedMetodoPago.value === 'Efectivo') {
            cuotaGroup.style.display = 'none';
            tarjetaGroup.style.display = 'none';
        } else {
            cuotaGroup.style.display = 'flex';
            tarjetaGroup.style.display = 'flex';
        }
    } else {
        cuotaGroup.style.display = 'none';
        tarjetaGroup.style.display = 'none';
    }
}

// Llamar a la función para inicializar el método de pago al cargar
initializeMetodoPago();

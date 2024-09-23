/* Reset de estilos básicos */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Arial', sans-serif;
    background-color: #f4f6f8;
    color: #333;
    line-height: 1.6;
}

header {
    background-color: #4CAF50;
    color: #fff;
    padding: 20px 0;
    text-align: center;
}

main {
    padding: 20px;
    max-width: 1200px;
    margin: auto;
}

section {
    background-color: #fff;
    padding: 20px;
    margin-bottom: 20px;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

h2 {
    margin-bottom: 15px;
    color: #4CAF50;
}

.form-group {
    display: flex;
    flex-direction: column;
    margin-bottom: 15px;
}

.form-group label {
    margin-bottom: 5px;
    font-weight: bold;
}

.form-group input,
.form-group select {
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
}

button[type="submit"] {
    background-color: #4CAF50;
    color: #fff;
    padding: 12px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
    transition: background-color 0.3s ease;
}

button[type="submit"]:hover {
    background-color: #45a049;
}

table {
    width: 100%;
    border-collapse: collapse;
}

table thead {
    background-color: #4CAF50;
    color: #fff;
}

table th, table td {
    padding: 12px;
    text-align: left;
    border-bottom: 1px solid #ddd;
}

table tr:hover {
    background-color: #f1f1f1;
}

.actions {
    display: flex;
    gap: 10px;
}

.actions button {
    background: none;
    border: none;
    cursor: pointer;
    color: #4CAF50;
    font-size: 18px;
    transition: color 0.3s ease;
}

.actions button:hover {
    color: #388E3C;
}

.download-btn {
    margin-top: 15px;
    background-color: #2196F3;
    color: #fff;
    padding: 10px 15px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
    display: flex;
    align-items: center;
    gap: 5px;
    transition: background-color 0.3s ease;
}

.download-btn:hover {
    background-color: #1976D2;
}

footer {
    text-align: center;
    padding: 15px 0;
    background-color: #4CAF50;
    color: #fff;
    position: fixed;
    width: 100%;
    bottom: 0;
}

/* Responsive Design */
@media (max-width: 768px) {
    .form-group {
        flex-direction: column;
    }

    table thead {
        display: none;
    }

    table, table tbody, table tr, table td {
        display: block;
        width: 100%;
    }

    table tr {
        margin-bottom: 15px;
    }

    table td {
        text-align: right;
        padding-left: 50%;
        position: relative;
    }

    table td::before {
        content: attr(data-label);
        position: absolute;
        left: 0;
        width: 50%;
        padding-left: 15px;
        font-weight: bold;
        text-align: left;
    }
}

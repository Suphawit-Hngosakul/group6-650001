document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('week-btn').addEventListener('click', () => showRequest('week'));
    document.getElementById('month-btn').addEventListener('click', () => showRequest('month'));
    document.getElementById('year-btn').addEventListener('click', () => showRequest('year'));
});
let patrimonioChart = null;

export const renderChart = () => {
    const ctx = document.getElementById('patrimonio-chart').getContext('2d');
    if (patrimonioChart) {
        patrimonioChart.destroy();
    }
    patrimonioChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul'],
            datasets: [{
                label: 'Evolução do Patrimônio',
                // This is mock data. In a real app, it would come from the user object.
                data: [1200, 1900, 3000, 5000, 4300, 3200, 4800],
                backgroundColor: 'rgba(79, 70, 229, 0.1)',
                borderColor: 'rgba(79, 70, 229, 1)',
                borderWidth: 2,
                tension: 0.4,
                fill: true,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { color: '#9CA3AF' },
                    grid: { color: '#374151' }
                },
                x: {
                    ticks: { color: '#9CA3AF' },
                    grid: { color: '#374151' }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
};
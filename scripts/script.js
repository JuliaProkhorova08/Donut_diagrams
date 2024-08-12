// Диаграмма 1: Обученность команды
const teamTrainingCanvas = document.getElementById('teamTrainingChart');
teamTrainingCanvas.width = 362;
teamTrainingCanvas.height = 160;
const teamTrainingCtx = teamTrainingCanvas.getContext('2d');
let dataValues = [70, 10, 10, 10];

// Плагин для рисования текста в центре диаграммы
const centerTextPlugin = {
    id: 'centerTextPlugin',
    beforeDraw: (chart) => {
        const ctx = chart.ctx;
        ctx.save();
        const fontSize = 32;
        ctx.font = `${fontSize}px "Stolzl", "Arial", sans-serif`;
        ctx.textBaseline = "middle";

        // Получаем актуальные значения данных
        const currentData = chart.data.datasets[0].data;
        const total = currentData.reduce((sum, value) => sum + value, 0);
        const percentage = ((currentData[0] / total) * 100).toFixed(0);
        const text = `${percentage}%`;

        const centerX = chart.width / 3.1;
        const centerY = chart.height / 1.95;
        const textWidth = ctx.measureText(text).width;
        const textX = Math.round(centerX - textWidth / 2);
        const textY = Math.round(centerY);

        ctx.fillStyle = "#000000";
        ctx.fillText(text, textX, textY);
        ctx.restore();
    }
};

const teamTrainingChart = new Chart(teamTrainingCtx, {
    type: 'doughnut',
    data: {
        labels: ['Завершено', 'В процессе', 'Не пройдено', 'Не начато'],
        datasets: [{
            data: dataValues,
            backgroundColor: ['#4CAF50', '#FFC107', '#F44336', '#9E9E9E'],
        }]
    },
    options: {
        responsive: false,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                position: 'right',
                align: 'center',
                labels: {
                    usePointStyle: true,
                    pointStyle: 'circle',
                    boxWidth: 8,
                    boxHeight: 8,
                    padding: 8,
                    font: {
                        size: 14,
                        family: '"Verdana", "Arial", sans-serif'
                    },
                    color: '#000000',
                    lineHeight: 1.43
                },

            },
            title: {
                display: false
            }
        },
        cutout: '77%',
        layout: {
            padding: {
                left: 0,
                right: 10,
                top: 0,
                bottom: 0
            }
        }
    },
    plugins: [centerTextPlugin]
});

// Функция для обновления данных диаграммы
function updateChartData(newData) {
    teamTrainingChart.data.datasets[0].data = newData;
    teamTrainingChart.update();
}

// Диаграмма 2: Прогресс сотрудников
const employeeProgressCanvas = document.getElementById('employeeProgressChart');
employeeProgressCanvas.width = 300;
employeeProgressCanvas.height = 150;
const employeeProgressCtx = employeeProgressCanvas.getContext('2d');

const employeeProgressChart = new Chart(employeeProgressCtx, {
    type: 'doughnut',
    data: {
        labels: ['Прошли', 'Не прошли'],
        datasets: [{
            data: [2, 3],
            backgroundColor: ['#E9841D', '#E7F1F9'],
        }]
    },
    options: {
        responsive: false,
        maintainAspectRatio: false,
        circumference: 180,
        rotation: -90,
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: true,
                text: '2/5',
                position: 'bottom',
                font: {
                    family: '"Stolzl", "Arial", sans-serif',
                    size: 32,
                    lineHeight: 1.25,
                    weight: 'normal'
                },
                color: '#000000',
                padding: {
                    top: -50,
                    bottom: 0
                }
            }
        },
        cutout: '80%',
        layout: {
            padding: {
                top: 0,
                bottom: 0,
                left: 0,
                right: 75
            }
        }
    },
    plugins: [{
        id: 'updateTitlePlugin',
        beforeDraw: (chart) => {
            const data = chart.data.datasets[0].data;
            const total = data.reduce((a, b) => a + b, 0);
            const passed = data[0];
            chart.options.plugins.title.text = `${passed}/${total}`;
        }
    }]
});

// Обновление диаграмм
function updateCharts() {
    const notTrained = parseInt(document.getElementById('notTrained').value);
    const notLoggedIn = parseInt(document.getElementById('notLoggedIn').value);
    const notVisited = parseInt(document.getElementById('notVisited').value);

    const totalEmployees = 5;
    const trainedEmployees = totalEmployees - (notTrained + notLoggedIn + notVisited);

    // Обновление диаграммы прогресса сотрудников
    employeeProgressChart.data.datasets[0].data = [trainedEmployees, totalEmployees - trainedEmployees];
    employeeProgressChart.options.plugins.title.text = `${trainedEmployees}/${totalEmployees}`;
    employeeProgressChart.update();

    // Обновление диаграммы обученности команды
    const completedPercentage = 100 - ((notTrained + notLoggedIn + notVisited) * 10);
    const inProgressPercentage = notTrained * 10;
    const notPassedPercentage = notLoggedIn * 10;
    const notStartedPercentage = notVisited * 10;

    teamTrainingChart.data.datasets[0].data = [completedPercentage, inProgressPercentage, notPassedPercentage, notStartedPercentage];
    teamTrainingChart.options.plugins.title.text = `${completedPercentage}%`;
    teamTrainingChart.update();
}

// Добавление обработчиков событий для инпутов
document.getElementById('notTrained').addEventListener('input', updateCharts);
document.getElementById('notLoggedIn').addEventListener('input', updateCharts);
document.getElementById('notVisited').addEventListener('input', updateCharts);

// Инициализация диаграмм
updateCharts();

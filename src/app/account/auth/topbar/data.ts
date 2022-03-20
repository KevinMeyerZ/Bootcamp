import { ChartType } from './chartjs.model';

const lineAreaChart: ChartType = {
    labels: ['10.00', '11.00', '12.000', '13.00', '14.00', '15.00', '16.00', '17.00', '18.00', '19.00'],
    datasets: [
        {
            label: 'Makanan',
            fill: true,
            lineTension: 0.5,
            backgroundColor: 'rgba(85, 110, 230, 0.2)',
            borderColor: '#DC3545',
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: '#556ee6',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: '#556ee6',
            pointHoverBorderColor: '#fff',
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: [65, 59, 80, 81, 56, 55, 40, 55, 30, 80]
        },
        {
            label: 'Minuman',
            fill: true,
            lineTension: 0.5,
            backgroundColor: 'rgba(235, 239, 242, 0.2)',
            borderColor: 'rgba(52, 195, 143, 0.8)',
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: '#ebeff2',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: '#ebeff2',
            pointHoverBorderColor: '#eef0f2',
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: [80, 23, 56, 65, 23, 35, 85, 25, 92, 36]
        }
    ],
    options: {
        defaultFontColor: '#8791af',
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            xAxes: [
                {
                    gridLines: {
                        color: 'rgba(166, 176, 207, 0.1)',
                    },
                },
            ],
            yAxes: [
                {
                    ticks: {
                        max: 100,
                        min: 20,
                        stepSize: 10,
                    },
                    gridLines: {
                        color: 'rgba(166, 176, 207, 0.1)',
                    },
                },
            ],
        },

    }
};

const lineBarChart: ChartType = {
    labels: [
        'Senin',
        'Selasa',
        'Rabu',
        'Kamis',
        'Jumat',
        'Sabtu',
        'Minggu'
    ],
    datasets: [
        {
            label: 'Produk Terjual',
            backgroundColor: 'rgba(52, 195, 143, 0.8)',
            borderColor: 'rgba(52, 195, 143, 0.8)',
            borderWidth: 1,
            hoverBackgroundColor: 'rgba(52, 195, 143, 0.9)',
            hoverBorderColor: 'rgba(52, 195, 143, 0.9)',
            data: [37,23,30,32,25,35,45],
            barPercentage: 0.4

        },
    ],
    options: {
        maintainAspectRatio: false,
        scales: {
            xAxes: [
                {
                    gridLines: {
                        color: 'rgba(166, 176, 207, 0.1)'
                    },
                }
            ],
            yAxes: [
                {
                    gridLines: {
                        color: 'rgba(166, 176, 207, 0.1)'
                    }
                }
            ]
        }
    }
};

const pieChart: ChartType = {
    labels: ['Minuman', 'Makanan'],
    datasets: [
        {
            data: [336, 178],
            backgroundColor: ['#34c38f', '#DC3545'],
            hoverBackgroundColor: ['#34c38f', '#DC3545'],
            hoverBorderColor: '#fff',
        }
    ],
    options: {
        maintainAspectRatio: false,
        legend: {
            position: 'top',
        }
    }
};

const donutChart: ChartType = {
    labels: [
        'Desktops', 'Tablets'
    ],
    datasets: [
        {
            data: [300, 210],
            backgroundColor: [
                '#556ee6', '#ebeff2'
            ],
            hoverBackgroundColor: ['#556ee6', '#ebeff2'],
            hoverBorderColor: '#fff',
        }],
    options: {
        maintainAspectRatio: false,
        legend: {
            position: 'top',
        }
    }
};

const radarChart: ChartType = {
    labels: [
        'Eating',
        'Drinking',
        'Sleeping',
        'Designing',
        'Coding',
        'Cycling',
        'Running',
    ],
    datasets: [
        {
            label: 'Desktops',
            backgroundColor: 'rgba(52, 195, 143, 0.2)',
            borderColor: '#34c38f',
            pointBackgroundColor: '#34c38f',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: '#34c38f',
            data: [65, 59, 90, 81, 56, 55, 40],
        },
        {
            label: 'Tablets',
            backgroundColor: 'rgba(85, 110, 230, 0.2)',
            borderColor: '#556ee6',
            pointBackgroundColor: '#556ee6',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: '#556ee6',
            data: [28, 48, 40, 19, 96, 27, 100],
        },
    ],
    options: {
        maintainAspectRatio: false,
        legend: {
            position: 'top'
        }
    }
};

const polarChart: ChartType = {
    labels: ['Series 1', 'Series 2', 'Series 3', 'Series 4'],
    datasets: [
        {
            data: [11, 16, 7, 18],
            backgroundColor: ['#f46a6a', '#34c38f', '#f1b44c', '#556ee6'],
            label: 'My dataset', // for legend
            hoverBorderColor: '#fff',
        },
    ],
    options: {
        responsive: true,
        legend: {
            position: 'top',
        }
    }
};

export { lineAreaChart, lineBarChart, pieChart, donutChart, radarChart, polarChart };

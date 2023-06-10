<script>
import sensor_nodes from '../../../../api/sensor_nodes'

function extract(history) {
    const temperatures = history.map(item => item.temperature);
    const humidities = history.map(item => item.humidity);
    const lastupdate = history.map(item => {
        let date = new Date(item.lastupdate)
        return date.toLocaleString('en-US', { month: '2-digit', day: '2-digit', hour: 'numeric' });
    });
    return {
        temperatures,
        humidities,
        lastupdate
    };
}

export default {
    name: "Content",
    mounted() {

        const data = sensor_nodes.fetchHistoryData('ENV-01')
            .then(data => {
                const { temperatures, humidities, lastupdate } = extract(data.history.reverse());
                // Set new default font family and font color to mimic Bootstrap's default styling
                Chart.defaults.global.defaultFontFamily = '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
                Chart.defaults.global.defaultFontColor = '#292b2c';

                // Area Chart Example
                const ctx = this.$refs.myAreaChart.getContext('2d');
                const myAreaChart = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: lastupdate,
                        datasets: [
                            {
                                label: "Temperatures",
                                yAxisID: 'temperature',
                                lineTension: 0.3,
                                backgroundColor: "rgba(255, 103, 103, 0.3)",
                                borderColor: "rgba(255, 103, 103, 1)",
                                pointRadius: 5,
                                pointBackgroundColor: "rgba(255, 153, 153, 1)",
                                pointBorderColor: "rgba(255, 103, 103, 0.8)",
                                pointHoverRadius: 5,
                                pointHoverBackgroundColor: "rgba(255, 153, 153, 1)",
                                pointHitRadius: 50,
                                pointBorderWidth: 2,
                                data: temperatures,
                            },
                            {
                                label: "Humidities",
                                yAxisID: 'humidity',
                                lineTension: 0.3,
                                backgroundColor: "rgba(0, 0, 0, 0)",
                                borderColor: "rgba(0, 104, 255, 1)",
                                pointRadius: 5,
                                pointBackgroundColor: "rgba(0, 104, 255, 1)",
                                pointBorderColor: "rgba(255, 255, 255, 0.8)",
                                pointHoverRadius: 5,
                                pointHoverBackgroundColor: "rgba(153, 204, 255, 1)",
                                pointHitRadius: 50,
                                pointBorderWidth: 2,
                                data: humidities,
                            }
                        ]

                    },
                    options: {
                        scales: {
                            xAxes: [{
                                time: {
                                    unit: 'date'
                                },
                                gridLines: {
                                    display: false
                                },
                                ticks: {
                                    maxTicksLimit: 7
                                }
                            }],
                            yAxes: [{
                                id: 'temperature',
                                position: 'left',
                                ticks: {
                                    callback: (value) => value + '°C',
                                },
                                scaleLabel: {
                                    display: true,
                                    // labelString: 'Temperature'
                                },
                                gridLines: {
                                    color: "rgba(0, 0, 0, .125)",
                                }
                            },
                            {
                                id: 'humidity',
                                position: 'right',
                                ticks: {
                                    callback: (value) => value + '%',
                                },
                                scaleLabel: {
                                    display: true,
                                    // labelString: 'Humidity'
                                }
                            }],
                        },
                        legend: {
                            display: false
                        }
                    }
                });
            })
            .catch(error => {
                console.log(error);
            })
    },
};
</script>

<!-- 13, 110, 253 -->

<template>
    <div class="card mb-4">
        <div class="card-header bg-primary text-white">
            <i class="fas fa-chart-area me-1"></i>
            Temperature and Humidity History
        </div>
        <div class="card-body"><canvas ref="myAreaChart" width="100%" height="220"></canvas></div>
    </div>
</template>

<style></style>

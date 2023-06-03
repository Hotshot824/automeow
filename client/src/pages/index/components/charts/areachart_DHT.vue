<script>
import DHT22 from '../../../../api/DHT22'

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

        DHT22.fetchDHTHistoryData()
            .then(response => response.json())
            .then(data => {
                const { temperatures, humidities, lastupdate } = extract(data.history);
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
                                lineTension: 0.3,
                                backgroundColor: "rgba(255, 153, 153, 0.2)", // 淡紅色
                                borderColor: "rgba(255, 153, 153, 1)",
                                pointRadius: 5,
                                pointBackgroundColor: "rgba(255, 153, 153, 1)",
                                pointBorderColor: "rgba(255, 255, 255, 0.8)",
                                pointHoverRadius: 5,
                                pointHoverBackgroundColor: "rgba(255, 153, 153, 1)",
                                pointHitRadius: 50,
                                pointBorderWidth: 2,
                                data: temperatures,
                            },
                            {
                                label: "Humidities",
                                lineTension: 0.3,
                                backgroundColor: "rgba(153, 204, 255, 0.2)", // 淡藍色
                                borderColor: "rgba(153, 204, 255, 1)",
                                pointRadius: 5,
                                pointBackgroundColor: "rgba(153, 204, 255, 1)",
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
                                // ticks: {
                                //     min: 0,
                                //     max: 100,
                                //     maxTicksLimit: 5
                                // },
                                gridLines: {
                                    color: "rgba(0, 0, 0, .125)",
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

<template>
    <div class="card mb-4">
        <div class="card-header">
            <i class="fas fa-chart-area me-1"></i>
            Temperature and Humidity History
        </div>
        <div class="card-body"><canvas ref="myAreaChart" width="100%" height="220"></canvas></div>
    </div>
</template>

<style></style>

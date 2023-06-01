var temperature = "Unknown", humidity = "Unknown", currentTime = "Unknown", online = "Unknown"
async function fetchTemperature_Humidity() {
    await fetch('/api/dht')
        .then(response => response.json())
        .then(data => {
            console.log(data)
            temperature = parseFloat(data.temperature).toFixed(2);
            humidity = parseFloat(data.humidity).toFixed(2);
            if (!isNaN(parseFloat(data.temperature)) && !isNaN(parseFloat(data.humidity))) {
                currentTime = updateCurrentTime();
                online = "ON"
            }
        })
        .catch(error => {
            online = "OFF"
            console.log(error);
        })
}

function updateCurrentTime() {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    return `${year}/${month}/${day}/${hours}:${minutes}:${seconds}`;
}

export default {
    async getDHTsensor() {
        await fetchTemperature_Humidity();
        return {
            "temperature": temperature,
            "humidity": humidity,
            "currentTime": currentTime,
            "online": online
        }
    },
}
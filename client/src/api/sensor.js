var temperature = "Unknown", humidity = "Unknown", currentTime = "Unknown", online = false
async function fetchDHTdata() {
    await fetch('/api/dht')
        .then(response => response.json())
        .then(data => {
            console.log(data)
            temperature = parseFloat(data.temperature).toFixed(2);
            humidity = parseFloat(data.humidity).toFixed(2);
            if (!isNaN(parseFloat(data.temperature)) && !isNaN(parseFloat(data.humidity))) {
                currentTime = updateCurrentTime();
                online = true
            }
        })
        .catch(error => {
            online = false
            console.log(error);
        })
}

async function fetchControlLED() {
    let data = {
        topic: 'Group10_boardA/sensor/controlLED',
        control: true
    }
    await fetch('/api/control', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(data => {
            console.log(data)
        })
        .catch(error => {
            online = false
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
    async getData() {
        await fetchDHTdata();
        return {
            "temperature": temperature,
            "humidity": humidity,
            "currentTime": currentTime,
            "online": online
        }
    },
    async controlLED() {
        await fetchControlLED();
    }
}
var temperature = "Unknown", humidity = "Unknown", current_time = "Unknown", online = false
async function fetchDHTdata() {
    await fetch('/api/sensors/dht')
        .then(response => response.json())
        .then(data => {
            // console.log(data);
            temperature = parseFloat(data.temperature).toFixed(2);
            humidity = parseFloat(data.humidity).toFixed(2);
            if (data.online == 'ON') {
                current_time = updateCurrentTime();
                online = true;
            } else {
                online = false;
            }
        })
        .catch(error => {
            online = false;
            console.log(error);
        })
}

async function fetchToggleDHT() {
    let data = {
        topic: 'Group10_boardA/DHT22/controlDHT',
        control: true
    }
    await fetch('/api/sensors/dht/control', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
        })
        .catch(error => {
            online = false;
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
            "current_time": current_time,
            "online": online
        }
    },
    async toggleDHT() {
        await fetchToggleDHT();
    }
}
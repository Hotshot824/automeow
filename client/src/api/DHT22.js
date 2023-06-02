var temperature = "", humidity = "", time = "", online = false
async function fetchDHTdata() {
    await fetch('/api/sensors/dht')
        .then(response => response.json())
        .then(data => {
            console.log(data);
            temperature = parseFloat(data.temperature).toFixed(2);
            humidity = parseFloat(data.humidity).toFixed(2);
            time = data.time;
            if (data.online == 'ON') {
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
        topic: 'automeow/DHT22/controlDHT',
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
            // console.log(data);
            if (data.online == 'ON') {
                online = true;
            } else {
                online = false;
            }
        })
        .catch(error => {
            console.log(error);
        })
}

export default {
    async getData() {
        await fetchDHTdata();
        return {
            "temperature": temperature,
            "humidity": humidity,
            "time": time,
            "online": online
        }
    },
    async toggleDHT() {
        await fetchToggleDHT();
        return {
            "online": online
        }
    }
}
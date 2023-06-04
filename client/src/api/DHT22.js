async function fetchDHTdata() {
    try {
        const response = await fetch('/api/sensors/dht')
        let data = await response.json();
        data.temperature = parseFloat(data.temperature).toFixed(2);
        data.humidity = parseFloat(data.humidity).toFixed(2);
        if (data.online == 'ON') {
            data.online = true;
        } else {
            data.online = false;
        }
        return data;
    } catch (error) {
        console.log(error);
        return { online: false };
    }
}

function fetchDHTHistoryData() {
    return fetch('/api/sensors/dht/history');
}


async function fetchToggleDHT() {
    try {
        let body = {
            topic: 'automeow/DHT22/control',
        }
        const response = await fetch('/api/sensors/dht/control', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        })
        let data = await response.json();
        if (data.online == 'ON') {
            data.online = true;
        } else {
            data.online = false;
        }
        return data
    } catch (error) {
        console.log(error);
        return { online: false };
    }
}

export default {
    fetchDHTdata,
    fetchToggleDHT,
    fetchDHTHistoryData,
}
async function fetchData() {
    try {
        const response = await fetch('/api/sensors/feeder')
        let data = await response.json();
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

async function fetchToggle() {
    try {
        let body = {
            topic: 'automeow/feeder/control',
        }
        const response = await fetch('/api/sensors/control', {
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

async function fetchToFeed() {
    try {
        let body = {
            topic: 'automeow/feeder/control/tofeed',
        }
        const response = await fetch('/api/sensors/control', {
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
    fetchData,
    fetchToggle,
    fetchToFeed,
}
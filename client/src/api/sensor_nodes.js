async function fetchData(device_name) {
    const url = `/api/nodes?device_name=${device_name}`;
    try {
        const response = await fetch(url)
        let data = await response.json();
        return data;
    } catch (error) {
        console.log(error);
    }
}

async function fetchHistoryData(device_name) {
    const url = `/api/nodes/history?device_name=${device_name}`;
    try {
        const response = await fetch(url)
        let data = await response.json();
        return data;
    } catch (error) {
        console.log(error);
    }
}

async function fetchControl(device_name, control_type) {
    const url = `/api/nodes/contorl?device_name=${device_name}&control_type=${control_type}`;
    try {
        const response = await fetch(url);
        let data = response.json();
        return data;
    } catch (error) {
        console.log(error);
    }
}

export default {
    fetchData,
    fetchHistoryData,
    fetchControl,
}
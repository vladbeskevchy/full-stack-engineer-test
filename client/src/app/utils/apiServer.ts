import axios from 'axios';

const apiServer = axios.create({
    baseURL: 'http://localhost:8001/',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    },
});

export default apiServer;
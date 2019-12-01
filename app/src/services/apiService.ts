import axios, { Method, AxiosRequestConfig } from 'axios';

class APIService {
    private serviceURL: string;

    constructor() {
        if (PRODUCTION) {
            this.serviceURL = window.location.href;
        } else {
            this.serviceURL = 'http://localhost:3000/';
        }
    }

    public get = (route: string, options?: AxiosRequestConfig) => {
        return this.makeAPIRequest('GET', route, options);
    }

    public post = (route: string, options?: AxiosRequestConfig) => {
        return this.makeAPIRequest('POST', route, options);
    }

    public delete = (route: string, options?: AxiosRequestConfig) => {
        return this.makeAPIRequest('DELETE', route, options);
    }

    private makeAPIRequest = (method: Method, route: string, options?: AxiosRequestConfig) => {
        const requestConfig: AxiosRequestConfig = options || {};
        requestConfig.method = method;
        if (route.startsWith('/')) {
            route = route.slice(1);
        }
        requestConfig.url = `${this.serviceURL}${route}`;

        return axios.request(requestConfig);
    }
}

export default new APIService();

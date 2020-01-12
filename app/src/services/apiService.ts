import axios, { Method, AxiosRequestConfig } from 'axios';
import store from '../store';

class APIService {
    private serviceURL: string;

    constructor() {
        if (PRODUCTION) {
            this.serviceURL = window.location.origin;
        } else {
            this.serviceURL = `http://${window.location.hostname}:3000/`;
        }
    }

    public get = (route: string, options?: AxiosRequestConfig) => {
        return this.makeAPIRequest('GET', route, options);
    }

    public post = (route: string, options?: AxiosRequestConfig, withoutToken: boolean = false) => {
        return this.makeAPIRequest('POST', route, options, withoutToken);
    }

    public delete = (route: string, options?: AxiosRequestConfig) => {
        return this.makeAPIRequest('DELETE', route, options);
    }

    private makeAPIRequest = (method: Method, route: string, options?: AxiosRequestConfig, withoutToken: boolean = false) => {
        const requestConfig: AxiosRequestConfig = options || {};
        requestConfig.method = method;
        if (route.startsWith('/')) {
            route = route.slice(1);
        }
        requestConfig.url = `${this.serviceURL}${route}`;
            if (!withoutToken) {
                requestConfig.headers = requestConfig.headers || {};
                requestConfig.headers.Authorization = `Bearer ${store.state.token}`;
            }

        return axios.request(requestConfig);
    }
}

export default new APIService();

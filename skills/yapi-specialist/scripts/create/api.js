import axios from 'axios';
import { stringify } from 'node:querystring';

export const YAPI_ERROR_CODES = {
    TOKEN_EXPIRED: 40011,
};

export async function getYapiInterfaceTotal(obj) {
    const { origin, token, projectId, catId } = obj;
    try {
        const url = catId ? `${origin}/api/interface/list_cat` : `${origin}/api/interface/list`;
        const params = catId
            ? { page: 1, limit: 1, catid: catId, token }
            : { page: 1, limit: 1, project_id: projectId, token };
        const response = await axios.get(url, {
            params,
            paramsSerializer: (params) => stringify(params),
        });
        if (response.data.errcode !== 0) {
            return null;
        }
        return response.data.data.count;
    } catch {
        return null;
    }
}

export async function getYapiInterfaceList(obj) {
    const { origin, token, projectId, total, catId } = obj;
    try {
        const url = catId ? `${origin}/api/interface/list_cat` : `${origin}/api/interface/list`;
        const params = catId
            ? { page: 1, limit: total, catid: catId, token }
            : { page: 1, limit: total, project_id: projectId, token };
        const response = await axios.get(url, {
            params,
            paramsSerializer: (params) => stringify(params),
        });
        if (response.data.errcode !== 0) {
            return null;
        }
        return response.data.data.list.map((item) => ({
            _id: item._id,
        }));
    } catch {
        return null;
    }
}

export async function getYapiInterfaceDetail(origin, token, interfaceId) {
    try {
        const url = `${origin}/api/interface/get`;
        const params = { id: interfaceId, token };
        const response = await axios.get(url, {
            params,
            paramsSerializer: (params) => stringify(params),
        });
        if (response.data.errcode !== 0) {
            return null;
        }
        return response.data.data;
    } catch {
        return null;
    }
}

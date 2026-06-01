import { axiosInstance } from '@/lib/http/axiosInstance';
import { getApiData } from '@/lib/http/unwrapApiSuccess';

const resourceBase = '/api/refunds';

/**
 * @param {{ page?: number, limit?: number, status?: string, search?: string }} query
 */
function buildListParams(query = {}) {
    const { page = 1, limit = 10, status, search } = query;

    const params = { page, limit };

    const q = typeof search === 'string' ? search.trim() : '';
    if (q) params.search = q;

    const s = typeof status === 'string' ? status.trim() : '';
    if (s) params.status = s;

    return params;
}

export const refundService = {
    /**
     * Guest/User tạo yêu cầu hoàn vé
     *
     * @param {{
     *   orderCode: string,
     *   customerName: string,
     *   customerEmail: string,
     *   customerPhone: string,
     *   bankName: string,
     *   bankAccountNumber: string,
     *   bankAccountHolder: string,
     *   note?: string
     * }} data
     */
    create: async (data) => {
        const body = await axiosInstance.post(resourceBase, data);
        return getApiData(body);
    },

    /**
     * Admin lấy danh sách yêu cầu hoàn vé
     *
     * @param {{ page?: number, limit?: number, status?: 'PENDING' | 'COMPLETED' | 'REJECTED', search?: string }} query
     */
    listAdmin: async (query = {}) => {
        const body = await axiosInstance.get(`${resourceBase}/admin`, {
            params: buildListParams(query),
        });

        return getApiData(body);
    },

    /**
     * Admin mark đã hoàn tiền
     *
     * @param {string} id
     */
    complete: async (id) => {
        const body = await axiosInstance.patch(
            `${resourceBase}/admin/${id}/complete`
        );
        return getApiData(body);
    },

    /**
     * Admin từ chối yêu cầu hoàn tiền
     *
     * @param {string} id
     */
    reject: async (id) => {
        const body = await axiosInstance.patch(
            `${resourceBase}/admin/${id}/reject`
        );
        return getApiData(body);
    },
};

export interface PaginationParams {
    page?: number;
    limit?: number;
}

export interface PaginatedResult<T> {
    data: T[];
    meta: {
        totalItems: number;
        itemCount: number;
        itemsPerPage: number;
        totalPages: number;
        currentPage: number;
    };
}

export const getPaginationMetadata = (
    totalItems: number,
    page: number,
    limit: number
) => {
    const totalPages = Math.ceil(totalItems / limit);
    return {
        totalItems,
        itemCount: limit,
        itemsPerPage: limit,
        totalPages,
        currentPage: page,
    };
};

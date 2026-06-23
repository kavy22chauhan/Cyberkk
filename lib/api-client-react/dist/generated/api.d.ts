import type { QueryKey, UseMutationOptions, UseMutationResult, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import type { ContactInput, ContactResponse, DeleteResponse, ErrorResponse, HealthStatus, IndicatorCount, ListScansParams, Scan, ScanInput, ScanListResponse, StatsSummary, TrendPoint } from './api.schemas';
import { customFetch } from '../custom-fetch';
import type { ErrorType, BodyType } from '../custom-fetch';
type AwaitedInput<T> = PromiseLike<T> | T;
type Awaited<O> = O extends AwaitedInput<infer T> ? T : never;
type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1];
export declare const getHealthCheckUrl: () => string;
/**
 * Returns server health status
 * @summary Health check
 */
export declare const healthCheck: (options?: RequestInit) => Promise<HealthStatus>;
export declare const getHealthCheckQueryKey: () => readonly ["/api/healthz"];
export declare const getHealthCheckQueryOptions: <TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData> & {
    queryKey: QueryKey;
};
export type HealthCheckQueryResult = NonNullable<Awaited<ReturnType<typeof healthCheck>>>;
export type HealthCheckQueryError = ErrorType<unknown>;
/**
 * @summary Health check
 */
export declare function useHealthCheck<TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getListScansUrl: (params?: ListScansParams) => string;
/**
 * Returns paginated scan history with optional search and sorting
 * @summary List scan history
 */
export declare const listScans: (params?: ListScansParams, options?: RequestInit) => Promise<ScanListResponse>;
export declare const getListScansQueryKey: (params?: ListScansParams) => readonly ["/api/scans", ...ListScansParams[]];
export declare const getListScansQueryOptions: <TData = Awaited<ReturnType<typeof listScans>>, TError = ErrorType<unknown>>(params?: ListScansParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listScans>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listScans>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListScansQueryResult = NonNullable<Awaited<ReturnType<typeof listScans>>>;
export type ListScansQueryError = ErrorType<unknown>;
/**
 * @summary List scan history
 */
export declare function useListScans<TData = Awaited<ReturnType<typeof listScans>>, TError = ErrorType<unknown>>(params?: ListScansParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listScans>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getCreateScanUrl: () => string;
/**
 * Analyze a URL for phishing indicators and save the result
 * @summary Scan a URL
 */
export declare const createScan: (scanInput: ScanInput, options?: RequestInit) => Promise<Scan>;
export declare const getCreateScanMutationOptions: <TError = ErrorType<ErrorResponse>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createScan>>, TError, {
        data: BodyType<ScanInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createScan>>, TError, {
    data: BodyType<ScanInput>;
}, TContext>;
export type CreateScanMutationResult = NonNullable<Awaited<ReturnType<typeof createScan>>>;
export type CreateScanMutationBody = BodyType<ScanInput>;
export type CreateScanMutationError = ErrorType<ErrorResponse>;
/**
* @summary Scan a URL
*/
export declare const useCreateScan: <TError = ErrorType<ErrorResponse>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createScan>>, TError, {
        data: BodyType<ScanInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createScan>>, TError, {
    data: BodyType<ScanInput>;
}, TContext>;
export declare const getGetScanUrl: (id: number) => string;
/**
 * @summary Get a scan by ID
 */
export declare const getScan: (id: number, options?: RequestInit) => Promise<Scan>;
export declare const getGetScanQueryKey: (id: number) => readonly [`/api/scans/${number}`];
export declare const getGetScanQueryOptions: <TData = Awaited<ReturnType<typeof getScan>>, TError = ErrorType<ErrorResponse>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getScan>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getScan>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetScanQueryResult = NonNullable<Awaited<ReturnType<typeof getScan>>>;
export type GetScanQueryError = ErrorType<ErrorResponse>;
/**
 * @summary Get a scan by ID
 */
export declare function useGetScan<TData = Awaited<ReturnType<typeof getScan>>, TError = ErrorType<ErrorResponse>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getScan>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getDeleteScanUrl: (id: number) => string;
/**
 * @summary Delete a scan record
 */
export declare const deleteScan: (id: number, options?: RequestInit) => Promise<DeleteResponse>;
export declare const getDeleteScanMutationOptions: <TError = ErrorType<ErrorResponse>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteScan>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof deleteScan>>, TError, {
    id: number;
}, TContext>;
export type DeleteScanMutationResult = NonNullable<Awaited<ReturnType<typeof deleteScan>>>;
export type DeleteScanMutationError = ErrorType<ErrorResponse>;
/**
* @summary Delete a scan record
*/
export declare const useDeleteScan: <TError = ErrorType<ErrorResponse>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteScan>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof deleteScan>>, TError, {
    id: number;
}, TContext>;
export declare const getGetRecentScansUrl: () => string;
/**
 * Returns the 5 most recent scans for the dashboard widget
 * @summary Get recent scans
 */
export declare const getRecentScans: (options?: RequestInit) => Promise<Scan[]>;
export declare const getGetRecentScansQueryKey: () => readonly ["/api/scans/recent"];
export declare const getGetRecentScansQueryOptions: <TData = Awaited<ReturnType<typeof getRecentScans>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getRecentScans>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getRecentScans>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetRecentScansQueryResult = NonNullable<Awaited<ReturnType<typeof getRecentScans>>>;
export type GetRecentScansQueryError = ErrorType<unknown>;
/**
 * @summary Get recent scans
 */
export declare function useGetRecentScans<TData = Awaited<ReturnType<typeof getRecentScans>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getRecentScans>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getGetStatsSummaryUrl: () => string;
/**
 * Returns total counts by risk level and other aggregates
 * @summary Get statistics summary
 */
export declare const getStatsSummary: (options?: RequestInit) => Promise<StatsSummary>;
export declare const getGetStatsSummaryQueryKey: () => readonly ["/api/stats/summary"];
export declare const getGetStatsSummaryQueryOptions: <TData = Awaited<ReturnType<typeof getStatsSummary>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getStatsSummary>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getStatsSummary>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetStatsSummaryQueryResult = NonNullable<Awaited<ReturnType<typeof getStatsSummary>>>;
export type GetStatsSummaryQueryError = ErrorType<unknown>;
/**
 * @summary Get statistics summary
 */
export declare function useGetStatsSummary<TData = Awaited<ReturnType<typeof getStatsSummary>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getStatsSummary>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getGetStatsTrendUrl: () => string;
/**
 * Returns daily scan counts for the last 30 days
 * @summary Get scan trend over time
 */
export declare const getStatsTrend: (options?: RequestInit) => Promise<TrendPoint[]>;
export declare const getGetStatsTrendQueryKey: () => readonly ["/api/stats/trend"];
export declare const getGetStatsTrendQueryOptions: <TData = Awaited<ReturnType<typeof getStatsTrend>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getStatsTrend>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getStatsTrend>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetStatsTrendQueryResult = NonNullable<Awaited<ReturnType<typeof getStatsTrend>>>;
export type GetStatsTrendQueryError = ErrorType<unknown>;
/**
 * @summary Get scan trend over time
 */
export declare function useGetStatsTrend<TData = Awaited<ReturnType<typeof getStatsTrend>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getStatsTrend>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getGetTopIndicatorsUrl: () => string;
/**
 * Returns most frequently triggered detection reasons
 * @summary Get top phishing indicators
 */
export declare const getTopIndicators: (options?: RequestInit) => Promise<IndicatorCount[]>;
export declare const getGetTopIndicatorsQueryKey: () => readonly ["/api/stats/top-indicators"];
export declare const getGetTopIndicatorsQueryOptions: <TData = Awaited<ReturnType<typeof getTopIndicators>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getTopIndicators>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getTopIndicators>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetTopIndicatorsQueryResult = NonNullable<Awaited<ReturnType<typeof getTopIndicators>>>;
export type GetTopIndicatorsQueryError = ErrorType<unknown>;
/**
 * @summary Get top phishing indicators
 */
export declare function useGetTopIndicators<TData = Awaited<ReturnType<typeof getTopIndicators>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getTopIndicators>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getSubmitContactUrl: () => string;
/**
 * @summary Submit contact form
 */
export declare const submitContact: (contactInput: ContactInput, options?: RequestInit) => Promise<ContactResponse>;
export declare const getSubmitContactMutationOptions: <TError = ErrorType<ErrorResponse>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof submitContact>>, TError, {
        data: BodyType<ContactInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof submitContact>>, TError, {
    data: BodyType<ContactInput>;
}, TContext>;
export type SubmitContactMutationResult = NonNullable<Awaited<ReturnType<typeof submitContact>>>;
export type SubmitContactMutationBody = BodyType<ContactInput>;
export type SubmitContactMutationError = ErrorType<ErrorResponse>;
/**
* @summary Submit contact form
*/
export declare const useSubmitContact: <TError = ErrorType<ErrorResponse>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof submitContact>>, TError, {
        data: BodyType<ContactInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof submitContact>>, TError, {
    data: BodyType<ContactInput>;
}, TContext>;
export {};
//# sourceMappingURL=api.d.ts.map
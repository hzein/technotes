/* eslint-disable @typescript-eslint/no-unused-vars */
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { BaseQueryFn } from "@reduxjs/toolkit/query";
import { setCredentials } from "../../features/auth/authSlice";
import { RootState } from "../store";
import { QueryReturnValue } from "@reduxjs/toolkit/dist/query/baseQueryTypes";

const url = import.meta.env.PROD
  ? import.meta.env.VITE_BASE_URL_PROD
  : import.meta.env.VITE_BASE_URL_DEV;

interface ResultType {
  data?: object[];
  error?: {
    data?: {
      message?: string;
    };
    status?: number;
    [key: string]: unknown;
  };
}

const baseQuery: BaseQueryFn = fetchBaseQuery({
  baseUrl: url,
  credentials: "include",
  prepareHeaders: (headers: Headers, { getState }) => {
    const state = getState() as RootState;
    const token = state.auth.token;
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn = async (args, api, extraOptions) => {
  // console.log(args) // request url, method, body
  // console.log(api) // signal, dispatch, getState()
  // console.log(extraOptions) //custom like {shout: true}

  let result: QueryReturnValue<unknown, unknown, ResultType> = await baseQuery(
    args,
    api,
    extraOptions
  );

  console.log("RESULT: ", result);

  // If you want, handle other status codes, too
  if (Object.prototype.hasOwnProperty.call(result, "error")) {
    if (Object.prototype.hasOwnProperty.call(result.error, "status")) {
      if (result?.error?.status === 403) console.log("sending refresh token");

      // send refresh token to get new access token
      const refreshResult = await baseQuery("/auth/refresh", api, extraOptions);

      if (refreshResult?.data) {
        // store the new token
        api.dispatch(setCredentials({ ...refreshResult.data }));

        // retry original query with new access token
        result = await baseQuery(args, api, extraOptions);
      } else {
        if (refreshResult?.error?.status === 403) {
          refreshResult.error.data.message = "Your login has expired. ";
        }
        return refreshResult;
      }
    }
  }

  return result;
};

export const apiSlice = createApi({
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Note", "User"],
  endpoints: (builder) => ({}),
});

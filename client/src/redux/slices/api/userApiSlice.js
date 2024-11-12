import { apiSlice } from "../apiSlice";

const USER_URL = "/user";

export const userApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        updateUser: builder.mutation({
            query: (data) => ({
                url: `${USER_URL}/profile`, // Use backticks for string interpolation
                method: "PUT",
                body: data,
                credentials: "include", // If you want credentials to be sent in a cross-site request
            }),
        }),

        getTeamList: builder.query({
            query: (data) => ({
                url: `${USER_URL}/get-team`, 
                method: "GET",
                credentials: "include", 
            }),
        }),

        deleteUser: builder.mutation({
            query: (id) => ({
                url: `${USER_URL}/${id}`, 
                method: "DELETE",
                credentials: "include", 
            }),
        }),


        UserAction: builder.mutation({
            query: (data) => ({
                url: `${USER_URL}/${data.id}`, 
                method: "PUT",
                body:data,
                credentials: "include", 
            }),
        }),


        getNotification: builder.query({
            query: (data) => ({
                url: `${USER_URL}/notifications`, 
                method: "GET",
                credentials: "include", 
            }),
        }),

        markNotiAsRead: builder.mutation({
            query: (data) => ({
                url: `${USER_URL}/read-noti?isReadType=${data.type}&id=${data?.id}`, 
                method: "PUT",
                body:data,
                credentials: "include", 
            }),
        }),

        changePassword: builder.mutation({
            query: (data) => ({
                url: `${USER_URL}/change-password`, 
                method: "PUT",
                body:data,
                credentials: "include", 
            }),
        }),
        
    }),
});

export  const{useUpdateUserMutation,
    useGetTeamListQuery,
    useDeleteUserMutation,
    useUserActionMutation,
    useGetNotificationQuery,
    useMarkNotiAsReadMutation,
    useChangePasswordMutation,}
= userApiSlice;
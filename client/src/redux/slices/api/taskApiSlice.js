import { apiSlice } from "../apiSlice";

const TASKS_URL = "/task";

export const taskApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getDashboardStats: builder.query({
            query: () => ({
                url: `${TASKS_URL}/dashboard`,
                method: "GET",
                credentials: "include",
            }),
        }),

        getAllTask: builder.query({
            query: ({strQuery,isTrashed,search}) => ({
                url: `${TASKS_URL}?stage=${strQuery}&isTrashed=${isTrashed}&search=${search}`,
                method: "GET",
                credentials: "include",
            }),
        }),

        getAllTasksForAdmin: builder.query({
            query: ({strQuery,isTrashed,search}) => ({
                url: `${TASKS_URL}/admin/all?stage=${strQuery}&isTrashed=${isTrashed}&search=${search}`,
                method: "GET",
                credentials: "include",
            }),
        }),

        getSingleTaskForAdmin: builder.query({
            query: (id) => ({
                url: `${TASKS_URL}/admin/${id}`,
                method: "GET",
                credentials: "include",
            }),
        }),

        updateTaskForAdmin: builder.mutation({
            query: (data) => ({
                url: `${TASKS_URL}/admin/update/${data._id}`,
                method: "PUT",
                body: data,
                credentials: "include",
            }),
        }),

        trashTaskForAdmin: builder.mutation({
            query: (id) => ({
                url: `${TASKS_URL}/admin/${id}`,
                method: "PUT",
                credentials: "include",
            }),
        }),

        createSubTaskForAdmin: builder.mutation({
            query: ({data,id}) => ({
                url: `${TASKS_URL}/admin/create-subtask/${id}`,
                method: "PUT",
                body:data,
                credentials: "include",
            }),
        }),

        postTaskActivityForAdmin: builder.mutation({
            query: ({data,id}) => ({
                url: `${TASKS_URL}/admin/activity/${id}`,
                method: "POST",
                body:data,
                credentials: "include",
            }),
        }),

        deleteRestoreTaskForAdmin: builder.mutation({
            query: ({id,actionType}) => ({
                url: `${TASKS_URL}/admin/delete-restore/${id}?actionType=${actionType}`,
                method: "DELETE",
                credentials: "include",
            }),
        }),

        createTask: builder.mutation({
            query: (data) => ({
                url: `${TASKS_URL}/create`,
                method: "POST",
                body: data,
                credentials: "include",
            }),
        }),

        duplicateTask: builder.mutation({
            query: (id) => ({
                url: `${TASKS_URL}/duplicate/${id}`,
                method: "POST",
                body: {},
                credentials: "include",
            }),
        }),

        updateTask: builder.mutation({
                query: (data) => ({
                    url: `${TASKS_URL}/update/${data._id}`,
                    method: "PUT",
                    body: data,
                    credentials: "include",
                }),
            }),

        trashTask: builder.mutation({
            query: (id) => ({
                url: `${TASKS_URL}/${id}`,
                method: "PUT",
                credentials: "include",
            }),
        }),

        createSubTask: builder.mutation({
            query: ({data,id}) => ({
                url: `${TASKS_URL}/create-subtask/${id}`,
                method: "PUT",
                body:data,
                credentials: "include",
            }),
        }),

        getSingleTask: builder.query({
            query: (id) => ({
                url: `${TASKS_URL}/${id}`,
                method: "GET",
                credentials: "include",
            }),
        }),

        postTaskActivity: builder.mutation({
            query: ({data,id}) => ({
                url: `${TASKS_URL}/activity/${id}`,
                method: "POST",
                body:data,
                credentials: "include",
            }),
        }),

        deleteRestoreTask: builder.mutation({
            query: ({id,actionType}) => ({
                url: `${TASKS_URL}/delete-restore/${id}?actionType=${actionType}`,
                method: "DELETE",
                credentials: "include",
            }),
        }),



    }),
});

export const { useGetDashboardStatsQuery ,
    useGetAllTaskQuery,
    useGetAllTasksForAdminQuery,
    useGetSingleTaskForAdminQuery,
    useUpdateTaskForAdminMutation,
    useTrashTaskForAdminMutation,
    useCreateSubTaskForAdminMutation,
    usePostTaskActivityForAdminMutation,
    useDeleteRestoreTaskForAdminMutation,
    useCreateTaskMutation,
    useDuplicateTaskMutation,
    useUpdateTaskMutation,
    useTrashTaskMutation,
    useCreateSubTaskMutation,
    useGetSingleTaskQuery,
    usePostTaskActivityMutation,
    useDeleteRestoreTaskMutation,
} = taskApiSlice;

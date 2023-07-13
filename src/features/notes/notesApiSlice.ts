/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  createSelector,
  createEntityAdapter,
  EntityState,
} from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";
import { RootState } from "../../app/store";

type Note = {
  _id: string;
  id: string;
  note: string;
  title: string;
  text: string;
  completed: boolean;
};

const notesAdapter = createEntityAdapter<Note>({
  sortComparer: (a, b) =>
    a.completed === b.completed ? 0 : a.completed ? 1 : -1,
});
const initialState = notesAdapter.getInitialState();

export const notesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getNotes: builder.query<Note[], void>({
      query: () => ({
        url: "/notes",
        validateStatus: (response: Response, result: any) => {
          return response.status === 200 && !result.isError;
        },
      }),
      transformResponse: (responseData: Note[]) => {
        const loadedNotes = responseData.map((note) => {
          note.id = note._id;
          return note;
        });
        return notesAdapter.setAll(initialState, loadedNotes);
      },
      providesTags: (result, _error, _arg) => {
        if (result?.ids) {
          return [
            { type: "Note", id: "LIST" },
            ...result.ids.map((id) => ({ type: "Note", id })),
          ];
        } else return [{ type: "Note", id: "LIST" }];
      },
    }),
    addNewNote: builder.mutation<Note, Note>({
      query: (initialNoteData) => ({
        url: "/notes",
        method: "POST",
        body: {
          ...initialNoteData,
        },
      }),
      invalidatesTags: [{ type: "Note", id: "LIST" }],
    }),
    updateNote: builder.mutation<Note, Note>({
      query: (initialNoteData) => ({
        url: "/notes",
        method: "PATCH",
        body: {
          ...initialNoteData,
        },
      }),
      invalidatesTags: (_result, _error, arg) => [{ type: "Note", id: arg.id }],
    }),
    deleteNote: builder.mutation<Note, any>({
      query: ({ id }) => ({
        url: "/notes",
        method: "DELETE",
        body: {
          id,
        },
      }),
      invalidatesTags: (_result, _error, arg) => [{ type: "Note", id: arg.id }],
    }),
  }),
});

export const {
  useGetNotesQuery,
  useAddNewNoteMutation,
  useUpdateNoteMutation,
  useDeleteNoteMutation,
} = notesApiSlice;

//Return the query result object
export const selectNotesResult = notesApiSlice.endpoints.getNotes.select();

//creates memoized selector
const selectNotesData = createSelector(
  selectNotesResult,
  (notesResult) => notesResult.data // normalized state object with ids & entites
);

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
  selectAll: selectAllNotes,
  selectById: selectNoteById,
  selectIds: selectNoteIds,
  //pass in a selector that returns the notes slice of state
} = notesAdapter.getSelectors<RootState>(
  (state) => selectNotesData(state) ?? initialState
);

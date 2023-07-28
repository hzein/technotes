import { useParams } from "react-router-dom";
import EditNoteForm from "./EditNoteForm";
import { useGetNotesQuery } from "./notesApiSlice";
import { useGetUsersQuery } from "../users/usersApiSlice";
import useAuth from "../../hooks/useAuth";
import PulseLoader from "react-spinners/PulseLoader";
import useTitle from "../../hooks/useTitle";
import { IdParams } from "../../config/types";
import { EntityId } from "@reduxjs/toolkit";

function EditNote() {
  useTitle("techNotes: Edit Note");

  const { id } = useParams<IdParams>();

  const { username, isManager, isAdmin } = useAuth();

  const { note } = useGetNotesQuery(undefined, {
    selectFromResult: ({ data }) => ({
      note: data?.entities[id as EntityId],
    }),
  });

  const { users } = useGetUsersQuery(undefined, {
    selectFromResult: ({ data }) => ({
      users: data?.ids.map((id) => data?.entities[id]),
    }),
  });

  if (!note || !users?.length) return <PulseLoader color={"#FFF"} />;

  if (!isManager && !isAdmin) {
    if (note.username !== username) {
      return <p className="errmsg">No access</p>;
    }
  }

  const content = <EditNoteForm note={note} users={users as []} />;

  return content;
}
export default EditNote;

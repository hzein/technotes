import { useParams } from "react-router-dom";
import EditUserForm from "./EditUserForm";
import { useGetUsersQuery } from "./usersApiSlice";
import PulseLoader from "react-spinners/PulseLoader";
import useTitle from "../../hooks/useTitle";
import { IdParams } from "../../config/types";
import { EntityId } from "@reduxjs/toolkit";

const EditUser = () => {
  useTitle("techNotes: Edit User");

  const { id } = useParams<IdParams>();

  const { user } = useGetUsersQuery(undefined, {
    selectFromResult: ({ data }) => ({
      user: data?.entities[id as EntityId],
    }),
  });

  if (!user) return <PulseLoader color={"#FFF"} />;

  const content = <EditUserForm user={user} />;

  return content;
};
export default EditUser;

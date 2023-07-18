import { useGetUsersQuery } from "./usersApiSlice";
import User from "./User";
import PulseLoader from "react-spinners/PulseLoader";
import { isFetchBaseQueryError, isErrorWithMessage } from "../../app/helpers";

const UsersList = () => {
  const {
    data: users,
    isLoading,
    isSuccess,
    error,
  } = useGetUsersQuery(undefined, {
    pollingInterval: 60000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  let content;

  if (isLoading) content = <PulseLoader color={"#FFF"} />;

  if (isFetchBaseQueryError(error)) {
    // you can access all properties of `FetchBaseQueryError` here
    const errMsg = "error" in error ? error.error : JSON.stringify(error.data);
    content = <p className="errmsg">{errMsg}</p>;
  } else if (isErrorWithMessage(error)) {
    // you can access all properties of `SerializedError` here
    content = <p className="errmsg">{error.message}</p>;
  }

  if (isSuccess) {
    const { ids } = users;

    const tableContent =
      ids?.length && ids.map((userId) => <User key={userId} userId={userId} />);

    content = (
      <table className="table table--users">
        <thead className="table__thead">
          <tr>
            <th scope="col" className="table__th user__username">
              Username
            </th>
            <th scope="col" className="table__th user__roles">
              Roles
            </th>
            <th scope="col" className="table__th user__edit">
              Edit
            </th>
          </tr>
        </thead>
        <tbody>{tableContent}</tbody>
      </table>
    );
  }

  return content;
};
export default UsersList;

import { store } from "../../app/store";
//import { useAppDispatch } from '../../app/hooks'
import { notesApiSlice } from "../notes/notesApiSlice";
import { usersApiSlice } from "../users/usersApiSlice";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";

const Prefetch = () => {
  useEffect(() => {
    store.dispatch(
      notesApiSlice.util.prefetch("getNotes", undefined, { force: true })
    );
    store.dispatch(
      usersApiSlice.util.prefetch("getUsers", undefined, { force: true })
    );
  }, []);

  return <Outlet />;
};
export default Prefetch;

"use client";
//test
import { RootState } from "../redux/store";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../redux/features/authSlice";

export default function Home() {
  const user = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  console.log(user);
  return (
    <>
      <div>{user.user.email}</div>
      <button onClick={() => dispatch(logoutUser(null))}>1`32</button>
    </>
  );
}

import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface UserState {
  email: string;
  url: string;
  name: string;
  officeId: boolean;
}

export interface User {
  user: UserState;
}

const initialState: User = {
  user: {
    email: "",
    url: "",
    name: "",
    officeId: false, // 預設 false
  },
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logoutUser: (state, action) => {
      if (action.payload == null) {
        state.user = {
          email: "345345",
          url: "345",
          name: "345",
          officeId: true, //預設false
        };
      }
    },
  },
});

// Action creators are generated for each case reducer function
export const { logoutUser } = authSlice.actions;

export default authSlice.reducer;

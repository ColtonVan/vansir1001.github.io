import { AppDispatch, RootState } from "./index";
import { createSlice } from "@reduxjs/toolkit";
import { User } from "./../screens/project-list/search-panel";
import * as auth from "../auth-provider";
import { AuthForm, bootstrapUser } from "../context/auth-context";
interface State {
  user: User | null;
}
const initialState: State = {
  user: null,
};
export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
    },
  },
});
const authActions = authSlice.actions;
//redux-thunk写法
export const login = (form: AuthForm) => (dispatch: AppDispatch) =>
  auth.login(form).then((user) => dispatch(authActions.setUser(user)));
export const register = (form: AuthForm) => (dispatch: AppDispatch) =>
  auth.register(form).then((user) => dispatch(authActions.setUser(user)));
export const logout = () => (dispatch: AppDispatch) =>
  auth.logout().then(() => dispatch(authActions.setUser(null)));
export const bootstrap = () => (dispatch: AppDispatch) =>
  bootstrapUser().then((user) => dispatch(authActions.setUser(user)));

export const selectUser = (state: RootState) => state.auth.user;

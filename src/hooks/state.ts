import { createGlobalState } from "react-hooks-global-state";
import { ILoginResponseData } from "./auth";

export interface IGlobalState {
  user: ILoginResponseData | null;
  isUserLoading: boolean;
}

export const { useGlobalState, setGlobalState, getGlobalState } = createGlobalState<IGlobalState>({
  user: null,
  isUserLoading: true,
});
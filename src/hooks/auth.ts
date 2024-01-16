import { BASE_URL, KEYS } from "@/helper/constant";
import storage from "@/helper/storage";
import { toastError } from "@/helper/toast";
import { IBaseErrorResponse, IBaseSuccessResponse } from "@/helper/type";
import { useState } from "react"
import { setGlobalState, useGlobalState } from "./state";

export interface ILoginResponseData {
  id: string;
  email: string;
  name: string;
  role: string;
  access_token: string;
}

export interface ILoginPayload {
  email: string;
  password: string;
}

export interface IRegisterPayload {
  email: string;
  name: string;
  password: string;
}

const useAuth = () => {
  const token = storage.getItem(KEYS.token)
  const [isLoading, setIsLoading] = useState(false)
  const [isUserLoading, setIsUserLoading] = useGlobalState('isUserLoading')

  const login = async (bodyPayload: ILoginPayload) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/v1/auth/login`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bodyPayload)
      })
      if (!res.ok) {
        const errRes: IBaseErrorResponse = await res.json();
        toastError(errRes.message);
      } else {
        const resData: IBaseSuccessResponse<ILoginResponseData> = await res.json();
        setGlobalState('user', resData.data);
        storage.setItem(KEYS.token, resData.data.access_token);
      }
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (bodyPayload: IRegisterPayload) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/v1/auth/register`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bodyPayload)
      })
      if (!res.ok) {
        const errRes: IBaseErrorResponse = await res.json();
        toastError(errRes.message);
      } else {
        const resData: IBaseSuccessResponse<ILoginResponseData> = await res.json();
        setGlobalState('user', resData.data);
        storage.setItem(KEYS.token, resData.data.access_token);
      }
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  const getMe = async () => {
    setIsUserLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/v1/me`, {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
      })
      if (!res.ok) {
        const errRes: IBaseErrorResponse = await res.json();
        logout();
      } else {
        const resData: IBaseSuccessResponse<ILoginResponseData> = await res.json();
        setGlobalState('user', resData.data);
      }
    } catch (error) {
      console.log(error)
    } finally {
      setIsUserLoading(false)
    }
  }

  const logout = () => {
    setGlobalState('user', null);
    storage.removeItem(KEYS.token);
  }

  return {
    isLoading,
    login,
    register,
    getMe,
    logout,
  }
}

export { useAuth }

import axios, { AxiosResponse, Method } from 'axios';
import { AlertTypes, AlertObject } from '@models/context';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context';
import { getCookie } from 'cookies-next';
import { Dispatch, SetStateAction } from 'react';

export default async function request(
  method,
  path,
  router,
  data,
  setAlert = () => {},
  successMsg = '',
  successRedirect = '',
  content_type = 'application/json',
){
  const token = getCookie('token');
  if (!token) {
    router.push('/login');
    return null;
  }
  try {
    console.log("token: ", token)
    console.log("data: ", data)
    const res = await axios.request({
      method,
      url: process.env.NEXT_PUBLIC_API_BASE_URL + path,
      data,
      headers: {
        'Content-Type': content_type,
        Authorization: `Bearer ${token}`,
      },
    });
    if (res.status === 200 && successRedirect) {
      router.push(successRedirect);
    }
    setAlert({ show: true, type: AlertTypes.SUCCESS, message: successMsg });
    return res;
  } catch (err) {
    if (err.response?.status === 401) {
      router.push('/login');
      return null;
    }
    if (err.response?.data?.status === 'ERROR') {
      setAlert({
        show: true,
        type: AlertTypes.ERROR,
        message: err.response.data.error_message,
      });
    } else {
      setAlert({ show: true, type: AlertTypes.ERROR, message: "Không thể kết nối đến server." });
    }
    return null;
  }
}

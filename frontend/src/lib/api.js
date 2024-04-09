import axios, { AxiosResponse, Method } from 'axios';
import { API_BASE_URL } from '@configs';
import { AlertTypes, AlertObject } from '@models/context';
import { getCookie } from 'cookies-next';

export default async function request(
  method,
  path,
  router,
  data = null,
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
    // console.log("token: ", token)
    // console.log("data: ", data)
    const res = await axios.request<Data>({
      method,
      url: API_BASE_URL + path,
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
      setAlert({ show: true, type: AlertTypes.ERROR, message: "Can't request to server." });
    }
    return null;
  }
}

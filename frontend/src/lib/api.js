import axios from 'axios';
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
    console.log("token: ", token)
    console.log("data: ", data)
    const res = await axios.request({
      method,
      url: `${process.env.NEXT_PUBLIC_API_BASE_URL}${path}`,
      data,
      headers: {
        'Content-Type': content_type,
        Authorization: `Bearer ${token}`,
      },
    });
    if (successRedirect) {
      router.push(successRedirect);
    }
    setAlert({ show: true, type: 'success', message: successMsg });
    return res;
  } catch (err) {
    if (err.response?.status === 401) {
      router.push('/login');
      return null;
    }
    if (err.response?.data?.status === 'ERROR') {
      setAlert({
        show: true,
        type: 'danger',
        message: err.response.data.error_message,
      });
    } else {
      setAlert({ show: true, type: 'danger', message: "Không thể kết nối tới server." });
    }
    return null;
  }
}

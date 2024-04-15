// ** Icon imports
import HomeOutline from 'mdi-material-ui/HomeOutline'
import AccountCogOutline from 'mdi-material-ui/AccountCogOutline'
import AccountBoxMultiple from 'mdi-material-ui/AccountBoxMultiple';
import DoorSlidingLock from 'mdi-material-ui/DoorSlidingLock';

const navigation = () => {
  return [
    {
      title: 'Trang chủ',
      icon: HomeOutline,
      path: '/'
    },
    {
      title: 'Nhân viên',
      icon: AccountBoxMultiple,
      path: '/employees'
    },
    {
      title: 'Phòng ban',
      icon: DoorSlidingLock,
      path: '/deparments'
    },
    {
      sectionTitle: 'Thiết lập khác'
    },
    {
      title: 'Thiết lập người dùng',
      icon: AccountCogOutline,
      path: '/account-settings'
    },
  ]
}

export default navigation

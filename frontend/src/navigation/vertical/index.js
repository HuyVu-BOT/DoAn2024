// ** Icon imports
import AccountCogOutline from 'mdi-material-ui/AccountCogOutline'
import AccountBoxMultiple from 'mdi-material-ui/AccountBoxMultiple';
import DoorSlidingLock from 'mdi-material-ui/DoorSlidingLock';

const navigation = () => {
  return [
    {
      title: 'Recognition Log',
      icon: DoorSlidingLock,
      path: '/recognition_logs'
    },
    {
      title: 'Nhân viên',
      icon: AccountBoxMultiple,
      path: '/employees'
    },
    {
      title: 'Phòng ban',
      icon: DoorSlidingLock,
      path: '/departments'
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

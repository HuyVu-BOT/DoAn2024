import { createContext } from 'react'

export const blankAlert = {
    show: false,
    type: "success",
    message: ""
  }
// eslint-disable-next-line import/prefer-default-export
export const AlertContext = createContext({alert: {...blankAlert}, setAlert: () => {}})

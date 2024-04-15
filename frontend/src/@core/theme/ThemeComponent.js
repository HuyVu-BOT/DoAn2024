// ** MUI Imports
import CssBaseline from '@mui/material/CssBaseline'
import GlobalStyles from '@mui/material/GlobalStyles'
import { ThemeProvider, createTheme, responsiveFontSizes } from '@mui/material/styles'

// ** Theme Config
import themeConfig from 'src/configs/themeConfig'

// ** Theme Override Imports
import overrides from './overrides'
import typography from './typography'

// ** Theme
import themeOptions from './ThemeOptions'

// ** Global Styles
import GlobalStyling from './globalStyles'
import { AlertContext } from 'src/context'
import { Toast } from 'react-bootstrap'
import { useContext } from 'react'

const ThemeComponent = props => {
  // ** Props
  const { settings, children } = props
  const { alert, setAlert } = useContext(AlertContext)

  // ** Merged ThemeOptions of Core and User
  const coreThemeConfig = themeOptions(settings)

  // ** Pass ThemeOptions to CreateTheme Function to create partial theme without component overrides
  let theme = createTheme(coreThemeConfig)

  // ** Continue theme creation and pass merged component overrides to CreateTheme function
  theme = createTheme(theme, {
    components: { ...overrides(theme) },
    typography: { ...typography(theme) }
  })

  // ** Set responsive font sizes to true
  if (themeConfig.responsiveFontSizes) {
    theme = responsiveFontSizes(theme)
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalStyles styles={() => GlobalStyling(theme)} />
      <Toast
        onClose={() => setAlert({ ...alert, show: false })}
        bg={alert.type}
        show={alert.show}
        delay={2000}
        autohide
        className='position-absolute'
        style={{ zIndex: 99999, right: 10, top: 65 }}
      >
        <Toast.Header>
          <strong className='me-auto'>Thông báo</strong>
        </Toast.Header>
        <Toast.Body>
          <p className='text-white'>{alert.message}</p>
        </Toast.Body>
      </Toast>
      {children}
    </ThemeProvider>
  )
}

export default ThemeComponent

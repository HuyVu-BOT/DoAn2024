// ** Next Imports
import Head from 'next/head'
import { Router } from 'next/router'

// ** Loader Import
import NProgress from 'nprogress'

// ** Emotion Imports
import { CacheProvider } from '@emotion/react'

// ** Config Imports
import themeConfig from 'src/configs/themeConfig'

// ** Component Imports
import UserLayout from 'src/layouts/UserLayout'
import ThemeComponent from 'src/@core/theme/ThemeComponent'

// ** Contexts
import { SettingsConsumer, SettingsProvider } from 'src/@core/context/settingsContext'

// ** Utils Imports
import { createEmotionCache } from 'src/@core/utils/create-emotion-cache'

// ** React Perfect Scrollbar Style
import 'react-perfect-scrollbar/dist/css/styles.css'

// ** Global css styles
import '../../styles/globals.css'
import { SSRProvider } from "react-bootstrap";
import { AlertContext } from "src/context";
import {useState} from "react";

const clientSideEmotionCache = createEmotionCache()

// ** Pace Loader
if (themeConfig.routingLoader) {
  Router.events.on('routeChangeStart', () => {
    NProgress.start()
  })
  Router.events.on('routeChangeError', () => {
    NProgress.done()
  })
  Router.events.on('routeChangeComplete', () => {
    NProgress.done()
  })
}

// ** Configure JSS & ClassName
const App = props => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props
  const [alert, setAlert] = useState({
    show: false,
    type: "",
    message: "",
  });
  // Variables
  const getLayout = Component.getLayout ?? (page => <UserLayout>{page}</UserLayout>)

  return (
    <SSRProvider>
    <CacheProvider value={emotionCache}>
      <Head>
        <title>{`${themeConfig.templateName} - Chấm công`}</title>
        <meta name='viewport' content='initial-scale=1, width=device-width' />
      </Head>

      <AlertContext.Provider value={{ alert, setAlert }}>
      <SettingsProvider>
        <SettingsConsumer>
          {({ settings }) => {
            return <ThemeComponent settings={settings}>{getLayout(<Component {...pageProps} />)}</ThemeComponent>
          }}
        </SettingsConsumer>
      </SettingsProvider>
      </AlertContext.Provider>
    </CacheProvider>
    </SSRProvider>
  )
}

export default App

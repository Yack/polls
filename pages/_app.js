import React, { useState, useEffect } from 'react'
import { initDevKit, openAppModal } from '@weekday/dev-kit'
import { HASURA_GRAPHQL_ADMIN_SECRET, GRAPHQL_ENDPOINT, APP_TOKEN, GRAPHQL_WEBSOCKET } from '../environment'

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    // true = DEV
    // ⚠️ Remember to set this for true
    initDevKit(APP_TOKEN, false)
  }, [])

  return <Component {...pageProps} />
}

export default MyApp

import { startTransition } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router'
import { Provider } from 'react-redux'

import { router } from './router'
import { store } from './store'

import './styles/main.scss'

const root = document.getElementById('root')!

const routes = createBrowserRouter(router)

startTransition(() => {
  createRoot(root).render(
    <Provider store={store}>
      <RouterProvider router={routes} />
    </Provider>
  )
})

import { Root } from './pages'

export const router = [
  {
    path: '/',
    Component: Root,
    children: [
      {
        path: '/',
        lazy: () => import('./pages/home'),
      },
    ],
  },
]

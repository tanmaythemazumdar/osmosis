import type { FC, JSX } from 'react'
import { Outlet } from 'react-router'

export const Root: FC = (): JSX.Element => {
  return <Outlet />
}

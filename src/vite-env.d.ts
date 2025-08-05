/// <reference types="vite/client" />

// SVG module declarations
declare module '*.svg' {
  import React from 'react'
  const SVGComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>
  export default SVGComponent
}

declare module '/vite.svg' {
  import React from 'react'
  const SVGComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>
  export default SVGComponent
}

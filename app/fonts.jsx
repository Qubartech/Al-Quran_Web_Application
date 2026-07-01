import localFont from 'next/font/local'

export const arabicFont = localFont({
  src: '../public/fonts/UthmanicHafs1Ver18.woff2',
  variable: '--font-arabic',
  display: 'swap',
})

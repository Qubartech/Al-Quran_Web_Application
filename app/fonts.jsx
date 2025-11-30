import localFont from 'next/font/local'

export const arabicFont = localFont({
  src: '../public/fonts/uthmanic_regular.otf',
  variable: '--font-arabic',
  display: 'swap',
})

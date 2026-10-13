import React from 'react'
import Navbar from './_components/navbar'

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Navbar />
      <main>{children}</main>
    </>
  )
}

export default MainLayout

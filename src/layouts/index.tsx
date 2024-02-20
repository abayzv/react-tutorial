import React from "react"
import Main from "./main"

const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <Main>
            {children}
        </Main>
    )
}

export default Layout
import React from 'react'
import { NavLink } from 'react-router'

const Navigation = ({children, className, navClassName}) => {
  return (
    <>
        <ul className={`${className}`}>
            {children.map(child => {
                return (
                    <li key={child.name}>
                    <NavLink to={child.link} state={child.state}  className={navClassName}>{child.name}</NavLink>
                </li>
                )
            })}

        </ul>
    </>
  )
}

export default Navigation
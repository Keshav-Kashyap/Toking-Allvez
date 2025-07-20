import React from 'react'
import { Navigate, useNavigate } from 'react-router-dom'

    
 export const ButtonComponent = (props) => {
 const routeTo = useNavigate();
  return (
  <button
  onClick={() => routeTo(props.routeToGo)}
  className={
    props.BlueBtn
      ? "bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
      : "text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
  }
>
  {props.BtnName}
</button>
  )
}


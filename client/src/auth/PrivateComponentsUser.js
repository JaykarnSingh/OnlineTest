import React from "react";
import {Navigate,Outlet} from "react-router-dom"

const PrivateComponentUser=()=>{
    const auth=localStorage.getItem('usertest');
    return auth?<Outlet/>:<Navigate to='/user'/>
}
export default PrivateComponentUser;
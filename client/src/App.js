import './App.css';
import Admin from './auth/Admin';
import User from './auth/User';
import Help from './pages/Help';
import Header from './layout/Header';
import UserData from './auth/UserData';
import AdminLogin from './auth/AdminLogin'
import {BrowserRouter,Routes,Route, Navigate} from "react-router-dom"
import PrivateComponent from './auth/PrivateComponent';
import PrivateComponentUser from './auth/PrivateComponentsUser';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TestPage from './pages/TestPage';
function App() {
 
  return (
    <div className="App">
    <BrowserRouter>
    <Header/>
    <Routes>

    <Route path='/adminlogin' element={<AdminLogin/>}/>
    <Route element={<PrivateComponent/>}>
    <Route path="/admin" element={<Admin/>}/>
    <Route path='/userdata' element={<UserData/>}/>
    </Route>
    
    <Route path="/user" element={<User/>}/>
    <Route element={<PrivateComponentUser/>}>
     <Route path='/testpage' element={<TestPage/>}/>
     </Route>

    <Route path="/help" element={<Help/>}/>
    </Routes>
    </BrowserRouter>

    </div>
  );
}

export default App;

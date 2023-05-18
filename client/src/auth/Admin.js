
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import React,{useState,useEffect,useRef} from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

// import UserData from './UserData';

const Admin = () => {
 
 


  // const auth=localStorage.getItem('user')

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [password, setPassword] = useState('');
  const navigate=useNavigate();

    const handleSubmit = (event) => {
      event.preventDefault(); 
      fetch('http://localhost:5000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
         name:name,
         email:email,
         phone:phone,
         address:address,
         password:password,
          
        }),
      })
        .then((response) => response.json())
        .then((data) => {
            navigate('/userdata')
            // alert("User Account created")
          // console.log(data);
        })
        .catch((error) => {
          console.error('Error:', error);
        });
      
  
    };
//admin logout
    const logout=()=>{
   localStorage.clear();
   navigate("/adminlogin")
    }

  return (<div>
  <div style={{background:"#ccccc0",display:"inline-block",marginLeft:"-37px"}}>
   <button className='btn btn-success' style={{marginLeft:"999px"}}><NavLink to='/userdata'style={{textDecoration:"none",color:"white"}}>User Data</NavLink></button> 
   <button className='btn btn-success' style={{marginLeft:"999px",marginTop:"20px"}} onClick={logout}><NavLink to="/adminlogin" style={{textDecoration:"none",color:"white"}}>Admin Logout</NavLink></button> 
   </div>



   <div className='conatiner' style={{width:"500px" , margin:"auto" ,marginTop:"30px"}}>
    <Form onSubmit={handleSubmit}>
    
    <Form.Group className="mb-4" controlId="formBasicName">
        <Form.Control type="text" placeholder="Enter Name" value={name}
        onChange={(e) => setName(e.target.value)}/>
      </Form.Group>

      <Form.Group className="mb-4" controlId="formBasicEmail">
        <Form.Control type="email" placeholder="Enter Email" value={email}
        onChange={(e) => setEmail(e.target.value)}/>
      </Form.Group>
      
      <Form.Group className="mb-4" controlId="formBasicPhone">
        <Form.Control type="text" placeholder="Enter Phone Number" value={phone}
        onChange={(e) => setPhone(e.target.value)}/>
      </Form.Group>

      <Form.Group className="mb-4" controlId="formBasicAddress">
        <Form.Control type="text" placeholder="Enter Address" value={address}
        onChange={(e) => setAddress(e.target.value)}/>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Control type="password" placeholder="Password" value={password}
        onChange={(e) => setPassword(e.target.value)}/>
      </Form.Group><br/>
      

    <Button variant="primary" type="submit" >
       Create User I'D
      </Button>
     
        
      <br/>
      
    </Form>
   </div>
</div>
  )
}

export default Admin

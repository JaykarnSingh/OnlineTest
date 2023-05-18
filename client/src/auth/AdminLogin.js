import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import React,{useState,useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
// import "./login.css"

function AdminLogin() {
   const navigate = useNavigate();

    const auth=localStorage.getItem('user');
  useEffect(()=>{
    if(auth){
      navigate('/admin')
    }
  })

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const[data, setData] = useState([])
    function handleLogin(event) {
        event.preventDefault();
        fetch('http://localhost:5000/adminlogin', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({email: email,
            password: password })
        })
        .then(response => response.json())
           .then(data => {
        if (data.error) {
          // console.log(data.error);
          // handle error
          setEmail('');
          setPassword('');
        } else {
          // console.log(data);
          setData(data);
          setEmail('');
          setPassword('');
          // handle success
          localStorage.setItem("user",JSON.stringify(data));
          navigate("/admin");
        }
      })
      .catch(error => {
        console.error(error);
        // handle error
       
      });
      }
  return (


    <div className='container' style={{width:"500px", margin:"auto",marginTop:"100px"}}>
    <h1>Admin Login</h1>
    <Form className='loginForm' onSubmit={handleLogin} >
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Email address</Form.Label>
        <Form.Control required type="email" placeholder="Enter email" 
        value={email}
        onChange={(event) => setEmail(event.target.value)} 
        />
        
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control required type="password" 
        placeholder="Password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}  />
      </Form.Group>
      
      <Button variant="primary" type="submit">
        Submit
      </Button>
      
    </Form>
    </div>  
  );
}

export default AdminLogin;
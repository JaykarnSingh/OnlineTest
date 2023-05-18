import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import React,{useState,useEffect} from 'react';
import { useNavigate } from 'react-router-dom';



const User = ({ stream }) => {

 






  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const[data, setData] = useState([])


  const auth=localStorage.getItem('usertest');
  useEffect(()=>{
    if(auth){
      navigate('/testpage')
    }
  })

  function handleLogin(event) {
    event.preventDefault();
    fetch('http://localhost:5000/testuserlogin', {
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
      console.log(data.error);
      // handle error
      setEmail('');
      setPassword('');
    } else {
      // console.log(data);
      setData(data);
      setEmail('');
      setPassword('');
      // handle success
      localStorage.setItem("usertest",JSON.stringify(data));
      navigate("/testpage");

     
    }
  })
  .catch(error => {
    console.error(error);
    // handle error
   
  });
  }

  return (
   
    <div className='container' style={{width:"500px", margin:"auto",marginTop:"100px"}}>
   

   
   <h1>User LogIn</h1>
    <Form className='loginForm' onSubmit={handleLogin} >
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Email address</Form.Label>
        <Form.Control type="email" placeholder="Enter email" 
        value={email}
        onChange={(event) => setEmail(event.target.value)} 
        />
        
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control type="password" 
        placeholder="Password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}  />
      </Form.Group>
      
      <Button variant="primary" type="submit">
        Submit
      </Button>
      
    </Form>
    </div>  
  )
}

export default User

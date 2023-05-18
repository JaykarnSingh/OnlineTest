
import React, { useState, useEffect } from 'react';
import {Modal, ModalBody, ModalHeader} from "reactstrap"
const PAGE_SIZE = 10;

const UserData = () => {


    const [model,setModel]=useState(false)
 const [score,setScore]=useState([])
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/getAllUsers')
      .then((resp) => resp.json())
      .then((data) => {
        setData(data);
        setTotalPages(Math.ceil(data.length / PAGE_SIZE));
      });
  }, []);

  useEffect(() => {
    fetch('http://localhost:5000/getAllScore')
      .then((resp) => resp.json())
      .then((data) => {
        setScore(data);
      });
  }, []);


  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const renderData = () => {
    const filteredData = data.filter((item) =>
      item._id.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    const endIndex = startIndex + PAGE_SIZE;
    const pageData = filteredData.slice(startIndex, endIndex);

    return (

    <div >
    <Modal
    size="lg"
    isOpen={model}
    toggle={()=>setModel(!model)}
    >
        <ModalHeader
        toggle={()=>setModel(!model)}
        >
            User Online Test Details
        </ModalHeader>
        <ModalBody>
        <div>
          {
            
            score.map((item)=>{
              return(
                <div>
                <h1>User Result</h1>
                <p style={{fontSize:"12px"}}>User Details :{item.id}</p>
                <p>Total Question :{item.length}</p>  
                 <p>Score :{item.score}</p> 
                 <p>currect answer :{item.cans}</p> 
                  <p>wrong answer:{item.wans}</p>
                </div>
              )
            })
          }
       
        </div>
        </ModalBody>
    </Modal>
    <div className='conatiner' style={{margin:"auto",marginTop:"10px"}}>
    <button className='btn btn-primary' style={{marginLeft:"900px", marginBottom:"30px"}} onClick={()=>setModel(true)}>Check Score Sheet</button>
      <table border="2" className='table table-bordered'>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Password</th>
            {/* <td>Test Result</td> */}
          </tr>
        </thead>
        <tbody>
          {pageData.map((item) => (
            <tr key={item.id}>
              <td>{item._id}</td>
              <td>{item.name}</td>
              <td>{item.email}</td>
              <td>{item.phone}</td>
              <td>{item.password}</td>
              {/* <td><button onClick={()=>setModel(true)}>Check</button></td> */}
            </tr>
          ))}
        </tbody>
      </table>
      </div>
      </div>
    );
  };

  const renderPagination = () => {
    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
    return (
      <div className='d-flex justify-content-center'>
        {pageNumbers.map((pageNumber) => (
          <button
            className='btn btn-primary'
            key={pageNumber}
            onClick={() => handlePageChange(pageNumber)}
            disabled={pageNumber === currentPage}
          >
            {pageNumber}
          </button>
        ))}
      </div>
    );
  };

  return (
    <div>
      <div style={{margin:"auto",marginTop:"30px"}}>
        <input type="text" value={searchTerm} onChange={handleSearch} placeholder="Enter User Id" />
      </div >
      {renderData()}
      {renderPagination()}
    </div>
  );
};

export default UserData;

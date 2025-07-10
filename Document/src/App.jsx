import React from 'react'
import {Routes , Route} from "react-router-dom"
import Home from './user/pages/Home/Home'
import Document from './user/pages/Document/Document'
import MyDocument from './user/pages/MyDocument/MyDocument'
import Login from './user/pages/Login/Login'
import Signup from './user/pages/Signup/Signup'
import Navbar from './user/components/Navbar/Navbar.jsx'
import ResetPassword from './user/pages/ResetPassword/ResetPassword'
import ForgotPassword from './user/pages/ForgotPassword/ForgotPassword'
import CreateDocument from './user/pages/CreateDocument/CreateDocument.jsx'
import DocumentDetails from './user/pages/DocumentDetails/DocumentDetails.jsx'
const App = () => {
  return (
    <>
       <Navbar/>
       <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/document' element={<Document/>} />
        <Route path="/document/:id" element={<DocumentDetails/>} />
        <Route path='/my-document' element={<MyDocument/>} />
        <Route path='create-document' element={<CreateDocument/>}/>
        <Route path='/login' element={<Login/>} />
        <Route path='/signup' element={<Signup/>} />
        <Route path='/forgot-password' element={<ForgotPassword/>} />
        <Route path='/reset-password' element={<ResetPassword/>} />
        <Route path='*' element={<h1>404 Page not found!</h1>} />
       </Routes>
    
    </>
  )
}

export default App
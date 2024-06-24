import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Register from './components/Register';
import Login from './components/Login';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Blog from './components/Blog';
import Blogdetails from './components/Blogdetails';
import BlogAdd from './components/BlogAdd';
import Footer from './components/Footer';

function App() {
  

  return (
    <>
      <ToastContainer 
        position='top-right' 
        autoClose={2000} 
        hideProgressBar={false} 
        newestOnTop={false} 
        closeOnClick 
        rtl={false} 
        pauseOnFocusLoss 
        draggable 
        pauseOnHover 
      />
      <Router>
        <Navbar />
        <Routes>
          <Route path='/register' element={<Register />} />
          <Route path='/login' element={<Login />} />
          <Route path='/' element={<Blog />} />
          <Route path='/blog-add' element={<BlogAdd />} />
          <Route path='/blog/:title' element={<Blogdetails />} />
        </Routes>
        <Footer/>
      </Router>
    </>
  );
}

export default App;

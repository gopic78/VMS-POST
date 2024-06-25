import React, { useEffect, useState } from 'react';
import Apiurl from '../Environment/Apiurl';
import axios from 'axios';
import { Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

function BlogAdd() {
    const navigate = useNavigate();
    const [blog, setBlog] = useState({
        title: '',
        image: null,
        description: '',
        category: '',
        user_id: localStorage.getItem('id')
    });

    const [getBlogDetails, setBlogDetails] = useState([]);

    useEffect(() => {
        getBlogs();
    }, []);

    const getBlogs = async () => {
        try {
            const id = localStorage.getItem('id');
            const response = await axios.get(Apiurl + `/blog/${id}`);
            if (response && response.status === 200) {
                console.log("blog get", response.data);
                const data = response.data;
                if (data) {
                    setBlogDetails(data);
                }
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file && file.type === 'image/png' || file.type === 'image/jpeg') {
            setBlog((previous) => ({
                ...previous,
                image: file
            }));
        } else {
            alert('Please select an image in PNG format');
        }
        console.log("file", file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('title', blog.title);
        formData.append('image', blog.image);
        formData.append('description', blog.description);
        formData.append('category', blog.category);
        formData.append('user_id', blog.user_id);

        try {
            const token = localStorage.getItem('token')
            const response = await axios.post(Apiurl + '/blog', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'x-access-token': token,
                },
            });
            if (response && response.status === 201) {
                getBlogs();
                setBlog({
                    title: '',
                    image: null,
                    description: '',
                    category: '',
                    user_id: localStorage.getItem('id')
                });
            }
        } catch (error) {
            console.log(error);
        }
    };

    // Edit modal
    const [editId, setEditId] = useState('');
    const [editBlog, setEditBlog] = useState({
        title: '',
        image: null,
        description: '',
        category: '',
        user_id: localStorage.getItem('id')
    });
    const [editModalOpen, setEditModalOpen] = useState(false);

    const handleEdit = (id, item) => {
        setEditId(id);
        setEditBlog(item);
        setEditModalOpen(true);
    }

    const handleEditFileSelect = (e) => {
        const file = e.target.files[0];
        if (file && file.type === 'image/png' || file.type === 'image/jpeg') {
            setEditBlog((previous) => ({
                ...previous,
                image: file
            }));
        } else {
            alert('Please select an image in PNG format');
        }
        console.log("file", file);
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('title', editBlog.title);
        formData.append('image', editBlog.image);
        formData.append('description', editBlog.description);
        formData.append('category', editBlog.category);
        formData.append('user_id', editBlog.user_id);

        try {
            const token = localStorage.getItem('token')
            const response = await axios.put(Apiurl + `/blog/${editId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'x-access-token': token,
                },
            });
            if (response && response.status === 200) {
                getBlogs();
                setEditModalOpen(false);
                toast.success('Blog updated successfully');
            }
        } catch (error) {
            console.log(error);
            toast.error('Failed to update blog');
        }
    }

    // Delete modal
    const [deleteId, setDeleteId] = useState('');
    const [deleteTitle, setDeleteTitle] = useState('');
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const handleDelete = (id, title) => {
        setDeleteId(id);
        setDeleteTitle(title)
        setDeleteModalOpen(true);
    }
    const deleteModalClose = () => {
        setDeleteModalOpen(false);
    }

    const handleDeleteSubmit = async () => {
        try {
            const token = localStorage.getItem('token')
            const response = await axios.delete(Apiurl + `/blog/${deleteId}`,{
                headers: {
                    'x-access-token': token,
                },
            });
            if (response) {
                toast.success('Blog deleted successfully');
                getBlogs();
                setDeleteModalOpen(false);
            }
        } catch (error) {
            toast.error('Failed to delete blog');
        }
    }

    const truncateDescription = (description) => {
        if (!description) {
            return '';
        }
        if (description.length > 30) {
            return description.substring(0, 30) + '...';
        }
        return description;
    };

    const truncateTitle = (title) => {
        if (!title) {
            return '';
        }
        if (title.length > 20) {
            return title.substring(0, 20) + '...';
        }
        return title;
    };

    const handleBack = () => {
        navigate('/')
    }

    return (
        <>
            <Modal show={deleteModalOpen} onHide={deleteModalClose}>
                <Modal.Header closeButton>
                    <p className='text-danger'>Are you sure you want to delete?</p>
                </Modal.Header>
                <Modal.Body>
                    <p className='word-break'>Title : <b>{truncateTitle(deleteTitle)}</b></p>
                </Modal.Body>
                <Modal.Footer>
                    <button className='btn btn-secondary' onClick={deleteModalClose}>Close</button>
                    <button className='btn btn-danger' onClick={handleDeleteSubmit}>Delete</button>
                </Modal.Footer>
            </Modal>

            <Modal show={editModalOpen} onHide={() => setEditModalOpen(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Blog</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={handleEditSubmit}>
                        <div className='row'>
                            <div className='col-lg-12'>
                                <label className='form-label'>Title</label>
                                <input className='form-control' type='text' value={editBlog.title} onChange={(e) => setEditBlog({ ...editBlog, title: e.target.value })} />

                                <label className='form-label' >Image</label>
                                <input className='form-control' type='file' onChange={handleEditFileSelect} />

                                <label className='form-label mt-1'>Description</label>
                                <input className='form-control' type='text' value={editBlog.description} onChange={(e) => setEditBlog({ ...editBlog, description: e.target.value })} />

                                <label className='form-label mt-1'>Category</label>
                                <input className='form-control' type='text' value={editBlog.category} onChange={(e) => setEditBlog({ ...editBlog, category: e.target.value })} />
                            </div>
                        </div>
                        <button type='submit' className='btn btn-primary btn-sm mt-3'>Update</button>
                    </form>
                </Modal.Body>
            </Modal>


            <button className='btn btn-secondary back-blog' onClick={handleBack}><i class="fa-solid fa-left-long"></i></button>
            <div className='container blog-add-main pb-5 mb-5'>
                <h5 className='text-center pt-3'>Add Blog</h5>
                <div className='card p-3'>
                    <form onSubmit={handleSubmit}>
                        <div className='row'>
                            <div className='col-lg-6'>
                                <label className='form-label'>Title</label>
                                <input className='form-control' type='text' value={blog.title} onChange={(e) => setBlog({ ...blog, title: e.target.value })} required />
                            </div>
                            <div className='col-lg-6'>
                                <label className='form-label' >Image</label>
                                <input className='form-control' type='file' onChange={handleFileSelect} required />
                            </div>
                            <div className='col-lg-6'>
                                <label className='form-label mt-1'>Description</label>
                                <input className='form-control' type='text' value={blog.description} onChange={(e) => setBlog({ ...blog, description: e.target.value })} required />
                            </div>
                            <div className='col-lg-6'>
                                <label className='form-label mt-1'>Category</label>
                                <input className='form-control' type='text' value={blog.category} onChange={(e) => setBlog({ ...blog, category: e.target.value })} required />
                            </div>
                        </div>
                        <button type='submit' className='btn btn-primary btn-sm mt-3'>ADD</button>
                    </form>
                </div>
                <h6 className='text-center pt-2'>Blogs</h6>
                <div className='table-responsive pt-3'>
                    <table className='table table-striped'>
                        <thead>
                            <tr>
                                <th>S.No</th>
                                <th>Title</th>
                                <th>Category</th>
                                <th>Image</th>
                                <th>Description</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {getBlogDetails.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="text-center">No blogs found</td>
                                </tr>
                            ) : (
                                getBlogDetails.map((item, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td style={{ width: "20%" }}>{truncateTitle(item.title)}</td>
                                        <td>{item.category}</td>
                                        <td>{item.image}</td>
                                        <td style={{ width: "25%" }}>{truncateDescription(item.description)}</td>
                                        <td>
                                            <div className='d-flex'>
                                                <button className='btn btn-secondary btn-sm me-2' onClick={() => handleEdit(item._id, item)}>
                                                    <i className="fa-regular fa-pen-to-square"></i>
                                                </button>
                                                <button className='btn btn-danger btn-sm' onClick={() => handleDelete(item._id,item.title)}>
                                                    <i className="fa-solid fa-trash"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}

                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}

export default BlogAdd;

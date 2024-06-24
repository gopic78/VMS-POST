import React, { useEffect, useState } from 'react';
import { useParams, useHistory, Navigate, useNavigate } from 'react-router-dom';
import Apiurl from '../Environment/Apiurl';
import axios from 'axios';

function Blogdetails() {
    const navigate = useNavigate();
    const { title } = useParams();
    const [blogDetails, setBlogDetails] = useState({});
    const [blogComments, setBlogComments] = useState([]);
    const [showLoginPopup, setShowLoginPopup] = useState(false);

    console.log("params,", title)
    const [comments, setComment] = useState({
        blog_id: '',
        comment: '',
        user_id: localStorage.getItem('id')
    });

    useEffect(() => {
        getBlogDetails();
    }, []);

    useEffect(() => {
        if (blogDetails._id) {
            setComment((prevState) => ({
                ...prevState,
                blog_id: blogDetails._id
            }));
        }
    }, [blogDetails]);

    const getBlogDetails = async () => {
        try {
            const response = await axios.get(Apiurl + '/blog');
            if (response && response.status === 200) {
                const data = response.data;
                const foundBlog = data.find((item) => item.title === title);
                if (foundBlog) {
                    setBlogDetails(foundBlog);
                    try {
                        const response = await axios.get(Apiurl + `/blogcomment/${foundBlog._id}`);
                        if (response && response.status === 200) {
                            const data = response.data;
                            if (data) {
                                setBlogComments(data);
                            }
                        }
                    } catch (error) {
                        console.log(error);
                    }
                }
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleCommentPost = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        if (!token) {
            setShowLoginPopup(true);
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(Apiurl + '/blogcomment', comments, {
                headers: {
                    'x-access-token': token,
                },
            });
            if (response && response.status === 201) {
                setComment({
                    blog_id: blogDetails._id,
                    comment: '',
                    user_id: localStorage.getItem('id')
                });
                getBlogDetails();
            }
        } catch (error) {
            console.log(error);
        }
    }

    const formatDateTime = (dateTimeString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' };
        return new Date(dateTimeString).toLocaleDateString('en-US', options);
    };

    const handleClosePopup = () => {
        setShowLoginPopup(false);
        navigate('/login')
    };

    return (
        <div className='blog-details-main-background pb-5 '>
            <div className='blog-details-main container'>
                <div>
                    <h2 className='blog-title'>{blogDetails.title}</h2>
                    <div className='d-flex gap-2'>
                        {blogDetails.userDetails && (
                            <p className='blog-user-title'>By <span>{blogDetails.userDetails.username}</span></p>
                        )}
                        <p className='blog-date'>- {new Date(blogDetails.created_date).toLocaleDateString()}</p>
                    </div>
                    <div className='blog-details-img-main'>
                        <img src={Apiurl + `/uploads/${blogDetails.image}`} alt='blog' />
                    </div>
                    <p className='blog-description mt-5'>{blogDetails.description}</p>
                </div>

                <div className='blog-comments-show-main mt-5'>
                    <h3>{blogComments.length || ""} Comments</h3>
                    <div className='comment-card'>
                        {blogComments.length === 0 ? (
                            <p>No comments yet. Be the first to comment!</p>
                        ) : (
                            blogComments.map((item, index) => (
                                <div className='d-flex gap-3 mt-4' key={index}>
                                    <img src={require('../assets/img/man.png')} alt='user' />
                                    <div className='row w-100'>
                                        <div className='col-lg-9'>
                                            <h5>{item.userDetails.username}</h5>
                                            <p className='comment-text'>{item.comment}</p>
                                        </div>
                                        <div className='col-lg-3'>
                                            <p className='comment-date'>{formatDateTime(item.created_date)}</p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className='comment-section mt-5'>
                    <h3 className='mb-4'>Add Comment</h3>
                    <form onSubmit={handleCommentPost}>
                        <div className='form-group mb-3'>
                            <label className='form-label'>Comment</label>
                            <input className='form-control comment-input' required value={comments.comment} onChange={(e) => setComment({ ...comments, comment: e.target.value })} placeholder='Your Comment' />
                        </div>
                        <button type='submit' className='btn btn-primary' disabled={comments.comment === ""}>Submit</button>
                    </form>
                </div>
            </div>

            {showLoginPopup && (
                <div className='login-popup'>
                    <div className='login-popup-content'>
                        <p>Please log in to post a comment.</p>
                        <button className='btn btn-primary' onClick={handleClosePopup}>Log In</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Blogdetails;

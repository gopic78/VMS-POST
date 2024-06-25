import React, { useEffect, useState } from 'react';
import '../assets/css/blog.css';
import axios from 'axios';
import Apiurl from '../Environment/Apiurl';
import { Link, useNavigate } from 'react-router-dom';
import notfound from '../assets/img/notfound.svg';

function Blog() {
    const navigate = useNavigate();
    const [blogs, setBlogs] = useState([]);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    useEffect(() => {
        getBlogs();
    }, []);

    const getBlogs = async () => {
        try {
            const response = await axios.get(Apiurl + '/blog');
            if (response && response.status === 200) {
                console.log("blogs", response.data);
                setBlogs(response.data);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const truncateTitle = (title) => {
        const words = title.split('');
        if (words.length > 50) {
            return words.splice(0, 50).join('') + '...';
        }
        return title;
    };
    const truncateDescription = (description) => {
        const words = description.split('');
        if (words.length > 100) {
            return words.splice(0, 100).join('') + '...';
        }
        return description;
    };

    const formatDate = (date) => {
        if (!date) return '';

        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Intl.DateTimeFormat('en-US', options).format(new Date(date));
    };

    const handlenavigate = (title) => {
        scrollToTop();
        navigate(`/blog/${title}`);

    }
    const handleAddBlogNavigate = () => {
        scrollToTop();
        navigate('/blog-add')

    }

    const token = localStorage.getItem("token")


    return (
        <>
            {
                token && <button className='btn btn-success add-blog' onClick={handleAddBlogNavigate}>Add Blog</button>
            }

            <div className='container mt-3 mb-5 pb-5'>

                <h3 className='text-center'>Blogs</h3>

                <div className='row blog-card-main pt-3'>
                    {blogs.length === 0 ? (
                        <div className='col-12 text-center'>
                            <img src={notfound} alt='No blogs available' className='img-fluid not-found-blog mb-4' />
                            <h2>No blogs available</h2>
                            <p>Stay tuned for upcoming blogs. We will have more content soon!</p>
                        </div>
                    ) : (
                        blogs.map((item, index) => (
                            <div className='col-lg-4 col-md-6 col-sm-12 mb-4' key={index}>
                                <div className='card blog-card'>
                                    <img src={Apiurl + `/uploads/${item.image}`} alt='blog' className='card-img-top' />
                                    <div className='blog-category'>
                                        <p>{item.category}</p>
                                    </div>
                                    <div className='card-body'>
                                        <h3 className='card-title' onClick={() => handlenavigate(item.title)}>
                                            {truncateTitle(item.title)}
                                        </h3>
                                        <p className='card-text'>{truncateDescription(item.description)}</p>
                                        <p className='read-more mb-0 pb-0' onClick={() => handlenavigate(item.title)}>
                                            <Link className='link'>Read more <i className="fa-solid fa-angles-right"></i></Link>
                                        </p>
                                    </div>
                                    <hr className='mt-0 pt-0' />
                                    <p className='createddate'>{formatDate(item.created_date)}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </>
    );
}

export default Blog;

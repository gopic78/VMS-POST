import React from 'react';
import { useForm } from 'react-hook-form';
import '../assets/css/login.css';
import Apiurl from '../Environment/Apiurl';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

function Login() {
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = async (data) => {
        try {
            const response = await axios.post(Apiurl + '/login', data);
            if (response && response.status === 200) {
                toast.success("Login successful!");
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('id', response.data.id);
                localStorage.setItem('username', response.data.username);
                setTimeout(() => {
                    navigate('/');
                }, 1000);
            }
        } catch (error) {
            if (error.response && error.response.data.message === "No user found") {
                toast.error("Email not found");
            }
            else if(error.response && error.response.data.message === "Incorrect password"){
                toast.error("Incorrect password");
            } else {
                toast.error("Login failed");
            }
            console.log(error)
        }
    };

    return (
        <div className='container register-main'>
            <div className='login-body'>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className='form-group'>
                        <h4 className='text-center'>Login</h4>
                    </div>
                    <div className='form-group'>
                        <label className='form-label'>Email</label>
                        <input
                            className='form-control'
                            type='email'
                            {...register('email', {
                                required: "Email is required",
                                pattern: {
                                    value: /\S+@\S+\.\S+/,
                                    message: "Invalid email address"
                                }
                            })}
                            placeholder='Email'
                        />
                        {errors.email && <span className="error">{errors.email.message}</span>}
                    </div>
                    <div className='form-group'>
                        <label className='form-label'>Password</label>
                        <input
                            className='form-control'
                            type='password'
                            {...register('password', {
                                required: "Password is required",
                            })}
                            placeholder='Password'
                        />
                        {errors.password && <span className="error">{errors.password.message}</span>}
                    </div>
                    <div className='form-group m-0 p-0'>
                        <Link to='/register' className='register-link'>Create new account</Link>
                    </div>
                    <button type='submit' className='btn btn-primary mt-2'>Login</button>
                </form>
            </div>
        </div>
    );
}

export default Login;

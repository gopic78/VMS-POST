import React from 'react';
import { useForm } from 'react-hook-form'; // Import react-hook-form
import '../assets/css/login.css';
import Apiurl from '../Environment/Apiurl';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

function Register() {
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = async (data) => {
        try {
            const response = await axios.post(Apiurl + '/register', data);
            if(response && response.status ===201){
                setTimeout(()=>{
                    toast.success("Registration successful!");
                    navigate('/login')
                },1000)
               
            }
        }
        catch (error) {
            if (error.response && error.response.data.message === "Email already exists") {
                toast.error("Email already exists, try another email");
              } else {
                toast.error("Registration failed");
              }
        }
    };

    return (
        <div className='container register-main'>
            <div className='register-body'>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className='form-group'>
                        <h4 className='text-center'>Signup</h4>
                        <label className='form-label'>Username</label>
                        <input
                            className='form-control'
                            type='text'
                            {...register('username', {
                                required: "Username is required",
                                pattern: {
                                    value: /^[A-Za-z0-9]+(?:[_-][A-Za-z0-9]+)*$/,
                                    message: "Invalid username format"
                                }
                            })}
                            placeholder='Username'
                        />
                        {errors.username && <span className="error">{errors.username.message}</span>}
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
                                minLength: {
                                    value: 6,
                                    message: "Password must be at least 6 characters long"
                                }
                            })}
                            placeholder='Password'
                        />
                        {errors.password && <span className="error">{errors.password.message}</span>}
                    </div>
                    <div>
                        <Link to='/login'>Already have an account?</Link>
                    </div>
                    <button type='submit' className='btn btn-primary mt-2'>Signup</button>
                </form>
            </div>
            {/* </div> */}
        </div>
    );
}

export default Register;

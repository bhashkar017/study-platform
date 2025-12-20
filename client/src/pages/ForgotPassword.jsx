import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ForgotPassword = () => {
    // Steps: 1 = Email, 2 = OTP, 3 = New Password
    const [step, setStep] = useState(1);

    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    // Step 1: Send OTP
    const handleSendOTP = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');
        try {
            await axios.post('http://localhost:5000/api/auth/forgot-password', { email });
            setMessage(`OTP sent to ${email}`);
            setStep(2);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send OTP');
        } finally {
            setLoading(false);
        }
    };

    // Step 2: Verify OTP
    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await axios.post('http://localhost:5000/api/auth/verify-otp', { email, otp });
            setStep(3);
            setMessage('');
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid OTP');
        } finally {
            setLoading(false);
        }
    };

    // Step 3: Reset Password
    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) return setError("Passwords don't match");

        setLoading(true);
        setError('');
        try {
            await axios.post('http://localhost:5000/api/auth/reset-password-final', { email, otp, password: newPassword });
            setMessage('Password reset successful! Redirecting to login...');
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to reset password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        {step === 1 && 'Forgot Password'}
                        {step === 2 && 'Enter OTP'}
                        {step === 3 && 'Reset Password'}
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        {step === 1 && "Enter your email address to receive an OTP."}
                        {step === 2 && `Enter the OTP sent to ${email}`}
                        {step === 3 && "Create a new strong password."}
                    </p>
                </div>

                {error && <div className="text-red-500 text-center text-sm bg-red-50 p-2 rounded">{error}</div>}
                {message && <div className="text-green-500 text-center text-sm bg-green-50 p-2 rounded">{message}</div>}

                {/* Step 1: Email Form */}
                {step === 1 && (
                    <form className="mt-8 space-y-6" onSubmit={handleSendOTP}>
                        <div className="rounded-md shadow-sm -space-y-px">
                            <input
                                type="email"
                                required
                                className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
                        >
                            {loading ? 'Sending...' : 'Send OTP'}
                        </button>
                    </form>
                )}

                {/* Step 2: OTP Form */}
                {step === 2 && (
                    <form className="mt-8 space-y-6" onSubmit={handleVerifyOTP}>
                        <div className="rounded-md shadow-sm -space-y-px">
                            <input
                                type="text"
                                required
                                className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm text-center tracking-widest text-2xl"
                                placeholder="XXXX"
                                maxLength="4"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                            />
                        </div>
                        <div className="flex justify-between">
                            <button type="button" onClick={() => setStep(1)} className="text-indigo-600 text-sm hover:underline">Change Email</button>
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
                        >
                            {loading ? 'Verifying...' : 'Verify OTP'}
                        </button>
                    </form>
                )}

                {/* Step 3: New Password Form */}
                {step === 3 && (
                    <form className="mt-8 space-y-6" onSubmit={handleResetPassword}>
                        <div className="rounded-md shadow-sm -space-y-px">
                            <div>
                                <input
                                    type="password"
                                    required
                                    className="appearance-none rounded-t-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                    placeholder="New Password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                />
                            </div>
                            <div>
                                <input
                                    type="password"
                                    required
                                    className="appearance-none rounded-b-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                    placeholder="Confirm Password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
                        >
                            {loading ? 'Resetting...' : 'Reset Password'}
                        </button>
                    </form>
                )}

                <div className="text-center">
                    <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500 text-sm">
                        Back to Sign In
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;

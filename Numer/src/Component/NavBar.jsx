import { Link } from 'react-router-dom';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { useState, useEffect, useRef } from 'react';

const clientID = "624289594288-fedkgi9m2vn2la1r3iicc6c8rm2j4elf.apps.googleusercontent.com";

const NavBar = () => {
    const [showSidebar, setShowSidebar] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userProfile, setUserProfile] = useState(null);
    const sidebarRef = useRef(null);
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
                setShowSidebar(false);
            }
        };

        if (showSidebar) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showSidebar]);

    const onSuccess = (credentialResponse) => {
        setIsLoggedIn(true);
        console.log(credentialResponse);
        const userObject = JSON.parse(atob(credentialResponse.credential.split('.')[1]));
        setUserProfile(userObject);
    };

    const onFailure = () => {
        console.log('Login Failed');
    };

    const logOut = () => {
        setIsLoggedIn(false);
        setUserProfile(null);
    };
    return (
        <GoogleOAuthProvider clientId={clientID}>
            <div className="sticky top-0 z-10 navbar-collapse flex justify-end bg-stone-900 h-24">
                <ul className="flex my-auto justify-center items-center">
                    <Link to="/Home" className="no-underline">
                        <li className="text-center px-10 text-2xl text-white hover:text-orange-400 transition ease-in duration-150">Home</li>
                    </Link>
                    <Link to="/History" className="no-underline">
                        <li className="text-center px-10 text-2xl text-white hover:text-orange-400 transition ease-in duration-150">History</li>
                    </Link>
                    <button onClick={() => setShowSidebar(true)} className="no-underline focus:outline-none">
                        <li className="text-center px-10 text-2xl text-white hover:text-orange-400 transition ease-in duration-150">Login</li>
                    </button>
                </ul>
                <div
                    ref={sidebarRef}
                    className={`fixed top-0 right-0 h-full w-64 bg-stone-900 p-4 transition-transform duration-500 ease-in-out ${
                        showSidebar ? 'transform translate-x-0' : 'transform translate-x-full'
                    }`}
                >
                    <ul className="flex flex-col space-y-4 justify-center items-center my-5 ">
                        {!isLoggedIn ? (
                            <li>
                                <GoogleLogin
                                    onSuccess={onSuccess}
                                    onError={onFailure}
                                    className="w-1/2 text-center"
                                />
                            </li>
                        ) : (
                            <>
                                <li className="text-2xl text-white text-wrap text-center">Welcome, {userProfile.name}!</li>
                                <hr className="border-2 border-white w-full"></hr>
                                <li className='flex flex-col'>
                                    <button
                                        className="text-2xl text-white hover:text-orange-400 transition ease-in duration-150"
                                        onClick={() => {console.log("Bookmark")}}
                                    >
                                        Bookmark
                                    </button>
                                    <button
                                        className="text-2xl text-white hover:text-orange-400 transition ease-in duration-150"
                                        onClick={() => {console.log("History")}}
                                    >
                                        History
                                    </button>
                                    <button
                                        className="text-2xl  text-white hover:text-orange-400 transition ease-in duration-150"
                                        onClick={() => logOut()}>
                                        Logout
                                    </button>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </GoogleOAuthProvider>
    );
};

export default NavBar;

import { Link } from 'react-router-dom';
import {GoogleLogin} from 'react-google-login';
import {gapi} from 'gapi-script'
import { useState,useEffect,useRef } from 'react';

const clientID = "624289594288-fedkgi9m2vn2la1r3iicc6c8rm2j4elf.apps.googleusercontent.com"

const NavBar = () => {
    const [showSidebar, setShowSidebar] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userProfile, setUserProfile] = useState(null);
    const sidebarRef = useRef(null);
    useEffect(() => {
        const initClient = () => {
            gapi.client.init({
                clientId: clientID,
                scope: '',
            });
        };
        gapi.load('client:auth2', initClient);
    }, []);

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

    const onSuccess = (res) => {
        setIsLoggedIn(true);
        setUserProfile(res.profileObj);
    };

    const onFailure = (err) => {
        console.log('failed', err);
    };

    const logOut = () => {
        setIsLoggedIn(false);
        setUserProfile(null);
    };

    return (
        <div className="sticky top-0 z-10 navbar-collapse flex justify-end bg-stone-900 h-24">
            <ul className="flex my-auto justify-center items-center">
                <Link to="/Home" className="no-underline">
                    <li className="text-center px-10 text-2xl text-white hover:text-orange-400 transition ease-in duration-150">Home</li>
                </Link>
                <button onClick={() => setShowSidebar(true)} className="no-underline focus:outline-none">
                    <li className="text-center px-10 text-2xl text-white hover:text-orange-400 transition ease-in duration-150">Login</li>
                </button>
            </ul>
            {showSidebar && (
                <div ref={sidebarRef} className="fixed top-0 right-0 h-full w-64 bg-stone-900 p-4">
                    <ul className="flex flex-col space-y-4 justify-center items-center translate-x-1 transition ease-in duration-500">
                        {!isLoggedIn ? (
                            <li>
                                <GoogleLogin
                                    clientId={clientID}
                                    buttonText="Login with Google"
                                    onSuccess={onSuccess}
                                    onFailure={onFailure}
                                    cookiePolicy={'single_host_origin'}
                                />
                            </li>
                        ) : (
                            <>
                                <li className="text-2xl text-white text-wrap text-center">Welcome, {userProfile.name}!</li>
                                <li>
                                    <button
                                        className="text-2xl text-white hover:text-orange-400 transition ease-in duration-150"
                                        onClick={logOut}
                                    >
                                        Logout
                                    </button>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default NavBar;
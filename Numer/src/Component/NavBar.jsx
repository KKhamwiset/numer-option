import { Link } from 'react-router-dom';

const NavBar = () => {
    return (
        <div className="sticky top-0 z-10 navbar-collapse flex justify-end bg-stone-900 h-16">
            <ul className="flex mt-auto mb-auto">
                <Link to="/home" className="no-underline hover:text-inherit">
                    <li className="mr-20 text-2xl text-white">Home</li>
                </Link>
                <Link to="/login" className="no-underline hover:text-inherit">
                    <li className="mr-20 text-2xl text-white">Login</li>
                </Link>
            </ul>
        </div>
    );
};

export default NavBar;

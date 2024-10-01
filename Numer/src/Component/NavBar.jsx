import { Link } from 'react-router-dom';

const NavBar = () => {
    return (
        <div className="sticky top-0 z-10 navbar-collapse flex justify-end bg-stone-900 h-24">
            <ul className="flex my-auto">
                <Link to="/Home" className="no-underline">
                    <li className="mr-20 text-2xl text-white hover:text-orange-400 transition ease-in duration-150">Home</li>
                </Link>
                <Link to="/login" className="no-underline">
                    <li className="mr-20 text-2xl text-white hover:text-orange-400 transition ease-in duration-150">Login</li>
                </Link>
            </ul>
        </div>
    );
};

export default NavBar;

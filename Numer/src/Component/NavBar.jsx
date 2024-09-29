

const NavBar = () => {
    return (
    <div className="sticky top-0 z-10 navbar-collapse flex justify-end bg-slate-500 h-16">
        <ul className="flex  mt-auto mb-auto">
          <a href="" className='no-underline hover:text-inherit'>
              <li className="mr-20 text-2xl">Home</li>
          </a>
          <a href=""className='no-underline hover:text-inherit'>
              <li className="mr-20 text-2xl">Login</li>
          </a>
        </ul>
      </div>
    );
}
export default NavBar;
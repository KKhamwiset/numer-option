
import { Link } from 'react-router-dom';


const MethodLink = ({ dest, title }) => (
    <Link 
      to={dest}
      className="s:w-1/4 md:w-1/4 lg:w-1/4 s:h-1/4 md:h-1/3 lg:h-1/4 
        border border-slate-300 rounded-lg m-5 
        no-underline text-black hover:text-orange-500 hover:border-orange-500 
        transition ease-in duration-200 hover:scale-105"
    >
      <div className="text-center text-2xl m-10">{title}</div>
    </Link>
  );
const methods = [
  // { path: "Simpleregression", title: "Simple Regression" },
  // { path: "Multipleregression", title: "Multiple Regression" },
]

const  Regression = () => {
    return (
        <div className='px-10 my-10'>
        <div className="text-left text-2xl mt-10 ">Regressions</div>
        <hr className='border-2 border-red-200'></hr>
        <div className="container mx-auto mt-10 flex flex-col flex-wrap items-center justify-center md:flex-row lg:flex-row">
          {methods.map((method) => (
            <MethodLink key={method.path} dest={`/Regression/${method.path}`} title={method.title}/>)
            )
          }
        </div>
    </div>
    )
  }

export default Regression;
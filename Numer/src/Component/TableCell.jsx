
const TableCell = ({ children, additionalClasses = "" }) => {
    return (
      <td className={`border border-slate-400 px-4 py-2 text-gray-700 ${additionalClasses}`}>
        {children}
      </td>
    );
  };
  export default TableCell;
  
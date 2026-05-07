import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

function BackButton() {
    return ( 
         <Link to={'/blogs'} className="inline-flex flex text-(--text-primary) gap-2 p-4 bg-(--surface-color)/30 rounded-2xl "><ArrowLeft /> Back to blog </Link>
     );
}

export default BackButton;
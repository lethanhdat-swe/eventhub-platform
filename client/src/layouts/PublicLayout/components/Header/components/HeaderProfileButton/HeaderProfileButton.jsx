import { User } from "lucide-react";
import { Link } from "react-router-dom";

function HeaderProfileButton() {
    return ( 
         <Link to={'/profile'}>
            <User color="var(--text-primary)"/> 
        </Link>
     );
}

export default HeaderProfileButton;
import { Outlet } from "react-router-dom";
import Header from "@/layouts/PublicLayout/components/Header";
import Footer from "@/layouts/PublicLayout/components/Footer";

function PublicLayout() {
    return (
        <div>
            <Header />
            <Outlet />
            <Footer />
        </div>
    );
}

export default PublicLayout;

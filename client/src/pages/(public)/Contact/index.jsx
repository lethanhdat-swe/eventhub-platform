import { SendIcon } from "@/assets/icons";
import ContactSection from "./components/ContactSection/ContactSection";
import HeroContact from "./components/HeroContact/HeroContact";
import ContactSupport from "./components/ContactSupport/ContactSupport";

function Contact() {
    return ( 
        <div className="pt-(--header-height)">
            <HeroContact />
            <ContactSection />
            <SendIcon size={500}/>
            <ContactSupport />
        </div>
     );
}

export default Contact;
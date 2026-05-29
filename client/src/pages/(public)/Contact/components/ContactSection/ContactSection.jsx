import ContactForm from "./components/ContactForm/ContactForm";
import ContactInfo from "./components/ContactInfo/ContactInfo";

function ContactSection() {
    return ( 
        <div className="grid grid-cols-1 gap-10 p-5 lg:grid-cols-2 lg:gap-20 sm:p-8 lg:p-10">
            <ContactForm />
            <ContactInfo />  
        </div>
     );
}

export default ContactSection;
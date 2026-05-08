import ContactForm from "./components/ContactForm/ContactForm";
import ContactInfo from "./components/ContactInfo/ContactInfo";

function ContactSection() {
    return ( 
        <div className="grid grid-cols-2 gap-20 p-10">
            <ContactForm />
            <ContactInfo />  
        </div>
     );
}

export default ContactSection;
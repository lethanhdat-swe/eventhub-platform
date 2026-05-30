import ContactForm from './components/ContactForm/ContactForm';
import ContactInfo from './components/ContactInfo/ContactInfo';

function ContactSection() {
  return (
    <section className="container">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-20 pt-10">
        <ContactForm />
        <ContactInfo />
      </div>
    </section>
  );
}

export default ContactSection;

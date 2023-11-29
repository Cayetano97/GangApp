import classes from "./Faq.module.css";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleQuestion,
  faAddressCard,
} from "@fortawesome/free-solid-svg-icons";

const faqData = [
  {
    id: 1,
    question: "¿Qué es esta aplicación?",
    answer:
      "La aplicación es una plataforma móvil que te permite acceder a ofertas, descuentos y promociones exclusivas en supermercados cercanos a tu ubicación. Te ayuda a ahorrar dinero mientras haces tus compras diarias.",
  },
  {
    id: 2,
    question: "¿Cómo puedo descargar la aplicación?",
    answer:
      "La aplicación está disponible para descargar en las principales tiendas de aplicaciones, como App Store (iOS) y Google Play (Android). Busca el nombre de la aplicación y sigue las instrucciones para instalarla en tu dispositivo móvil.",
  },
  {
    id: 3,
    question: "¿Necesito cuenta para usar la aplicación?",
    answer:
      "Sí, para acceder a las ofertas, necesitas crear una cuenta en la aplicación. Puedes registrarte con tu dirección de correo electrónico y crear una contraseña segura.",
  },
  {
    id: 4,
    question: "¿Mis datos personales están seguros?",
    answer:
      "Sí, valoramos tu privacidad y seguridad. Tus datos personales se manejan de acuerdo con nuestras políticas de privacidad, que cumplen con las regulaciones de protección de datos vigentes.",
  },
  {
    id: 5,
    question: "¿Cómo encuentro las ofertas disponibles?",
    answer:
      "Una vez que hayas seleccionado un supermercado, verás una lista de ofertas disponibles para ese lugar. También puedes buscar productos específicos para ver si están en oferta.",
  },
  {
    id: 6,
    question: "¿Cómo canjeo las ofertas en el supermercado?",
    answer:
      "Agrega los productos en oferta a tu lista de compras dentro de la aplicación. Luego, muestra tu lista al cajero o cajera en el supermercado al momento de pagar. Los descuentos se aplicarán automáticamente al escanear los productos.",
  },
  {
    id: 7,
    question:
      "¿Puedo combinar ofertas con cupones o promociones del supermercado?",
    answer:
      "En general, las ofertas de la aplicación no son acumulables con otras promociones o cupones del supermercado. Sin embargo, es posible que algunos supermercados permitan ciertas combinaciones. Consulta los términos y condiciones de cada oferta para obtener más información.",
  },
  {
    id: 8,
    question: "¿Es esta aplicación gratuita?",
    answer:
      "Sí, la aplicación es gratuita para descargar y utilizar. No hay costos ocultos ni tarifas para acceder a las ofertas.",
  },
  {
    id: 9,
    question: "¿Cómo funciona la aplicación?",
    answer:
      "La aplicación utiliza la geolocalización para identificar supermercados cercanos a tu ubicación. Una vez que seleccionas un supermercado, podrás ver las ofertas y descuentos disponibles en ese establecimiento. Puedes agregar los productos que desees a tu lista de compras y presentarlos en caja para recibir el descuento correspondiente.",
  },
];

const Faq = () => {
  const [expandedQuestionId, setExpandedQuestionId] = useState(null);

  const handleQuestionClick = (id) => {
    setExpandedQuestionId(id === expandedQuestionId ? null : id);
  };

  return (
    <div className={classes.faqComplete}>
      <div className={classes.contactInfo}>
        <div>
          <label>
            <h3>
              <FontAwesomeIcon icon={faAddressCard} /> Contacto
            </h3>
          </label>
        </div>
        <p>Nombre: SmartCart</p>
        <p>Teléfono: +34 XXX XXX XXX</p>
        <p>Email: contacto@contacto.com</p>
        <p>Dirección: Calle Falsa 123, Malága</p>
      </div>
      <div className={classes.faqContainer}>
        <div>
          <label>
            <h3>
              <FontAwesomeIcon icon={faCircleQuestion} /> FAQ
            </h3>
          </label>
        </div>
        {faqData.map((faqItem) => (
          <div key={faqItem.id} className={classes.faqItem}>
            <div
              className={classes.question}
              onClick={() => handleQuestionClick(faqItem.id)}
            >
              {faqItem.question}
              <span className={classes.toggleIcon}>
                {expandedQuestionId === faqItem.id ? "-" : "+"}
              </span>
            </div>
            {expandedQuestionId === faqItem.id && (
              <p className={classes.answer}>{faqItem.answer}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Faq;

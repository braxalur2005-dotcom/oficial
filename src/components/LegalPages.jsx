export function TermsPage({ setCurrentView }) {
    return (
        <LegalLayout title="Términos y Condiciones de Servicio">
            <p><strong>Última actualización:</strong> agosto de 2026</p>

            <h3>1. Aceptación de los términos</h3>
            <p>Al contratar cualquiera de los paquetes o servicios ofrecidos por NEXUS, S.A. de C.V. ("Nexus"), el cliente acepta los presentes Términos y Condiciones de Servicio en su totalidad. Si no estás de acuerdo con alguna disposición, te pedimos no contratar nuestros servicios.</p>

            <h3>2. Descripción de los servicios</h3>
            <p>Nexus ofrece el desarrollo de plataformas digitales para negocios de reparación de productos electrónicos, incluyendo de forma enunciativa mas no limitativa: Cotizador Inteligente, Rastreador de Órdenes en Tiempo Real, Ubicación Digital Estratégica, SEO Orgánico, Automatización, Diseño Responsivo, Desarrollo a Medida y servicios de mantenimiento, conforme al paquete específico contratado y publicado en la sección "Paquetes" del sitio web al momento de la contratación.</p>

            <h3>3. Alcance del proyecto y "Desarrollo a Medida"</h3>
            <p>El alcance de cada proyecto (número de páginas, funcionalidades, integraciones) se define por escrito antes de iniciar el desarrollo, mediante una cotización o propuesta de trabajo específica ("Alcance Acordado"). Cualquier trabajo adicional al Alcance Acordado, incluyendo cambios solicitados por el cliente durante el desarrollo, podrá generar un costo adicional y una extensión del plazo de entrega, lo cual será notificado al cliente antes de realizarse.</p>

            <h3>4. Precios, forma de pago y facturación</h3>
            <p>Los precios de los paquetes se publican en moneda nacional (pesos mexicanos, MXN) en la sección "Paquetes" del sitio web. El pago podrá realizarse conforme a las modalidades habilitadas en el sitio (pago único o mensualidad de mantenimiento). Nexus emitirá el Comprobante Fiscal Digital por Internet (CFDI) correspondiente a cada pago recibido, conforme a lo dispuesto por el Código Fiscal de la Federación y las disposiciones de la Resolución Miscelánea Fiscal vigente.</p>

            <h3>5. Plazos de entrega</h3>
            <p>Los plazos de entrega informados en el sitio o en la propuesta son estimados y están sujetos a la entrega oportuna, por parte del cliente, de la información, contenidos y accesos necesarios para el desarrollo del proyecto. Nexus no será responsable por retrasos atribuibles a la falta de dicha colaboración.</p>

            <h3>6. Mantenimiento y soporte</h3>
            <p>El alcance específico del mantenimiento mensual (horas de soporte, tiempo de respuesta, incidencias cubiertas) se define por escrito en cada contratación.</p>

            <h3>7. Propiedad intelectual</h3>
            <p>Salvo pacto en contrario por escrito, el código fuente, diseños y desarrollos realizados a la medida para un cliente son propiedad de Nexus hasta el pago íntegro del servicio contratado, momento en el cual se transferirán los derechos de uso correspondientes al cliente, conforme a lo que se defina en la propuesta específica. Las herramientas, metodologías y componentes propios de Nexus (por ejemplo, la arquitectura base del Cotizador Inteligente y el Rastreador de Órdenes) permanecen en todo momento como propiedad intelectual de Nexus, aun cuando se licencien para su uso dentro del sitio del cliente.</p>

            <h3>8. Obligaciones del cliente</h3>
            <p>El cliente se obliga a proporcionar información veraz y actualizada, a colaborar oportunamente durante el desarrollo del proyecto, y a realizar los pagos en las fechas acordadas.</p>

            <h3>9. Cancelaciones y reembolsos</h3>
            <p>La política de cancelación y reembolsos se define por escrito en cada contratación.</p>

            <h3>10. Limitación de responsabilidad</h3>
            <p>Nexus no garantiza resultados específicos de negocio (por ejemplo, un número determinado de clientes nuevos o de posiciones en buscadores) derivados del uso de sus plataformas o servicios de posicionamiento, ya que estos dependen de factores fuera de su control, como el comportamiento del mercado y de los motores de búsqueda. La responsabilidad de Nexus frente al cliente, en cualquier caso, no excederá el monto efectivamente pagado por el servicio del que derive la reclamación.</p>

            <h3>11. Confidencialidad y datos personales</h3>
            <p>El tratamiento de los datos personales del cliente se rige por el <button onClick={() => setCurrentView('privacy')} className="text-nexus-accent underline">Aviso de Privacidad</button> de Nexus.</p>

            <h3>12. Modificaciones a los presentes términos</h3>
            <p>Nexus podrá actualizar estos Términos de Servicio en cualquier momento, publicando la versión vigente en el sitio web con su fecha de actualización.</p>

            <h3>13. Legislación aplicable y jurisdicción</h3>
            <p>Para la interpretación y cumplimiento de estos Términos, las partes se someten a la legislación aplicable en México y a los tribunales competentes de la Ciudad de México, renunciando a cualquier otro fuero que pudiera corresponderles por razón de su domicilio presente o futuro.</p>
        </LegalLayout>
    );
}

export function PrivacyPage({ setCurrentView }) {
    return (
        <LegalLayout title="Aviso de Privacidad">
            <p><strong>Última actualización:</strong> agosto de 2026</p>

            <h3>1. Identidad y domicilio del responsable</h3>
            <p>NEXUS, S.A. de C.V. ("Nexus", "nosotros"), con domicilio en Polanco, Alcaldía Miguel Hidalgo, Ciudad de México, México, es responsable del tratamiento de tus datos personales conforme a este Aviso de Privacidad, en cumplimiento del artículo 15 de la Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP).</p>

            <h3>2. Datos personales que recabamos</h3>
            <p>Dependiendo de tu relación con Nexus (visitante del sitio, prospecto o cliente), podemos recabar:</p>
            <ul>
                <li>Datos de identificación y contacto: nombre, correo electrónico, número telefónico o de WhatsApp, nombre del negocio.</li>
                <li>Datos del negocio: giro, dirección o ubicación del establecimiento, horarios de atención.</li>
                <li>Datos de la cotización: descripción del problema o servicio, modelo del producto o equipo.</li>
                <li>Datos de cuenta: correo electrónico y contraseña (cifrada) al crear una cuenta.</li>
                <li>Datos de pago: procesados directamente por la pasarela de pagos correspondiente; Nexus no almacena números completos de tarjeta.</li>
                <li>Datos técnicos y de navegación: dirección IP, tipo de dispositivo y navegador, páginas visitadas, mediante cookies (ver Política de Cookies).</li>
            </ul>
            <p>No recabamos, salvo que el cliente los proporcione voluntariamente, datos personales sensibles en los términos del artículo 3, fracción VI de la LFPDPPP. Si en algún momento se llegaran a recabar datos sensibles, se solicitará el consentimiento expreso y por escrito del titular.</p>

            <h3>3. Finalidades del tratamiento</h3>
            <p><strong>Finalidades primarias</strong> (necesarias para la relación con Nexus): elaborar cotizaciones y propuestas; desarrollar, entregar y dar mantenimiento a la plataforma contratada; procesar pagos y emitir CFDI; brindar soporte técnico; habilitar y operar el Cotizador Inteligente y el Rastreador de Órdenes; cumplir obligaciones legales, fiscales y contractuales.</p>
            <p><strong>Finalidades secundarias</strong> (requieren tu autorización): enviar información promocional; realizar encuestas de satisfacción; fines estadísticos y de mejora de nuestros servicios de marketing digital.</p>
            <p>Si no deseas que tus datos se utilicen para las finalidades secundarias, puedes manifestarlo enviando un correo a <strong>nexus.atencion@outlook.com</strong> con el asunto "No a finalidades secundarias". La negativa no será motivo para negarte los servicios contratados.</p>

            <h3>4. Transferencias de datos</h3>
            <p>Tus datos podrán ser compartidos con pasarelas de pago, proveedores de hosting e infraestructura en la nube, proveedores de mensajería (API de WhatsApp Business), y autoridades competentes cuando exista requerimiento legal fundado. Nexus no vende ni renta tus datos personales a terceros con fines distintos a los aquí descritos.</p>

            <h3>5. Derechos ARCO y cómo ejercerlos</h3>
            <p>Tienes derecho a Acceder, Rectificar, Cancelar y Oponerte al tratamiento de tus datos personales ("derechos ARCO"), conforme a los artículos 22 al 35 de la LFPDPPP. Para ejercerlos, envía una solicitud a <strong>nexus.atencion@outlook.com</strong> indicando: (i) tu nombre completo, (ii) documento que acredite tu identidad, (iii) descripción clara del derecho que deseas ejercer. Nexus dará respuesta dentro de los 20 días hábiles siguientes a su recepción.</p>

            <h3>6. Medidas de seguridad</h3>
            <p>Nexus ha implementado medidas de seguridad administrativas, técnicas y físicas razonables para proteger tus datos personales, conforme al artículo 19 de la LFPDPPP.</p>

            <h3>7. Uso de cookies</h3>
            <p>El sitio de Nexus utiliza cookies y tecnologías similares. El detalle se encuentra en nuestra <button onClick={() => setCurrentView('cookies')} className="text-nexus-accent underline">Política de Cookies</button>.</p>

            <h3>8. Cambios al presente Aviso de Privacidad</h3>
            <p>Nexus podrá modificar este Aviso de Privacidad en cualquier momento. Cualquier modificación será publicada en esta misma sección con su fecha de actualización.</p>

            <h3>9. Autoridad competente</h3>
            <p>Si consideras que tu derecho a la protección de datos personales ha sido lesionado, tienes derecho a acudir ante el INAI (Instituto Nacional de Transparencia, Acceso a la Información y Protección de Datos Personales).</p>
        </LegalLayout>
    );
}

export function CookiesPage() {
    return (
        <LegalLayout title="Política de Cookies">
            <p><strong>Última actualización:</strong> agosto de 2026</p>

            <h3>1. ¿Qué son las cookies?</h3>
            <p>Las cookies son pequeños archivos de texto que un sitio web instala en tu navegador o dispositivo, que permiten recordar información sobre tu visita.</p>

            <h3>2. Tipos de cookies que utiliza el sitio de Nexus</h3>
            <ul>
                <li><strong>Necesarias/técnicas:</strong> indispensables para el funcionamiento del sitio, por ejemplo, para mantener tu sesión iniciada en tu panel de cliente. No requieren consentimiento previo.</li>
                <li><strong>Preferencias:</strong> recuerdan configuraciones como el idioma o región.</li>
                <li><strong>Analíticas:</strong> nos permiten entender cómo los visitantes usan el sitio, con fines estadísticos.</li>
                <li><strong>Publicidad/marketing:</strong> utilizadas para medir el desempeño de campañas publicitarias, cuando aplique.</li>
            </ul>

            <h3>3. Cookies de terceros</h3>
            <p>Algunas funciones del sitio (mapas, botón de WhatsApp, reproductor de video, sistema de inicio de sesión) pueden instalar cookies de proveedores externos. Nexus no controla directamente estas cookies; te recomendamos revisar las políticas de privacidad de dichos proveedores.</p>

            <h3>4. Cómo deshabilitar las cookies</h3>
            <p>Puedes configurar tu navegador para bloquear o eliminar cookies. Ten en cuenta que deshabilitar las cookies necesarias puede afectar el funcionamiento del sitio (por ejemplo, el inicio de sesión o el simulador "Armar mi Paquete").</p>

            <h3>5. Consentimiento</h3>
            <p>Al continuar navegando en el sitio de Nexus y aceptar el aviso de cookies que aparece en tu primera visita, aceptas el uso de cookies conforme a esta política.</p>

            <h3>6. Actualizaciones a esta política</h3>
            <p>Esta Política de Cookies puede actualizarse. La fecha de la versión vigente se indica arriba.</p>
        </LegalLayout>
    );
}

function LegalLayout({ title, children }) {
    return (
        <div className="pt-32 pb-20 px-4 max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-8">{title}</h2>
            <div className="legal-content glass-panel p-8 space-y-4 text-gray-300 leading-relaxed">
                {children}
            </div>
        </div>
    );
}


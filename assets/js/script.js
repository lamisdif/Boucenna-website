/**
 * BOUCENNA WEBSITE - MAIN JAVASCRIPT & FULL MULTILINGUAL TRANSLATION ENGINE
 * (100% Client-Side - Arabic RTL Support - Pure WhatsApp Workflow - Zero Database)
 */

'use strict';

/**
 * PRELOADER
 */
const hidePreloader = () => {
  const preloader = document.querySelector("[data-preloader]");
  if (preloader) {
    preloader.classList.add("loaded");
    preloader.style.display = "none";
  }
  document.body.classList.add("loaded");
};
hidePreloader();
window.addEventListener("load", hidePreloader);
document.addEventListener("DOMContentLoaded", hidePreloader);

/**
 * NAVBAR MOBILE TOGGLE
 */
const navTogglers = document.querySelectorAll("[data-nav-toggler]");
const navbar = document.querySelector("[data-navbar]");
const overlay = document.querySelector("[data-overlay]");

const toggleNavbar = () => {
  if (navbar) navbar.classList.toggle("active");
  if (overlay) overlay.classList.toggle("active");
  document.body.classList.toggle("nav-active");
};
navTogglers.forEach(btn => btn.addEventListener("click", toggleNavbar));

/**
 * STICKY HEADER & BACK TO TOP
 */
const header = document.querySelector("[data-header]");
const backTopBtn = document.querySelector("[data-back-top-btn]");

window.addEventListener("scroll", () => {
  if (window.scrollY >= 80) {
    if (header) header.classList.add("active");
    if (backTopBtn) backTopBtn.classList.add("active");
  } else {
    if (header) header.classList.remove("active");
    if (backTopBtn) backTopBtn.classList.remove("active");
  }
});

/**
 * FAQ ACCORDION HANDLER
 */
document.addEventListener('click', (e) => {
  const trigger = e.target.closest('.faq-btn-trigger');
  if (!trigger) return;
  
  const faqItem = trigger.closest('.modern-faq-item');
  if (!faqItem) return;

  const isActive = faqItem.classList.contains('active');
  document.querySelectorAll('.modern-faq-item').forEach(item => item.classList.remove('active'));
  
  if (!isActive) {
    faqItem.classList.add('active');
  }
});

/**
 * PRE-SELECT CENTER BUTTONS ON DIALYSE VACANCES
 */
document.addEventListener('click', (e) => {
  const chooseBtn = e.target.closest('[data-choose-center]');
  if (!chooseBtn) return;
  
  const centerName = chooseBtn.getAttribute('data-choose-center');
  const selectEl = document.getElementById('vacation-center-select');
  if (selectEl && centerName) {
    selectEl.value = centerName;
  }
});

/**
 * TEAM TABS SWITCHER
 */
document.addEventListener('click', (e) => {
  const tabBtn = e.target.closest('[data-team-tab]');
  if (!tabBtn) return;

  document.querySelectorAll('[data-team-tab]').forEach(btn => btn.classList.remove('active'));
  tabBtn.classList.add('active');
});

/**
 * GENERAL CONTACT FORM -> WHATSAPP INTEGRATION (MULTILINGUAL)
 */
const generalContactForm = document.getElementById('general-contact-form');
if (generalContactForm) {
  generalContactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const currentLang = localStorage.getItem('boucenna_lang') || 'fr';
    const t = (i18nDictionary[currentLang] || i18nDictionary['fr']);

    const nameInput = generalContactForm.querySelector('input[type="text"]');
    const phoneInput = generalContactForm.querySelector('input[type="tel"]');
    const emailInput = generalContactForm.querySelector('input[type="email"]');
    const messageInput = generalContactForm.querySelector('textarea');

    const name = nameInput ? nameInput.value.trim() : '';
    const phone = phoneInput ? phoneInput.value.trim() : '';
    const email = emailInput ? emailInput.value.trim() : '';
    const message = messageInput ? messageInput.value.trim() : '';

    if (!name || !phone || !message) {
      alert(t.contact_form_error_required || 'Veuillez renseigner votre nom, téléphone et message.');
      return;
    }

    let headerTitle = "📩 *Message de Contact — Clinique Boucenna*";
    let lName = "👤 *Nom :*";
    let lPhone = "📱 *Téléphone :*";
    let lEmail = "✉️ *Email :*";
    let lMsg = "📝 *Message :*";

    if (currentLang === 'ar') {
      headerTitle = "📩 *رسالة تواصل — عيادة بوسنة*";
      lName = "👤 *الاسم :*";
      lPhone = "📱 *الهاتف :*";
      lEmail = "✉️ *البريد الإلكتروني :*";
      lMsg = "📝 *الرسالة :*";
    } else if (currentLang === 'en') {
      headerTitle = "📩 *Contact Message — Boucenna Clinic*";
      lName = "👤 *Name :*";
      lPhone = "📱 *Phone :*";
      lEmail = "✉️ *Email :*";
      lMsg = "📝 *Message :*";
    }

    const lines = [
      headerTitle,
      "",
      `${lName} ${name}`,
      `${lPhone} ${phone}`,
      email ? `${lEmail} ${email}` : '',
      `${lMsg} ${message}`
    ].filter(Boolean);

    const whatsappUrl = `https://wa.me/213770313136?text=${encodeURIComponent(lines.join('\n'))}`;
    window.open(whatsappUrl, '_blank');
  });
}

/**
 * VACATION REQUEST FORM -> WHATSAPP INTEGRATION (MULTILINGUAL)
 */
const vacationForm = document.getElementById('vacation-request-form');
if (vacationForm) {
  vacationForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const currentLang = localStorage.getItem('boucenna_lang') || 'fr';
    const t = (i18nDictionary[currentLang] || i18nDictionary['fr']);

    const successAlert = document.getElementById('form-alert-success');
    const errorAlert = document.getElementById('form-alert-error');
    const errorMsg = document.getElementById('form-error-msg');

    if (successAlert) successAlert.style.display = 'none';
    if (errorAlert) errorAlert.style.display = 'none';

    const formData = new FormData(vacationForm);
    const data = Object.fromEntries(formData.entries());

    if (!data.full_name || !data.country || !data.phone || !data.stay_city || !data.arrival_date || !data.departure_date || !data.center) {
      if (errorAlert) {
        if (errorMsg) errorMsg.textContent = t.vac_form_error_required || 'Veuillez renseigner tous les champs obligatoires (*).';
        errorAlert.style.display = 'flex';
      }
      return;
    }

    const arrival = new Date(data.arrival_date);
    const departure = new Date(data.departure_date);
    if (departure < arrival) {
      if (errorAlert) {
        if (errorMsg) errorMsg.textContent = t.vac_form_error_dates || 'La date de départ ne peut pas être antérieure à la date d\'arrivée.';
        errorAlert.style.display = 'flex';
      }
      return;
    }

    let headerTitle = "🏥 *Demande de Dialyse Vacances — Clinique Boucenna*";
    let lFullName = "👤 *Nom et prénom :*";
    let lCountry = "🌍 *Pays de résidence :*";
    let lPhone = "📱 *Téléphone / WhatsApp :*";
    let lCity = "📍 *Ville de séjour en Algérie :*";
    let lArrival = "📅 *Date d'arrivée :*";
    let lDeparture = "📅 *Date de départ :*";
    let lCenter = "🏥 *Centre souhaité :*";
    let lSessions = "🔢 *Nombre de séances :*";
    let lContact = "💬 *Moyen de contact préféré :*";
    let lNotes = "📝 *Informations complémentaires :*";

    if (currentLang === 'ar') {
      headerTitle = "🏥 *طلب غسيل كلى عطلات — عيادة بوسنة*";
      lFullName = "👤 *الاسم واللقب :*";
      lCountry = "🌍 *بلد الإقامة :*";
      lPhone = "📱 *الهاتف / واتساب :*";
      lCity = "📍 *مدينة الإقامة في الجزائر :*";
      lArrival = "📅 *تاريخ الوصول :*";
      lDeparture = "📅 *تاريخ المغادرة :*";
      lCenter = "🏥 *المركز المطلوب :*";
      lSessions = "🔢 *عدد الجلسات :*";
      lContact = "💬 *طريقة التواصل المفضلة :*";
      lNotes = "📝 *معلومات إضافية :*";
    } else if (currentLang === 'en') {
      headerTitle = "🏥 *Holiday Dialysis Request — Boucenna Clinic*";
      lFullName = "👤 *Full Name :*";
      lCountry = "🌍 *Country of Residence :*";
      lPhone = "📱 *Phone / WhatsApp :*";
      lCity = "📍 *City in Algeria :*";
      lArrival = "📅 *Arrival Date :*";
      lDeparture = "📅 *Departure Date :*";
      lCenter = "🏥 *Selected Center :*";
      lSessions = "🔢 *Number of Sessions :*";
      lContact = "💬 *Preferred Contact :*";
      lNotes = "📝 *Additional Notes :*";
    }

    const lines = [
      headerTitle,
      "",
      `${lFullName} ${data.full_name}`,
      `${lCountry} ${data.country}`,
      `${lPhone} ${data.phone}`,
      `${lCity} ${data.stay_city}`,
      `${lArrival} ${data.arrival_date}`,
      `${lDeparture} ${data.departure_date}`,
      `${lCenter} ${data.center}`,
      `${lSessions} ${data.sessions_count || 'Non spécifié'}`,
      `${lContact} ${data.preferred_contact || 'WhatsApp'}`
    ];

    if (data.additional_notes && data.additional_notes.trim() !== '') {
      lines.push(`${lNotes} ${data.additional_notes.trim()}`);
    }

    const messageText = lines.join('\n');
    const whatsappUrl = `https://wa.me/213770313136?text=${encodeURIComponent(messageText)}`;

    if (successAlert) {
      successAlert.innerHTML = `
        <ion-icon name="logo-whatsapp" style="font-size: 2.4rem; color: #25d366; flex-shrink: 0;"></ion-icon>
        <div>
          <strong>${t.vac_form_alert_success_title || 'Votre demande est prête !'}</strong><br>
          ${t.vac_form_alert_success_desc || "WhatsApp va s'ouvrir avec votre message prérempli. Vérifiez les informations puis appuyez sur <strong>Envoyer</strong> pour transmettre votre demande à l'équipe Boucenna."}
        </div>
      `;
      successAlert.style.display = 'flex';
    }

    window.open(whatsappUrl, '_blank');
  });
}

/**
 * ==========================================================================
 * EXHAUSTIVE MULTILINGUAL TRANSLATION SYSTEM (FR / EN / AR)
 * ==========================================================================
 */
const i18nDictionary = {
  "fr": {
    "lang_name": "FR",
    "nav_home": "Accueil",
    "nav_centers": "Nos centres",
    "nav_team": "Notre équipe",
    "nav_transfer": "Changer de centre",
    "nav_cnas": "Informations CNAS",
    "nav_vacation": "Dialyse Vacances",
    "nav_contact": "Contact",
    "nav_contact_btn": "Nous contacter",
    "btn_espace_patient": "Espace patient",
    "drop_cherchell": "Centre Cherchell (Tipaza)",
    "drop_bouira": "Centre Bouira",
    "drop_ain_oulmene": "Centre Aïn Oulmène (Sétif)",
    "nav_presentation": "Présentation",
    "drop_about": "À Propos",
    "drop_depts": "Nos Départements",
    "drop_advice": "Guide & Conseils",
    "nav_about": "À Propos",
    "nav_depts": "Départements",
    "nav_advice": "Conseils",
    "hero_title_home": "Réseau de centres<br><span>d'hémodialyse Boucenna</span>",
    "hero_sub_home": "Un réseau de centres de qualité, humain et innovant à votre service à Cherchell, Bouira et Aïn Oulmène.",
    "btn_discover_centers": "Découvrir nos centres",
    "btn_vacation_cta": "Dialyse Vacances en Algérie",
    "home_c1_title": "Aïn Oulmène",
    "home_c1_sub": "Sétif et sud de Sétif",
    "home_c2_title": "Bouira",
    "home_c2_sub": "Bouira et environs",
    "home_c3_title": "Cherchell",
    "home_c3_sub": "Tipaza / Littoral",
    "btn_discover": "Découvrir",
    "badge_video_immersion": "Immersion en vidéo",
    "title_videos_section": "Découvrez nos <span>centres en vidéo</span>",
    "sub_videos_section": "Visionnez les vidéos réelles filmées au sein de nos cliniques à Cherchell et Bouira.",
    "video_c1_title": "Centre de Cherchell (Tipaza)",
    "video_c1_desc": "Découvrez nos installations modernes, notre vue sur la mer et nos générateurs de pointe.",
    "video_c2_title": "Centre de Bouira",
    "video_c2_desc": "Visitez le centre de Bouira, son accueil chaleureux et son plateau technique complet.",
    "video_card1_title": "Clinique Boucenna Cherchell",
    "video_card1_desc": "Cadre maritime et salles d'hémodialyse haute technologie.",
    "video_card2_title": "Clinique Boucenna Bouira",
    "video_card2_desc": "Installations de pointe et accueil personnalisé au centre de Bouira.",
    "title_testimonials": "L'expérience de <span>nos patients</span>",
    "sub_testimonials": "Découvrez les retours en vidéo et les témoignages de nos patients pris en charge dans nos centres.",
    "testi_1_text": "Je remercie le centre Boucenna Cherchell. Il y a une équipe très professionnelle et à l'écoute des patients.",
    "testi_1_author": "M. A.",
    "testi_1_city": "Cherchell",
    "testi_2_text": "Le cadre est très moderne, propre et bien équipé. Le personnel est très humain. Merci pour votre soutien.",
    "testi_2_author": "F. K.",
    "testi_2_city": "Bouira",
    "testi_3_text": "Grâce à Boucenna Cherchell, j'ai bien continué ma dialyse pendant mon séjour en Algérie. Je recommande ce centre.",
    "testi_3_author": "R. B.",
    "testi_3_city": "Cherchell",
    "testi_1_quote": "Je remercie le centre Boucenna Cherchell. Il y a une équipe très professionnelle et à l'écoute des patients.",
    "testi_2_quote": "Le cadre est très moderne, propre et bien équipé. Le personnel est très humain. Merci pour votre soutien.",
    "testi_3_quote": "Grâce à Boucenna Cherchell, j'ai bien continué ma dialyse pendant mon séjour en Algérie. Je recommande ce centre.",
    "badge_boucenna_network": "Réseau Boucenna",
    "hero_title_vacances": "Dialyse Vacances<br><span>en Algérie</span>",
    "hero_sub_vacances": "Organisez vos séances de dialyse avant votre arrivée dans l'un de nos trois centres.",
    "btn_organize_sessions": "Organiser mes séances",
    "btn_call": "Appeler",
    "btn_whatsapp": "WhatsApp",
    "btn_choose_center": "Choisir ce centre",
    "prop_quality_care": "Soins de qualité",
    "prop_quality_care_desc": "Prise en charge par des équipes médicales expérimentées.",
    "prop_peaceful_trip": "Voyage en toute sérénité",
    "prop_peaceful_trip_desc": "Nous organisons vos séances selon votre planning.",
    "prop_dedicated_help": "Assistance dédiée",
    "prop_dedicated_help_desc": "Notre équipe est à votre écoute avant, pendant et après votre séjour.",
    "badge_our_centers": "Nos centres",
    "title_discover_centers": "Découvrez nos<br>centres de dialyse",
    "sub_discover_centers": "Le Réseau Boucenna vous accueille dans 3 centres de dialyse modernes et confortables.",
    "pin_3centers": "3 centres à votre service en Algérie",
    "cherchell_desc": "Un cadre apaisant en bord de mer, équipé des dernières technologies pour votre confort et votre sécurité.",
    "bouira_desc": "Un centre moderne au cœur de Bouira, pensé pour vous offrir des soins de qualité dans un environnement serein.",
    "ain_oulmene_desc": "Des installations de haut standing et une équipe dédiée à votre bien-être, proche de chez vous.",
    "btn_view_details": "Voir les détails →",
    "prop_safety": "Qualité & Sécurité",
    "prop_safety_desc": "Des protocoles stricts et du matériel de pointe pour votre sécurité.",
    "prop_devoted_team": "Équipe dévouée",
    "prop_devoted_team_desc": "Des professionnels expérimentés à votre écoute à chaque séance.",
    "prop_optimal_comfort": "Confort optimal",
    "prop_optimal_comfort_desc": "Des espaces modernes et chaleureux pensés pour votre bien-être.",
    "prop_proximity": "Proximité & Accessibilité",
    "prop_proximity_desc": "Trois centres idéalement situés pour vous simplifier le quotidien.",
    "badge_why_us": "Pourquoi nous choisir",
    "title_why_boucenna": "Pourquoi choisir<br><span>Boucenna ?</span>",
    "sub_why_boucenna": "Notre mission est de vous offrir une prise en charge de qualité, en toute sécurité et en toute sérénité, où que vous soyez en Algérie.",
    "why_1_title": "Équipe expérimentée",
    "why_1_desc": "Des néphrologues et infirmiers spécialisés, à votre écoute, pour vous offrir les meilleurs soins.",
    "why_2_title": "Centres modernes",
    "why_2_desc": "Des centres de dialyse équipés des dernières technologies, conformes aux normes internationales.",
    "why_3_title": "Accompagnement personnalisé",
    "why_3_desc": "Un suivi adapté à vos besoins et à votre état de santé, avec une attention particulière à chaque patient.",
    "why_4_title": "Prise en charge organisée",
    "why_4_desc": "Nous planifions et coordonnons vos séances pour un séjour médical sans stress.",
    "why_5_title": "Confort pendant les séances",
    "why_5_desc": "Un environnement propre, confortable et sécurisé pour votre bien-être tout au long de vos traitements.",
    "why_6_title": "Assistance avant votre arrivée",
    "why_6_desc": "Notre équipe vous accompagne à distance pour préparer votre séjour en toute sérénité.",
    "priority_health_title": "Votre santé, notre priorité",
    "priority_health_desc": "Avec Boucenna, vous bénéficiez d'un réseau de confiance engagé à vos côtés pour des soins de qualité, où que vous soyez.",
    "title_4steps": "Votre parcours<br><span>de dialyse en 4 étapes</span>",
    "sub_4steps": "We accompany you at each stage to organize your dialysis sessions in all serenity.",
    "step1_title": "1. Envoyez vos dates de séjour",
    "step1_desc": "Indiquez vos dates de séjour, la destination souhaitée et vos coordonnées via notre formulaire ou par téléphone.",
    "step2_title": "2. Vérification des disponibilités",
    "step2_desc": "Nous recherchons le centre Boucenna le plus proche de votre lieu de séjour et vérifions les créneaux disponibles.",
    "step3_title": "3. Votre dossier est étudié",
    "step3_desc": "Nous analysons votre dossier médical en toute confidentialité pour garantir la continuité et la sécurité de vos soins.",
    "step4_title": "4. Confirmation de vos séances",
    "step4_desc": "Une confirmation vous est envoyée avec toutes les informations pratiques pour le bon déroulement de vos séances.",
    "steps_banner_title": "Un accompagnement humain et réactif",
    "steps_banner_desc": "Notre équipe dédiée est à votre écoute avant, pendant et après votre séjour. Votre tranquillité d'esprit est notre priorité.",
    "form_title": "Préparez votre séjour de dialyse",
    "form_subtitle": "Remplissez ce formulaire et notre équipe vous accompagnera pour organiser un séjour de dialyse sûr, confortable et adapté à vos besoins.",
    "form_name_label": "Nom et prénom *",
    "form_country_label": "Pays de résidence *",
    "form_phone_label": "Téléphone / WhatsApp *",
    "form_city_label": "Ville de séjour en Algérie *",
    "form_arrival_label": "Date d'arrivée *",
    "form_departure_label": "Date de départ *",
    "form_center_label": "Centre souhaité *",
    "form_sessions_label": "Nombre approximatif de séances *",
    "form_contact_pref_label": "Moyen de contact préféré *",
    "form_notes_label": "Informations complémentaires (facultatif)",
    "form_security_text": "Vos informations sont confidentielles et utilisées uniquement pour préparer votre séjour.",
    "form_btn_submit": "Envoyer ma demande via WhatsApp",
    "title_faq": "Questions fréquentes<br><span>sur la dialyse en voyage</span>",
    "sub_faq": "Retrouvez les réponses aux questions les plus courantes pour organiser votre prise en charge en dialyse lors de vos déplacements en toute sérénité.",
    "faq_q1": "Comment réserver mes séances de dialyse avant mon voyage ?",
    "faq_a1": "Il vous suffit de remplir notre formulaire de séjour en ligne ou de nous contacter sur WhatsApp avec vos dates et votre centre de choix. Nous vérifions les disponibilités et réservons vos créneaux.",
    "faq_q2": "Quels documents médicaux dois-je apporter ?",
    "faq_a2": "Nous vous demanderons votre dernière prescription de dialyse, un compte-rendu médical récent et vos dernières sérologies à jour.",
    "faq_q3": "Les soins sont-ils pris en charge par la CNAS ?",
    "faq_a3": "Oui, la prise en charge est assurée à 100% dans le cadre de la convention CNAS.",
    "faq_q4": "Proposez-vous un service de transport sanitaire ?",
    "faq_a4": "Oui, notre service de transport sanitaire adapté peut vous prendre en charge entre votre lieu de résidence et le centre de dialyse.",
    "faq_q5": "Comment contacter l'équipe médicale en cas de besoin ?",
    "faq_a5": "Notre équipe est joignable 24h/24 et 7j/7 par téléphone et WhatsApp pour répondre à toute urgence ou question pratique.",
    "faq_side_title": "Besoin d'aide personnalisée ?",
    "faq_side_desc": "Notre équipe est à votre écoute pour répondre à toutes vos questions et vous accompagner dans l'organisation de votre dialyse en voyage.",
    "faq_btn_whatsapp": "Nous contacter sur WhatsApp",
    "faq_btn_call": "Nous appeler",
    "title_help_box": "Besoin d'aide ?<br><span>Notre équipe est à votre écoute</span>",
    "sub_help_box": "Vous venez de l'étranger et vous avez besoin d'organiser vos séances de dialyse avant votre voyage en Algérie ? Notre équipe Boucenna vous accompagne à chaque étape.",
    "btn_write_us": "Nous écrire",
    "title_team": "Notre équipe <span>médicale</span>",
    "sub_team": "Nos médecins et notre personnel soignant sont engagés à vous offrir des soins de qualité et une prise en charge humaine.",
    "tab_nephro": "Néphrologue",
    "tab_paramedical": "Équipe paramédicale",
    "doctor_title": "Néphrologue & Directeur Médical",
    "doc_b1": "Spécialiste en néphrologie & hémodialyse",
    "doc_b2": "Suivi personnalisé et adaptation des protocoles",
    "doc_b3": "Approche humaine et bienveillante",
    "doc_b4": "Supervision médicale continue des 3 centres",
    "btn_appointment": "Prendre rendez-vous",
    "team_nursing_title": "Équipe soignante & paramédicale",
    "team_nursing_desc": "Des infirmiers diplômés et techniciens chevronnés dédiés à votre prise en charge au quotidien dans chacun de nos 3 centres.",
    "team_c1_role": "Équipe de soins",
    "team_c1_title": "Infirmiers Spécialisés",
    "team_c1_desc": "Branchement sécurisé, surveillance continue des paramètres hémodynamiques et écoute active.",
    "team_c2_role": "Pôle Littoral",
    "team_c2_title": "Équipe de Cherchell",
    "team_c2_desc": "Personnel soignant bilingue formé aux urgences néphrologiques et à l'accueil des vacanciers.",
    "team_c3_role": "Suivi en direct",
    "team_c3_title": "Surveillance Hémodialyse",
    "team_c3_desc": "Contrôle strict des générateurs, stérilisation et confort pendant toute la durée du traitement.",
    "cherchell_hero_title": "Centre d'Hémodialyse<br><span>Boucenna – Cherchell</span>",
    "cherchell_hero_sub": "Un centre moderne et performant dédié à votre bien-être, avec une équipe médicale expérimentée.",
    "bouira_hero_title": "Centre d'Hémodialyse<br><span>Boucenna – Bouira</span>",
    "bouira_hero_sub": "Un centre moderne au cœur de Bouira, pensé pour vous offrir des soins de qualité dans un environnement serein.",
    "ain_oulmene_hero_title": "Centre d'Hémodialyse<br><span>Boucenna – Aïn Oulmène</span>",
    "ain_oulmene_hero_sub": "Des installations de haut standing, pharmacie spécialisée et transport médicalisé à votre service à Sétif.",
    "pill_team": "Équipe expérimentée",
    "pill_tech": "Matériel de pointe",
    "pill_hygiene": "Hygiène et sécurité",
    "pill_care": "Prise en charge personnalisée",
    "btn_call_center": "Appeler le centre",
    "btn_itineraire": "Itinéraire",
    "why_cherchell_title": "Pourquoi choisir<br><span>Boucenna Cherchell ?</span>",
    "why_bouira_title": "Pourquoi choisir<br><span>Boucenna Bouira ?</span>",
    "why_ain_oulmene_title": "Pourquoi choisir<br><span>Boucenna Aïn Oulmène ?</span>",
    "gallery_title": "Galerie photos",
    "gallery_sub": "Découvrez notre centre à travers quelques images.",
    "transfer_title": "Comment se passe<br><span>un changement de centre ?</span>",
    "transfer_sub": "Notre équipe vous accompagne à chaque étape pour faciliter vos démarches.",
    "t_step1_title": "1. Contactez-nous",
    "t_step1_desc": "Par téléphone ou WhatsApp pour nous faire part de votre demande.",
    "t_step2_title": "2. Vérification des disponibilités",
    "t_step2_desc": "Nous vérifions les créneaux dans le centre souhaité.",
    "t_step3_title": "3. Envoi de l'offre",
    "t_step3_desc": "Nous vous envoyons les informations et les documents nécessaires.",
    "t_step4_title": "4. Dossier accepté",
    "t_step4_desc": "Le centre confirme la prise en charge et la date de transfert.",
    "t_step5_title": "5. Nouveau suivi personnalisé",
    "t_step5_desc": "Vous commencez votre traitement dans votre nouveau centre en toute sérénité.",
    "transfer_banner_title": "Vous êtes déjà dialysé dans un autre centre ?",
    "transfer_banner_desc": "Nous vous accompagnons dans le transfert en toute sécurité et avec une coordination complète.",
    "cnas_title": "Prise en charge <span>CNAS</span>",
    "cnas_sub": "La prise en charge est assurée à 100% dans le cadre conventionné de la CNAS. Nous faisons toutes les démarches à votre place.",
    "cnas_card1_title": "Démarches simplifiées",
    "cnas_card1_desc": "Nous vous aidons dans toutes les formalités avec la CNAS et les caisses d'assurance.",
    "cnas_card2_title": "Prise en charge à 100 %",
    "cnas_card2_desc": "Selon les conditions d'éligibilité et la réglementation en vigueur, sans avance de frais.",
    "cnas_card3_title": "Transport sanitaire conventionné",
    "cnas_card3_desc": "Nous mettons à votre disposition notre service de transport médicalisé (VSL et ambulances).",
    "cnas_btn": "Nous contacter pour plus d'informations",
    "contact_page_title": "Contactez-<span>nous</span>",
    "contact_page_sub": "Notre équipe est à votre écoute pour répondre à toutes vos questions.",
    "label_phone": "Téléphone",
    "label_whatsapp": "WhatsApp",
    "label_address": "Adresse",
    "label_hours": "Horaires",
    "contact_address_val": "Cité Kaaboub Coopérative Immobilière Essalam Section 105/Lot N°151 Sétif, Algérie",
    "contact_hours_val": "Tous les jours – 24h/24",
    "btn_send_msg": "Envoyer le message",
    "footer_tagline": "Vos soins rénaux, notre priorité.<br>Transport sanitaire, consultations et pharmacie.",
    "footer_maps_link": "Itinéraire Google Maps",
    "footer_copyright": "© 2025 Clinique Dialyse Boucenna — Tous droits réservés.",
    "footer_legal": "Mentions légales",
    "footer_privacy": "Confidentialité",
    "footer_sitemap": "Plan du site",
    "footer_c2_title": "Boucenna Cherchell",
    "footer_c2_address": "Cité Zitouni El Kheir<br>Cherchell, Tipaza",
    "footer_c3_title": "Boucenna Bouira",
    "footer_c3_address": "Cité 2000 Logements<br>Bouira",
    "footer_c4_title": "Boucenna Aïn Oulmène",
    "footer_c4_address": "Aïn Oulmène, Sétif<br>(Plateau & Pharmacie)",
    "whatsapp_tooltip": "Besoin d'aide ? Écrivez-nous",
    "about_badge": "À Propos",
    "about_hero_title": "Une expertise médicale<br><span>à votre service</span>",
    "about_hero_sub": "Le Réseau Boucenna, leader en hémodialyse en Algérie, s'engage à vous offrir des soins de qualité, humains et innovants.",
    "about_section1_badge": "Notre réseau",
    "about_section1_title": "Leader de l'Assistance<br><span>Médicale en Algérie</span>",
    "about_section1_p1": "Le Réseau Boucenna s'est imposé comme l'un des leaders de l'hémodialyse en Algérie, grâce à une équipe de professionnels aguerris et des moyens matériels de premier plan pour offrir les meilleures conditions de prise en charge.",
    "about_section1_p2": "Notre réseau comprend aujourd'hui un néphrologue spécialiste, des médecins généralistes et une équipe de soins infirmiers dédiée dans nos 3 centres de Cherchell, Bouira et Aïn Oulmène.",
    "about_doctor_badge": "Direction Médicale",
    "about_doctor_title": "Dr Nassim Boucenna",
    "about_doctor_sub": "Fondateur &amp; Leader en santé et innovation médicale.",
    "about_doctor_b1": "Fort de plus de 12 ans d'expérience dans le secteur de la santé, il pilote un réseau de cliniques spécialisées en hémodialyse, une entreprise de transport médical et une officine.",
    "about_doctor_b2": "DPharm et MSc en Biochimie, il mène des projets alliant biologie moléculaire et intégration de l'intelligence artificielle pour optimiser les soins médicaux.",
    "about_doctor_b3": "Passionné par l'innovation et l'amélioration du bien-être des patients, il conçoit et déploie des solutions de santé avancées.",
    "about_commit_badge": "Nos engagements",
    "about_commit_title": "Pourquoi choisir<br><span>Boucenna ?</span>",
    "about_transport_title": "Transport sanitaire",
    "about_transport_desc": "Disponibilité 24h/24 et 7j/7 avec ambulances et VSL équipées pour votre confort et sécurité.",
    "about_cta_title": "Vous souhaitez en savoir plus ?",
    "about_cta_sub": "Notre équipe est disponible pour répondre à toutes vos questions.",
    "advice_badge": "Guide pratique",
    "advice_hero_title": "Conseils & Guide<br><span>pour Patients en Dialyse</span>",
    "advice_hero_sub": "Toutes les informations essentielles sur la prise en charge, les documents nécessaires et les conseils pratiques pour votre quotidien en dialyse.",
    "advice_tab_coverage": "Prise en charge",
    "advice_tab_docs": "Documents",
    "advice_tab_transport": "Transport",
    "advice_tab_fistula": "Fistule",
    "advice_tab_nutrition": "Nutrition",
    "advice_coverage_title": "Prise en charge financière",
    "advice_coverage_p": "L'insuffisance rénale chronique terminale est prise en charge à 100% par la sécurité sociale (CNAS / CASNOS). Les séances d'hémodialyse, les médicaments liés au traitement et le transport sanitaire sont couverts dans le cadre de la convention.",
    "advice_docs_title": "Documents à présenter",
    "advice_docs_tourists_title": "Vacanciers (étrangers/locaux)",
    "advice_docs_t1": "Protocole de dialyse / Fiche de liaison",
    "advice_docs_t2": "Bilan récent (Sérologie)",
    "advice_docs_t3": "Compte rendu médical récent",
    "advice_cnas_1": "Ouverture de droit originale et récente",
    "advice_cnas_2": "Bilan récent (Sérologie)",
    "advice_cnas_3": "Carte de groupage sanguin",
    "advice_cnas_4": "Dossier médical et/ou fiche de liaison",
    "advice_cnas_5": "02 photos d'identité",
    "advice_cnas_6": "01 certificat de résidence",
    "advice_casnos_1": "Prise en charge CASNOS valide",
    "advice_casnos_2": "Bilan récent (Sérologie)",
    "advice_casnos_3": "Carte de groupage sanguin",
    "advice_casnos_4": "Dossier médical et/ou fiche de liaison",
    "advice_casnos_5": "02 photos d'identité",
    "advice_casnos_6": "01 certificat de résidence",
    "advice_cnas_title": "CNAS (Sécurité Sociale)",
    "advice_casnos_title": "CASNOS (Non-Salariés)",
    "advice_transport_title": "Transport sanitaire",
    "advice_transport_p1": "Le Réseau Boucenna met à votre disposition son service de transport sanitaire avec des ambulances médicalisées et des Véhicules Sanitaires Légers (VSL).",
    "advice_transport_p2": "Nos chauffeurs sont disponibles 24h/24 et 7j/7 pour vous prendre en charge entre votre domicile et le centre de dialyse, en toute sécurité et confort.",
    "advice_fistula_title": "Conseils sur la Fistule",
    "advice_fistula_1": "Une fistule artério-veineuse doit être créée avant le début de l'hémodialyse pour assurer un accès vasculaire de qualité.",
    "advice_fistula_2": "Surveillez quotidiennement son bon fonctionnement en ressentant les vibrations caractéristiques.",
    "advice_fistula_3": "Évitez le port de montres, bracelets, bijoux ou de tout pansement trop serré.",
    "advice_fistula_4": "Protégez-la lors d'activités physiques et ne dormez pas sur ce bras.",
    "advice_fistula_5": "N'utilisez jamais de produits ou crèmes sur la fistule sans avis médical préalable.",
    "advice_nutrition_title": "Alimentation & Nutrition",
    "advice_nutrition_1": "Une alimentation équilibrée et adaptée est essentielle pour les patients en hémodialyse.",
    "advice_nutrition_2": "La prise de poids entre deux séances ne doit pas dépasser 5% du poids du corps.",
    "advice_nutrition_3": "Contrôlez vos apports en sel, potassium et phosphore selon les recommandations de votre médecin.",
    "advice_nutrition_4": "Limitez les aliments riches en potassium : bananes, chocolat, légumes secs, potages concentrés, fruits secs.",
    "dept_badge": "Nos départements",
    "dept_hero_title": "Départements Médicaux <span>d'Hémodialyse</span>",
    "dept_hero_sub": "Hémodialyse, consultations de néphrologie, transport sanitaire médicalisé et pharmacie spécialisée — tout pour votre prise en charge complète.",
    "dept_hemo_badge": "Hémodialyse Haute Performance",
    "dept_hemo_title": "Séances<br><span>d'Hémodialyse</span>",
    "dept_hemo_p1": "Nos centres d'hémodialyse disposent de plusieurs postes de dialyse équipés des dernières générations de générateurs, disponibles du dimanche au jeudi.",
    "dept_hemo_p2": "Chaque séance est supervisée par une équipe médicale et paramédicale expérimentée, dans un environnement stérile et confortable.",
    "dept_hemo_f1": "Générateurs de dialyse de dernière génération",
    "dept_hemo_f2": "Protocoles de stérilisation stricts",
    "dept_hemo_f3": "Surveillance médicale continue",
    "dept_hemo_f4": "Prise en charge CNAS / CASNOS à 100%",
    "dept_nephro_badge": "Néphrologie Clinique",
    "dept_nephro_title": "Consultations de<br><span>Néphrologie</span>",
    "dept_nephro_p": "Les consultations de néphrologie sont assurées par le Dr Nassim Boucenna, spécialiste en maladies rénales et hémodialyse, accompagné de médecins généralistes expérimentés.",
    "dept_nephro_f1": "Suivi de l'insuffisance rénale chronique",
    "dept_nephro_f2": "Adaptation des protocoles de dialyse",
    "dept_nephro_f3": "Suivi personnalisé et bilan biologique",
    "dept_nephro_f4": "Gestion des complications rénales",
    "dept_transport_badge": "Transport Sanitaire 24h/24 – 7j/7",
    "dept_transport_title": "Transport Sanitaire<br><span>24h/24 – 7j/7</span>",
    "dept_transport_p": "Notre service de transport médicalisé assure la prise en charge et le transport des patients entre leur domicile et le centre de dialyse, ainsi qu'entre les wilayates.",
    "dept_transport_f1": "Ambulances médicalisées équipées",
    "dept_transport_f2": "VSL (Véhicules Sanitaires Légers)",
    "dept_transport_f3": "Transport inter-wilayates",
    "dept_transport_f4": "Chauffeurs disponibles 24h/24 et 7j/7",
    "dept_pharmacy_badge": "Département 4",
    "dept_pharmacy_title": "Pharmacie<br><span>Spécialisée</span>",
    "dept_pharmacy_p": "Notre pharmacie spécialisée est intégrée au centre d'Aïn Oulmène (Sétif) et assure l'approvisionnement en médicaments et consommables liés à l'hémodialyse et à la prise en charge rénale.",
    "dept_pharmacy_f1": "Médicaments et consommables pour dialyse",
    "dept_pharmacy_f2": "Suivi pharmaceutique personnalisé",
    "dept_pharmacy_f3": "Coordination avec l'équipe médicale",
    "label_phone_whatsapp": "Tél / WhatsApp :",
    "label_fullname": "Nom complet *",
    "label_phone_req": "Téléphone *",
    "label_email": "Email",
    "label_your_message": "Votre message *",
    "placeholder_name": "Ex. : Jean Dupont",
    "placeholder_phone": "+33 6 12 34 56 78",
    "placeholder_email": "email@domaine.com",
    "placeholder_message": "Écrivez votre message...",
    "why_chh_1_title": "Traitement avancé",
    "why_chh_1_desc": "Générateurs récents de dernière génération et traitement d'eau haute sécurité.",
    "why_chh_2_title": "Équipe expérimentée",
    "why_chh_2_desc": "Néphrologues et infirmiers chevronnés présents à chaque séance.",
    "why_chh_3_title": "Hébergement",
    "why_chh_3_desc": "Assistance pour vos séjours de vacances et hébergements à proximité de la mer.",
    "why_chh_4_title": "Environnement agréable",
    "why_chh_4_desc": "Un cadre serein et apaisant sur la côte méditerranéenne de Tipaza.",
    "gallery_chh_title": "Galerie photos – <span>Boucenna Cherchell</span>",
    "gallery_chh_sub": "Découvrez notre centre à travers quelques images.",
    "why_bouira_1_title": "Emplacement central",
    "why_bouira_1_desc": "Idéalement situé à la Cité 2000 Logements, facile d'accès depuis toute la wilaya.",
    "why_bouira_2_title": "Néphrologie dédiée",
    "why_bouira_2_desc": "Consultations régulières et ajustement rigoureux des protocoles de dialyse.",
    "why_bouira_3_title": "Confort & Sérénité",
    "why_bouira_3_desc": "Salles climatisées, fauteuils grand confort et collations soignées.",
    "why_bouira_4_title": "Conventionné CNAS",
    "why_bouira_4_desc": "Prise en charge à 100% sans avance de frais pour tous les assurés sociaux.",
    "gallery_bouira_title": "Galerie photos – <span>Boucenna Bouira</span>",
    "gallery_bouira_sub": "Découvrez les installations de notre centre de Bouira.",
    "why_ao_1_title": "Transport dédié",
    "why_ao_1_desc": "Flotte d'ambulances et véhicules sanitaires pour vos trajets domicile-clinique.",
    "why_ao_2_title": "Pharmacie affiliée",
    "why_ao_2_desc": "Disponibilité immédiate de l'ensemble de vos traitements et médicaments néphrologiques.",
    "why_ao_3_title": "Équipe chevronnée",
    "why_ao_3_desc": "Sous la direction médicale du Dr Nassim Boucenna, néphrologue d'expérience.",
    "why_ao_4_title": "Sécurité totale",
    "why_ao_4_desc": "Stérilisation stricte, salle de traitement d'eau bi-osmose inversée.",
    "gallery_ao_title": "Galerie photos – <span>Boucenna Aïn Oulmène</span>",
    "gallery_ao_sub": "Découvrez nos installations, nos générateurs et notre pharmacie à Sétif.",
    "team_nursing_badge": "Personnel & Soins en action",
    "team_nursing_title_full": "Une équipe soignante <span>au cœur de vos soins</span>",
    "team_nursing_sub": "Présents à chaque séance d'hémodialyse pour garantir votre sécurité, votre confort et votre bien-être.",
    "vac_commitment_badge": "Réseau Boucenna",
    "vac_commitment_title": "Notre engagement à vos côtés",
    "vac_commitment_sub": "Nous mettons tout en œuvre pour vous offrir une prise en charge de qualité, où que vous soyez.",
    "vac_c1_title": "Écoute & bienveillance",
    "vac_c2_title": "Qualité & sécurité",
    "vac_c3_title": "Accompagnement personnalisé",
    "vac_side_avail": "Notre équipe patient est disponible",
    "badge_faq": "FAQ",
    "card_cherchell_title": "Cherchell – Tipaza",
    "card_bouira_title": "Bouira",
    "card_ain_oulmene_title": "Aïn Oulmène – Sétif",
    "placeholder_stay_city": "Ex. : Cherchell, Bouira, Sétif...",
    "placeholder_sessions": "Ex. : 6, 12, 18...",
    "placeholder_notes": "Précisez vos besoins particuliers, préférences d'hébergement...",
    "opt_select_country": "Sélectionnez votre pays",
    "opt_france": "France",
    "opt_algeria": "Algérie (inter-wilaya)",
    "opt_canada": "Canada",
    "opt_belgium": "Belgique",
    "opt_switzerland": "Suisse",
    "opt_other": "Autre",
    "opt_choose_center": "Choisir un centre",
    "opt_cherchell": "Cherchell (Tipaza)",
    "opt_bouira": "Bouira",
    "opt_ain_oulmene": "Aïn Oulmène (Sétif)",
    "opt_whatsapp": "WhatsApp",
    "opt_phone": "Téléphone",
    "opt_email": "Email",
    "reassure_title": "Vous êtes entre de bonnes mains",
    "reassure_desc": "Notre équipe de coordonnateurs patients vous accompagne à chaque étape : planification des séances, accueil, transport et suivi médical personnalisé.",
    "reassure_1": "Prise en charge complète et sécurisée",
    "reassure_2": "Équipes médicales expérimentées",
    "reassure_3": "Centres modernes et confortables",
    "vac_side_hours": "du lundi au samedi de 8h à 18h.",
    "vac_side_here": "Nous sommes là pour vous.",
    "vac_hl1_title": "Accompagnement personnalisé",
    "vac_hl1_desc": "Un interlocuteur dédié pour organiser votre prise en charge.",
    "vac_hl2_title": "Organisation avant départ",
    "vac_hl2_desc": "Planifiez vos séances de dialyse à l'avance en toute sérénité.",
    "vac_hl3_title": "Soins de qualité et sécurité",
    "vac_hl3_desc": "Des centres modernes avec des équipes médicales expérimentées.",
    "vac_hl4_title": "Voyage en toute tranquillité",
    "vac_hl4_desc": "Profitez de votre séjour en Algérie, nous prenons soin de vous.",
    "center_ref_badge": "Centre de référence",
    "center_dialysis_badge": "Centre de dialyse",
    "pill_pharmacy": "Pharmacie affiliée",
    "pill_cnas": "100% CNAS / CASNOS",
    "badge_video_testimonials": "Témoignages vidéos réels",
    "video_testi_1_badge": "Patiente en hémodialyse",
    "video_testi_1_title": "Témoignage au Centre Boucenna",
    "video_testi_1_desc": "Retour d'expérience chaleureux sur la qualité des soins et l'attention du personnel soignant.",
    "video_testi_2_badge": "Patient régulier",
    "video_testi_2_title": "Prise en charge et confort",
    "video_testi_2_desc": "Témoignage sur le suivi médical rigoureux et l'accompagnement personnalisé.",
    "transfer_step_title": "Comment se déroule le changement de centre ?",
    "transfer_step1_title": "1. Contactez-nous",
    "transfer_step1_desc": "Par téléphone ou WhatsApp pour nous faire part de votre demande.",
    "transfer_step2_title": "2. Nous vérifions les disponibilités",
    "transfer_step2_desc": "Nous vérifions les créneaux dans le centre souhaité (Cherchell, Bouira, Aïn Oulmène).",
    "transfer_step3_title": "3. Nous vous envoyons votre offre",
    "transfer_step3_desc": "Nous vous transmettons les informations et les formalités nécessaires.",
    "transfer_step4_title": "4. Votre dossier est accepté",
    "transfer_step4_desc": "Le centre confirme la prise en charge et la date de transfert.",
    "transfer_step5_title": "5. Votre nouveau suivi personnalisé",
    "transfer_step5_desc": "Vous commencez votre traitement dans votre nouveau centre en toute sérénité.",
    "transfer_priority_title": "Vous êtes déjà dialysé dans un autre centre ?",
    "transfer_priority_desc": "Nous vous accompagnons dans le transfert en toute sécurité et avec une coordination complète.",
    "team_hero_badge": "Direction Médicale",
    "dr_boucenna_role": "Spécialiste en néphrologie & hémodialyse",
    "team_section_title": "Nos équipes <span>au cœur de vos soins</span>",
    "team_section_sub": "Présents à chaque séance d'hémodialyse pour garantir votre sécurité, votre confort et votre bien-être.",
    "team_card1_badge": "Équipe de soins",
    "team_card1_title": "Infirmiers Spécialisés",
    "team_card1_desc": "Branchement sécurisé, surveillance continue des paramètres hémodynamiques et écoute active.",
    "team_card2_badge": "Pôle Littoral",
    "team_card2_title": "Équipe de Cherchell",
    "team_card2_desc": "Personnel soignant bilingue formé aux urgences néphrologiques et à l'accueil des vacanciers.",
    "team_card3_badge": "Suivi en direct",
    "team_card3_title": "Surveillance Hémodialyse",
    "team_card3_desc": "Contrôle strict des générateurs, stérilisation et confort pendant toute la durée du traitement.",
    "cnas_main_intro": "La prise en charge en dialyse est assurée dans le cadre de la CNAS. Nous faisons toutes les démarches à votre place.",
    "conseil_badge_hero": "Guide Santé Rénale",
    "conseil_hero_title": "Conseils et recommandations <span>pour Patients en Dialyse</span>",
    "conseil_cnas_highlight": "Prise en charge à 100% par la sécurité sociale (CNAS / CASNOS)",
    "conseil_emergency_highlight": "Assistance médicale disponible 24h/24 et 7j/7",
    "dept_hero_badge": "Nos Pôles de Soins",
    "dept_pharma_badge": "Pharmacie Spécialisée",
    "vac_form_alert_success_title": "Votre demande est prête !",
    "vac_form_alert_success_desc": "WhatsApp va s'ouvrir avec votre message prérempli. Vérifiez les informations puis appuyez sur <strong>Envoyer</strong> pour transmettre votre demande à l'équipe Boucenna.",
    "vac_form_error_required": "Veuillez renseigner tous les champs obligatoires (*).",
    "vac_form_error_dates": "La date de départ ne peut pas être antérieure à la date d'arrivée.",
    "contact_form_error_required": "Veuillez renseigner votre nom, téléphone et message."
  },
  "en": {
    "lang_name": "EN",
    "nav_home": "Home",
    "nav_centers": "Our Centers",
    "nav_team": "Our Team",
    "nav_transfer": "Change Center",
    "nav_cnas": "CNAS Coverage",
    "nav_vacation": "Holiday Dialysis",
    "nav_contact": "Contact",
    "nav_contact_btn": "Contact Us",
    "btn_espace_patient": "Patient Portal",
    "drop_cherchell": "Cherchell Center (Tipaza)",
    "drop_bouira": "Bouira Center",
    "drop_ain_oulmene": "Aïn Oulmène Center (Sétif)",
    "nav_presentation": "Presentation",
    "drop_about": "About Us",
    "drop_depts": "Our Departments",
    "drop_advice": "Guide & Advice",
    "nav_about": "About Us",
    "nav_depts": "Departments",
    "nav_advice": "Practical Advice",
    "hero_title_home": "Boucenna Hemodialysis<br><span>Centers Network</span>",
    "hero_sub_home": "A network of high-quality, caring and modern dialysis clinics serving you in Cherchell, Bouira and Aïn Oulmène.",
    "btn_discover_centers": "Discover Our Centers",
    "btn_vacation_cta": "Holiday Dialysis in Algeria",
    "home_c1_title": "Aïn Oulmène",
    "home_c1_sub": "Sétif and Southern Region",
    "home_c2_title": "Bouira",
    "home_c2_sub": "Bouira and Central Region",
    "home_c3_title": "Cherchell",
    "home_c3_sub": "Tipaza / Coastal Area",
    "btn_discover": "Discover",
    "badge_video_immersion": "Video Immersion",
    "title_videos_section": "Discover Our <span>Centers in Video</span>",
    "sub_videos_section": "Watch real videos filmed inside our modern clinics in Cherchell and Bouira.",
    "video_c1_title": "Cherchell Center (Tipaza)",
    "video_c1_desc": "Discover our seaside clinic, state-of-the-art dialysis stations and caring team.",
    "video_c2_title": "Bouira Center",
    "video_c2_desc": "Visit our Bouira clinic, its welcoming environment and full technical facilities.",
    "video_card1_title": "Boucenna Cherchell Clinic",
    "video_card1_desc": "Seaside setting and state-of-the-art dialysis stations.",
    "video_card2_title": "Boucenna Bouira Clinic",
    "video_card2_desc": "Cutting-edge equipment and personalized patient care in Bouira.",
    "title_testimonials": "Our Patients' <span>Experience</span>",
    "sub_testimonials": "Discover real video feedback and testimonials from patients cared for in our centers.",
    "testi_1_text": "I sincerely thank the Boucenna Cherchell clinic. Highly professional team attentive to patients' needs.",
    "testi_1_author": "M. A.",
    "testi_1_city": "Cherchell",
    "testi_2_text": "Very modern, clean and perfectly equipped clinic. Outstanding medical staff. Thank you for your care.",
    "testi_2_author": "F. K.",
    "testi_2_city": "Bouira",
    "testi_3_text": "Thanks to Boucenna Cherchell, I continued my dialysis smoothly during my holidays in Algeria. Highly recommended.",
    "testi_3_author": "R. B.",
    "testi_3_city": "Cherchell",
    "testi_1_quote": "I sincerely thank the Boucenna Cherchell clinic. Highly professional team attentive to patients' needs.",
    "testi_2_quote": "Very modern, clean and perfectly equipped clinic. Outstanding medical staff. Thank you for your care.",
    "testi_3_quote": "Thanks to Boucenna Cherchell, I continued my dialysis smoothly during my holidays in Algeria. Highly recommended.",
    "badge_boucenna_network": "Boucenna Network",
    "hero_title_vacances": "Holiday Dialysis<br><span>in Algeria</span>",
    "hero_sub_vacances": "Organize your dialysis sessions in advance before your stay in one of our three modern centers.",
    "btn_organize_sessions": "Book My Sessions",
    "btn_call": "Call Us",
    "btn_whatsapp": "WhatsApp",
    "btn_choose_center": "Choose this center",
    "prop_quality_care": "High-Quality Care",
    "prop_quality_care_desc": "Treated by experienced and specialized medical teams.",
    "prop_peaceful_trip": "Peace of Mind Travel",
    "prop_peaceful_trip_desc": "We coordinate your sessions around your holiday schedule.",
    "prop_dedicated_help": "Dedicated Support",
    "prop_dedicated_help_desc": "Our patient care team is at your service before, during and after your stay.",
    "badge_our_centers": "Our Centers",
    "title_discover_centers": "Discover Our<br>Dialysis Centers",
    "sub_discover_centers": "Boucenna Network welcomes you in 3 comfortable and state-of-the-art dialysis clinics.",
    "pin_3centers": "3 centers serving you in Algeria",
    "cherchell_desc": "A peaceful seaside setting, equipped with the latest medical technologies for your safety and comfort.",
    "bouira_desc": "A modern clinic in the heart of Bouira, offering premier nephrology care in a serene setting.",
    "ain_oulmene_desc": "High-end facilities and a devoted medical team, close to home in the Sétif region.",
    "btn_view_details": "View Details →",
    "prop_safety": "Quality & Safety",
    "prop_safety_desc": "Strict medical hygiene protocols and cutting-edge dialyzers.",
    "prop_devoted_team": "Devoted Team",
    "prop_devoted_team_desc": "Seasoned medical professionals attentive at every session.",
    "prop_optimal_comfort": "Optimal Comfort",
    "prop_optimal_comfort_desc": "Modern and welcoming air-conditioned spaces designed for your well-being.",
    "prop_proximity": "Proximity & Access",
    "prop_proximity_desc": "Three ideally located clinics with dedicated medical transport.",
    "badge_why_us": "Why Choose Us",
    "title_why_boucenna": "Why Choose<br><span>Boucenna?</span>",
    "sub_why_boucenna": "Our mission is to provide you with top-quality, secure and reassuring care wherever you travel in Algeria.",
    "why_1_title": "Experienced Team",
    "why_1_desc": "Specialized nephrologists and nurses attentive to offering you the finest care.",
    "why_2_title": "Modern Clinics",
    "why_2_desc": "Dialysis centers equipped with cutting-edge technology compliant with international standards.",
    "why_3_title": "Personalized Support",
    "why_3_desc": "Care tailored to your medical history and specific health needs.",
    "why_4_title": "Seamless Coordination",
    "why_4_desc": "We schedule and coordinate your sessions for a stress-free medical stay.",
    "why_5_title": "Comfort During Sessions",
    "why_5_desc": "Clean, comfortable and secure environments ensuring your well-being throughout treatment.",
    "why_6_title": "Pre-Arrival Assistance",
    "why_6_desc": "Our coordinator assists you remotely to prepare your journey with complete confidence.",
    "priority_health_title": "Your Health, Our Priority",
    "priority_health_desc": "With Boucenna, you rely on a trusted healthcare network committed to high-standard care across Algeria.",
    "title_4steps": "Your Dialysis Journey<br><span>in 4 Simple Steps</span>",
    "sub_4steps": "We assist you at every step to organize your dialysis appointments with total peace of mind.",
    "step1_title": "1. Send Your Travel Dates",
    "step1_desc": "Submit your travel dates, preferred Algerian destination and contact details via our form or phone.",
    "step2_title": "2. Availability Check",
    "step2_desc": "We identify the closest Boucenna clinic to your stay and verify available session slots.",
    "step3_title": "3. Medical File Review",
    "step3_desc": "Our nephrology team reviews your medical prescription confidentially to ensure continuity of care.",
    "step4_title": "4. Session Confirmation",
    "step4_desc": "You receive a formal confirmation with full schedule details and clinic address.",
    "steps_banner_title": "Caring & Prompt Assistance",
    "steps_banner_desc": "Our dedicated team supports you before, during and after your stay. Your peace of mind is our priority.",
    "form_title": "Prepare Your Dialysis Stay",
    "form_subtitle": "Fill out this form and our coordination team will help you organize a safe, comfortable and personalized dialysis stay.",
    "form_name_label": "Full Name *",
    "form_country_label": "Country of Residence *",
    "form_phone_label": "Phone / WhatsApp *",
    "form_city_label": "Stay City in Algeria *",
    "form_arrival_label": "Arrival Date *",
    "form_departure_label": "Departure Date *",
    "form_center_label": "Preferred Center *",
    "form_sessions_label": "Approximate Number of Sessions *",
    "form_contact_pref_label": "Preferred Contact Method *",
    "form_notes_label": "Additional Notes (Optional)",
    "form_security_text": "Your information is confidential and used exclusively to arrange your dialysis stay.",
    "form_btn_submit": "Send My Request via WhatsApp",
    "title_faq": "Frequently Asked Questions<br><span>About Travel Dialysis</span>",
    "sub_faq": "Find answers to the most common questions regarding your dialysis arrangements when traveling in Algeria.",
    "faq_q1": "How can I book my dialysis sessions before traveling?",
    "faq_a1": "Simply fill out our online request form or contact us via WhatsApp with your travel dates and preferred center. We verify availability and book your slots.",
    "faq_q2": "What medical documents are required?",
    "faq_a2": "We require your latest dialysis prescription, recent medical summary and up-to-date serology results.",
    "faq_q3": "Are treatments covered by CNAS?",
    "faq_a3": "Yes, hemodialysis treatments are 100% covered under the official CNAS agreement.",
    "faq_q4": "Do you offer patient medical transport?",
    "faq_a4": "Yes, our specialized ambulance and patient transport vehicles pick you up between your accommodation and the dialysis clinic.",
    "faq_q5": "How can I reach the medical staff if needed?",
    "faq_a5": "Our patient coordination team is reachable 24/7 by phone and WhatsApp for any assistance.",
    "faq_side_title": "Need Custom Assistance?",
    "faq_side_desc": "Our team is available 7/7 to answer all your inquiries and help plan your holiday dialysis.",
    "faq_btn_whatsapp": "Contact Us on WhatsApp",
    "faq_btn_call": "Call Us Now",
    "title_help_box": "Need Help?<br><span>Our Team Is At Your Service</span>",
    "sub_help_box": "Coming from abroad and need to plan your dialysis sessions before traveling to Algeria? The Boucenna team supports you every step of the way.",
    "btn_write_us": "Write to Us",
    "title_team": "Our <span>Medical Team</span>",
    "sub_team": "Our nephrologists and healthcare staff are dedicated to delivering exceptional care with a deeply human approach.",
    "tab_nephro": "Nephrologist",
    "tab_paramedical": "Nursing Staff",
    "doctor_title": "Nephrologist & Medical Director",
    "doc_b1": "Specialist in Nephrology & Hemodialysis",
    "doc_b2": "Tailored Patient Care & Treatment Optimization",
    "doc_b3": "Compassionate, Patient-Centered Approach",
    "doc_b4": "Continuous Medical Supervision Across All 3 Centers",
    "btn_appointment": "Book an Appointment",
    "team_nursing_title": "Nursing & Healthcare Staff",
    "team_nursing_desc": "Certified nurses and dialysis technicians devoted to your daily treatment and comfort in our 3 centers.",
    "team_c1_role": "Nursing Care",
    "team_c1_title": "Specialized Nurses",
    "team_c1_desc": "Safe vascular access, continuous hemodynamic monitoring and attentive patient support.",
    "team_c2_role": "Coastal Clinic",
    "team_c2_title": "Cherchell Team",
    "team_c2_desc": "Multilingual staff trained in nephrological emergencies and welcoming holiday dialysis patients.",
    "team_c3_role": "Live Monitoring",
    "team_c3_title": "Hemodialysis Monitoring",
    "team_c3_desc": "Strict machine calibration, continuous sterilization and supreme comfort throughout sessions.",
    "cherchell_hero_title": "Boucenna Hemodialysis<br><span>Center – Cherchell</span>",
    "cherchell_hero_sub": "A modern and high-performance center dedicated to your well-being with seasoned medical staff.",
    "bouira_hero_title": "Boucenna Hemodialysis<br><span>Center – Bouira</span>",
    "bouira_hero_sub": "A premier clinic in central Bouira providing top-tier nephrology care in a serene environment.",
    "ain_oulmene_hero_title": "Boucenna Hemodialysis<br><span>Center – Aïn Oulmène</span>",
    "ain_oulmene_hero_sub": "High-end facilities, specialized pharmacy and dedicated medical transport in the Sétif region.",
    "pill_team": "Experienced Team",
    "pill_tech": "Advanced Equipment",
    "pill_hygiene": "Hygiene & Safety",
    "pill_care": "Personalized Care",
    "btn_call_center": "Call Center",
    "btn_itineraire": "Directions",
    "why_cherchell_title": "Why Choose<br><span>Boucenna Cherchell?</span>",
    "why_bouira_title": "Why Choose<br><span>Boucenna Bouira?</span>",
    "why_ain_oulmene_title": "Why Choose<br><span>Boucenna Aïn Oulmène?</span>",
    "gallery_title": "Photo Gallery",
    "gallery_sub": "Discover our clinic through real photographs.",
    "transfer_title": "How Does a<br><span>Center Transfer Work?</span>",
    "transfer_sub": "Our coordination team supports you at every step for a smooth transfer.",
    "t_step1_title": "1. Contact Us",
    "t_step1_desc": "Call or message us on WhatsApp with your transfer request.",
    "t_step2_title": "2. Slot Availability",
    "t_step2_desc": "We verify available schedules at your chosen Boucenna clinic.",
    "t_step3_title": "3. Transfer Offer",
    "t_step3_desc": "We provide you with all required documents and care arrangements.",
    "t_step4_title": "4. File Accepted",
    "t_step4_desc": "The clinic confirms admission and the official transfer date.",
    "t_step5_title": "5. Tailored Care Starts",
    "t_step5_desc": "Begin your treatments in your new clinic with complete confidence.",
    "transfer_banner_title": "Already receiving dialysis in another center?",
    "transfer_banner_desc": "We handle your transfer safely with full medical and administrative coordination.",
    "cnas_title": "CNAS <span>Insurance Coverage</span>",
    "cnas_sub": "Hemodialysis treatments are 100% covered under our official agreement with CNAS. We handle all administrative paperwork.",
    "cnas_card1_title": "Simplified Formalities",
    "cnas_card1_desc": "We assist you with all social security and CNAS insurance administration.",
    "cnas_card2_title": "100% Coverage",
    "cnas_card2_desc": "According to eligibility requirements and regulations, with zero advance fees.",
    "cnas_card3_title": "Approved Medical Transport",
    "cnas_card3_desc": "We provide dedicated sanitized transport services (ambulatory vehicles and ambulances).",
    "cnas_btn": "Contact Us for More Information",
    "contact_page_title": "Contact <span>Us</span>",
    "contact_page_sub": "Our team is available 24/7 to answer all your questions.",
    "label_phone": "Phone",
    "label_whatsapp": "WhatsApp",
    "label_address": "Address",
    "label_hours": "Hours",
    "contact_address_val": "Cité Kaaboub Coopérative Essalam Section 105/Lot N°151 Sétif, Algeria",
    "contact_hours_val": "Everyday – 24/7",
    "btn_send_msg": "Send Message",
    "footer_tagline": "Your renal care, our priority.<br>Medical transport, nephrology consultations and pharmacy.",
    "footer_maps_link": "Google Maps Directions",
    "footer_copyright": "© 2025 Boucenna Dialysis Clinic — All rights reserved.",
    "footer_legal": "Legal Notice",
    "footer_privacy": "Privacy Policy",
    "footer_sitemap": "Sitemap",
    "footer_c2_title": "Boucenna Cherchell",
    "footer_c2_address": "Cité Zitouni El Kheir<br>Cherchell, Tipaza",
    "footer_c3_title": "Boucenna Bouira",
    "footer_c3_address": "Cité 2000 Logements<br>Bouira",
    "footer_c4_title": "Boucenna Aïn Oulmène",
    "footer_c4_address": "Aïn Oulmène, Sétif<br>(Clinic & Pharmacy)",
    "whatsapp_tooltip": "Need help? Message us",
    "about_badge": "About Us",
    "about_hero_title": "Medical Expertise<br><span>At Your Service</span>",
    "about_hero_sub": "The Boucenna Network, leader in hemodialysis in Algeria, is committed to providing high-quality, humane, and innovative care.",
    "about_section1_badge": "Our Network",
    "about_section1_title": "Leader in Medical<br><span>Assistance in Algeria</span>",
    "about_section1_p1": "The Boucenna Network has established itself as one of the leaders in hemodialysis in Algeria, thanks to a seasoned professional team and top-tier material resources.",
    "about_section1_p2": "Our network now includes a specialist nephrologist, general practitioners, and a dedicated nursing team across our 3 clinics in Cherchell, Bouira, and Aïn Oulmène.",
    "about_doctor_badge": "Medical Direction",
    "about_doctor_title": "Dr. Nassim Boucenna",
    "about_doctor_sub": "Founder &amp; Leader in health and medical innovation.",
    "about_doctor_b1": "With over 12 years of experience in the healthcare sector, he manages a network of specialized hemodialysis clinics, a medical transport company, and a pharmacy.",
    "about_doctor_b2": "DPharm and MSc in Biochemistry, he leads projects combining molecular biology and artificial intelligence integration to optimize medical care.",
    "about_doctor_b3": "Passionate about innovation and improving patient well-being, he designs and deploys advanced healthcare solutions.",
    "about_commit_badge": "Our Commitments",
    "about_commit_title": "Why Choose<br><span>Boucenna?</span>",
    "about_transport_title": "Medical Transport",
    "about_transport_desc": "24/7 availability with ambulances and VSL equipped for your comfort and safety.",
    "about_cta_title": "Want to learn more?",
    "about_cta_sub": "Our team is available to answer all your questions.",
    "advice_badge": "Practical Guide",
    "advice_hero_title": "Advice &amp; Guide<br><span>for Dialysis Patients</span>",
    "advice_hero_sub": "All the essential information on coverage, required documents, and practical advice for your daily life on dialysis.",
    "advice_tab_coverage": "Coverage",
    "advice_tab_docs": "Documents",
    "advice_tab_transport": "Transport",
    "advice_tab_fistula": "Fistula",
    "advice_tab_nutrition": "Nutrition",
    "advice_coverage_title": "Financial Coverage",
    "advice_coverage_p": "End-stage renal disease is 100% covered by social security (CNAS / CASNOS). Hemodialysis sessions, related medications, and medical transport are covered under the agreement.",
    "advice_docs_title": "Required Documents",
    "advice_docs_tourists_title": "Tourists (Foreign / Local)",
    "advice_docs_t1": "Dialysis protocol / Liaison sheet",
    "advice_docs_t2": "Recent blood tests (Serology)",
    "advice_docs_t3": "Recent medical report",
    "advice_cnas_1": "Original and recent proof of rights",
    "advice_cnas_2": "Recent blood tests (Serology)",
    "advice_cnas_3": "Blood grouping card",
    "advice_cnas_4": "Medical file and/or liaison sheet",
    "advice_cnas_5": "02 ID photos",
    "advice_cnas_6": "01 residency certificate",
    "advice_casnos_1": "Valid CASNOS coverage document",
    "advice_casnos_2": "Recent blood tests (Serology)",
    "advice_casnos_3": "Blood grouping card",
    "advice_casnos_4": "Medical file and/or liaison sheet",
    "advice_casnos_5": "02 ID photos",
    "advice_casnos_6": "01 residency certificate",
    "advice_cnas_title": "CNAS (Social Security)",
    "advice_casnos_title": "CASNOS (Self-Employed)",
    "advice_transport_title": "Medical Transport",
    "advice_transport_p1": "The Boucenna Network provides you with medical transport services using medicalized ambulances and Light Medical Vehicles (VSL).",
    "advice_transport_p2": "Our drivers are available 24/7 to transport you between your home and the dialysis center safely and comfortably.",
    "advice_fistula_title": "Fistula Advice",
    "advice_fistula_1": "An arterio-venous fistula must be created before starting hemodialysis to ensure high-quality vascular access.",
    "advice_fistula_2": "Check its proper functioning daily by feeling the characteristic vibrations.",
    "advice_fistula_3": "Avoid wearing watches, bracelets, jewelry, or any tight bandages on the arm with the fistula.",
    "advice_fistula_4": "Protect it during physical activities and do not sleep on that arm.",
    "advice_fistula_5": "Never use products or creams on the fistula without prior medical advice.",
    "advice_nutrition_title": "Diet &amp; Nutrition",
    "advice_nutrition_1": "A balanced and adapted diet is essential for hemodialysis patients.",
    "advice_nutrition_2": "Weight gain between two sessions should not exceed 5% of body weight.",
    "advice_nutrition_3": "Control your intake of salt, potassium, and phosphorus according to your doctor's recommendations.",
    "advice_nutrition_4": "Limit foods rich in potassium: bananas, chocolate, legumes, concentrated soups, dried fruits.",
    "dept_badge": "Our Departments",
    "dept_hero_title": "Medical Departments <span>of Hemodialysis</span>",
    "dept_hero_sub": "Hemodialysis, nephrology consultations, medical transport, and specialized pharmacy — everything for your complete care.",
    "dept_hemo_badge": "High-Performance Hemodialysis",
    "dept_hemo_title": "Hemodialysis<br><span>Sessions</span>",
    "dept_hemo_p1": "Our dialysis clinics have multiple stations equipped with the latest generation of machines, available Sunday to Thursday.",
    "dept_hemo_p2": "Each session is supervised by an experienced medical and nursing team in a sterile and comfortable environment.",
    "dept_hemo_f1": "Latest generation dialysis machines",
    "dept_hemo_f2": "Strict sterilization protocols",
    "dept_hemo_f3": "Continuous medical monitoring",
    "dept_hemo_f4": "100% CNAS / CASNOS coverage",
    "dept_nephro_badge": "Clinical Nephrology",
    "dept_nephro_title": "Nephrology<br><span>Consultations</span>",
    "dept_nephro_p": "Nephrology consultations are provided by Dr. Nassim Boucenna, a specialist in kidney diseases and hemodialysis, along with experienced general practitioners.",
    "dept_nephro_f1": "Chronic kidney disease monitoring",
    "dept_nephro_f2": "Adaptation of dialysis protocols",
    "dept_nephro_f3": "Personalized follow-up and laboratory tests",
    "dept_nephro_f4": "Management of kidney complications",
    "dept_transport_badge": "Medical Transport 24/7",
    "dept_transport_title": "Medical Transport<br><span>24/7 Support</span>",
    "dept_transport_p": "Our medical transport service manages the transport of patients between their home and the clinic, as well as inter-wilaya transport.",
    "dept_transport_f1": "Equipped medicalized ambulances",
    "dept_transport_f2": "Light Medical Vehicles (VSL)",
    "dept_transport_f3": "Inter-wilaya transportation",
    "dept_transport_f4": "Drivers available 24 hours a day, 7 days a week",
    "dept_pharmacy_badge": "Department 4",
    "dept_pharmacy_title": "Specialized<br><span>Pharmacy</span>",
    "dept_pharmacy_p": "Our specialized pharmacy is integrated into the Aïn Oulmène clinic (Sétif) and ensures the supply of drugs and consumables for hemodialysis and kidney care.",
    "dept_pharmacy_f1": "Medicaments and consumables for dialysis",
    "dept_pharmacy_f2": "Personalized pharmaceutical follow-up",
    "dept_pharmacy_f3": "Coordination with the medical team",
    "label_phone_whatsapp": "Phone / WhatsApp:",
    "label_fullname": "Full Name *",
    "label_phone_req": "Phone *",
    "label_email": "Email",
    "label_your_message": "Your message *",
    "placeholder_name": "Ex.: John Doe",
    "placeholder_phone": "+33 6 12 34 56 78",
    "placeholder_email": "email@domain.com",
    "placeholder_message": "Write your message...",
    "why_chh_1_title": "Advanced Treatment",
    "why_chh_1_desc": "Latest generation dialyzers and high-security water treatment.",
    "why_chh_2_title": "Experienced Team",
    "why_chh_2_desc": "Nephrologists and seasoned nurses present at every session.",
    "why_chh_3_title": "Accommodation",
    "why_chh_3_desc": "Assistance for your vacation stays and accommodation near the sea.",
    "why_chh_4_title": "Pleasant Environment",
    "why_chh_4_desc": "A serene and soothing setting on the Mediterranean coast of Tipaza.",
    "gallery_chh_title": "Photo Gallery – <span>Boucenna Cherchell</span>",
    "gallery_chh_sub": "Discover our clinic through photographs.",
    "why_bouira_1_title": "Central Location",
    "why_bouira_1_desc": "Conveniently located at Cité 2000 Logements, easily accessible across the wilaya.",
    "why_bouira_2_title": "Dedicated Nephrology",
    "why_bouira_2_desc": "Regular consultations and rigorous adjustment of dialysis protocols.",
    "why_bouira_3_title": "Comfort & Serenity",
    "why_bouira_3_desc": "Air-conditioned rooms, high-comfort armchairs and dedicated snacks.",
    "why_bouira_4_title": "CNAS Approved",
    "why_bouira_4_desc": "100% coverage with zero upfront costs for all insured patients.",
    "gallery_bouira_title": "Photo Gallery – <span>Boucenna Bouira</span>",
    "gallery_bouira_sub": "Discover the facilities of our Bouira clinic.",
    "why_ao_1_title": "Dedicated Transport",
    "why_ao_1_desc": "Fleet of ambulances and medical transport for your home-to-clinic trips.",
    "why_ao_2_title": "Affiliated Pharmacy",
    "why_ao_2_desc": "Immediate availability of all nephrology treatments and medications.",
    "why_ao_3_title": "Seasoned Team",
    "why_ao_3_desc": "Under the medical direction of Dr. Nassim Boucenna, experienced nephrologist.",
    "why_ao_4_title": "Total Safety",
    "why_ao_4_desc": "Strict sterilization, double reverse osmosis water treatment room.",
    "gallery_ao_title": "Photo Gallery – <span>Boucenna Aïn Oulmène</span>",
    "gallery_ao_sub": "Discover our facilities, dialyzers and pharmacy in Sétif.",
    "team_nursing_badge": "Staff & Care in Action",
    "team_nursing_title_full": "A nursing team <span>at the heart of your care</span>",
    "team_nursing_sub": "Present at every hemodialysis session to guarantee your safety, comfort, and well-being.",
    "vac_commitment_badge": "Boucenna Network",
    "vac_commitment_title": "Our Commitment to You",
    "vac_commitment_sub": "We do everything possible to provide you with high-quality care wherever you are.",
    "vac_c1_title": "Attentive & Caring",
    "vac_c2_title": "Quality & Safety",
    "vac_c3_title": "Personalized Support",
    "vac_side_avail": "Our patient team is available",
    "badge_faq": "FAQ",
    "card_cherchell_title": "Cherchell – Tipaza",
    "card_bouira_title": "Bouira",
    "card_ain_oulmene_title": "Aïn Oulmène – Sétif",
    "placeholder_stay_city": "Ex.: Cherchell, Bouira, Sétif...",
    "placeholder_sessions": "Ex.: 6, 12, 18...",
    "placeholder_notes": "Specify any special medical requirements, lodging preferences...",
    "opt_select_country": "Select your country",
    "opt_france": "France",
    "opt_algeria": "Algeria (inter-wilaya)",
    "opt_canada": "Canada",
    "opt_belgium": "Belgium",
    "opt_switzerland": "Switzerland",
    "opt_other": "Other",
    "opt_choose_center": "Choose a center",
    "opt_cherchell": "Cherchell (Tipaza)",
    "opt_bouira": "Bouira",
    "opt_ain_oulmene": "Aïn Oulmène (Sétif)",
    "opt_whatsapp": "WhatsApp",
    "opt_phone": "Phone",
    "opt_email": "Email",
    "reassure_title": "You are in good hands",
    "reassure_desc": "Our patient coordination team assists you at every step: session booking, greeting, transport and medical follow-up.",
    "reassure_1": "Comprehensive and secure medical care",
    "reassure_2": "Experienced nephrology teams",
    "reassure_3": "Modern and comfortable centers",
    "vac_side_hours": "Monday through Saturday, 8am to 6pm.",
    "vac_side_here": "We are here for you.",
    "vac_hl1_title": "Personalized Support",
    "vac_hl1_desc": "A dedicated coordinator to organize your appointments.",
    "vac_hl2_title": "Pre-Departure Booking",
    "vac_hl2_desc": "Schedule your dialysis sessions in advance with total peace of mind.",
    "vac_hl3_title": "Quality Care & Safety",
    "vac_hl3_desc": "Modern centers with experienced medical teams.",
    "vac_hl4_title": "Peaceful Travels",
    "vac_hl4_desc": "Enjoy your stay in Algeria, we take complete care of your renal health.",
    "center_ref_badge": "Reference Center",
    "center_dialysis_badge": "Dialysis Center",
    "pill_pharmacy": "Affiliated Pharmacy",
    "pill_cnas": "100% CNAS / CASNOS",
    "badge_video_testimonials": "Real Video Testimonials",
    "video_testi_1_badge": "Hemodialysis Patient",
    "video_testi_1_title": "Testimonial at Boucenna Center",
    "video_testi_1_desc": "Warm feedback on the quality of care and attention from our medical staff.",
    "video_testi_2_badge": "Regular Patient",
    "video_testi_2_title": "Care and Comfort",
    "video_testi_2_desc": "Testimonial on rigorous medical follow-up and personalized support.",
    "transfer_step_title": "How Does Transferring Centers Work?",
    "transfer_step1_title": "1. Contact Us",
    "transfer_step1_desc": "By phone or WhatsApp to share your transfer request with us.",
    "transfer_step2_title": "2. We Check Availability",
    "transfer_step2_desc": "We check schedule availability in your desired center (Cherchell, Bouira, Aïn Oulmène).",
    "transfer_step3_title": "3. We Send the Documentation",
    "transfer_step3_desc": "We provide you with all the necessary medical and administrative paperwork.",
    "transfer_step4_title": "4. Your File is Accepted",
    "transfer_step4_desc": "The center confirms acceptance and coordinates your starting transfer date.",
    "transfer_step5_title": "5. Your New Personalized Care",
    "transfer_step5_desc": "You begin treatment at your new center with total confidence and peace of mind.",
    "transfer_priority_title": "Already Receiving Dialysis at Another Center?",
    "transfer_priority_desc": "We assist you through a smooth, safe transfer with comprehensive medical coordination.",
    "team_hero_badge": "Medical Leadership",
    "dr_boucenna_role": "Specialist in Nephrology & Hemodialysis",
    "team_section_title": "Our Teams <span>at the Heart of Your Care</span>",
    "team_section_sub": "Present at every dialysis session to ensure your safety, comfort, and well-being.",
    "team_card1_badge": "Care Team",
    "team_card1_title": "Specialized Nurses",
    "team_card1_desc": "Safe vascular access connection, continuous hemodynamic monitoring, and empathetic care.",
    "team_card2_badge": "Coastal Branch",
    "team_card2_title": "Cherchell Team",
    "team_card2_desc": "Bilingual medical staff trained in nephrology emergencies and vacationer welcoming.",
    "team_card3_badge": "Live Monitoring",
    "team_card3_title": "Hemodialysis Surveillance",
    "team_card3_desc": "Rigorous dialysis machine monitoring, high sterilization, and patient comfort throughout.",
    "cnas_main_intro": "Dialysis treatment is fully covered under the CNAS framework. We handle all paperwork on your behalf.",
    "conseil_badge_hero": "Kidney Health Guide",
    "conseil_hero_title": "Advice & Recommendations <span>for Dialysis Patients</span>",
    "conseil_cnas_highlight": "100% covered by social security (CNAS / CASNOS)",
    "conseil_emergency_highlight": "24/7 Medical assistance and advice available",
    "dept_hero_badge": "Our Care Departments",
    "dept_pharma_badge": "Specialized Pharmacy",
    "vac_form_alert_success_title": "Your request is ready!",
    "vac_form_alert_success_desc": "WhatsApp will open with your pre-filled message. Review the information and press <strong>Send</strong> to submit your request to the Boucenna team.",
    "vac_form_error_required": "Please fill in all required fields (*).",
    "vac_form_error_dates": "Departure date cannot be earlier than arrival date.",
    "contact_form_error_required": "Please enter your name, phone number, and message."
  },
  "ar": {
    "lang_name": "AR",
    "nav_home": "الرئيسية",
    "nav_centers": "مراكزنا",
    "nav_team": "فريقنا الطبي",
    "nav_transfer": "تغيير المركز",
    "nav_cnas": "الضمان الاجتماعي (CNAS)",
    "nav_vacation": "غسيل الكلى للعطلات",
    "nav_contact": "اتصل بنا",
    "nav_contact_btn": "تواصل معنا",
    "btn_espace_patient": "فضاء المريض",
    "drop_cherchell": "مركز Boucenna Cherchell (تيبازة)",
    "drop_bouira": "مركز Boucenna Bouira",
    "drop_ain_oulmene": "مركز Boucenna Aïn Oulmène (سطيف)",
    "nav_presentation": "عن العيادة",
    "drop_about": "من نحن",
    "drop_depts": "أقسامنا الطبية",
    "drop_advice": "دليل النصائح",
    "nav_about": "من نحن",
    "nav_depts": "أقسامنا",
    "nav_advice": "دليل النصائح",
    "hero_title_home": "شبكة مراكز<br><span>تصفية الدم بوسنة</span>",
    "hero_sub_home": "شبكة مراكز عصرية، إنسانية ومبتكرة في خدمتكم في شرشال، البويرة وعين ولمان.",
    "btn_discover_centers": "اكتشف مراكزنا",
    "btn_vacation_cta": "تصفية الدم أثناء العطلات في الجزائر",
    "home_c1_title": "عين ولمان",
    "home_c1_sub": "سطيف وجنوب سطيف",
    "home_c2_title": "البويرة",
    "home_c2_sub": "البويرة ونواحيها",
    "home_c3_title": "شرشال",
    "home_c3_sub": "تيبازة / الساحل",
    "btn_discover": "اكتشف المركز",
    "badge_video_immersion": "جولة بالفيديو",
    "title_videos_section": "اكتشف <span>مراكزنا بالفيديو</span>",
    "sub_videos_section": "شاهد مقاطع الفيديو الحقيقية المصورة داخل عياداتنا الحديثة في شرشال والبويرة.",
    "video_c1_title": "مركز بوسنة شرشال (تيبازة)",
    "video_c1_desc": "اكتشف تجهيزاتنا العصرية وإطلالتنا المهدئة على البحر وأحدث أجهزة غسيل الكلى.",
    "video_c2_title": "مركز بوسنة البويرة",
    "video_c2_desc": "تفضل بزيارة عيادتنا بالبويرة واستقبلنا الدافئ ومنشآتنا الطبية المتكاملة.",
    "video_card1_title": "عيادة بوسنة شرشال",
    "video_card1_desc": "موقع ساحلي مميز وقاعات تصفية دم عالية التقنية.",
    "video_card2_title": "عيادة بوسنة البويرة",
    "video_card2_desc": "تجهيزات متطورة واستقبال مخصص في مركز البويرة.",
    "title_testimonials": "تجارب <span>مرضانا</span>",
    "sub_testimonials": "اكتشفوا الشهادات المصورة وآراء مرضانا الذين تمت رعايتهم في مراكزنا بكل عناية.",
    "testi_1_text": "أتوجه بالشكر الجزيل لمركز بوسنة شرشال. طاقم في قمة الاحترافية وحسن الاستماع للمرضى.",
    "testi_1_author": "م. أ.",
    "testi_1_city": "شرشال",
    "testi_2_text": "مركز عصري جداً ونظيف ومجهز بأحدث الوسائل. الطاقم الطبي إنساني ومتعاون. شكراً لكم.",
    "testi_2_author": "ف. ك.",
    "testi_2_city": "البويرة",
    "testi_3_text": "بفضل عيادة بوسنة شرشال، تابعت حصص التصفية بكل سهولة أثناء عطلتي بالجزائر. أنصح بشدة بهذا المركز.",
    "testi_3_author": "ر. ب.",
    "testi_3_city": "شرشال",
    "testi_1_quote": "أتوجه بالشكر الجزيل لمركز بوسنة شرشال. طاقم في قمة الاحترافية وحسن الاستماع للمرضى.",
    "testi_2_quote": "مركز عصري جداً ونظيف ومجهز بأحدث الوسائل. الطاقم الطبي إنساني ومتعاون. شكراً لكم.",
    "testi_3_quote": "بفضل عيادة بوسنة شرشال، تابعت حصص التصفية بكل سهولة أثناء عطلتي بالجزائر. أنصح بشدة بهذا المركز.",
    "badge_boucenna_network": "شبكة بوسنة",
    "hero_title_vacances": "غسيل الكلى أثناء العطلات<br><span>في الجزائر</span>",
    "hero_sub_vacances": "نظم جلسات غسيل الكلى الخاصة بك قبل وصولك إلى أحد مراكزنا الثلاثة الحديثة.",
    "btn_organize_sessions": "تنظيم جلساتي",
    "btn_call": "اتصل بنا",
    "btn_whatsapp": "WhatsApp",
    "btn_choose_center": "اختر هذا المركز",
    "prop_quality_care": "رعاية طبية فائقة",
    "prop_quality_care_desc": "إشراف كامل من قبل أطقم طبية وتمريضية متخصصة وذات خبرة عالية.",
    "prop_peaceful_trip": "سفر بكل راحة واطمئنان",
    "prop_peaceful_trip_desc": "نقوم بتنسيق مواعيد جلساتك وفقاً لجدول عطلتك وسفرك.",
    "prop_dedicated_help": "مرافقة ودعم مستمر",
    "prop_dedicated_help_desc": "فريق التنسيق الطبي في خدمتكم قبل وأثناء وبعد إقامتكم في الجزائر.",
    "badge_our_centers": "مراكزنا",
    "title_discover_centers": "اكتشف مراكز<br>تصفية الدم Boucenna",
    "sub_discover_centers": "ترحب بكم شبكة Boucenna في 3 مراكز لتصفية الدم حديثة ومجهزة بأعلى معايير الراحة والأمان.",
    "pin_3centers": "3 مراكز في خدمتكم عبر الجزائر",
    "cherchell_desc": "موقع مميز ومهدئ على الواجهة البحرية، مجهز بأحدث التجهيزات لضمان راحتكم وسلامتكم.",
    "bouira_desc": "مركز حديث في قلب مدينة Bouira، صُمم ليقدم رعاية كلوية عالية الجودة في بيئة هادئة ومريحة.",
    "ain_oulmene_desc": "منشآت طبية راقية وفريق متخصص مكرس لرعايتكم بالقرب منكم في ولاية سطيف.",
    "btn_view_details": "عرض التفاصيل ←",
    "prop_safety": "الجودة والسلامة",
    "prop_safety_desc": "بروتوكولات صحية صارمة وأجهزة حديثة لضمان أمانكم التام.",
    "prop_devoted_team": "طاقم طبي متفانٍ",
    "prop_devoted_team_desc": "أطباء وممرضون ذوو كفاءة عالية يرافقونكم في كل حصة علاجية.",
    "prop_optimal_comfort": "أقصى درجات الراحة",
    "prop_optimal_comfort_desc": "قاعات مكيفة ومقاعد عصرية مريحة مصممة لراحتكم التامة.",
    "prop_proximity": "القرب وسهولة الوصول",
    "prop_proximity_desc": "ثلاثة مراكز في مواقع استراتيجية مع توفير خدمة النقل الصحي المتخصص.",
    "badge_why_us": "لماذا تختار عياداتنا",
    "title_why_boucenna": "لماذا تختار<br><span>Boucenna ؟</span>",
    "sub_why_boucenna": "مهمتنا هي أن نقدم لكم تكفلاً طبياً ممتازاً بكل أمان واطمئنان أينما كنتم في الجزائر.",
    "why_1_title": "طاقم طبي ذو خبرة",
    "why_1_desc": "أطباء كلى وممرضون متخصصون يسهرون على تقديم أفضل رعاية طبية ممكنة.",
    "why_2_title": "مراكز ومعدات حديثة",
    "why_2_desc": "أحدث أجهزة غسيل الكلى ومحطات معالجة المياه المطابقة للمعايير الدولية.",
    "why_3_title": "مرافقة شخصية",
    "why_3_desc": "متابعة دقيقة تتكيف مع حالتكم الصحية واحتياجاتكم الفردية.",
    "why_4_title": "تنظيم محكم ومسبق",
    "why_4_desc": "نخطط وننسق مواعيد حصصكم لضمان إقامة طبية هادئة وخالية من أي ضغوط.",
    "why_5_title": "راحة قصوى أثناء الحصص",
    "why_5_desc": "بيئة نظيفة ومريحة ومجهزة بالكامل لضمان رفاهيتكم طوال فترة العلاج.",
    "why_6_title": "مساعدة مسبقة قبل الوصول",
    "why_6_desc": "نرافقكم عن بُعد لاستكمال الإجراءات والتأكد من جاهزية كل شيء قبل وصولكم.",
    "priority_health_title": "صحتكم هي أولويتنا الأولى",
    "priority_health_desc": "مع عيادات Boucenna، تستفيدون من شبكة رعاية موثوقة تسهر على خدمتكم وسلامتكم في كل وقت.",
    "title_4steps": "مسار غسيل الكلى<br><span>في 4 خطوات سهلة</span>",
    "sub_4steps": "نرافقكم في كل مرحلة لتنظيم جلساتكم الطبية بكل بساطة وسرعة.",
    "step1_title": "1. إرسال تواريخ الإقامة",
    "step1_desc": "حدد تواريخ إقامتك والوجهة المطلوبة ومعلومات الاتصال عبر الاستمارة أو بالهاتف.",
    "step2_title": "2. التأكد من الأماكن الشاغرة",
    "step2_desc": "نحدد مركز Boucenna الأقرب لمكان إقامتكم ونحجز الأوقات المناسبة لكم.",
    "step3_title": "3. دراسة الملف الطبي",
    "step3_desc": "يراجع طبيب الكلى ملفكم الطبي بسرية تامة لضمان استمرارية العلاج بأعلى أمان.",
    "step4_title": "4. تأكيد المواعيد النهائية",
    "step4_desc": "نرسل لكم تأكيداً رسمياً يتضمن جميع التفاصيل والمواعيد المحددة.",
    "steps_banner_title": "مرافقة إنسانية وسريعة الاستجابة",
    "steps_banner_desc": "فريقنا المتخصص في خدمتكم قبل وأثناء وبعد إقامتكم. راحة بالكم هي هدفنا الدائم.",
    "form_title": "تحضير إقامتكم لغسيل الكلى",
    "form_subtitle": "املأ هذا النموذج وسيتولى فريقنا الطبي مرافقتكم لتنظيم إقامة علاجية آمنة ومريحة تلبي جميع متطلباتكم.",
    "form_name_label": "الاسم واللقب *",
    "form_country_label": "بلد الإقامة *",
    "form_phone_label": "رقم الهاتف / WhatsApp *",
    "form_city_label": "مدينة الإقامة في الجزائر *",
    "form_arrival_label": "تاريخ الوصول *",
    "form_departure_label": "تاريخ المغادرة *",
    "form_center_label": "المركز المطلوب *",
    "form_sessions_label": "عدد الجلسات التقريبي *",
    "form_contact_pref_label": "طريقة الاتصال المفضلة *",
    "form_notes_label": "معلومات إضافية (اختياري)",
    "form_security_text": "بياناتكم سرية تماماً وتُستخدم فقط لتنظيم جلساتكم الطبية.",
    "form_btn_submit": "إرسال الطلب عبر WhatsApp",
    "title_faq": "الأسئلة الشائعة<br><span>حول غسيل الكلى أثناء السفر</span>",
    "sub_faq": "إليكم الإجابات عن أكثر التساؤلات شيوعاً لتنظيم علاجكم بكل طمأنينة.",
    "faq_q1": "كيف يمكنني حجز جلسات غسيل الكلى قبل سفري؟",
    "faq_a1": "يكفي ملء نموذج الطلب عبر الإنترنت أو مراسلتنا على WhatsApp بتواريخ إقامتك والمركز المفضل. سنتأكد من التوفر ونحجز مواعيدك فوراً.",
    "faq_q2": "ما هي الوثائق الطبية المطلوبة؟",
    "faq_a2": "نطلب آخر وصفة طبية لغسيل الكلى، وتقريراً طبياً حديثاً، ونتائج التحاليل المصلية المحدثة.",
    "faq_q3": "هل العلاج مغطى من قبل الضمان الاجتماعي (CNAS)؟",
    "faq_a3": "نعم، جلسات تصفية الدم مغطاة بنسبة 100% في إطار الاتفاقية المبرمة مع الضمان الاجتماعي.",
    "faq_q4": "هل تقدمون خدمة النقل الصحي للمرضى؟",
    "faq_a4": "نعم، سيارات النقل الصحي المجهزة التابعة للمركز تتكفل بنقلكم بين مقر إقامتكم والعيادة.",
    "faq_q5": "كيف يمكنني التواصل مع الفريق الطبي عند الحاجة؟",
    "faq_a5": "فريق التنسيق الطبي متاح على مدار 24 ساعة وطوال أيام الأسبوع عبر الهاتف و WhatsApp للرد على أي استفسار.",
    "faq_side_title": "هل تحتاج إلى مساعدة مخصصة؟",
    "faq_side_desc": "فريقنا في خدمتكم 7/7 للإجابة على كافة استفساراتكم ومساعدتكم في تخطيط علاجكم أثناء العطلة.",
    "faq_btn_whatsapp": "تواصل معنا عبر WhatsApp",
    "faq_btn_call": "اتصل بنا هاتفياً",
    "title_help_box": "بحاجة إلى مساعدة؟<br><span>فريقنا دائماً في خدمتكم</span>",
    "sub_help_box": "هل أنت قادم من الخارج وتحتاج إلى تنظيم جلسات غسيل الكلى قبل سفرك إلى الجزائر؟ فريق Boucenna معك في كل خطوة.",
    "btn_write_us": "راسلنا الآن",
    "title_team": "فريقنا <span>الطبي المتخصص</span>",
    "sub_team": "أطباؤنا وطاقمنا التمريضي ملتزمون بتقديم رعاية طبية فائقة الجودة وبلمسة إنسانية راقية.",
    "tab_nephro": "Néphrologue",
    "tab_paramedical": "الطاقم شبه الطبي",
    "doctor_title": "Dr. Nassim Boucenna — Néphrologue & Directeur Médical",
    "doc_b1": "Spécialiste en néphrologie & hémodialyse",
    "doc_b2": "متابعة شخصية وتكييف بروتوكولات العلاج",
    "doc_b3": "نهج إنساني ورعاية قائمة على التعاطف والاحترام",
    "doc_b4": "إشراف طبي مستمر على المراكز الثلاثة",
    "btn_appointment": "حجز موعد",
    "team_nursing_title": "الطاقم التمريضي وشبه الطبي",
    "team_nursing_desc": "ممرضون مؤهلون وتقنيون ذوو خبرة يسهرون على رعايتكم اليومية في مراكزنا الثلاثة.",
    "team_c1_role": "طاقم الرعاية",
    "team_c1_title": "ممرضون متخصصون",
    "team_c1_desc": "وصل آمن للقسطرة ومراقبة دقيقة للعلامات الحيوية طوال فترة الجلسة.",
    "team_c2_role": "قطب الساحل",
    "team_c2_title": "طاقم مركز Boucenna Cherchell",
    "team_c2_desc": "طاقم مدرب على حالات الطوارئ واستقبال مرضى العطلات من مختلف الدول.",
    "team_c3_role": "متابعة مباشرة",
    "team_c3_title": "مراقبة تصفية الدم",
    "team_c3_desc": "تعقيم دوري وفحص مستمر للمولدات وأعلى درجات الراحة أثناء العلاج.",
    "cherchell_hero_title": "Centre d'Hémodialyse<br><span>Boucenna – Cherchell</span>",
    "cherchell_hero_sub": "مركز حديث وعالي الأداء مكرس لراحتكم مع طاقم طبي ذي خبرة واسعة.",
    "bouira_hero_title": "Centre d'Hémodialyse<br><span>Boucenna – Bouira</span>",
    "bouira_hero_sub": "مركز حديث في قلب مدينة Bouira، صُمم ليقدم رعاية كلوية عالية الجودة في بيئة هادئة ومريحة.",
    "ain_oulmene_hero_title": "Centre d'Hémodialyse<br><span>Boucenna – Aïn Oulmène</span>",
    "ain_oulmene_hero_sub": "منشآت طبية راقية، صيدلية متخصصة ونقل صحي في خدمتكم بولاية سطيف.",
    "pill_team": "طاقم طبي ذو خبرة",
    "pill_tech": "أحدث الأجهزة",
    "pill_hygiene": "نظافة وأمان تام",
    "pill_care": "تكفل طبي مخصص",
    "btn_call_center": "الاتصال بالمركز",
    "btn_itineraire": "الاتجاهات",
    "why_cherchell_title": "لماذا تختار<br><span>Boucenna Cherchell ؟</span>",
    "why_bouira_title": "لماذا تختار<br><span>Boucenna Bouira ؟</span>",
    "why_ain_oulmene_title": "لماذا تختار<br><span>Boucenna Aïn Oulmène ؟</span>",
    "gallery_title": "معرض الصور",
    "gallery_sub": "اكتشف مركزنا من خلال هذه الصور الحقيقية.",
    "transfer_title": "كيف يتم<br><span>تغيير مركز التصفية؟</span>",
    "transfer_sub": "فريقنا يرافقكم في كل خطوة لتسهيل كافة الإجراءات.",
    "t_step1_title": "1. تواصل معنا",
    "t_step1_desc": "عبر الهاتف أو WhatsApp لإبلاغنا برغبتكم في التحويل.",
    "t_step2_title": "2. فحص الأماكن الشاغرة",
    "t_step2_desc": "نتأكد من توفر المواعيد في المركز المطلوب.",
    "t_step3_title": "3. إرسال الوثائق",
    "t_step3_desc": "نرسل لكم المعلومات والوثائق الإدارية اللازمة.",
    "t_step4_title": "4. قبول الملف",
    "t_step4_desc": "يؤكد المركز التكفل الطبي وتحديد تاريخ بدء الجلسات.",
    "t_step5_title": "5. بدء المتابعة الجديدة",
    "t_step5_desc": "تبدأ علاجك في مركزك الجديد بكل راحة واطمئنان.",
    "transfer_banner_title": "هل تخضع حالياً للتصفية في مركز آخر؟",
    "transfer_banner_desc": "نرافقك في عملية النقل بأمان تام وبتنسيق طبي وإداري شامل.",
    "cnas_title": "التغطية من قبل <span>الضمان الاجتماعي (CNAS)</span>",
    "cnas_sub": "جلسات تصفية الدم مغطاة بنسبة 100% في إطار الاتفاقية المبرمة مع الضمان الاجتماعي. نتكفل بكافة المعاملات نيابة عنكم.",
    "cnas_card1_title": "إجراءات إدارية مبسطة",
    "cnas_card1_desc": "نساعدكم في كافة المعاملات الإدارية مع CNAS وصناديق الضمان الاجتماعي.",
    "cnas_card2_title": "تكفل كامل بنسبة 100%",
    "cnas_card2_desc": "وفقاً للشروط والأنظمة السارية، بدون أي تسبيق أو دفع مصاريف من طرفكم.",
    "cnas_card3_title": "نقل صحي معتمد ومجاني",
    "cnas_card3_desc": "نوفر لكم أسطول نقل صحي مجهز ومكيف (سيارات مجهزة وإسعاف) من وإلى المركز.",
    "cnas_btn": "تواصل معنا للمزيد من المعلومات",
    "contact_page_title": "اتصل <span>بنا</span>",
    "contact_page_sub": "فريقنا الطبي والإداري دائماً في الاستماع للإجابة على جميع تساؤلاتكم.",
    "label_phone": "الهاتف",
    "label_whatsapp": "WhatsApp",
    "label_address": "العنوان",
    "label_hours": "أوقات العمل",
    "contact_address_val": "Cité Kaaboub Coopérative Immobilière Essalam Section 105/Lot N°151 Sétif, Algérie",
    "contact_hours_val": "طوال أيام الأسبوع – 24/24 ساعة",
    "btn_send_msg": "إرسال الرسالة",
    "footer_tagline": "رعايتكم الكلوية أولويتنا القصوى.<br>نقل صحي، استشارات أمراض الكلى وصيدلية متخصصة.",
    "footer_maps_link": "الاتجاهات عبر Google Maps",
    "footer_copyright": "© 2025 Clinique Dialyse Boucenna — جميع الحقوق محفوظة.",
    "footer_legal": "الشروط القانونية",
    "footer_privacy": "سياسة الخصوصية",
    "footer_sitemap": "خريطة الموقع",
    "footer_c2_title": "Boucenna Cherchell",
    "footer_c2_address": "Cité Zitouni El Kheir<br>Cherchell, Tipaza",
    "footer_c3_title": "Boucenna Bouira",
    "footer_c3_address": "Cité 2000 Logements<br>Bouira",
    "footer_c4_title": "Boucenna Aïn Oulmène",
    "footer_c4_address": "Aïn Oulmène, Sétif<br>(Plateau & Pharmacie)",
    "whatsapp_tooltip": "هل تحتاج مساعدة؟ راسلنا على WhatsApp",
    "about_badge": "من نحن",
    "about_hero_title": "خبرة طبية متكاملة<br><span>في خدمتكم</span>",
    "about_hero_sub": "تلتزم شبكة Boucenna لتصفية الدم، الرائدة في الجزائر، بتقديم رعاية طبية عالية الجودة وإنسانية ومبتكرة.",
    "about_section1_badge": "شبكتنا الطبية",
    "about_section1_title": "الرائد في المساعدة<br><span>الطبية في الجزائر</span>",
    "about_section1_p1": "فرضت شبكة Boucenna نفسها كواحدة من الشبكات الرائدة في تصفية الدم بالجزائر، وذلك بفضل طاقم من المحترفين ذوي الخبرة والوسائل المادية والبشرية الحديثة.",
    "about_section1_p2": "تضم شبكتنا اليوم طبيباً أخصائياً في أمراض الكلى، وأطباء عامين، وطاقم تمريض متفانٍ في مراكزنا الثلاثة في Cherchell، Bouira و Aïn Oulmène.",
    "about_doctor_badge": "Direction Médicale",
    "about_doctor_title": "Dr. Nassim Boucenna",
    "about_doctor_sub": "Fondateur & Leader en santé et innovation médicale.",
    "about_doctor_b1": "مع أكثر من 12 عاماً من الخبرة في قطاع الصحة، يدير شبكة عيادات متخصصة في تصفية الدم، ومؤسسة للنقل الطبي وصيدلية.",
    "about_doctor_b2": "دكتور في الصيدلة وماجستير في الكيمياء الحيوية، يقود مشاريع تجمع بين البيولوجيا الجزيئية ودمج الذكاء الاصطناعي لتحسين الرعاية الطبية.",
    "about_doctor_b3": "شغوف بالابتكار وتحسين رفاهية المرضى، يقوم بتصميم ونشر حلول صحية متطورة.",
    "about_commit_badge": "التزاماتنا",
    "about_commit_title": "لماذا تختار<br><span>Boucenna ؟</span>",
    "about_transport_title": "Transport sanitaire",
    "about_transport_desc": "متوفر 24 ساعة/24 وطوال أيام الأسبوع بسيارات إسعاف مجهزة لسلامتكم وراحتكم.",
    "about_cta_title": "هل ترغب في معرفة المزيد؟",
    "about_cta_sub": "فريقنا متوفر للإجابة على جميع استفساراتكم ومرافقتكم.",
    "advice_badge": "الدليل العملي",
    "advice_hero_title": "نصائح وإرشادات<br><span>لمرضى تصفية الدم</span>",
    "advice_hero_sub": "جميع المعلومات الأساسية حول التكفل المالي، الوثائق المطلوبة، والنصائح العملية لحياتكم اليومية مع العلاج.",
    "advice_tab_coverage": "التكفل المالي",
    "advice_tab_docs": "الوثائق المطلوبة",
    "advice_tab_transport": "النقل الصحي",
    "advice_tab_fistula": "Fistule",
    "advice_tab_nutrition": "التغذية",
    "advice_coverage_title": "التكفل المالي والعلاجي",
    "advice_coverage_p": "يتم التكفل بالفشل الكلوي المزمن بنسبة 100% من قبل الضمان الاجتماعي (CNAS / CASNOS). تغطي الاتفاقية جلسات تصفية الدم، الأدوية ذات الصلة، والنقل الصحي.",
    "advice_docs_title": "الوثائق المطلوبة للبدء",
    "advice_docs_tourists_title": "مرضى العطلات (الأجانب والمحليين)",
    "advice_docs_t1": "Protocole de dialyse / Fiche de liaison",
    "advice_docs_t2": "تحاليل طبية حديثة (Sérologie)",
    "advice_docs_t3": "Compte rendu médical récent",
    "advice_cnas_1": "شهادة انتساب أصلية وحديثة للضمان الاجتماعي",
    "advice_cnas_2": "تحاليل طبية حديثة (Sérologie)",
    "advice_cnas_3": "بطاقة فصيلة الدم (Groupage)",
    "advice_cnas_4": "Dossier médical / Fiche de liaison",
    "advice_cnas_5": "صورتان شمسيتان (02)",
    "advice_cnas_6": "شهادة إقامة واحدة (01)",
    "advice_casnos_1": "شهادة تكفل صالحة من CASNOS",
    "advice_casnos_2": "تحاليل طبية حديثة (Sérologie)",
    "advice_casnos_3": "بطاقة فصيلة الدم (Groupage)",
    "advice_casnos_4": "Dossier médical / Fiche de liaison",
    "advice_casnos_5": "صورتان شمسيتان (02)",
    "advice_casnos_6": "شهادة إقامة واحدة (01)",
    "advice_cnas_title": "CNAS (الضمان الاجتماعي)",
    "advice_casnos_title": "CASNOS (الضمان الاجتماعي لغير الأجراء)",
    "advice_transport_title": "Transport sanitaire",
    "advice_transport_p1": "توفر لكم شبكة Boucenna خدمة نقل صحي مخصصة عبر سيارات إسعاف مجهزة وسيارات نقل صحي خفيفة (VSL).",
    "advice_transport_p2": "سائقونا متوفرون 24 ساعة/24 و7 أيام/7 لنقلكم بين مقر إقامتكم والمركز بكل أمان وراحة تامة.",
    "advice_fistula_title": "نصائح وإرشادات حول الناسور (Fistule)",
    "advice_fistula_1": "يجب إنشاء الناسور الشرياني الوريدي (Fistule) قبل بدء غسيل الكلى لضمان وصول وعائي آمن وعالي الجودة.",
    "advice_fistula_2": "راقب عمله يومياً عن طريق تحسس الاهتزازات المميزة.",
    "advice_fistula_3": "تجنب ارتداء الساعات، الأساور، المجوهرات أو الضمادات الضيقة.",
    "advice_fistula_4": "احمِ الناسور أثناء الأنشطة البدنية وتجنب النوم على هذا الذراع.",
    "advice_fistula_5": "لا تضع أي مستحضرات أو كريمات على الناسور دون استشارة طبيبك مسبقاً.",
    "advice_nutrition_title": "الغذاء والتغذية الصحية",
    "advice_nutrition_1": "تعد التغذية المتوازنة والمناسبة أمراً ضرورياً لمرضى تصفية الدم.",
    "advice_nutrition_2": "يجب ألا تتجاوز زيادة الوزن بين الجلستين 5% من إجمالي وزن الجسم.",
    "advice_nutrition_3": "تحكم في كمية الملح، البوتاسيوم، والفسفور وفقاً لتوجيهات طبيبك المعالج.",
    "advice_nutrition_4": "قلل من الأطعمة الغنية بالبوتاسيوم: الموز، الشوكولاتة، البقوليات الجافة، الحساء المركز، والفواكه المجففة.",
    "dept_badge": "أقسامنا الطبية",
    "dept_hero_title": "الأقسام الطبية <span>لتصفية الدم وأمراض الكلى</span>",
    "dept_hero_sub": "جلسات تصفية الدم، استشارات أمراض الكلى، النقل الصحي المجهز، وصيدلية متخصصة — تكفل طبي شامل لسلامتكم.",
    "dept_hemo_badge": "تصفية الدم عالية الدقة",
    "dept_hemo_title": "Séances<br><span>d'Hémodialyse</span>",
    "dept_hemo_p1": "تحتوي مراكزنا على عدة محطات لتصفية الدم مجهزة بأحدث المولدات الطبية، وهي متوفرة من الأحد إلى الخميس.",
    "dept_hemo_p2": "تخضع كل جلسة لإشراف طبي وتمريضي دقيق وذو خبرة في بيئة معقمة ومريحة للغاية.",
    "dept_hemo_f1": "أحدث مولدات وأجهزة تصفية الدم",
    "dept_hemo_f2": "بروتوكولات تعقيم وتطهير صارمة جداً",
    "dept_hemo_f3": "مراقبة وفحص طبي مستمر للمريض",
    "dept_hemo_f4": "تغطية كاملة بنسبة 100% (CNAS / CASNOS)",
    "dept_nephro_badge": "طب الكلى السريري",
    "dept_nephro_title": "Consultations de<br><span>Néphrologie</span>",
    "dept_nephro_p": "يقدم Dr. Nassim Boucenna، أخصائي أمراض الكلى وتصفية الدم، الاستشارات والمتابعة الدقيقة للمرضى رفقة أطباء عامين مؤهلين.",
    "dept_nephro_f1": "متابعة تطور القصور الكلوي المزمن",
    "dept_nephro_f2": "تعديل وتكييف بروتوكولات وجلسات العلاج",
    "dept_nephro_f3": "متابعة شخصية ونتائج التحاليل البيولوجية دورياً",
    "dept_nephro_f4": "التكفل بالمضاعفات والوقاية منها",
    "dept_transport_badge": "نقل صحي 24/24 و7/7",
    "dept_transport_title": "Transport Sanitaire<br><span>24h/24 – 7j/7</span>",
    "dept_transport_p": "تضمن خدمة النقل الصحي لدينا نقل المرضى وتأمين وصولهم بكل أمان بين مقر سكناهم والعيادة، وكذلك التنقل بين الولايات.",
    "dept_transport_f1": "سيارات إسعاف مجهزة بالكامل",
    "dept_transport_f2": "سيارات نقل صحي خفيفة (VSL)",
    "dept_transport_f3": "خدمة النقل الطبي بين الولايات",
    "dept_transport_f4": "طواقم نقل متوفرة 24 ساعة/24 وطوال الأسبوع",
    "dept_pharmacy_badge": "Département 4",
    "dept_pharmacy_title": "Pharmacie<br><span>Spécialisée</span>",
    "dept_pharmacy_p": "تم دمج صيدليتنا المتخصصة في عيادة Aïn Oulmène (سطيف) لتأمين إمدادات الأدوية والمستلزمات الخاصة بمرضى الكلى وتصفية الدم.",
    "dept_pharmacy_f1": "أدوية ومستلزمات علاج تصفية الدم",
    "dept_pharmacy_f2": "متابعة صيدلانية دقيقة وتوجيه المريض",
    "dept_pharmacy_f3": "تنسيق متكامل ومباشر مع الطاقم الطبي للعيادة",
    "label_phone_whatsapp": "Tél / WhatsApp :",
    "label_fullname": "الاسم واللقب *",
    "label_phone_req": "رقم الهاتف *",
    "label_email": "البريد الإلكتروني",
    "label_your_message": "رسالتكم *",
    "placeholder_name": "مثال: أحمد بوعلام",
    "placeholder_phone": "+33 6 12 34 56 78",
    "placeholder_email": "email@domain.com",
    "placeholder_message": "اكتب رسالتك هنا...",
    "why_chh_1_title": "Traitement avancé",
    "why_chh_1_desc": "أحدث مولدات تصفية الدم ومحطة معالجة مياه عالية الأمان.",
    "why_chh_2_title": "Équipe expérimentée",
    "why_chh_2_desc": "أطباء كلى وممرضون ذوو كفاءة عالية في كل حصة.",
    "why_chh_3_title": "Hébergement",
    "why_chh_3_desc": "مساعدة في تنظيم إقامتكم السياحية بالقرب من البحر.",
    "why_chh_4_title": "Environnement agréable",
    "why_chh_4_desc": "موقع هادئ ومريح على الساحل المتوسطي لولاية تيبازة.",
    "gallery_chh_title": "Galerie photos – <span>Boucenna Cherchell</span>",
    "gallery_chh_sub": "اكتشف مركزنا من خلال هذه الصور.",
    "why_bouira_1_title": "Emplacement central",
    "why_bouira_1_desc": "موقع استراتيجي بحي 2000 مسكن وسهل الوصول من مختلف مناطق الولاية.",
    "why_bouira_2_title": "Néphrologie dédiée",
    "why_bouira_2_desc": "استشارات دورية وتكييف دقيق لبروتوكولات التصفية.",
    "why_bouira_3_title": "Confort & Sérénité",
    "why_bouira_3_desc": "قاعات مكيفة، كراسي طبية مريحة جداً ورعاية خاصة.",
    "why_bouira_4_title": "Conventionné CNAS",
    "why_bouira_4_desc": "تغطية كاملة بنسبة 100% دون دفع مسبق لجميع المؤمنين.",
    "gallery_bouira_title": "Galerie photos – <span>Boucenna Bouira</span>",
    "gallery_bouira_sub": "اكتشف تجهيزات ومرافق مركزنا بالبويرة.",
    "why_ao_1_title": "Transport dédié",
    "why_ao_1_desc": "أسطول سيارات إسعاف ونقل صحي لنقلكم بين المنزل والعيادة.",
    "why_ao_2_title": "Pharmacie affiliée",
    "why_ao_2_desc": "توفر فوري لكافة الأدوية والعلاجات الخاصة بأمراض الكلى.",
    "why_ao_3_title": "Équipe chevronnée",
    "why_ao_3_desc": "تحت الإشراف الطبي للدكتور Dr. Nassim Boucenna، أخصائي أمراض الكلى.",
    "why_ao_4_title": "Sécurité totale",
    "why_ao_4_desc": "تعقيم صارم ومحطة معالجة مياه بتقنية التناضح العكسي المزدوج.",
    "gallery_ao_title": "Galerie photos – <span>Boucenna Aïn Oulmène</span>",
    "gallery_ao_sub": "اكتشف مرافقنا وأجهزتنا وصيدليتنا بسطيف.",
    "team_nursing_badge": "Personnel & Soins en action",
    "team_nursing_title_full": "طاقم تمريضي <span>في قلب رعايتكم الصحية</span>",
    "team_nursing_sub": "حاضرون في كل حصة تصفية لضمان سلامتكم وراحتكم التامة.",
    "vac_commitment_badge": "Réseau Boucenna",
    "vac_commitment_title": "Notre engagement à vos côtés",
    "vac_commitment_sub": "نبذل قصارى جهدنا لنقدم لكم أفضل رعاية طبية أينما كنتم.",
    "vac_c1_title": "Écoute & bienveillance",
    "vac_c2_title": "Qualité & sécurité",
    "vac_c3_title": "Accompagnement personnalisé",
    "vac_side_avail": "فريق رعاية المرضى في خدمتكم",
    "badge_faq": "الأسئلة الشائعة",
    "card_cherchell_title": "Cherchell – Tipaza",
    "card_bouira_title": "Bouira",
    "card_ain_oulmene_title": "Aïn Oulmène – Sétif",
    "placeholder_stay_city": "مثال: تيبازة، البويرة، سطيف...",
    "placeholder_sessions": "مثال: 6، 12، 18...",
    "placeholder_notes": "حدد أي احتياجات خاصة، تفضيلات الإقامة...",
    "opt_select_country": "اختر بلد إقامتك",
    "opt_france": "فرنسا",
    "opt_algeria": "الجزائر (بين الولايات)",
    "opt_canada": "كندا",
    "opt_belgium": "بلجيكا",
    "opt_switzerland": "سويسرا",
    "opt_other": "بلد آخر",
    "opt_choose_center": "اختر المركز المطلوب",
    "opt_cherchell": "Cherchell (تيبازة)",
    "opt_bouira": "Bouira",
    "opt_ain_oulmene": "Aïn Oulmène (سطيف)",
    "opt_whatsapp": "WhatsApp",
    "opt_phone": "الهاتف",
    "opt_email": "البريد الإلكتروني",
    "reassure_title": "أنتم في أيدٍ أمينة",
    "reassure_desc": "يرافقكم فريق التنسيق الطبي في كل خطوة: حجز المواعيد، الاستقبال، النقل والمتابعة الطبية المخصصة.",
    "reassure_1": "تكفل طبي شامل ومؤمن 100%",
    "reassure_2": "أطقم طبية وتمريضية عالية الخبرة",
    "reassure_3": "مراكز حديثة ومريحة للغاية",
    "vac_side_hours": "من الإثنين إلى السبت من 8:00 إلى 18:00.",
    "vac_side_here": "نحن هنا دائماً لأجلكم.",
    "vac_hl1_title": "مرافقة شخصية دقيقة",
    "vac_hl1_desc": "منسق طبي خاص لتنظيم كافة مواعيدكم.",
    "vac_hl2_title": "تنظيم مسبق قبل السفر",
    "vac_hl2_desc": "خطط لجلسات تصفية الدم مسبقاً بكل راحة بال.",
    "vac_hl3_title": "رعاية ممتازة وسلامة تامة",
    "vac_hl3_desc": "مراكز حديثة مع أطقم طبية وتمريضية متمرسة.",
    "vac_hl4_title": "سفر بكل اطمئنان",
    "vac_hl4_desc": "استمتع بإقامتك في الجزائر، ونحن نتكفل بصحتك الكلوية بالكامل.",
    "center_ref_badge": "مركز مرجعي",
    "center_dialysis_badge": "مركز تصفية الدم",
    "pill_pharmacy": "صيدلية تابعة",
    "pill_cnas": "100% CNAS / CASNOS",
    "badge_video_testimonials": "شهادات حقيقية بالفيديو",
    "video_testi_1_badge": "مريضة تصفية الدم",
    "video_testi_1_title": "شهادة في مركز بوسنة",
    "video_testi_1_desc": "انطباع طيب ومؤثر حول جودة الرعاية الطبية والاهتمام الإنساني الفائق من الطاقم الطبي.",
    "video_testi_2_badge": "مريض منتظم",
    "video_testi_2_title": "الرعاية والراحة المثالية",
    "video_testi_2_desc": "شهادة حول المتابعة الطبية الصارمة والمرافقة المخصصة لضمان راحة المريض.",
    "transfer_step_title": "كيف يتم إجراء تغيير المركز؟",
    "transfer_step1_title": "1. تواصلوا معنا",
    "transfer_step1_desc": "عبر الهاتف أو الواتساب لإبلاغنا برغبتكم في التحويل.",
    "transfer_step2_title": "2. نتحقق من التوفر",
    "transfer_step2_desc": "نتحقق فوراً من المواعيد والأماكن المتاحة في المركز المطلوب (شرشال، البويرة، عين ولمان).",
    "transfer_step3_title": "3. نرسل لكم الملف والوثائق",
    "transfer_step3_desc": "نزودكم بكافة المعلومات والإجراءات الإدارية والطبية المطلوبة.",
    "transfer_step4_title": "4. قبول ملفكم الطبي",
    "transfer_step4_desc": "يؤكد المركز التكفل الطبي ويحدد تاريخ بدء الجلسات.",
    "transfer_step5_title": "5. متابعتكم المخصصة الجديدة",
    "transfer_step5_desc": "تبدأون جلساتكم في مركزكم الجديد بكل أمان وطمأنينة وراحة بال.",
    "transfer_priority_title": "هل تغسل كليتيك حالياً في مركز آخر وترغب بالانتقال؟",
    "transfer_priority_desc": "نحن نرافقكم في عملية التحويل بأمان تام وتنسيق طبي وإداري شامل بدون أي تعقيد.",
    "team_hero_badge": "الإدارة الطبية",
    "dr_boucenna_role": "أخصائي في أمراض الكلى وتصفية الدم",
    "team_section_title": "طواقمنا <span>في قلب رعايتكم الصحية</span>",
    "team_section_sub": "حاضرون في كل جلسة لضمان أقصى درجات السلامة، الراحة والاطمئنان الصحي.",
    "team_card1_badge": "فريق التمريض",
    "team_card1_title": "ممرضون متخصصون",
    "team_card1_desc": "ربط آمن، مراقبة مستمرة للعلامات الحيوية وإنصات دائم لاحتياجات كل مريض.",
    "team_card2_badge": "قطب الساحل",
    "team_card2_title": "فريق شرشال",
    "team_card2_desc": "طاقم مؤهل ومدرّب على طوارئ الكلى وحسن استقبال مرضى العطلات.",
    "team_card3_badge": "مراقبة مباشرة",
    "team_card3_title": "مراقبة تصفية الدم",
    "team_card3_desc": "مراقبة صارمة لأجهزة الغسيل، تعقيم فائق وتوفير الراحة التامة طوال مدة العلاج.",
    "cnas_main_intro": "التكفل بجلسات تصفية الدم مؤمن 100% ضمن إطار الصندوق الوطني CNAS. نقوم بجميع الإجراءات نيابة عنكم.",
    "conseil_badge_hero": "دليل صحة الكلى",
    "conseil_hero_title": "نصائح وإرشادات طبية <span>لمرضى تصفية الدم</span>",
    "conseil_cnas_highlight": "تكفل كامل 100% من طرف الضمان الاجتماعي (CNAS / CASNOS)",
    "conseil_emergency_highlight": "مساعدة واستشارة طبية متاحة على مدار 24 ساعة وطوال أيام الأسبوع",
    "dept_hero_badge": "أقسامنا الطبية",
    "dept_pharma_badge": "صيدلية متخصصة تابعة",
    "vac_form_alert_success_title": "طلبكم جاهز للإرسال!",
    "vac_form_alert_success_desc": "سيتم فتح تطبيق واتساب مع رسالتكم الجاهزة. يرجى التحقق من المعلومات ثم الضغط على <strong>إرسال</strong> لتأكيد طلبكم لدى فريق بوسنة.",
    "vac_form_error_required": "يرجى ملء جميع الحقول المطلوبة الإلزامية (*).",
    "vac_form_error_dates": "تاريخ المغادرة لا يمكن أن يكون قبل تاريخ الوصول.",
    "contact_form_error_required": "يرجى إدخال الاسم، رقم الهاتف والرسالة."
  }
};

function initLanguageSwitcher() {
  const urlParams = new URLSearchParams(window.location.search);
  const paramLang = urlParams.get('lang');
  const savedLang = (paramLang && ['fr', 'en', 'ar'].includes(paramLang)) ? paramLang : (localStorage.getItem('boucenna_lang') || 'fr');
  setLanguage(savedLang);

  document.addEventListener('click', (e) => {
    const langBtn = e.target.closest('.lang-btn');
    const langSelector = e.target.closest('.lang-selector');
    
    if (langBtn && langSelector) {
      langSelector.classList.toggle('active');
      return;
    }

    const langOption = e.target.closest('.lang-option');
    if (langOption) {
      const selectedLang = langOption.getAttribute('data-lang');
      if (selectedLang) {
        setLanguage(selectedLang);
      }
      const parentSelector = langOption.closest('.lang-selector');
      if (parentSelector) parentSelector.classList.remove('active');
      return;
    }

    document.querySelectorAll('.lang-selector').forEach(sel => sel.classList.remove('active'));
  });
}

function setLanguage(lang) {
  if (!i18nDictionary[lang]) lang = 'fr';
  localStorage.setItem('boucenna_lang', lang);

  const isRTL = lang === 'ar';
  document.documentElement.lang = lang;
  document.documentElement.dir = isRTL ? 'rtl' : 'ltr';

  // Body classes for RTL/LTR
  if (isRTL) {
    document.body.classList.add('lang-ar');
    document.body.classList.remove('lang-ltr');
  } else {
    document.body.classList.remove('lang-ar');
    document.body.classList.add('lang-ltr');
  }

  // Update button label
  document.querySelectorAll('.current-lang-text').forEach(el => {
    el.textContent = lang.toUpperCase();
  });

  // Update dropdown selection
  document.querySelectorAll('.lang-option').forEach(opt => {
    if (opt.getAttribute('data-lang') === lang) {
      opt.classList.add('active');
    } else {
      opt.classList.remove('active');
    }
  });

  // Translate all marked elements
  const t = i18nDictionary[lang];
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (t && t[key]) {
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.placeholder = t[key];
      } else if (el.tagName === 'OPTION') {
        el.textContent = t[key];
      } else if (el.tagName === 'SELECT') {
        // do not touch select innerHTML
      } else {
        el.innerHTML = t[key];
      }
    }
  });

  // Mirror directional icons in RTL
  document.querySelectorAll('.dir-flip').forEach(icon => {
    icon.style.transform = isRTL ? 'scaleX(-1)' : '';
  });

  // Fix form controls direction
  document.querySelectorAll('input, textarea, select').forEach(el => {
    el.dir = isRTL ? 'rtl' : 'ltr';
  });
}

document.addEventListener('DOMContentLoaded', initLanguageSwitcher);

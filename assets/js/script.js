/**
 * BOUCENNA WEBSITE - MAIN JAVASCRIPT & FULL MULTILINGUAL TRANSLATION ENGINE
 * (100% Client-Side - Zero Untranslated Words in Arabic RTL - Pure WhatsApp Workflow - Zero Database)
 */

'use strict';

/**
 * GOOGLE ANALYTICS 4 / CONVERSION EVENT TRACKER (CdC Section 18)
 * Respectful of privacy - zero patient health data sent to analytics
 */
function trackAnalyticsEvent(eventName, params = {}) {
  try {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: eventName,
      ...params,
      timestamp: new Date().toISOString()
    });
    if (typeof gtag === 'function') {
      gtag('event', eventName, params);
    }
  } catch (err) {
    console.debug('Analytics tracker event:', eventName, err);
  }
}

// Track page view on load
document.addEventListener('DOMContentLoaded', () => {
  if (window.location.pathname.includes('dialyse-vacances')) {
    trackAnalyticsEvent('vacation_page_view', { page: 'dialyse-vacances' });
  }
});

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
 * PRE-SELECT CENTER BUTTONS ON DIALYSE VACANCES (CdC Section 5)
 */
document.addEventListener('click', (e) => {
  const chooseBtn = e.target.closest('[data-choose-center]');
  if (!chooseBtn) return;
  
  const centerName = chooseBtn.getAttribute('data-choose-center');
  const selectEl = document.getElementById('vacation-center-select');
  if (selectEl && centerName) {
    selectEl.value = centerName;
    trackAnalyticsEvent('vacation_center_select', { center: centerName });
  }

  const formSection = document.getElementById('formulaire-vacances');
  if (formSection) {
    formSection.scrollIntoView({ behavior: 'smooth' });
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
 * TRACKING FOR CALL & WHATSAPP BUTTONS (CdC Section 18)
 */
document.addEventListener('click', (e) => {
  const trackEl = e.target.closest('[data-track]');
  if (!trackEl) return;
  const eventType = trackEl.getAttribute('data-track');
  if (eventType === 'vacation_whatsapp_click') {
    trackAnalyticsEvent('vacation_whatsapp_click', { source: 'vacation_page' });
  } else if (eventType === 'vacation_phone_click') {
    trackAnalyticsEvent('vacation_phone_click', { source: 'vacation_page' });
  }
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
 * VACATION REQUEST FORM -> WHATSAPP INTEGRATION (CdC Section 7, 8, 15 & 18)
 * Respectful of medical privacy: No medical diagnosis, access vascular or serology sent
 */
const vacationForm = document.getElementById('vacation-request-form');
if (vacationForm) {
  let formStarted = false;
  vacationForm.addEventListener('focusin', () => {
    if (!formStarted) {
      formStarted = true;
      trackAnalyticsEvent('vacation_form_start');
    }
  });

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

    // Validation des champs obligatoires
    if (!data.full_name || !data.country || !data.phone || !data.stay_city || !data.arrival_date || !data.departure_date || !data.center) {
      if (errorAlert) {
        if (errorMsg) errorMsg.textContent = t.vac_form_error_required || 'Veuillez renseigner tous les champs obligatoires (*).';
        errorAlert.style.display = 'flex';
      }
      return;
    }

    // Consent Checkbox (Mandatory CdC Section 7)
    const consentBox = document.getElementById('vacation-consent');
    if (consentBox && !consentBox.checked) {
      if (errorAlert) {
        if (errorMsg) errorMsg.textContent = t.vac_form_error_consent || 'Veuillez accepter la politique de traitement des informations.';
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

    // Track Analytics Conversion Event (CdC Section 18)
    trackAnalyticsEvent('vacation_form_submit', {
      center: data.center,
      country: data.country
    });

    let headerTitle = "🏥 *Demande de Dialyse Vacances — Clinique Boucenna*";
    let lFullName = "👤 *Nom et prénom :*";
    let lCountry = "🌍 *Pays de résidence :*";
    let lPhone = "📱 *Téléphone / WhatsApp :*";
    let lCity = "📍 *Ville de séjour en Algérie :*";
    let lArrival = "📅 *Date d'arrivée :*";
    let lDeparture = "📅 *Date de départ :*";
    let lCenter = "🏥 *Centre souhaité :*";
    let lSessions = "🔢 *Nombre de séances :*";
    let lContact = "💬 *Canal préféré :*";
    let lNotes = "📝 *Informations complémentaires :*";

    if (currentLang === 'ar') {
      headerTitle = "🏥 *طلب غسيل كلى أثناء العطلات — عيادة بوسنة*";
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
      lCenter = "🏥 *Preferred Center :*";
      lSessions = "🔢 *Number of Sessions :*";
      lContact = "💬 *Preferred Contact :*";
      lNotes = "📝 *Additional Information :*";
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
      data.sessions_count ? `${lSessions} ${data.sessions_count}` : '',
      data.preferred_contact ? `${lContact} ${data.preferred_contact}` : ''
    ].filter(Boolean);

    if (data.additional_notes && data.additional_notes.trim() !== '') {
      lines.push(`${lNotes} ${data.additional_notes.trim()}`);
    }

    const messageText = lines.join('\n');
    const whatsappUrl = `https://wa.me/213770313136?text=${encodeURIComponent(messageText)}`;

    if (successAlert) {
      successAlert.style.display = 'flex';
      successAlert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    window.open(whatsappUrl, '_blank');
  });
}

/**
 * ==========================================================================
 * EXHAUSTIVE MULTILINGUAL TRANSLATION SYSTEM (FR / EN / AR)
 * 100% Complete - Zero French words remaining in Arabic RTL dictionary
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
    "video_card1_title": "Clinique Boucenna Cherchell (Tipaza)",
    "video_card1_desc": "Cadre maritime apaisant et salles d'hémodialyse équipées des dernières technologies.",
    "video_card2_title": "Clinique Boucenna Bouira",
    "video_card2_desc": "Installations de pointe et accueil personnalisé au centre de Bouira.",
    "title_testimonials": "L'expérience de <span>nos patients</span>",
    "sub_testimonials": "Découvrez les retours en vidéo et les témoignages de nos patients pris en charge dans nos centres.",
    "testi_1_text": "Une merveilleuse addition à Cherchell et à notre belle région de Sidi Yahia. Bonne continuation !",
    "testi_1_author": "Abdelhak Bourahli",
    "testi_1_city": "Local Guide • Cherchell (Sidi Yahia)",
    "testi_2_text": "Un grand apport pour la région sud de la wilaya de Sétif. Établissement propre et accueil remarquable.",
    "testi_2_author": "Marouane Algérie",
    "testi_2_city": "Local Guide • Sétif (Aïn Oulmène)",
    "testi_3_text": "C'est la meilleure clinique de dialyse, service irréprochable et équipe au top.",
    "testi_3_author": "Anis Anis09",
    "testi_3_city": "Avis Google Maps vérifié",
    "testi_1_quote": "Une merveilleuse addition à Cherchell et à notre belle région de Sidi Yahia. Bonne continuation !",
    "testi_2_quote": "Un grand apport pour la région sud de la wilaya de Sétif. Établissement propre et accueil remarquable.",
    "testi_3_quote": "C'est la meilleure clinique de dialyse, service irréprochable et équipe au top.",
    "badge_boucenna_network": "Réseau Boucenna",
    "hero_title_vacances": "Dialyse pendant vos vacances en Algérie",
    "hero_sub_vacances": "Vous venez en Algérie pour quelques jours ou plusieurs semaines ? Organisez vos séances de dialyse avec Boucenna avant votre arrivée, en toute simplicité.",
    "hero_reassurance_line": "3 centres • Équipe médicale expérimentée • Coordination avant le voyage • Contact WhatsApp",
    "btn_organize_sessions": "ORGANISER MES SÉANCES",
    "btn_call": "APPELER",
    "btn_whatsapp": "WHATSAPP",
    "badge_our_centers": "Nos centres",
    "title_choose_center_section": "Choisissez le centre le plus pratique pour votre séjour",
    "sub_choose_center_section": "Le Réseau Boucenna vous accueille dans ses 3 centres d'excellence. Cherchell au bord de mer est mis en avant, tout en vous laissant le libre choix pour Bouira et Aïn Oulmène.",
    "ribbon_highlight": "Littoral & Vue Mer",
    "zone_cherchell": "Tipaza / littoral / ouest d’Alger",
    "card_cherchell_title": "Cherchell – Tipaza",
    "cherchell_vac_desc": "Cadre apaisant en bord de mer, générateurs récents, réponse rapide sous 24h et disponibilités sur demande.",
    "quick_resp_24h": "Réponse sous 24h",
    "quick_avail_ondemand": "Disponibilités sur demande",
    "btn_choose_cherchell": "Choisir Cherchell",
    "zone_bouira": "Bouira et environs",
    "card_bouira_title": "Bouira",
    "bouira_vac_desc": "Emplacement stratégique à la Cité 2000 Logements, environnement serein, accès direct autoroute Est-Ouest.",
    "quick_contact_direct": "Contact direct",
    "quick_modern_room": "Salles climatisées",
    "btn_choose_bouira": "Choisir Bouira",
    "zone_ain_oulmene": "Sétif et sud de Sétif",
    "card_ain_oulmene_title": "Aïn Oulmène – Sétif",
    "ain_oulmene_vac_desc": "Plateau technique de pointe et service de transport médicalisé dédié.",
    "quick_transport_avail": "Transport dédié",
    "quick_pharma_avail": "Plateau de pointe",
    "btn_choose_ain_oulmene": "Choisir Aïn Oulmène",
    "btn_view_details": "Voir les détails de la clinique →",
    "title_4steps": "Votre parcours de dialyse en 4 étapes",
    "sub_4steps": "Nous vous accompagnons à chaque étape pour organiser vos séances en toute sérénité.",
    "step1_title": "1. Envoyez vos dates",
    "step1_desc": "Indiquez votre période de séjour, votre ville en Algérie et le centre Boucenna souhaité.",
    "step2_title": "2. Nous vérifions les disponibilités",
    "step2_desc": "Notre équipe vous confirme si des créneaux peuvent être réservés pendant votre séjour.",
    "step3_title": "3. Votre dossier est étudié",
    "step3_desc": "Après le premier contact, nous vous indiquons les documents médicaux nécessaires et le moyen sécurisé de les transmettre.",
    "step4_title": "4. Vous recevez votre confirmation",
    "step4_desc": "Après validation médicale et administrative, vous recevez les informations utiles pour vos séances avant votre arrivée.",
    "microtext_steps": "Nous vous recommandons de nous contacter le plus tôt possible avant votre voyage. Les disponibilités varient selon la période et le centre.",
    "form_title": "Préparer mes séances de dialyse pendant mon séjour",
    "form_subtitle": "Le formulaire est court, mobile et rassurant. Aucun dossier médical complet n'est demandé au premier contact.",
    "form_name_label": "Nom et prénom *",
    "form_country_label": "Pays de résidence *",
    "form_phone_label": "Téléphone / WhatsApp (avec indicatif) *",
    "form_city_label": "Ville de séjour en Algérie *",
    "form_arrival_label": "Date d'arrivée *",
    "form_departure_label": "Date de départ *",
    "form_center_label": "Centre souhaité *",
    "form_sessions_label": "Nombre approximatif de séances (optionnel)",
    "form_contact_pref_label": "Canal préféré de contact (optionnel)",
    "form_notes_label": "Informations complémentaires (facultatif)",
    "form_consent_label": "J’accepte que Boucenna utilise les informations ci-dessus pour traiter ma demande et me recontacter.",
    "form_privacy_link": "Politique de confidentialité & protection des données",
    "form_btn_submit": "ENVOYER MA DEMANDE",
    "form_success_msg": "Merci. Votre demande a bien été reçue. Notre équipe vous contactera pour vérifier les disponibilités et vous expliquer la suite.",
    "opt_select_country": "Sélectionnez votre pays",
    "opt_france": "France",
    "opt_belgium": "Belgique",
    "opt_switzerland": "Suisse",
    "opt_canada": "Canada",
    "opt_uk": "Royaume-Uni",
    "opt_algeria": "Algérie (inter-wilaya)",
    "opt_other": "Autre pays",
    "opt_choose_center": "Choisir un centre",
    "opt_cherchell": "Cherchell (Tipaza / Littoral)",
    "opt_bouira": "Bouira",
    "opt_ain_oulmene": "Aïn Oulmène (Sétif)",
    "opt_dont_know": "Je ne sais pas (nous vous orienterons)",
    "opt_whatsapp": "WhatsApp",
    "opt_phone": "Appel téléphonique",
    "opt_email": "E-mail",
    "vac_form_alert_success_title": "Demande transmise avec succès !",
    "vac_form_error_required": "Veuillez renseigner tous les champs obligatoires (*).",
    "vac_form_error_consent": "Veuillez accepter la politique de traitement des informations.",
    "vac_form_error_dates": "La date de départ ne peut pas être antérieure à la date d'arrivée.",
    "reassure_title": "Vous êtes entre de bonnes mains",
    "reassure_desc": "Notre équipe de coordination médicale vous accompagne à chaque étape : planification des créneaux, transport sanitaire et suivi personnalisé.",
    "reassure_1": "Aucune donnée médicale demandée sur ce formulaire",
    "reassure_2": "Équipes médicales et néphrologues expérimentés",
    "reassure_3": "Confirmation écrite avant votre arrivée",
    "faq_side_title": "Besoin d'aide personnalisée ?",
    "faq_side_desc": "Notre équipe est à votre écoute pour vous conseiller et vous accompagner dans l'organisation de votre séjour de dialyse.",
    "faq_btn_whatsapp": "Nous contacter sur WhatsApp",
    "faq_btn_call": "Nous appeler (+213 770 31 31 36)",
    "badge_why_us": "Pourquoi nous choisir",
    "title_why_vacances": "Pourquoi Boucenna pendant votre séjour ?",
    "sub_why_vacances": "Un accompagnement haut de gamme et sécurisé pensé spécialement pour les voyageurs et la diaspora.",
    "why_v1_title": "Coordination avant l’arrivée",
    "why_v1_desc": "Vous savez avant votre voyage si votre organisation est confirmée.",
    "why_v2_title": "Équipe médicale expérimentée",
    "why_v2_desc": "Une équipe habituée à la prise en charge en hémodialyse.",
    "why_v3_title": "Centres modernes",
    "why_v3_desc": "Environnement propre, confortable et rassurant.",
    "why_v4_title": "Contact WhatsApp",
    "why_v4_desc": "Un échange simple avant et pendant votre séjour.",
    "why_v5_title": "Plusieurs implantations",
    "why_v5_desc": "Cherchell, Bouira et Aïn Oulmene.",
    "why_v6_title": "Accompagnement administratif",
    "why_v6_desc": "L’équipe vous explique les démarches correspondant à votre situation.",
    "priority_health_title": "Votre santé, notre priorité",
    "priority_health_desc": "Avec Boucenna, vous bénéficiez d'un réseau de confiance engagé à vos côtés pour des soins de qualité, où que vous soyez.",
    "title_video_immersion": "Votre dialyse pendant votre séjour : comment ça se passe ?",
    "sub_video_immersion": "Visionnez les vidéos réelles filmées au sein de nos cliniques à Cherchell et Bouira.",
    "badge_medical_security": "Sécurité des données de santé",
    "title_medical_file": "Dossier médical : comment l’envoyer ?",
    "sub_medical_file": "Le formulaire public ne demande aucune donnée médicale. Après vérification des disponibilités, nous vous transmettons un lien sécurisé dédié.",
    "sec_w1_title": "Premier contact sans données sensibles",
    "sec_w1_desc": "Vous envoyez uniquement vos dates et votre centre de choix via le formulaire.",
    "sec_w2_title": "Lien sécurisé et chiffré",
    "sec_w2_desc": "Notre équipe vous envoie un lien sécurisé HTTPS distinct avec contrôle d'accès.",
    "sec_w3_title": "Étude confidentielle par le néphrologue",
    "sec_w3_desc": "Le médecin spécialiste étudie votre dossier pour adapter vos protocoles de dialyse.",
    "docs_checklist_title": "Liste des documents à préparer",
    "docs_checklist_sub": "À transmettre uniquement après le premier contact :",
    "doc_item_1": "Prescription / protocole de dialyse récent",
    "doc_item_2": "Compte rendu médical ou résumé de prise en charge",
    "doc_item_3": "Derniers bilans biologiques utiles et sérologies",
    "doc_item_4": "Informations sur l’abord vasculaire et traitements en cours",
    "doc_item_5": "Coordonnées de votre centre de dialyse habituel",
    "doc_item_note": "* La liste finale est validée par le médecin néphrologue selon votre situation médicale.",
    "badge_coverage": "Couverture & Formalités",
    "title_pricing_coverage": "Prise en charge et règlement",
    "desc_pricing_coverage": "Les modalités de prise en charge ou de règlement varient selon votre pays de résidence, votre couverture et votre situation. Notre équipe vérifie avec vous les modalités applicables avant la confirmation définitive de vos séances.",
    "cov_card1_title": "Résidents en Europe & Diaspora",
    "cov_card1_desc": "France, Belgique, Suisse, Royaume-Uni, Canada... Nous vous indiquons les démarches selon vos assurances et conventions applicables.",
    "cov_card2_title": "Transparence & Accompagnement",
    "cov_card2_desc": "Aucune mauvaise surprise : les modalités financières et administratives sont vérifiées et validées avant votre arrivée.",
    "cov_card3_title": "Sécurité Sociale Algérienne (CNAS)",
    "cov_card3_desc": "Pour les assurés sociaux résidents ou affiliés, prise en charge conventionnée conformément à la réglementation en vigueur.",
    "badge_testimonials": "Retours d'expérience",
    "title_vacation_testimonials": "Témoignages",
    "sub_vacation_testimonials": "L'expérience des patients de passage et vacanciers ayant organisé leurs séances avec Boucenna.",
    "v_testi1_quote": "« Je réside en France et je viens chaque été voir ma famille. L'organisation avec le centre de Cherchell a été d'une fluidité exemplaire. Ponctualité, accueil et sérénité totale. »",
    "v_testi1_author": "Karim B.",
    "v_testi1_city": "Paris / Séjour à Tipaza",
    "v_testi2_quote": "« C'était ma première dialyse hors de Belgique. L'équipe médicale de Bouira a vérifié mon protocole en amont. Les générateurs sont très modernes et le confort est irréprochable. »",
    "v_testi2_author": "Fatima Z.",
    "v_testi2_city": "Bruxelles / Séjour à Bouira",
    "v_testi3_quote": "« Organisation rapide via WhatsApp, dossier médical traité en toute discrétion. Arrivé à Sétif, tout était prêt pour ma première séance sans aucune attente. »",
    "v_testi3_author": "Mohamed L.",
    "v_testi3_city": "Lyon / Séjour à Aïn Oulmène",
    "btn_more_google_reviews": "Consulter davantage d'avis sur Google Maps →",
    "badge_faq": "FAQ Internationale",
    "title_faq": "Questions fréquentes",
    "sub_faq": "Retrouvez les réponses aux questions essentielles pour préparer votre dialyse pendant votre séjour en Algérie.",
    "faq_q1": "Combien de temps avant mon voyage dois-je vous contacter ?",
    "faq_a1": "Le plus tôt possible. Les créneaux dépendent des disponibilités du centre et de la validation de votre dossier.",
    "faq_q2": "Comment savoir si mes séances sont bien réservées ?",
    "faq_a2": "Vos séances ne sont considérées comme confirmées qu’après validation médicale et administrative et après réception d’une confirmation de Boucenna.",
    "faq_q3": "Quels documents médicaux dois-je envoyer ?",
    "faq_a3": "Après le premier contact, notre équipe vous communique la liste correspondant à votre situation ainsi qu’un moyen sécurisé de transmission.",
    "faq_q4": "Puis-je choisir mes jours ou mes horaires ?",
    "faq_a4": "Vous pouvez indiquer vos préférences. Le centre vous proposera les créneaux compatibles avec votre prescription et les disponibilités.",
    "faq_q5": "Je vis en France / Belgique / ailleurs : comment fonctionne la prise en charge ?",
    "faq_a5": "Cela dépend de votre couverture et de votre situation. Boucenna vous explique les modalités avant la confirmation des séances.",
    "faq_q6": "Puis-je modifier mes dates ?",
    "faq_a6": "Contactez-nous dès que possible. Toute modification reste soumise aux disponibilités.",
    "faq_q7": "Puis-je venir accompagné ?",
    "faq_a7": "Oui, selon l’organisation du centre. L’équipe vous précisera les conditions pratiques.",
    "faq_q8": "Où se trouvent les centres ?",
    "faq_a8": "La page propose l’adresse, la carte et le bouton Itinéraire pour Cherchell, Bouira et Aïn Oulmene.",
    "badge_access_map": "Accès & Localisation",
    "title_centers_map": "Où se trouvent nos centres ?",
    "sub_centers_map": "Retrouvez les coordonnées complètes et lancez votre itinéraire GPS en un clic.",
    "title_final_cta": "Préparez votre séjour avant votre départ",
    "desc_final_cta": "Indiquez-nous vos dates et votre lieu de séjour. Notre équipe vérifie les disponibilités et vous accompagne étape par étape jusqu’à la confirmation de vos séances.",
    "footer_tagline": "Vos soins rénaux, notre priorité.<br>Transport sanitaire et consultations spécialisées.",
    "footer_maps_link": "Itinéraire Google Maps",
    "footer_copyright": "© 2026 Clinique Dialyse Boucenna — Tous droits réservés.",
    "footer_sitemap": "Plan du site",
    "footer_c2_title": "Boucenna Cherchell",
    "footer_c2_address": "Cité Zitouni El Kheir<br>Cherchell, Tipaza",
    "footer_c3_title": "Boucenna Bouira",
    "footer_c3_address": "Cité 2000 Logements<br>Bouira",
    "footer_c4_title": "Boucenna Aïn Oulmène",
    "footer_c4_address": "Aïn Oulmène, Sétif",
    "whatsapp_tooltip": "Besoin d'aide ? Écrivez-nous",
    "label_phone_whatsapp": "Tél / WhatsApp :",
    "label_fullname": "Nom complet *",
    "label_phone_req": "Téléphone *",
    "label_email": "Email",
    "label_your_message": "Votre message *",
    "placeholder_name": "Votre nom",
    "placeholder_phone": "+213...",
    "placeholder_email": "email@domaine.com",
    "placeholder_message": "Écrivez votre message...",
    "about_badge": "À Propos de nous",
    "about_hero_title": "Une expertise médicale<br><span>à votre service</span>",
    "about_hero_sub": "Le Réseau Boucenna, leader en hémodialyse en Algérie, s'engage à vous offrir des soins de qualité, humains et innovants.",
    "about_section1_badge": "Notre réseau",
    "about_section1_title": "Leader de l'Assistance<br><span>Médicale en Algérie</span>",
    "about_section1_p1": "Le Réseau Boucenna s'est imposé comme l'un des leaders de l'hémodialyse en Algérie, grâce à une équipe de professionnels aguerris et des moyens matériels de premier plan pour offrir les meilleures conditions de prise en charge.",
    "about_section1_p2": "Notre réseau comprend aujourd'hui un néphrologue spécialiste, des médecins généralistes et une équipe de soins infirmiers dédiée dans nos 3 centres de Cherchell, Bouira et Aïn Oulmène.",
    "about_doctor_badge": "Direction Médicale",
    "about_doctor_title": "Dr Nassim Boucenna",
    "about_doctor_sub": "Fondateur & Leader en santé et innovation médicale.",
    "about_doctor_b1": "Fort de plus de 12 ans d'expérience dans le secteur de la santé, il pilote un réseau de cliniques spécialisées en hémodialyse et une entreprise de transport médical.",
    "about_doctor_b2": "DPharm et MSc en Biochimie, il mène des projets alliant biologie moléculaire et intégration de l'intelligence artificielle pour optimiser les soins médicaux.",
    "about_doctor_b3": "Passionné par l'innovation et l'amélioration du bien-être des patients, il conçoit et déploie des solutions de santé avancées alignées sur les besoins réels du terrain.",
    "about_commit_badge": "Nos engagements",
    "about_commit_title": "Pourquoi choisir<br><span>Boucenna ?</span>",
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
    "prop_quality_care": "Coordination médicale dédiée",
    "prop_quality_care_desc": "Validation des créneaux et suivi administratif avant votre départ.",
    "prop_peaceful_trip": "Voyage en toute sérénité",
    "prop_peaceful_trip_desc": "Nous organisons vos séances selon votre planning de séjour.",
    "prop_dedicated_help": "Échange simple & direct",
    "prop_dedicated_help_desc": "Un interlocuteur WhatsApp dédié à votre écoute à chaque étape.",
    "dr_boucenna_role": "Néphrologue & Directeur Médical",
    "video_testi_1_badge": "Patiente en hémodialyse",
    
    "badge_team_local": "Équipe locale dévouée",
    "title_team_cherchell": "L'équipe soignante de <span>Cherchell</span>",
    "desc_team_cherchell": "Une équipe médicale et infirmière chevronnée, attentive et bilingue, présente à chaque séance d'hémodialyse pour vous assurer des soins d'excellence dans un cadre serein au bord de la Méditerranée.",
    "title_team_bouira": "L'équipe soignante de <span>Bouira</span>",
    "desc_team_bouira": "Nos néphrologues, infirmiers diplômés d'État et aides-soignants vous accueillent chaleureusement à la Cité 2000 Logements avec un accompagnement personnalisé et une écoute permanente.",
    "btn_contact_team": "Contacter l'équipe",
    
    "badge_team_local": "Dedicated Local Team",
    "title_team_cherchell": "The Healthcare Team of <span>Cherchell</span>",
    "desc_team_cherchell": "An experienced, attentive, and bilingual medical and nursing team present at every hemodialysis session to deliver top-tier care in a serene Mediterranean seaside setting.",
    "title_team_bouira": "The Healthcare Team of <span>Bouira</span>",
    "desc_team_bouira": "Our nephrologists, certified dialysis nurses, and healthcare assistants warmly welcome you at Cité 2000 Logements with personalized support and constant attentiveness.",
    "btn_contact_team": "Contact the Team",
    
    "badge_team_local": "طاقم محلي متفانٍ",
    "title_team_cherchell": "الطاقم الطبي والتمريضي في <span>شرشال</span>",
    "desc_team_cherchell": "طاقم طبي وتمريضي ذو خبرة عالية وحسن استماع، متواجد في كل حصة تصفية دم لضمان رعاية ممتازة في بيئة هادئة ومريحة على الساحل المتوسطي.",
    "title_team_bouira": "الطاقم الطبي والتمريضي في <span>البويرة</span>",
    "desc_team_bouira": "أطباؤنا وممرضونا المؤهلون يستقبلونكم بكل عناية في حي 2000 مسكن بالبويرة مع مرافقة شخصية وإنصات دائم لاحتياجاتكم.",
    "btn_contact_team": "تواصل مع الفريق",
    "title_testi_bouira": "L'expérience à <span>Boucenna Bouira</span>",
    "sub_testi_bouira": "Retour d'expérience chaleureux d'une patiente sur la qualité des soins et l'accompagnement à notre centre de Bouira.",
    "title_testi_cherchell": "L'expérience à <span>Boucenna Cherchell</span>",
    "sub_testi_cherchell": "Témoignage d'un patient régulier sur le suivi médical rigoureux et le confort au centre de Cherchell.",

    "video_testi_1_title": "Témoignage au Centre Boucenna",
    "video_testi_1_desc": "Retour d'expérience chaleureux sur la qualité des soins et l'attention du personnel soignant.",
    "video_testi_2_badge": "Patient régulier",
    "video_testi_2_title": "Prise en charge et confort",
    "video_testi_2_desc": "Témoignage sur le suivi médical rigoureux et l'accompagnement personnalisé.",

    "contact_form_error_required": "Veuillez renseigner votre nom, téléphone et message."
,
    "dept_badge": "Nos départements",
    "dept_hero_title": "Nos Services &<br><span>Départements Médicaux</span>",
    "dept_hero_sub": "Hémodialyse, consultations de néphrologie et transport sanitaire médicalisé — tout pour votre prise en charge complète.",
    "dept_hemo_badge": "Département 1",
    "dept_hemo_title": "Séances<br><span>d'Hémodialyse</span>",
    "dept_hemo_p1": "Nos centres d'hémodialyse disposent de plusieurs postes de dialyse équipés des dernières générations de générateurs, disponibles du dimanche au jeudi.",
    "dept_hemo_p2": "Chaque séance est supervisée par une équipe médicale et paramédicale expérimentée, dans un environnement stérile et confortable.",
    "dept_hemo_f1": "Générateurs de dialyse de dernière génération",
    "dept_hemo_f2": "Protocoles de stérilisation stricts",
    "dept_hemo_f3": "Surveillance médicale continue",
    "dept_hemo_f4": "Prise en charge CNAS / CASNOS à 100%",
    "dept_nephro_badge": "Département 2",
    "dept_nephro_title": "Consultations de<br><span>Néphrologie</span>",
    "dept_nephro_p": "Les consultations de néphrologie sont assurées par le Dr Nassim Boucenna, spécialiste en maladies rénales et hémodialyse, accompagné de médecins généralistes expérimentés.",
    "dept_nephro_f1": "Suivi de l'insuffisance rénale chronique",
    "dept_nephro_f2": "Adaptation des protocoles de dialyse",
    "dept_nephro_f3": "Suivi personnalisé et bilan biologique",
    "dept_nephro_f4": "Gestion des complications rénales",
    "dept_transport_badge": "Département 3",
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
    "team_nursing_badge": "Personnel & Soins en action",
    "team_section_title": "Nos équipes <span>au cœur de vos soins</span>",
    "team_section_sub": "Présents à chaque séance d'hémodialyse pour garantir votre sécurité, votre confort et votre bien-être.",
    "team_nursing_title": "Équipe soignante & paramédicale",
    "team_nursing_desc": "Des infirmiers diplômés et techniciens chevronnés dédiés à votre prise en charge au quotidien dans chacun de nos 3 centres.",
    "team_card1_badge": "Équipe de soins",
    "team_card1_title": "Infirmiers Spécialisés",
    "team_card1_desc": "Branchement sécurisé, surveillance continue des constantes vitales et écoute bienveillante.",
    "team_card2_badge": "Pôle Littoral",
    "team_card2_title": "Équipe de Cherchell",
    "team_card2_desc": "Personnel soignant qualifié formé aux urgences néphrologiques et à l'accueil des vacanciers.",
    "team_card3_badge": "Suivi en direct",
    "team_card3_title": "Surveillance Hémodialyse",
    "team_card3_desc": "Contrôle strict des générateurs, stérilisation et confort pendant toute la durée du traitement.",
    "transfer_title": "Comment se passe<br><span>un changement de centre ?</span>",
    "transfer_sub": "Notre équipe vous accompagne à chaque étape pour faciliter vos démarches.",
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
    "cnas_title": "Prise en charge <span>CNAS</span>",
    "cnas_main_intro": "La prise en charge en dialyse est assurée dans le cadre de la CNAS.<br>Nous faisons toutes les démarches à votre place.",
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
    "pill_team": "Équipe expérimentée",
    "pill_tech": "Matériel de pointe",
    "pill_hygiene": "Hygiène et sécurité",
    "pill_care": "Prise en charge personnalisée",
    "btn_call_center": "Appeler le centre",
    "btn_itineraire": "Itinéraire",
    "center_dialysis_badge": "Centre de dialyse",
    "center_ref_badge": "Centre de référence",
    "pill_pharmacy": "Plateau technique",
    "pill_cnas": "100% CNAS / CASNOS",
    "cherchell_hero_title": "Centre d'Hémodialyse<br><span>Boucenna – Cherchell</span>",
    "cherchell_hero_sub": "Un centre moderne et performant dédié à votre bien-être, avec une équipe médicale expérimentée.",
    "why_cherchell_title": "Pourquoi choisir <span>Boucenna Cherchell ?</span>",
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
    "bouira_hero_title": "Centre d'Hémodialyse<br><span>Boucenna – Bouira</span>",
    "why_bouira_title": "Pourquoi choisir <span>Boucenna Bouira ?</span>",
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
    "ain_oulmene_hero_title": "Centre d'Hémodialyse<br><span>Boucenna – Aïn Oulmène</span>",
    "why_ain_oulmene_title": "Pourquoi choisir <span>Boucenna Aïn Oulmène ?</span>",
    "why_ao_1_title": "Transport dédié",
    "why_ao_1_desc": "Flotte d'ambulances et véhicules sanitaires pour vos trajets domicile-clinique.",
    "why_ao_2_title": "Plateau technique",
    "why_ao_2_desc": "Équipements de dernière génération et générateurs récents pour votre sécurité.",
    "why_ao_3_title": "Équipe chevronnée",
    "why_ao_3_desc": "Sous la direction médicale du Dr Nassim Boucenna, néphrologue d'expérience.",
    "why_ao_4_title": "Sécurité totale",
    "why_ao_4_desc": "Stérilisation stricte, salle de traitement d'eau bi-osmose inversée.",
    "gallery_ao_title": "Galerie photos – <span>Boucenna Aïn Oulmène</span>",
    "gallery_ao_sub": "Découvrez nos installations, nos générateurs et notre pharmacie à Sétif."
  },

  "en": {
    "lang_name": "EN",
    "nav_home": "Home",
    "nav_centers": "Our Centers",
    "nav_team": "Medical Team",
    "nav_transfer": "Transfer Center",
    "nav_cnas": "CNAS Coverage",
    "nav_vacation": "Holiday Dialysis",
    "nav_contact": "Contact",
    "nav_contact_btn": "Contact Us",
    "btn_espace_patient": "Patient Portal",
    "drop_cherchell": "Cherchell Center (Tipaza)",
    "drop_bouira": "Bouira Center",
    "drop_ain_oulmene": "Ain Oulmene Center (Setif)",
    "nav_presentation": "About Us",
    "drop_about": "About",
    "drop_depts": "Our Departments",
    "drop_advice": "Guide & Advice",
    "nav_about": "About",
    "nav_depts": "Departments",
    "nav_advice": "Advice",
    "hero_title_home": "Boucenna Hemodialysis<br><span>Center Network</span>",
    "hero_sub_home": "A high-quality, caring, and innovative center network at your service in Cherchell, Bouira, and Ain Oulmene.",
    "btn_discover_centers": "Explore Our Centers",
    "btn_vacation_cta": "Holiday Dialysis in Algeria",
    "home_c1_title": "Ain Oulmene",
    "home_c1_sub": "Setif and South Setif",
    "home_c2_title": "Bouira",
    "home_c2_sub": "Bouira and surroundings",
    "home_c3_title": "Cherchell",
    "home_c3_sub": "Tipaza / Coastal",
    "btn_discover": "Discover",
    "badge_video_immersion": "Video Tour",
    "title_videos_section": "Explore Our <span>Centers in Video</span>",
    "sub_videos_section": "Watch real videos filmed inside our modern clinics in Cherchell and Bouira.",
    "video_c1_title": "Cherchell Center (Tipaza)",
    "video_c1_desc": "Discover our modern facilities, sea view, and latest-generation dialysis generators.",
    "video_c2_title": "Bouira Center",
    "video_c2_desc": "Visit our Bouira clinic, its warm welcome, and complete medical infrastructure.",
    "video_card1_title": "Boucenna Clinic Cherchell (Tipaza)",
    "video_card1_desc": "Soothing seaside environment and high-tech hemodialysis rooms.",
    "video_card2_title": "Boucenna Clinic Bouira",
    "video_card2_desc": "Cutting-edge equipment and personalized patient care in central Bouira.",
    "title_testimonials": "Our Patients' <span>Experience</span>",
    "sub_testimonials": "Discover real patient reviews and testimonials from our centers.",
    "testi_1_text": "A wonderful addition to Cherchell and our beautiful region of Sidi Yahia. All the best!",
    "testi_1_author": "Abdelhak Bourahli",
    "testi_1_city": "Local Guide • Cherchell (Sidi Yahia)",
    "testi_2_text": "A great addition to the southern region of the Sétif wilaya. Clean facility and remarkable care.",
    "testi_2_author": "Marouane Algérie",
    "testi_2_city": "Local Guide • Sétif (Aïn Oulmène)",
    "testi_3_text": "It is the best dialysis clinic, flawless service and great medical team.",
    "testi_3_author": "Anis Anis09",
    "testi_3_city": "Verified Google Maps Review",
    "testi_1_quote": "A wonderful addition to Cherchell and our beautiful region of Sidi Yahia. All the best!",
    "testi_2_quote": "A great addition to the southern region of the Sétif wilaya. Clean facility and remarkable care.",
    "testi_3_quote": "It is the best dialysis clinic, flawless service and great medical team.",
    "badge_boucenna_network": "Boucenna Network",
    "hero_title_vacances": "Dialysis During Your Stay in Algeria",
    "hero_sub_vacances": "Visiting Algeria for a few days or several weeks? Easily coordinate your dialysis sessions with Boucenna before your arrival.",
    "hero_reassurance_line": "3 Centers • Experienced Medical Team • Pre-trip Coordination • WhatsApp Contact",
    "btn_organize_sessions": "ORGANIZE MY SESSIONS",
    "btn_call": "CALL US",
    "btn_whatsapp": "WHATSAPP",
    "badge_our_centers": "Our Centers",
    "title_choose_center_section": "Choose the Most Convenient Center for Your Stay",
    "sub_choose_center_section": "Boucenna Network welcomes you in 3 modern centers. Cherchell on the coast is highlighted, while offering full choice for Bouira and Ain Oulmene.",
    "ribbon_highlight": "Coastal & Sea View",
    "zone_cherchell": "Tipaza / Coastal / West Algiers",
    "card_cherchell_title": "Cherchell – Tipaza",
    "cherchell_vac_desc": "Peaceful seaside setting, modern generators, rapid 24h response, and availability upon request.",
    "quick_resp_24h": "Response within 24h",
    "quick_avail_ondemand": "Availability upon request",
    "btn_choose_cherchell": "Choose Cherchell",
    "zone_bouira": "Bouira and surroundings",
    "card_bouira_title": "Bouira",
    "bouira_vac_desc": "Strategic location at Cite 2000 Logements, serene environment, direct highway access.",
    "quick_contact_direct": "Direct contact",
    "quick_modern_room": "Air-conditioned rooms",
    "btn_choose_bouira": "Choose Bouira",
    "zone_ain_oulmene": "Setif and South Setif",
    "card_ain_oulmene_title": "Ain Oulmene – Setif",
    "ain_oulmene_vac_desc": "High-end equipment, on-site specialized pharmacy, and dedicated patient transport.",
    "quick_transport_avail": "Medical transport",
    "quick_pharma_avail": "On-site pharmacy",
    "btn_choose_ain_oulmene": "Choose Ain Oulmene",
    "btn_view_details": "View Clinic Details →",
    "title_4steps": "Your 4-Step Dialysis Journey",
    "sub_4steps": "We assist you at each stage to organize your sessions with total peace of mind.",
    "step1_title": "1. Send Your Dates",
    "step1_desc": "Indicate your travel dates, destination city in Algeria, and preferred Boucenna center.",
    "step2_title": "2. We Check Availability",
    "step2_desc": "Our medical team confirms if slots can be reserved during your stay.",
    "step3_title": "3. Your File is Reviewed",
    "step3_desc": "After initial contact, we specify required medical records and provide a secure channel for transmission.",
    "step4_title": "4. You Receive Confirmation",
    "step4_desc": "Following medical and administrative review, you receive full session details prior to your arrival.",
    "microtext_steps": "We recommend contacting us as early as possible before your trip. Slot availability varies depending on the period and center.",
    "form_title": "Prepare My Dialysis Sessions During My Stay",
    "form_subtitle": "The form is brief, mobile-friendly, and reassuring. No complete medical file is requested on first contact.",
    "form_name_label": "Full Name *",
    "form_country_label": "Country of Residence *",
    "form_phone_label": "Phone / WhatsApp (with country code) *",
    "form_city_label": "City in Algeria *",
    "form_arrival_label": "Arrival Date *",
    "form_departure_label": "Departure Date *",
    "form_center_label": "Preferred Center *",
    "form_sessions_label": "Approximate Number of Sessions (optional)",
    "form_contact_pref_label": "Preferred Contact Channel (optional)",
    "form_notes_label": "Additional Information (optional)",
    "form_consent_label": "I agree that Boucenna may use the information above to process my request and contact me.",
    "form_privacy_link": "Privacy Policy & Data Protection",
    "form_btn_submit": "SUBMIT MY REQUEST",
    "form_success_msg": "Thank you. Your request has been successfully received. Our team will contact you to check availability and guide you through the next steps.",
    "opt_select_country": "Select your country",
    "opt_france": "France",
    "opt_belgium": "Belgium",
    "opt_switzerland": "Switzerland",
    "opt_canada": "Canada",
    "opt_uk": "United Kingdom",
    "opt_algeria": "Algeria (inter-wilaya)",
    "opt_other": "Other country",
    "opt_choose_center": "Choose a center",
    "opt_cherchell": "Cherchell (Tipaza / Coastal)",
    "opt_bouira": "Bouira",
    "opt_ain_oulmene": "Ain Oulmene (Setif)",
    "opt_dont_know": "I don't know (we will advise you)",
    "opt_whatsapp": "WhatsApp",
    "opt_phone": "Phone call",
    "opt_email": "Email",
    "vac_form_alert_success_title": "Request Transmitted Successfully!",
    "vac_form_error_required": "Please fill in all mandatory fields (*).",
    "vac_form_error_consent": "Please accept the privacy consent to submit your request.",
    "vac_form_error_dates": "Departure date cannot be prior to arrival date.",
    "reassure_title": "You are in safe hands",
    "reassure_desc": "Our medical coordination team assists you at every step: slot scheduling, transport, and personalized care.",
    "reassure_1": "No medical records required on this form",
    "reassure_2": "Experienced nephrologists and medical staff",
    "reassure_3": "Written confirmation before your arrival",
    "faq_side_title": "Need personalized assistance?",
    "faq_side_desc": "Our team is available to answer all questions and coordinate your holiday dialysis in Algeria.",
    "faq_btn_whatsapp": "Contact Us on WhatsApp",
    "faq_btn_call": "Call Us (+213 770 31 31 36)",
    "badge_why_us": "Why Choose Us",
    "title_why_vacances": "Why Boucenna During Your Stay?",
    "sub_why_vacances": "High-end, reassuring medical coordination designed specifically for travelers and the diaspora.",
    "why_v1_title": "Pre-Arrival Coordination",
    "why_v1_desc": "You know before your trip that your schedule is confirmed.",
    "why_v2_title": "Experienced Medical Team",
    "why_v2_desc": "A specialized team accustomed to comprehensive hemodialysis care.",
    "why_v3_title": "Modern Facilities",
    "why_v3_desc": "Clean, comfortable, and reassuring clinic environments.",
    "why_v4_title": "WhatsApp Contact",
    "why_v4_desc": "Seamless, direct communication before and during your stay.",
    "why_v5_title": "Multiple Locations",
    "why_v5_desc": "Cherchell, Bouira, and Ain Oulmene.",
    "why_v6_title": "Administrative Support",
    "why_v6_desc": "Our team explains the procedures matching your insurance situation.",
    "priority_health_title": "Your Health, Our Priority",
    "priority_health_desc": "With Boucenna, benefit from a trusted network committed to quality renal care wherever you travel in Algeria.",
    "title_video_immersion": "Your Dialysis During Your Stay: How Does It Work?",
    "sub_video_immersion": "Watch real video tours filmed inside our clinics in Cherchell and Bouira.",
    "badge_medical_security": "Health Data Security",
    "title_medical_file": "Medical Records: How to Send Them?",
    "sub_medical_file": "Our public form does not request medical records. After confirming availability, we provide a secure, encrypted link.",
    "sec_w1_title": "Initial Contact Without Sensitive Data",
    "sec_w1_desc": "You send only your dates and chosen center via the form.",
    "sec_w2_title": "Secure Encrypted Link",
    "sec_w2_desc": "Our team sends a separate HTTPS link with strict access control.",
    "sec_w3_title": "Confidential Nephrologist Review",
    "sec_w3_desc": "The specialist reviews your records to tailor your treatment protocols.",
    "docs_checklist_title": "Checklist of Medical Documents",
    "docs_checklist_sub": "To be submitted only after initial contact:",
    "doc_item_1": "Recent dialysis prescription / protocol",
    "doc_item_2": "Medical summary or clinical report",
    "doc_item_3": "Recent lab blood tests and serology",
    "doc_item_4": "Vascular access information & current treatments",
    "doc_item_5": "Contact details of your regular dialysis center",
    "doc_item_note": "* The final list is validated by the nephrologist according to your medical case.",
    "badge_coverage": "Coverage & Formalities",
    "title_pricing_coverage": "Coverage and Payment",
    "desc_pricing_coverage": "Coverage and payment terms vary depending on your country of residence, insurance, and situation. Our team reviews applicable terms with you before final confirmation.",
    "cov_card1_title": "European Residents & Diaspora",
    "cov_card1_desc": "France, Belgium, Switzerland, UK, Canada... We guide you based on your insurance policies and international agreements.",
    "cov_card2_title": "Transparency & Guidance",
    "cov_card2_desc": "No unexpected surprises: administrative and financial details are clearly verified prior to your arrival.",
    "cov_card3_title": "Algerian Social Security (CNAS)",
    "cov_card3_desc": "For affiliated or resident insured patients, full coverage applies in accordance with social security regulations.",
    "badge_testimonials": "Patient Reviews",
    "title_vacation_testimonials": "Testimonials",
    "sub_vacation_testimonials": "Feedback from visiting dialysis patients who coordinated their sessions with Boucenna.",
    "v_testi1_quote": "“I live in France and visit family every summer. Scheduling with the Cherchell clinic was exceptionally smooth. Punctual, welcoming, and total peace of mind.”",
    "v_testi1_author": "Karim B.",
    "v_testi1_city": "Paris / Stay in Tipaza",
    "v_testi2_quote": "“This was my first dialysis outside Belgium. The Bouira medical team reviewed my protocol beforehand. The machines are modern and the comfort was excellent.”",
    "v_testi2_author": "Fatima Z.",
    "v_testi2_city": "Brussels / Stay in Bouira",
    "v_testi3_quote": "“Fast WhatsApp coordination and confidential medical file review. When I arrived in Setif, everything was ready for my first session with zero waiting.”",
    "v_testi3_author": "Mohamed L.",
    "v_testi3_city": "Lyon / Stay in Ain Oulmene",
    "btn_more_google_reviews": "View More Verified Reviews on Google Maps →",
    "badge_faq": "International FAQ",
    "title_faq": "Frequently Asked Questions",
    "sub_faq": "Find answers to essential questions to prepare your dialysis stay in Algeria with peace of mind.",
    "faq_q1": "How far in advance should I contact you?",
    "faq_a1": "As early as possible. Available slots depend on center capacity and medical file validation.",
    "faq_q2": "How do I know if my sessions are confirmed?",
    "faq_a2": "Your sessions are only considered confirmed after both medical and administrative approval, upon receiving written confirmation from Boucenna.",
    "faq_q3": "What medical documents must I send?",
    "faq_a3": "Following initial contact, our team provides the specific checklist for your case along with a secure transmission link.",
    "faq_q4": "Can I choose my days or session times?",
    "faq_a4": "You may indicate your preferences. The center will offer slots compatible with your medical prescription and availability.",
    "faq_q5": "I live in France / Belgium / abroad: how does coverage work?",
    "faq_a5": "This depends on your insurance coverage and individual situation. Boucenna clarifies all applicable terms prior to booking.",
    "faq_q6": "Can I change my dates?",
    "faq_a6": "Please contact us as soon as possible. Any schedule change remains subject to slot availability.",
    "faq_q7": "Can I come with an accompanying person?",
    "faq_a7": "Yes, according to clinic guidelines. Our team will specify practical arrangements for companions.",
    "faq_q8": "Where are the centers located?",
    "faq_a8": "This page provides the full address, interactive map, and GPS directions button for Cherchell, Bouira, and Ain Oulmene.",
    "badge_access_map": "Access & Directions",
    "title_centers_map": "Where Are Our Centers Located?",
    "sub_centers_map": "Find complete contact details and launch your GPS directions with one click.",
    "title_final_cta": "Prepare Your Stay Before You Travel",
    "desc_final_cta": "Tell us your travel dates and stay location. Our team verifies slot availability and guides you step-by-step to confirm your sessions.",
    "footer_tagline": "Your renal health, our priority.<br>Medical transport, consultations, and pharmacy.",
    "footer_maps_link": "Google Maps Directions",
    "footer_copyright": "© 2026 Boucenna Dialysis Clinic — All rights reserved.",
    "footer_sitemap": "Sitemap",
    "footer_c2_title": "Boucenna Cherchell",
    "footer_c2_address": "Cite Zitouni El Kheir<br>Cherchell, Tipaza",
    "footer_c3_title": "Boucenna Bouira",
    "footer_c3_address": "Cite 2000 Logements<br>Bouira",
    "footer_c4_title": "Boucenna Ain Oulmene",
    "footer_c4_address": "Ain Oulmene, Setif<br>(Plateau & Pharmacy)",
    "whatsapp_tooltip": "Need help? Message us",
    "label_phone_whatsapp": "Phone / WhatsApp:",
    "label_fullname": "Full Name *",
    "label_phone_req": "Phone Number *",
    "label_email": "Email",
    "label_your_message": "Your Message *",
    "placeholder_name": "Your name",
    "placeholder_phone": "+213...",
    "placeholder_email": "email@domain.com",
    "placeholder_message": "Write your message here...",
    "about_badge": "About Us",
    "about_hero_title": "Medical Excellence<br><span>at Your Service</span>",
    "about_hero_sub": "Boucenna Network, a leader in hemodialysis in Algeria, is committed to providing quality, caring, and innovative renal care.",
    "about_section1_badge": "Our Network",
    "about_section1_title": "Leader in Medical<br><span>Assistance in Algeria</span>",
    "about_section1_p1": "Boucenna Network has established itself as a leading hemodialysis provider in Algeria, thanks to a dedicated medical team and top-tier infrastructure.",
    "about_section1_p2": "Our network includes specialist nephrologists, physicians, and dedicated nursing teams across our 3 centers in Cherchell, Bouira, and Ain Oulmene.",
    "about_doctor_badge": "Medical Direction",
    "about_doctor_title": "Dr. Nassim Boucenna",
    "about_doctor_sub": "Founder & Medical Innovation Leader.",
    "about_doctor_b1": "Over 12 years of experience in healthcare, leading specialized dialysis clinics, medical transport, and pharmacy services.",
    "about_doctor_b2": "DPharm & MSc in Biochemistry, integrating molecular biology and artificial intelligence for patient care optimization.",
    "about_doctor_b3": "Passionate about patient well-being, designing advanced health solutions tailored to real clinical needs.",
    "about_commit_badge": "Our Commitments",
    "about_commit_title": "Why Choose<br><span>Boucenna?</span>",
    "why_1_title": "Experienced Team",
    "why_1_desc": "Specialist nephrologists and nurses attentive to your health and well-being.",
    "why_2_title": "Modern Centers",
    "why_2_desc": "Dialysis facilities equipped with latest technologies, compliant with international standards.",
    "why_3_title": "Personalized Care",
    "why_3_desc": "Continuous adaptation to each patient's medical condition and lifestyle.",
    "why_4_title": "Organized Coordination",
    "why_4_desc": "We schedule and coordinate your sessions for a stress-free medical stay.",
    "why_5_title": "Comfort During Sessions",
    "why_5_desc": "Clean, comfortable, and safe environment for your well-being throughout treatment.",
    "why_6_title": "Assistance Before Arrival",
    "why_6_desc": "Our team assists you remotely to prepare your stay with total serenity.",
    "about_transport_title": "Medical Transport",
    "about_transport_desc": "24/7 availability with equipped ambulances and light medical vehicles.",
    "about_cta_title": "Want to know more?",
    "about_cta_sub": "Our team is available to answer all your inquiries.",
    "advice_badge": "Practical Guide",
    "advice_hero_title": "Advice & Guide<br><span>for Dialysis Patients</span>",
    "advice_hero_sub": "Essential information regarding insurance coverage, required documents, and practical advice for your daily life with dialysis.",
    "advice_tab_coverage": "Coverage",
    "advice_tab_docs": "Documents",
    "advice_tab_transport": "Transport",
    "advice_tab_fistula": "Fistula",
    "advice_tab_nutrition": "Nutrition",
    "advice_coverage_title": "Financial Coverage",
    "advice_coverage_p": "End-stage renal disease is 100% covered under social security conventions (CNAS / CASNOS). Dialysis sessions, related medications, and medical transport are included.",
    "advice_docs_title": "Documents to Present",
    "advice_docs_tourists_title": "Visiting Patients (Foreign/Local)",
    "advice_docs_t1": "Dialysis protocol / liaison sheet",
    "advice_docs_t2": "Recent lab tests (Serology)",
    "advice_docs_t3": "Recent medical clinical report",
    "advice_cnas_1": "Original recent social security entitlement",
    "advice_cnas_2": "Recent lab tests (Serology)",
    "advice_cnas_3": "Blood group card",
    "advice_cnas_4": "Medical file and liaison sheet",
    "advice_cnas_5": "2 ID photos",
    "advice_cnas_6": "1 Certificate of residence",
    "advice_casnos_1": "Valid CASNOS coverage certificate",
    "advice_casnos_2": "Recent lab tests (Serology)",
    "advice_casnos_3": "Blood group card",
    "advice_casnos_4": "Medical file and liaison sheet",
    "advice_casnos_5": "2 ID photos",
    "advice_casnos_6": "1 Certificate of residence",
    "advice_cnas_title": "CNAS (Social Security)",
    "advice_casnos_title": "CASNOS (Self-Employed)",
    "advice_transport_title": "Medical Transport",
    "advice_transport_p1": "Boucenna Network provides equipped ambulances and light medical vehicles for all patient transfers.",
    "advice_transport_p2": "Our drivers are available 24/7 to ensure safe and comfortable transit between your home and the clinic.",
    "advice_fistula_title": "Fistula Care & Advice",
    "advice_fistula_1": "An arteriovenous fistula must be created prior to hemodialysis to secure vascular access.",
    "advice_fistula_2": "Check its thrill daily by feeling the characteristic vibration.",
    "advice_fistula_3": "Avoid wearing watches, bracelets, or tight bandages on the fistula arm.",
    "advice_fistula_4": "Protect it during physical activity and avoid sleeping on that arm.",
    "advice_fistula_5": "Never apply creams or products to the fistula without medical consultation.",
    "advice_nutrition_title": "Diet & Nutrition",
    "advice_nutrition_1": "A balanced, customized diet is vital for hemodialysis patients.",
    "advice_nutrition_2": "Interdialytic weight gain should not exceed 5% of dry body weight.",
    "advice_nutrition_3": "Control sodium, potassium, and phosphorus intake as prescribed by your physician.",
    "advice_nutrition_4": "Limit potassium-rich foods: bananas, chocolate, dried legumes, and concentrated broths.",
    "prop_quality_care": "Dedicated Medical Coordination",
    "prop_quality_care_desc": "Slot validation and administrative follow-up before your departure.",
    "prop_peaceful_trip": "Travel in Total Peace of Mind",
    "prop_peaceful_trip_desc": "We organize your sessions around your travel schedule.",
    "prop_dedicated_help": "Simple & Direct Communication",
    "prop_dedicated_help_desc": "A dedicated WhatsApp contact at your side every step of the way.",
    "dr_boucenna_role": "Nephrologist & Medical Director",
    "video_testi_1_badge": "Hemodialysis Patient",
    "badge_team_local": "Dedicated Local Team",
    "title_team_cherchell": "The Healthcare Team of <span>Cherchell</span>",
    "desc_team_cherchell": "An experienced, attentive, and bilingual medical and nursing team present at every hemodialysis session to deliver top-tier care in a serene Mediterranean seaside setting.",
    "title_team_bouira": "The Healthcare Team of <span>Bouira</span>",
    "desc_team_bouira": "Our nephrologists, certified dialysis nurses, and healthcare assistants warmly welcome you at Cité 2000 Logements with personalized support and constant attentiveness.",
    "btn_contact_team": "Contact the Team",
    "title_testi_bouira": "The Experience at <span>Boucenna Bouira</span>",
    "sub_testi_bouira": "Warm patient feedback on the quality of care and compassionate support at our Bouira clinic.",
    "title_testi_cherchell": "The Experience at <span>Boucenna Cherchell</span>",
    "sub_testi_cherchell": "Testimonial from a regular patient on the rigorous medical care and comfort at our Cherchell clinic.",

    "video_testi_1_title": "Testimonial at Boucenna Center",
    "video_testi_1_desc": "Warm feedback on the quality of care and the kindness of our medical team.",
    "video_testi_2_badge": "Regular Patient",
    "video_testi_2_title": "Care and Comfort",
    "video_testi_2_desc": "Testimonial on rigorous medical follow-up and personalized support.",

    "contact_form_error_required": "Please fill in your name, phone number and message."
,
    "dept_badge": "Our Departments",
    "dept_hero_title": "Our Medical<br><span>Services & Departments</span>",
    "dept_hero_sub": "Hemodialysis, nephrology consultations, 24/7 medical transport, and specialized pharmacy.",
    "dept_hemo_badge": "Department 1",
    "dept_hemo_title": "Hemodialysis<br><span>Sessions</span>",
    "dept_hemo_p1": "Our clinics feature multiple dialysis stations equipped with latest-generation generators, available Sunday through Thursday.",
    "dept_hemo_p2": "Every session is closely monitored by experienced nephrology nurses in a sterile, comfortable setting.",
    "dept_hemo_f1": "Latest-generation dialysis machines",
    "dept_hemo_f2": "Strict sterilization protocols",
    "dept_hemo_f3": "Continuous medical monitoring",
    "dept_hemo_f4": "100% CNAS / CASNOS convention coverage",
    "dept_nephro_badge": "Department 2",
    "dept_nephro_title": "Nephrology<br><span>Consultations</span>",
    "dept_nephro_p": "Nephrology consultations are led by Dr. Nassim Boucenna, renal disease and dialysis specialist, alongside experienced physicians.",
    "dept_nephro_f1": "Chronic kidney disease management",
    "dept_nephro_f2": "Dialysis protocol optimization",
    "dept_nephro_f3": "Personalized biology follow-up",
    "dept_nephro_f4": "Renal complication prevention",
    "dept_transport_badge": "Department 3",
    "dept_transport_title": "Medical Transport<br><span>24/7 Service</span>",
    "dept_transport_p": "Our sanitary transport service ensures safe transfers between home and the clinic, including inter-wilaya travel.",
    "dept_transport_f1": "Fully equipped ambulances",
    "dept_transport_f2": "Light medical vehicles (VSL)",
    "dept_transport_f3": "Inter-wilaya transfers",
    "dept_transport_f4": "24/7 available drivers",
    "dept_pharmacy_badge": "Department 4",
    "dept_pharmacy_title": "Specialized<br><span>Pharmacy</span>",
    "dept_pharmacy_p": "Integrated at our Ain Oulmene center (Setif), our pharmacy ensures full supply of renal and dialysis medications.",
    "dept_pharmacy_f1": "Dialysis treatments and consumables",
    "dept_pharmacy_f2": "Pharmaceutical follow-up",
    "dept_pharmacy_f3": "Direct coordination with the medical team",
    "title_team": "Our Medical <span>Team</span>",
    "sub_team": "Our physicians and nursing staff are committed to providing top-quality, compassionate care.",
    "tab_nephro": "Nephrologist",
    "tab_paramedical": "Nursing Staff",
    "doctor_title": "Nephrologist & Medical Director",
    "doc_b1": "Specialist in Nephrology & Hemodialysis",
    "doc_b2": "Personalized treatment protocol adaptation",
    "doc_b3": "Compassionate, human-centered approach",
    "doc_b4": "Continuous medical supervision across all 3 centers",
    "btn_appointment": "Book Consultation",
    "team_nursing_badge": "Staff & Care in Action",
    "team_section_title": "Our Teams <span>at the Heart of Your Care</span>",
    "team_section_sub": "Present at every dialysis session to guarantee safety, comfort, and peace of mind.",
    "team_nursing_title": "Nursing & Healthcare Staff",
    "team_nursing_desc": "Certified nurses and technicians dedicated to your daily care in each of our 3 centers.",
    "team_card1_badge": "Care Team",
    "team_card1_title": "Specialized Nurses",
    "team_card1_desc": "Safe cannulation, continuous vital sign monitoring, and attentive patient listening.",
    "team_card2_badge": "Coastal Team",
    "team_card2_title": "Cherchell Team",
    "team_card2_desc": "Qualified staff trained in nephrology emergencies and vacation patient reception.",
    "team_card3_badge": "Live Monitoring",
    "team_card3_title": "Dialysis Monitoring",
    "team_card3_desc": "Strict machine checks, sterilization, and patient comfort throughout therapy.",
    "transfer_title": "How Does a<br><span>Center Transfer Work?</span>",
    "transfer_sub": "Our team accompanies you through every step to simplify administrative procedures.",
    "transfer_step1_title": "1. Contact Us",
    "transfer_step1_desc": "Reach out via phone or WhatsApp to inform us of your transfer request.",
    "transfer_step2_title": "2. We Verify Availability",
    "transfer_step2_desc": "We check slots in your chosen center (Cherchell, Bouira, Ain Oulmene).",
    "transfer_step3_title": "3. We Send the Transfer Plan",
    "transfer_step3_desc": "We provide you with all required documents and administrative details.",
    "transfer_step4_title": "4. Medical File Accepted",
    "transfer_step4_desc": "The clinic confirms your admission date and treatment schedule.",
    "transfer_step5_title": "5. Your New Care Journey",
    "transfer_step5_desc": "Begin treatment in your new clinic in complete comfort and peace of mind.",
    "transfer_priority_title": "Already dialyzing elsewhere and wish to transfer?",
    "transfer_priority_desc": "We support your seamless transfer with full medical and administrative coordination.",
    "cnas_title": "CNAS <span>Coverage</span>",
    "cnas_main_intro": "Dialysis care is fully covered under the national CNAS convention.<br>We handle all formalities on your behalf.",
    "cnas_card1_title": "Simplified Formalities",
    "cnas_card1_desc": "We guide you through all paperwork with CNAS and social security offices.",
    "cnas_card2_title": "100% Coverage",
    "cnas_card2_desc": "Subject to eligibility regulations, with zero out-of-pocket advance.",
    "cnas_card3_title": "Sanitary Transport",
    "cnas_card3_desc": "Access our fleet of ambulances and light medical vehicles for transit.",
    "cnas_btn": "Contact Us for Coverage Information",
    "contact_page_title": "Contact <span>Us</span>",
    "contact_page_sub": "Our team is at your disposal to assist you with all inquiries.",
    "label_phone": "Phone",
    "label_whatsapp": "WhatsApp",
    "label_address": "Address",
    "label_hours": "Hours",
    "contact_address_val": "Cite Kaaboub Coop Immobiliere Essalam Sec 105/Lot 151 Setif, Algeria",
    "contact_hours_val": "Open Every Day – 24/7",
    "btn_send_msg": "Send Message",
    "pill_team": "Experienced Team",
    "pill_tech": "Advanced Tech",
    "pill_hygiene": "Hygiene & Safety",
    "pill_care": "Personalized Care",
    "btn_call_center": "Call Center",
    "btn_itineraire": "Get Directions",
    "center_dialysis_badge": "Dialysis Center",
    "center_ref_badge": "Reference Center",
    "pill_pharmacy": "Advanced Platform",
    "pill_cnas": "100% CNAS / CASNOS",
    "cherchell_hero_title": "Boucenna Hemodialysis<br><span>Center – Cherchell</span>",
    "cherchell_hero_sub": "A modern clinic dedicated to patient well-being, supervised by an experienced medical staff.",
    "why_cherchell_title": "Why Choose <span>Boucenna Cherchell?</span>",
    "why_chh_1_title": "Advanced Treatment",
    "why_chh_1_desc": "Latest-generation dialysis machines and high-safety water purification.",
    "why_chh_2_title": "Experienced Staff",
    "why_chh_2_desc": "Nephrologists and certified nurses present at every session.",
    "why_chh_3_title": "Accommodation Support",
    "why_chh_3_desc": "Assistance for holiday stays near the Mediterranean coast.",
    "why_chh_4_title": "Pleasant Setting",
    "why_chh_4_desc": "Serene and calming environment on the Tipaza coastline.",
    "gallery_chh_title": "Photo Gallery – <span>Boucenna Cherchell</span>",
    "gallery_chh_sub": "Explore our Cherchell clinic in pictures.",
    "bouira_hero_title": "Boucenna Hemodialysis<br><span>Center – Bouira</span>",
    "why_bouira_title": "Why Choose <span>Boucenna Bouira?</span>",
    "why_bouira_1_title": "Central Location",
    "why_bouira_1_desc": "Conveniently located at Cite 2000 Logements with easy highway access.",
    "why_bouira_2_title": "Dedicated Nephrology",
    "why_bouira_2_desc": "Regular consultations and precise protocol adjustments.",
    "why_bouira_3_title": "Comfort & Serenity",
    "why_bouira_3_desc": "Air-conditioned rooms, ergonomic chairs, and patient attention.",
    "why_bouira_4_title": "CNAS Convention",
    "why_bouira_4_desc": "100% direct insurance coverage for social security beneficiaries.",
    "gallery_bouira_title": "Photo Gallery – <span>Boucenna Bouira</span>",
    "gallery_bouira_sub": "Discover our clinic and patient rooms in Bouira.",
    "ain_oulmene_hero_title": "Boucenna Hemodialysis<br><span>Center – Ain Oulmene</span>",
    "why_ain_oulmene_title": "Why Choose <span>Boucenna Ain Oulmene?</span>",
    "why_ao_1_title": "Dedicated Transport",
    "why_ao_1_desc": "Ambulance and VSL fleet for home-to-clinic patient transport.",
    "why_ao_2_title": "Technical Platform",
    "why_ao_2_desc": "Immediate on-site availability of all renal medications.",
    "why_ao_3_title": "Expert Team",
    "why_ao_3_desc": "Under the medical direction of Dr. Nassim Boucenna, nephrologist.",
    "why_ao_4_title": "Total Safety",
    "why_ao_4_desc": "Strict sterilization and double reverse-osmosis water treatment.",
    "gallery_ao_title": "Photo Gallery – <span>Boucenna Ain Oulmene</span>",
    "gallery_ao_sub": "Discover our Setif facilities, dialysis rooms, and pharmacy."
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
    "drop_cherchell": "مركز شرشال (تيبازة)",
    "drop_bouira": "مركز البويرة",
    "drop_ain_oulmene": "مركز عين ولمان (سطيف)",
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
    "video_card1_title": "عيادة بوسنة شرشال (تيبازة)",
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
    "hero_title_vacances": "غسيل الكلى أثناء عطلتكم في الجزائر",
    "hero_sub_vacances": "هل أنتم قادمون إلى الجزائر لبضعة أيام أو لعدة أسابيع؟ نظموا جلسات غسيل الكلى مع بوسنة بكل سهولة قبل وصولكم.",
    "hero_reassurance_line": "3 مراكز • طاقم طبي متخصص • تنسيق مسبق قبل السفر • تواصل مباشر عبر واتساب",
    "btn_organize_sessions": "تنظيم جلساتي",
    "btn_call": "اتصل بنا",
    "btn_whatsapp": "واتساب",
    "badge_our_centers": "مراكزنا",
    "title_choose_center_section": "اختر المركز الأنسب لمكان إقامتكم",
    "sub_choose_center_section": "ترحب بكم شبكة بوسنة في 3 مراكز حديثة ومجهزة. مركز شرشال الساحلي في الصدارة مع إمكانية الاختيار الكامل لمركزي البويرة وعين ولمان.",
    "ribbon_highlight": "موقع ساحلي وإطلالة بحرية",
    "zone_cherchell": "تيبازة / الساحل / غرب الجزائر العاصمة",
    "card_cherchell_title": "شرشال – تيبازة",
    "cherchell_vac_desc": "بيئة هادئة على شاطئ البحر، أحدث أجهزة الغسيل الكلوي، استجابة سريعة في أقل من 24 ساعة وتوفر المواعيد عند الطلب.",
    "quick_resp_24h": "استجابة خلال 24 ساعة",
    "quick_avail_ondemand": "مواعيد متوفرة عند الطلب",
    "btn_choose_cherchell": "اختيار مركز شرشال",
    "zone_bouira": "البويرة ونواحيها",
    "card_bouira_title": "البويرة",
    "bouira_vac_desc": "موقع استراتيجي بحي 2000 مسكن، محيط هادئ ومريح مع سهولة الوصول عبر الطريق السيار شرق-غرب.",
    "quick_contact_direct": "تواصل مباشر",
    "quick_modern_room": "قاعات مكيفة ومريحة",
    "btn_choose_bouira": "اختيار مركز البويرة",
    "zone_ain_oulmene": "سطيف وجنوب سطيف",
    "card_ain_oulmene_title": "عين ولمان – سطيف",
    "ain_oulmene_vac_desc": "تجهيزات طبية متطورة، صيدلية متخصصة مدمجة وخدمة نقل صحي مخصصة للمرضى.",
    "quick_transport_avail": "نقل صحي متوفر",
    "quick_pharma_avail": "تجهيزات متطورة",
    "btn_choose_ain_oulmene": "اختيار مركز عين ولمان",
    "btn_view_details": "عرض تفاصيل العيادة ←",
    "title_4steps": "مسار غسيل الكلى في 4 خطوات",
    "sub_4steps": "نرافقكم في كل خطوة لتنظيم جلساتكم الطبية بكل طمأنينة.",
    "step1_title": "1. إرسال تواريخ الإقامة",
    "step1_desc": "حدد فترة إقامتك، والمدينة التي ستقيم بها في الجزائر والمركز المفضل لديك.",
    "step2_title": "2. التحقق من توفر المواعيد",
    "step2_desc": "يؤكد فريقنا إمكانية حجز الفترات الزمنية المناسبة طوال مدة إقامتك.",
    "step3_title": "3. دراسة ملفكم الطبي",
    "step3_desc": "بعد التواصل الأول، نوضح لكم الوثائق الطبية اللازمة ونزودكم برابط آمن ومشفر لإرسالها.",
    "step4_title": "4. استلام التأكيد النهائي",
    "step4_desc": "بعد الموافقة الطبية والإدارية، تستلمون التأكيد الرسمي وجدول مواعيدكم قبل وصولكم إلى الجزائر.",
    "microtext_steps": "ننصح بالتواصل معنا في أقرب وقت ممكن قبل سفركم، حيث تختلف الأماكن المتاحة بحسب الفترة والمركز المطلوب.",
    "form_title": "تحضير جلسات غسيل الكلى أثناء إقامتي",
    "form_subtitle": "النموذج مبسط ومريح للهاتف. لا يُطلب أي ملف طبي كامل في الاتصال الأولي.",
    "form_name_label": "الاسم واللقب *",
    "form_country_label": "بلد الإقامة *",
    "form_phone_label": "الهاتف / واتساب (مع الرمز الدولي) *",
    "form_city_label": "مدينة الإقامة في الجزائر *",
    "form_arrival_label": "تاريخ الوصول *",
    "form_departure_label": "تاريخ المغادرة *",
    "form_center_label": "المركز المطلوب *",
    "form_sessions_label": "عدد الجلسات التقريبي (اختياري)",
    "form_contact_pref_label": "طريقة التواصل المفضلة (اختياري)",
    "form_notes_label": "معلومات إضافية (اختياري)",
    "form_consent_label": "أوافق على استخدام عيادة بوسنة للبيانات أعلاه لمعالجة طلبي والتواصل معي.",
    "form_privacy_link": "سياسة الخصوصية وحماية البيانات",
    "form_btn_submit": "إرسال طلبي",
    "form_success_msg": "شكراً لكم. تم استلام طلبكم بنجاح. سيتواصل معكم فريقنا للتحقق من التوفر وشرح الخطوات التالية.",
    "opt_select_country": "اختر بلد إقامتك",
    "opt_france": "فرنسا",
    "opt_belgium": "بلجيكا",
    "opt_switzerland": "سويسرا",
    "opt_canada": "كندا",
    "opt_uk": "المملكة المتحدة",
    "opt_algeria": "الجزائر (بين الولايات)",
    "opt_other": "بلد آخر",
    "opt_choose_center": "اختر المركز المطلوب",
    "opt_cherchell": "شرشال (تيبازة / الساحل)",
    "opt_bouira": "البويرة",
    "opt_ain_oulmene": "عين ولمان (سطيف)",
    "opt_dont_know": "لا أعرف بعد (سنقوم بإرشادكم)",
    "opt_whatsapp": "واتساب",
    "opt_phone": "اتصال هاتفي",
    "opt_email": "البريد الإلكتروني",
    "vac_form_alert_success_title": "تم إرسال الطلب بنجاح!",
    "vac_form_error_required": "يرجى ملء جميع الحقول الإلزامية المطلوبة (*).",
    "vac_form_error_consent": "يرجى الموافقة على سياسة الخصوصية لإرسال الطلب.",
    "vac_form_error_dates": "تاريخ المغادرة لا يمكن أن يكون قبل تاريخ الوصول.",
    "reassure_title": "أنتم في أيدٍ أمينة",
    "reassure_desc": "يرافقكم فريق التنسيق الطبي في كل خطوة: حجز المواعيد، الاستقبال، النقل والمتابعة الطبية المخصصة.",
    "reassure_1": "لا يُطلب أي ملف طبي عبر هذه الاستمارة",
    "reassure_2": "أطباء كلى وأطقم تمريضية عالية الخبرة",
    "reassure_3": "تأكيد كتابي رسمي قبل وصولكم",
    "faq_side_title": "هل تحتاج إلى مساعدة مخصصة؟",
    "faq_side_desc": "فريقنا في خدمتكم للإجابة على كافة استفساراتكم ومساعدتكم في تخطيط علاجكم أثناء العطلة.",
    "faq_btn_whatsapp": "تواصل معنا عبر واتساب",
    "faq_btn_call": "اتصل بنا (+213 770 31 31 36)",
    "badge_why_us": "لماذا تختار عياداتنا",
    "title_why_vacances": "لماذا تختار عيادات بوسنة أثناء إقامتك؟",
    "sub_why_vacances": "مرافقة طبية رفيعة المستوى ومؤمنة بالكامل مخصصة للمسافرين وأبناء الجالية.",
    "why_v1_title": "تنسيق مسبق قبل الوصول",
    "why_v1_desc": "تضمنون تأكيد وتثبيت كافة مواعيد حصصكم قبل انطلاق رحلتكم.",
    "why_v2_title": "طاقم طبي وتمريضي متمرس",
    "why_v2_desc": "طاقم متخصص ذو كفاءة وخبرة طويلة في جلسات تصفية الدم.",
    "why_v3_title": "مراكز حديثة ومريحة",
    "why_v3_desc": "بيئة طبية نظيفة، مريحة ومهدئة مطابقة لأعلى المعايير.",
    "why_v4_title": "تواصل مباشر عبر واتساب",
    "why_v4_desc": "تبادل سهل وسريع للاستفسارات قبل وخلال كامل فترة إقامتكم.",
    "why_v5_title": "تغطية جغرافية متعددة",
    "why_v5_desc": "شرشال، البويرة وعين ولمان.",
    "why_v6_title": "مرافقة وتوجيه إداري",
    "why_v6_desc": "يقوم فريقنا بشرح كافة الإجراءات الإدارية المناسبة لحالتكم وتغطيتكم.",
    "priority_health_title": "صحتكم هي أولويتنا الدائمة",
    "priority_health_desc": "مع شبكة بوسنة، تستفيدون من منظومة علاجية موثوقة تسهر على تقديم أفضل رعاية كلوية.",
    "title_video_immersion": "غسيل الكلى أثناء إقامتكم: كيف تتم العملية؟",
    "sub_video_immersion": "شاهد مقاطع الفيديو الحقيقية المصورة داخل عياداتنا في شرشال والبويرة.",
    "badge_medical_security": "حماية وأمان البيانات الصحية",
    "title_medical_file": "الملف الطبي: كيف يتم إرساله؟",
    "sub_medical_file": "الاستمارة الأولية لا تطلب بيانات طبية. بعد تأكيد توفر الأماكن، نزودكم برابط آمن ومحمي لنقل الملف.",
    "sec_w1_title": "تواصل أولي خالٍ من البيانات الحساسة",
    "sec_w1_desc": "ترسلون فقط التواريخ والمركز المطلوب عبر النموذج.",
    "sec_w2_title": "رابط آمن ومشفر",
    "sec_w2_desc": "يرسل لكم فريقنا رابطاً مشفراً خاصاً يتمتع بحماية وأمان عاليين.",
    "sec_w3_title": "دراسة سرية من طرف طبيب الكلى",
    "sec_w3_desc": "يدرس أخصائي أمراض الكلى ملفكم بدقة لتكييف بروتوكول العلاج المناسب.",
    "docs_checklist_title": "قائمة الوثائق الطبية المطلوبة",
    "docs_checklist_sub": "يتم إرسالها فقط بعد تأكيد التوفر الأولي:",
    "doc_item_1": "وصفة أو بروتوكول تصفية الدم الأخير",
    "doc_item_2": "تقرير طبي حديث أو ملخص التكفل الطبي",
    "doc_item_3": "آخر التحاليل البيولوجية والمصلية المحدثة",
    "doc_item_4": "معلومات المدخل الوعائي (الناسور) والعلاجات الحالية",
    "doc_item_5": "معلومات الاتصال بمركز الغسيل المعتاد",
    "doc_item_note": "* يتم اعتماد القائمة النهائية من قبل طبيب الكلى وفقاً للحالة الفردية للمريض.",
    "badge_coverage": "التغطية والإجراءات",
    "title_pricing_coverage": "التغطية المالية والتسوية",
    "desc_pricing_coverage": "تختلف إجراءات التكفل المالي أو التسوية حسب بلد الإقامة، التغطية التأمينية والوضعية الفردية. يقوم فريقنا بتدقيق كافة الإجراءات معكم قبل التأكيد النهائي للمواعيد.",
    "cov_card1_title": "المقيمون في أوروبا والجالية",
    "cov_card1_desc": "فرنسا، بلجيكا، سويسرا، بريطانيا، كندا... نوجهكم وفقاً لوثائق التأمين والاتفاقيات المعمول بها.",
    "cov_card2_title": "شفافية ومرافقة كاملة",
    "cov_card2_desc": "بدون أي مفاجآت: يتم تدقيق وتأكيد كافة الشروط الإدارية والمالية بوضوح قبل وصولكم.",
    "cov_card3_title": "الضمان الاجتماعي الجزائري (CNAS)",
    "cov_card3_desc": "للمؤمنين اجتماعياً والمقيمين، يتم التكفل التعاقدي طبقاً للتنظيمات المعمول بها لدى الصندوق.",
    "badge_testimonials": "تجارب المرضى",
    "title_vacation_testimonials": "شهادات وتجارب",
    "sub_vacation_testimonials": "انطباعات وتجارب المرضى والزوار الذين نظموا حصصهم العلاجية مع عيادات بوسنة.",
    "v_testi1_quote": "« أقيم في فرنسا وآتي كل صيف لزيارة عائلتي. كان التنسيق مع مركز شرشال في غاية السلاسة والاحترافية. انضباط في المواعيد، استقبال رائع وراحة بال تامة. »",
    "v_testi1_author": "كريم ب.",
    "v_testi1_city": "باريس / إقامة في تيبازة",
    "v_testi2_quote": "« كانت أول تجربة غسيل كلى لي خارج بلجيكا. راجع الفريق الطبي بالبويرة بروتوكولي بدقة مسبقاً. الأجهزة حديثة جداً والراحة لا تشوبها شائبة. »",
    "v_testi2_author": "فاطمة ز.",
    "v_testi2_city": "بروكسل / إقامة في البويرة",
    "v_testi3_quote": "« تنظيم سريع عبر واتساب، ومعاملة للملف الطبي بأقصى درجات السرية. عند وصولي لسطيف، كان كل شيء جاهزاً لحصتي الأولى دون أي انتظار. »",
    "v_testi3_author": "محمد ل.",
    "v_testi3_city": "ليون / إقامة في عين ولمان",
    "btn_more_google_reviews": "عرض المزيد من التقييمات على خرائط Google ←",
    "badge_faq": "الأسئلة الشائعة",
    "title_faq": "الأسئلة الشائعة",
    "sub_faq": "إليكم الإجابات عن أكثر التساؤلات أهمية لتنظيم علاجكم أثناء الإقامة بالجزائر بكل طمأنينة.",
    "faq_q1": "كم من الوقت قبل سفري يجب أن أتواصل معكم؟",
    "faq_a1": "في أقرب وقت ممكن. تعتمد الأماكن المتاحة على قدرة استيعاب المركز والموافقة على ملفكم الطبي.",
    "faq_q2": "كيف أتأكد من أن جلساتي قد حُجزت بالفعل؟",
    "faq_a2": "لا تُعتبر الجلسات مؤكدة إلا بعد الموافقة الطبية والإدارية واستلام تأكيد رسمي من عيادة بوسنة.",
    "faq_q3": "ما هي الوثائق الطبية التي يجب إرسالها؟",
    "faq_a3": "بعد التواصل الأولي، يزودكم فريقنا بقائمة الوثائق المناسبة لحالتكم مع رابط آمن ومشفر لإرسالها.",
    "faq_q4": "هل يمكنني اختيار أيامي أو أوقات الجلسات؟",
    "faq_a4": "يمكنكم تحديد تفضيلاتكم، وسيقترح المركز الفترات الزمنية المتوافقة مع وصفتكم الطبية والأماكن المتاحة.",
    "faq_q5": "أعيش في فرنسا / بلجيكا / بلد آخر: كيف يتم التكفل المالي؟",
    "faq_a5": "يعتمد ذلك على نوع تغطيتكم التأمينية ووضعيتكم. تشرح لكم عيادة بوسنة الإجراءات المعمول بها قبل تأكيد الجلسات.",
    "faq_q6": "هل يمكنني تعديل تواريخ الجلسات؟",
    "faq_a6": "يرجى التواصل معنا في أقرب وقت ممكن. يخضع أي تعديل لتوفر الأماكن الشاغرة بالمركز.",
    "faq_q7": "هل يمكنني القدوم برفقة مرافق؟",
    "faq_a7": "نعم، وفقاً لتنظيم كل مركز. سيوضح لكم الطاقم الشروط والترتيبات العملية المناسبة.",
    "faq_q8": "أين تقع المراكز؟",
    "faq_a8": "توفر هذه الصفحة العناوين الدقيقة، الخريطة التفاعلية وزر تحديد المسار لمراكز شرشال، البويرة وعين ولمان.",
    "badge_access_map": "الموقع وسهولة الوصول",
    "title_centers_map": "أين تقع مراكزنا؟",
    "sub_centers_map": "تعرفوا على العناوين الدقيقة وانقروا لبدء مساركم عبر GPS مباشرة.",
    "title_final_cta": "حضروا إقامتكم العلاجية قبل موعد سفركم",
    "desc_final_cta": "أرسلوا تواريخ رحلتكم ومدينة إقامتكم. يتحقق فريقنا من المواعيد ويرافقكم خطوة بخطوة حتى تأكيد كافة حصصكم.",
    "footer_tagline": "صحتكم الكلوية، أولويتنا الدائمة.<br>نقل صحي، استشارات طبية وصيدلية متخصصة.",
    "footer_maps_link": "الاتجاهات عبر Google Maps",
    "footer_copyright": "© 2026 عيادات غسيل الكلى بوسنة — جميع الحقوق محفوظة.",
    "footer_sitemap": "خريطة الموقع",
    "footer_c2_title": "بوسنة شرشال",
    "footer_c2_address": "حي زيتوني الخير<br>شرشال، تيبازة",
    "footer_c3_title": "بوسنة البويرة",
    "footer_c3_address": "حي 2000 مسكن<br>البويرة",
    "footer_c4_title": "بوسنة عين ولمان",
    "footer_c4_address": "عين ولمان، سطيف<br>(العيادة والصيدلية)",
    "whatsapp_tooltip": "بحاجة لمساعدة؟ تواصل معنا",
    "label_phone_whatsapp": "الهاتف / واتساب :",
    "label_fullname": "الاسم واللقب *",
    "label_phone_req": "رقم الهاتف *",
    "label_email": "البريد الإلكتروني",
    "label_your_message": "رسالتكم *",
    "placeholder_name": "الاسم الكامل",
    "placeholder_phone": "+213...",
    "placeholder_email": "email@domain.com",
    "placeholder_message": "اكتب رسالتك هنا...",
    "about_badge": "عن العيادة",
    "about_hero_title": "خبرة طبية متميزة<br><span>في خدمتكم</span>",
    "about_hero_sub": "تلتزم شبكة مراكز بوسنة، الرائدة في تصفية الدم بالجزائر، بتقديم رعاية طبية عالية الجودة وإنسانية ومبتكرة.",
    "about_section1_badge": "شبكتنا الطبية",
    "about_section1_title": "رائد المساعدة<br><span>الطبية في الجزائر</span>",
    "about_section1_p1": "أثبتت شبكة بوسنة مكانتها كواحدة من أبرز شبكات تصفية الدم في الجزائر، بفضل طواقمها الطبية المؤهلة وتجهيزاتها الحديثة لضمان أفضل شروط التكفل.",
    "about_section1_p2": "تضم شبكتنا أطباء كلى متخصصين، أطباء عامين وأطقم تمريضية مكرسة في مراكزنا الثلاثة بشرشال، البويرة وعين ولمان.",
    "about_doctor_badge": "الإدارة الطبية",
    "about_doctor_title": "الدكتور نسيم بوسنة",
    "about_doctor_sub": "مؤسس وقائد الابتكار في الرعاية الصحية.",
    "about_doctor_b1": "بخبرة تتجاوز 12 عاماً في قطاع الصحة، يقود شبكة عيادات متخصصة في تصفية الدم، مؤسسة نقل صحي وصيدلية متخصصة.",
    "about_doctor_b2": "دكتور في الصيدلة وماجستير في الكيمياء الحيوية، يقود مشاريع تجمع بين البيولوجيا الجزيئية والذكاء الاصطناعي لتحسين الرعاية الطبية.",
    "about_doctor_b3": "شغوف بالابتكار وراحة المرضى، ويصمم حلولاً صحية متقدمة تواكب الاحتياجات الميدانية الفعلية.",
    "about_commit_badge": "التزاماتنا",
    "about_commit_title": "لماذا تختار<br><span>بوسنة؟</span>",
    "why_1_title": "طاقم ذو كفاءة عالية",
    "why_1_desc": "أطباء كلى وممرضون متخصصون يسهرون على تقديم أفضل رعاية طبية ممكنة.",
    "why_2_title": "مراكز حديثة",
    "why_2_desc": "مراكز غسيل كلى مجهزة بأحدث التقنيات والمولدات المطابقة للمعايير الدولية.",
    "why_3_title": "متابعة مخصصة",
    "why_3_desc": "متابعة دقيقة تتكيف مع حالتكم الصحية واحتياجاتكم الفردية في كل حصة.",
    "why_4_title": "تكفل منظم",
    "why_4_desc": "نخطط وننسق مواعيد حصصكم لضمان إقامة علاجية هادئة وخالية من أي قلق.",
    "why_5_title": "أقصى درجات الراحة",
    "why_5_desc": "بيئة نظيفة، مريحة ومؤمنة بالكامل لضمان رفاهيتكم طوال فترة العلاج.",
    "why_6_title": "مساعدة مسبقة قبل الوصول",
    "why_6_desc": "نرافقكم عن بُعد لاستكمال الإجراءات والتأكد من جاهزية كل شيء قبل وصولكم.",
    "about_transport_title": "نقل صحي متكامل",
    "about_transport_desc": "متوفر 24 ساعة/24 وطوال أيام الأسبوع بسيارات إسعاف ومركبات صحية مجهزة بالكامل.",
    "about_cta_title": "هل ترغبون في معرفة المزيد؟",
    "about_cta_sub": "فريقنا جاهز ومتاح للإجابة على جميع استفساراتكم.",
    "advice_badge": "دليل عملي",
    "advice_hero_title": "نصائح وإرشادات<br><span>لمرضى تصفية الدم</span>",
    "advice_hero_sub": "كافة المعلومات الأساسية حول التكفل المالي، الوثائق المطلوبة والنصائح اليومية لحياة صحية أفضل مع تصفية الدم.",
    "advice_tab_coverage": "التكفل المالي",
    "advice_tab_docs": "الوثائق",
    "advice_tab_transport": "النقل الصحي",
    "advice_tab_fistula": "الناسور",
    "advice_tab_nutrition": "التغذية",
    "advice_coverage_title": "التكفل المالي بالكامل",
    "advice_coverage_p": "يتم التكفل بالقصور الكلوي المزمن بنسبة 100% من طرف الضمان الاجتماعي (CNAS / CASNOS). يشمل ذلك حصص تصفية الدم، الأدوية والنقل الصحي في إطار الاتفاقية.",
    "advice_docs_title": "الوثائق الواجب تقديمها",
    "advice_docs_tourists_title": "المرضى الزوار والوافدون",
    "advice_docs_t1": "بروتوكول تصفية الدم / بطاقة الربط",
    "advice_docs_t2": "تحاليل حديثة (المصلية)",
    "advice_docs_t3": "تقرير طبي سريري حديث",
    "advice_cnas_1": "شهادة افتتاح الحقوق الأصلية الحديثة",
    "advice_cnas_2": "تحاليل حديثة (المصلية)",
    "advice_cnas_3": "بطاقة فصيلة الدم",
    "advice_cnas_4": "الملف الطبي أو بطاقة المتابعة",
    "advice_cnas_5": "02 صور شمسية",
    "advice_cnas_6": "01 شهادة إقامة",
    "advice_casnos_1": "شهادة تكفل كاسنوس سارية المفعول",
    "advice_casnos_2": "تحاليل حديثة (المصلية)",
    "advice_casnos_3": "بطاقة فصيلة الدم",
    "advice_casnos_4": "الملف الطبي أو بطاقة المتابعة",
    "advice_casnos_5": "02 صور شمسية",
    "advice_casnos_6": "01 شهادة إقامة",
    "advice_cnas_title": "الضمان الاجتماعي (CNAS)",
    "advice_casnos_title": "غير الأجراء (CASNOS)",
    "advice_transport_title": "النقل الصحي الطبي",
    "advice_transport_p1": "توفر شبكة بوسنة أسطول سيارات إسعاف مجهزة ومركبات صحية خفيفة (VSL) لنقل المرضى.",
    "advice_transport_p2": "سائقونا متوفرون 24/24 و7/7 لتأمين تنقلاتكم بين مقر السكن والعيادة بأمان وراحة تامة.",
    "advice_fistula_title": "نصائح وإرشادات حول الناسور",
    "advice_fistula_1": "يجب إنشاء الناسور الشرياني الوريدي قبل بدء التصفية لضمان مدخل وعائي ممتاز.",
    "advice_fistula_2": "راقب عمل الناسور يومياً بالشعور بالاهتزاز المميز لتدفق الدم.",
    "advice_fistula_3": "تجنب ارتداء الساعات، الأساور أو الضمادات الضيقة على ذراع الناسور.",
    "advice_fistula_4": "احمِ ذراعك أثناء الأنشطة وتجنب النوم على نفس الذراع.",
    "advice_fistula_5": "لا تستخدم أي مراهم أو علاجات على الناسور دون استشارة طبية مسبقة.",
    "advice_nutrition_title": "التغذية والنظام الغذائي",
    "advice_nutrition_1": "النظام الغذائي المتوازن والمناسب ضروري جداً لمرضى تصفية الدم.",
    "advice_nutrition_2": "يجب ألا تتجاوز زيادة الوزن بين الحصتين نسبة 5% من الوزن الجاف.",
    "advice_nutrition_3": "راقب تناول الملح، البوتاسيوم والفوسفور وفقاً لتعليمات طبيبك المعالج.",
    "advice_nutrition_4": "قلل من الأطعمة الغنية بالبوتاسيوم: الموز، الشوكولاتة، البقوليات الجافة والفواكه المجففة.",
    "prop_quality_care": "تنسيق طبي مخصص",
    "prop_quality_care_desc": "التحقق من المواعيد والمتابعة الإدارية قبل مغادرتكم.",
    "prop_peaceful_trip": "سفر بكل طمأنينة",
    "prop_peaceful_trip_desc": "ننسق جلساتكم وفقاً لجدول رحلتكم.",
    "prop_dedicated_help": "تواصل سهل ومباشر",
    "prop_dedicated_help_desc": "مسؤول واتساب مخصص في خدمتكم في كل خطوة.",
    "dr_boucenna_role": "أخصائي أمراض الكلى والمدير الطبي",
    "video_testi_1_badge": "مريضة تصفية دم",
    "badge_team_local": "طاقم محلي متفانٍ",
    "title_team_cherchell": "الطاقم الطبي والتمريضي في <span>شرشال</span>",
    "desc_team_cherchell": "طاقم طبي وتمريضي ذو خبرة عالية وحسن استماع، متواجد في كل حصة تصفية دم لضمان رعاية ممتازة في بيئة هادئة ومريحة على الساحل المتوسطي.",
    "title_team_bouira": "الطاقم الطبي والتمريضي في <span>البويرة</span>",
    "desc_team_bouira": "أطباؤنا وممرضونا المؤهلون يستقبلونكم بكل عناية في حي 2000 مسكن بالبويرة مع مرافقة شخصية وإنصات دائم لاحتياجاتكم.",
    "btn_contact_team": "تواصل مع الفريق",
    "title_testi_bouira": "تجربة المرضى في <span>بوسنة البويرة</span>",
    "sub_testi_bouira": "انطباع طيب من إحدى المريضات حول جودة الرعاية الطبية وحسن المرافقة في مركز البويرة.",
    "title_testi_cherchell": "تجربة المرضى في <span>بوسنة شرشال</span>",
    "sub_testi_cherchell": "شهادة مريض منتظم حول المتابعة الطبية الدقيقة والراحة في مركز شرشال.",

    "video_testi_1_title": "شهادة في مركز بوسنة",
    "video_testi_1_desc": "انطباع طيب حول جودة الرعاية الطبية وحسن معاملة الفريق التمريضي.",
    "video_testi_2_badge": "مريض منتظم",
    "video_testi_2_title": "الرعاية والراحة",
    "video_testi_2_desc": "شهادة حول المتابعة الطبية الدقيقة والمرافقة الشخصية لكل مريض.",

    "contact_form_error_required": "يرجى تعبئة حقلَي الاسم والهاتف والرسالة."
,
    "dept_badge": "أقسامنا الطبية",
    "dept_hero_title": "خدماتنا <span>وأقسامنا الطبية المتخصصة</span>",
    "dept_hero_sub": "تصفية الدم، استشارات أمراض الكلى، نقل صحي 24/24 وصيدلية متخصصة — تكفل شامل بصحتكم.",
    "dept_hemo_badge": "القسم 1",
    "dept_hemo_title": "حصص<br><span>تصفية الدم (الديلزة)</span>",
    "dept_hemo_p1": "تحتوي مراكزنا على أحدث مولدات تصفية الدم المتقدمة والمتاحة من الأحد إلى الخميس.",
    "dept_hemo_p2": "تتم مراقبة كل جلسة بدقة من قبل فريق طبي وتمريضي متخصص في بيئة معقمة ومريحة.",
    "dept_hemo_f1": "أحدث مولدات تصفية الدم العالمية",
    "dept_hemo_f2": "بروتوكولات تعقيم وتطهير صارمة",
    "dept_hemo_f3": "مراقبة طبية مستمرة طوال الجلسة",
    "dept_hemo_f4": "تغطية كاملة 100% في إطار الضمان الاجتماعي",
    "dept_nephro_badge": "القسم 2",
    "dept_nephro_title": "استشارات<br><span>أمراض الكلى</span>",
    "dept_nephro_p": "يقدم استشارات أمراض الكلى الدكتور نسيم بوسنة، أخصائي أمراض الكلى وتصفية الدم، بمرافقة أطباء عامين متمرسين.",
    "dept_nephro_f1": "متابعة تطور القصور الكلوي المزمن",
    "dept_nephro_f2": "تعديل وتكييف بروتوكولات وجلسات العلاج",
    "dept_nephro_f3": "متابعة شخصية ونتائج التحاليل البيولوجية دورياً",
    "dept_nephro_f4": "التكفل بالمضاعفات والوقاية منها",
    "dept_transport_badge": "القسم 3",
    "dept_transport_title": "النقل الصحي الطبي<br><span>24 ساعة/24 – 7 أيام/7</span>",
    "dept_transport_p": "تضمن خدمة النقل الصحي لدينا نقل المرضى وتأمين وصولهم بكل أمان بين مقر سكناهم والعيادة، وكذلك التنقل بين الولايات.",
    "dept_transport_f1": "سيارات إسعاف مجهزة بالكامل",
    "dept_transport_f2": "سيارات نقل صحي خفيفة (VSL)",
    "dept_transport_f3": "خدمة النقل الطبي بين الولايات",
    "dept_transport_f4": "طواقم نقل متوفرة 24 ساعة/24 وطوال الأسبوع",
    "dept_pharmacy_badge": "القسم 4",
    "dept_pharmacy_title": "صيدلية<br><span>متخصصة تابعة</span>",
    "dept_pharmacy_p": "تم دمج صيدليتنا المتخصصة في عيادة عين ولمان (سطيف) لتأمين إمدادات الأدوية والمستلزمات الخاصة بمرضى الكلى وتصفية الدم.",
    "dept_pharmacy_f1": "أدوية ومستلزمات علاج تصفية الدم",
    "dept_pharmacy_f2": "متابعة صيدلانية دقيقة وتوجيه المريض",
    "dept_pharmacy_f3": "تنسيق متكامل ومباشر مع الطاقم الطبي للعيادة",
    "title_team": "فريقنا <span>الطبي المتخصص</span>",
    "sub_team": "أطباؤنا وطاقمنا التمريضي ملتزمون بتقديم رعاية طبية فائقة الجودة وبلمسة إنسانية راقية.",
    "tab_nephro": "طبيب أمراض الكلى",
    "tab_paramedical": "الطاقم شبه الطبي",
    "doctor_title": "أخصائي أمراض الكلى والمدير الطبي",
    "doc_b1": "أخصائي في أمراض الكلى وتصفية الدم",
    "doc_b2": "متابعة شخصية وتكييف بروتوكولات العلاج",
    "doc_b3": "نهج إنساني ورعاية قائمة على التعاطف والاحترام",
    "doc_b4": "إشراف طبي مستمر على المراكز الثلاثة",
    "btn_appointment": "حجز موعد استشارة",
    "team_nursing_badge": "طاقم الرعاية في الميدان",
    "team_section_title": "طواقمنا <span>في قلب رعايتكم الصحية</span>",
    "team_section_sub": "حاضرون في كل جلسة لضمان أقصى درجات السلامة، الراحة والاطمئنان الصحي.",
    "team_nursing_title": "طاقم التمريض والرعاية الصحية",
    "team_nursing_desc": "ممرضون مؤهلون وتقنيون متمرسون مكرسون لرعايتكم اليومية في كل مركز من مراكزنا الثلاثة.",
    "team_card1_badge": "فريق التمريض",
    "team_card1_title": "ممرضون متخصصون",
    "team_card1_desc": "ربط آمن، مراقبة مستمرة للعلامات الحيوية وإنصات دائم لاحتياجات كل مريض.",
    "team_card2_badge": "قطب الساحل",
    "team_card2_title": "فريق شرشال",
    "team_card2_desc": "طاقم مؤهل ومدرّب على طوارئ الكلى وحسن استقبال مرضى العطلات.",
    "team_card3_badge": "مراقبة مباشرة",
    "team_card3_title": "مراقبة تصفية الدم",
    "team_card3_desc": "مراقبة صارمة لأجهزة الغسيل، تعقيم فائق وتوفير الراحة التامة طوال مدة العلاج.",
    "transfer_title": "كيف يتم إجراء<br><span>تغيير المركز؟</span>",
    "transfer_sub": "نحن نرافقكم في عملية التحويل بأمان تام وتنسيق طبي وإداري شامل بدون أي تعقيد.",
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
    "cnas_title": "التكفل ضمن <span>الضمان الاجتماعي (CNAS)</span>",
    "cnas_main_intro": "التكفل بجلسات تصفية الدم مؤمن 100% ضمن إطار الصندوق الوطني CNAS.<br>نقوم بجميع الإجراءات نيابة عنكم.",
    "cnas_card1_title": "إجراءات ميسرة",
    "cnas_card1_desc": "نساعدكم في كافة المعاملات الإدارية مع مصالح الضمان الاجتماعي.",
    "cnas_card2_title": "تكفل بنسبة 100%",
    "cnas_card2_desc": "وفق شروط الاستفادة والتنظيمات المعمول بها، دون دفع أي مبالغ مسبقة.",
    "cnas_card3_title": "نقل صحي معتمد",
    "cnas_card3_desc": "نوفر لكم خدمة النقل الصحي المعتمدة بسيارات إسعاف وسيارات مخصصة.",
    "cnas_btn": "تواصلوا معنا لمزيد من المعلومات",
    "contact_page_title": "اتصلوا <span>بنا</span>",
    "contact_page_sub": "فريقنا في خدمتكم للرد على كافة أسئلتكم واستفساراتكم.",
    "label_phone": "الهاتف",
    "label_whatsapp": "واتساب",
    "label_address": "العنوان",
    "label_hours": "أوقات العمل",
    "contact_address_val": "حي قعبوب التعاونية العقارية السلام قسم 105/قطعة رقم 151 سطيف، الجزائر",
    "contact_hours_val": "طوال أيام الأسبوع – 24 ساعة/24",
    "btn_send_msg": "إرسال الرسالة",
    "pill_team": "طاقم متمرس",
    "pill_tech": "أجهزة حديثة",
    "pill_hygiene": "نظافة وأمان",
    "pill_care": "رعاية مخصصة",
    "btn_call_center": "الاتصال بالمركز",
    "btn_itineraire": "تحديد المسار",
    "center_dialysis_badge": "مركز تصفية الدم",
    "center_ref_badge": "مركز مرجعي",
    "pill_pharmacy": "تجهيزات متطورة",
    "pill_cnas": "100% CNAS / CASNOS",
    "cherchell_hero_title": "مركز تصفية الدم<br><span>بوسنة – شرشال</span>",
    "cherchell_hero_sub": "مركز عصري ومتطور مكرس لراحتكم وسلامتكم، بإشراف طاقم طبي متخصص وذو كفاءة.",
    "why_cherchell_title": "لماذا تختار <span>بوسنة شرشال؟</span>",
    "why_chh_1_title": "علاج متطور",
    "why_chh_1_desc": "أحدث مولدات تصفية الدم ومحطة معالجة مياه عالية الأمان.",
    "why_chh_2_title": "طاقم طبي ذو خبرة",
    "why_chh_2_desc": "أطباء كلى وممرضون ذوو كفاءة عالية في كل حصة.",
    "why_chh_3_title": "مساعدة في الإقامة",
    "why_chh_3_desc": "مساعدة في تنظيم إقامتكم السياحية بالقرب من البحر.",
    "why_chh_4_title": "موقع مميز ومريح",
    "why_chh_4_desc": "موقع هادئ ومريح على الساحل المتوسطي لولاية تيبازة.",
    "gallery_chh_title": "معرض الصور – <span>بوسنة شرشال</span>",
    "gallery_chh_sub": "اكتشف مركزنا من خلال هذه الصور.",
    "bouira_hero_title": "مركز تصفية الدم<br><span>بوسنة – البويرة</span>",
    "why_bouira_title": "لماذا تختار <span>بوسنة البويرة؟</span>",
    "why_bouira_1_title": "موقع مركزي",
    "why_bouira_1_desc": "موقع استراتيجي بحي 2000 مسكن وسهل الوصول من مختلف مناطق الولاية.",
    "why_bouira_2_title": "أمراض كلى متخصصة",
    "why_bouira_2_desc": "استشارات دورية وتكييف دقيق لبروتوكولات التصفية.",
    "why_bouira_3_title": "راحة وطمأنينة",
    "why_bouira_3_desc": "قاعات مكيفة، كراسي طبية مريحة جداً ورعاية خاصة.",
    "why_bouira_4_title": "اتفاقية مع الضمان الاجتماعي",
    "why_bouira_4_desc": "تغطية كاملة بنسبة 100% دون دفع مسبق لجميع المؤمنين.",
    "gallery_bouira_title": "معرض الصور – <span>بوسنة البويرة</span>",
    "gallery_bouira_sub": "اكتشف تجهيزات ومرافق مركزنا بالبويرة.",
    "ain_oulmene_hero_title": "مركز تصفية الدم<br><span>بوسنة – عين ولمان</span>",
    "why_ain_oulmene_title": "لماذا تختار <span>بوسنة عين ولمان؟</span>",
    "why_ao_1_title": "نقل صحي مخصص",
    "why_ao_1_desc": "أسطول سيارات إسعاف ونقل صحي لنقلكم بين المنزل والعيادة.",
    "why_ao_2_title": "قاعدة تقنية متطورة",
    "why_ao_2_desc": "توفر فوري لكافة الأدوية والعلاجات الخاصة بأمراض الكلى.",
    "why_ao_3_title": "طاقم متمرس",
    "why_ao_3_desc": "تحت الإشراف الطبي للدكتور نسيم بوسنة، أخصائي أمراض الكلى.",
    "why_ao_4_title": "سلامة وأمان تام",
    "why_ao_4_desc": "تعقيم صارم ومحطة معالجة مياه بتقنية التناضح العكسي المزدوج.",
    "gallery_ao_title": "معرض الصور – <span>بوسنة عين ولمان</span>",
    "gallery_ao_sub": "اكتشف مرافقنا وأجهزتنا وصيدليتنا بسطيف."
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

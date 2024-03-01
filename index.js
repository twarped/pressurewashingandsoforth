// Element variables
const scrollSnapBodies = document.body.querySelectorAll('.scroll-snap');
const navBacking = document.body.querySelectorAll('.nav-backing')[0];
const nav = document.querySelector('nav');
const navAs = document.body.querySelectorAll('nav a');
const faBars = document.body.querySelectorAll('.fa-bars')[0];
const baCarouselSlides = document.body.querySelector('#beforeandafter .carousel-slides');
const contactForm = document.getElementById('contact-form');
const contactFormInputs = contactForm.querySelectorAll('input, textarea');
const submit = document.getElementById('submit');
const footer = document.body.querySelector('footer');


// CSS variables
let navHeight = parseInt((getComputedStyle(document.body)).getPropertyValue('--nav-height'));

// Other variables
let waitTimeout; // setTimeout id for closeNav function

/**
 * Check to see if the --nav-height has changed (Just in case...)
 */

function setNavHeight() {
    navHeight = parseInt((getComputedStyle(document.body)).getPropertyValue('--nav-height'));
}

/**
 * Checks to see if a number is within a minimum and a maximum value
 * @param {number} min The minimum the number can be
 * @param {number} num The number to be checked
 * @param {number} max The maximum the number can be
 * @returns {Boolean} True if the number is within the minimum and maximum values
 */

function isWithin(min, num, max) {
    return min <= num && num <= max;
}

/**
 * How we're going to set the active navigation link style after it was clicked
 * 
 * @param {MouseEvent} ev The mouse event for when a navigation link is clicked
 */

function navClick(ev) {
    navAs.forEach(el => {
        el.classList.remove('active');
    });
    ev.target.classList.add('active');
    if (ev.type === 'click') {
        navBacking.classList.remove('active');
        nav.classList.remove('dropdown');
    }
};

/**
 * What happens when the user clicks the fa bars.
 * Either opens or closes the expanded navbar
 */

function faClick() {
    if (nav.classList.contains('dropdown')) {
        navBacking.classList.remove('active');
        nav.classList.remove('dropdown');
    } else {
        navBacking.classList.add('active');
        nav.classList.add('dropdown');
    }
}

/**
 * Closes the expanded navbar after a certain wait time unless the navbar is interacted with
 * @param {Number} wait Time in milliseconds to wait for user to respond to expanded navbar before closing it.
 */

function closeNav(ev, wait = 300) {
    function stopWaiting() {
        clearTimeout(waitTimeout);
    }
    const waitTimeout = setTimeout(() => {
        nav.removeEventListener('mouseover', stopWaiting);
        navBacking.classList.remove('active');
        nav.classList.remove('dropdown');
    }, wait);
    nav.addEventListener('mouseover', stopWaiting);
}

/**
 * How we're going to set the active navigation link to the section we're looking at
 * 
 * @param {Event} ev The scroll event
 * @param {Boolean} log Whether or not to log the sections and stuff
 */

function checkActiveSection(ev = new Event('scroll'), log = false) {
    const sections = [...document.body.querySelectorAll('header'), ...document.body.querySelectorAll('section')];
    const activeSection = sections.filter(section => {
        setNavHeight();

        // Plus or minus this amount for our current scroll position. Basically increases the chance of finding a section
        const sensitivity = (window.innerHeight - navHeight) / 2;

        const sectionRectY = section.getBoundingClientRect().y;
        return isWithin(navHeight - sensitivity, sectionRectY, navHeight + sensitivity) || isWithin(0, sectionRectY, sensitivity) || sectionRectY == navHeight - footer.offsetHeight;
    });

    if (activeSection[0]) {
        navClick({ target: document.body.querySelector(`nav a[href="#${ activeSection[0].id }"]`) });

        // set the navbar position
        if (activeSection[0].id == 'home') {
            nav.classList.add('up');
        } else {
            nav.classList.remove('up');
        }
    };

    if (log) {
        console.log(sections);
        console.log(sections.map(el => el.getBoundingClientRect().y))
        console.log(activeSection);
    };
};

/**
 * Check which carousel slide is currently active
 * 
 * @param {Event} ev The scroll event triggered by a carousel element
 */

function checkActiveSlide(ev) {

}

/**
 * Send the form data to the google sheet.
 * 
 * https://developer.mozilla.org/en-US/docs/Learn/Forms/Sending_forms_through_JavaScript
 */

async function sendData() {
    // Associate the FormData object with the form element
    const formData = new FormData(contactForm);

    try {
        submit.value = "Processing Request...";
        const response = await fetch("https://script.google.com/macros/s/AKfycby-pWhALDx1-YHOMv9rKFAsG4XvkmxAwjBZo26gdKVY_wjLNW_G3o1Xm_3qJW8XvtypzA/exec", {
            method: "POST",
            // Set the FormData instance as the request body
            body: formData,
        });
        console.log(await response.json());
        submit.value = "Success!";
        contactForm.reset();
    } catch (e) {
        console.error(e);
        submit.value = "Error. Please try again.";
    }
}


// Event Listeners
nav.addEventListener('mouseleave', closeNav);

navAs.forEach(el => {
    el.addEventListener('click', navClick);
});

faBars.addEventListener('click', faClick);
faBars.addEventListener('mouseover', faClick);

scrollSnapBodies.forEach(el => {
    el.addEventListener('scroll', checkActiveSection);
});

baCarouselSlides.addEventListener('scroll', checkActiveSlide);
  
// Take over form submission
contactForm.addEventListener("submit", ev => {
    ev.preventDefault();
    sendData();
});

contactFormInputs.forEach(el => {
    el.addEventListener('input', ev => {
        if (ev.target.value != '') {
            submit.value = 'Send Job Request';
        };
    });
})
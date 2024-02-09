// Element variables
const scrollSnapBodies = document.body.querySelectorAll('.scroll-snap');
const nav = document.querySelector('nav');
const navAs = document.body.querySelectorAll('nav a');
const baCarouselSlides = document.body.querySelector('#beforeandafter .carousel-slides');
const footer = document.body.querySelector('footer');


// CSS variables
let navHeight = parseInt((getComputedStyle(document.body)).getPropertyValue('--nav-height'));

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
    if (ev.target.classList) {}
};

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
        
        console.log(activeSection[0].id);

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


// Event Listeners
navAs.forEach(el => {
    el.addEventListener('click', navClick);
});

scrollSnapBodies.forEach(el => {
    el.addEventListener('scroll', checkActiveSection);
});

baCarouselSlides.childNodes.forEach(el => {
    el.addEventListener('scroll', checkActiveSlide);
})
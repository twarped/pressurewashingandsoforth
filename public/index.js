const navA = document.body.querySelectorAll('nav a');

navA.forEach(el => {
    el.addEventListener('click', el => {
        navA.forEach(el => {
            el.classList.remove('active');
        });
        el.target.classList.add('active');
    });
});
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if(entry.isIntersecting)
            entry.target.classList.add('motion-safe:animate-fade');
    })
}, {rootMargin: '0px', threshold: [0, .1, 1]});
const sections = document.querySelectorAll('section, #project-div div');
sections.forEach((section) => observer.observe(section));
const menu = document.querySelector('menu');

function hide() {
    if(menu.classList.contains('left-0')){
        document.querySelector('main').removeEventListener('click', hide);
        menu.classList.remove('left-0');
        menu.classList.add('-left-full')
    }
}

function scrollToTop(){
    hide()
    window.scrollTo({top: 0, behavior: 'smooth'});
}

function hiddenMenu() {
    if (menu.classList.contains('-left-full')) {
        document.querySelector('main').addEventListener('click', hide);
        menu.classList.remove('-left-full');
        menu.classList.add('left-0');
    } else {
        hide()
    }
}

document.getElementById('theme-switch').addEventListener('click', () => {
    const span = document.querySelector('#theme-switch span');
    const body = document.body;
    if(body.dataset.theme === 'dark') {
        body.dataset.theme = 'light';
        span.innerHTML = '&#xe51c;';
    } else {
        body.dataset.theme = 'dark';
        span.innerHTML = '&#xe518;';
    }
})

function scrollTo(id) {
    hide()
    let y = document.getElementById(id).getBoundingClientRect().top + window.scrollY
    if (window.screenX < 720) y -= 72;
    window.scroll({
        top: y,
        behavior: 'smooth'
    });
}

const skillList = document.getElementById('skills-list');
let scrolled_to_end = false;
let paused = false;
function setMenuTimeOut() {
    if(paused) return;
    let scroll_y = skillList.scrollLeft + 1;
    if (scroll_y < (skillList.scrollWidth - skillList.offsetWidth)) {
        if (!scrolled_to_end)
            skillList.scroll({left: scroll_y});
        else if (scroll_y === 1)
            scrolled_to_end = false
    }
    else {
        scrolled_to_end = true
        skillList.scroll({left: 0, behavior: 'smooth'});
    }
}

const projects = document.querySelectorAll('#project-div div div div.inline-block');
const max = projects.length - 1;
const NEXT = 'next';
const PREVIOUS = 'previous';
let current = 0;
let signal = 1;
let project_paused = false;
let skip_next = false;
function projectCursor(cursor) {
    if(project_paused) return;
    if (!cursor) {
        if(skip_next) {
            skip_next = false;
            return;
        }
        if(current === max)
            signal = -1
        else if(current === 0)
            signal = 1
        if (signal === 1)
            cursor = NEXT
        else if (signal === -1)
            cursor = PREVIOUS
    } else {
        skip_next = true;
        signal = cursor === NEXT ? 1 : -1;
    }

    if ((current === 0 && cursor === PREVIOUS) || (current === max && cursor === NEXT)) return;
    if(cursor !== NEXT && cursor !== PREVIOUS) console.error('unknown-cursor');
    document.getElementById('project-previous').style.opacity = '';
    document.getElementById('project-next').style.opacity = '';
    projects[current].classList.remove('scale-100');
    projects[current].classList.add('scale-80');
    projects[current].classList.remove('left-1/2');
    projects[current].classList.add(cursor === NEXT ? '-left-1/2' : 'left-[150%]');
    current += cursor === NEXT ? 1 : -1;
    projects[current].classList.remove('scale-80');
    projects[current].classList.add('scale-100');
    projects[current].classList.remove(cursor === NEXT ? 'left-[150%]' : '-left-1/2');
    projects[current].classList.add('left-1/2');
    if (current === 0)
        document.getElementById('project-previous').style.opacity = '30%';
    else if (current === max)
        document.getElementById('project-next').style.opacity = '30%';
}

document.getElementById('menu').addEventListener('click', hiddenMenu);
document.getElementById('home-button').addEventListener('click', scrollToTop);
document.getElementById('about-me-button').addEventListener('click', () => scrollTo('about-me'));
document.getElementById('skills-button').addEventListener('click', () => scrollTo('skills'));
document.getElementById('projects-button').addEventListener('click', () => scrollTo('projects'));
document.getElementById('education-button').addEventListener('click', () => scrollTo('education'));
document.getElementById('return').addEventListener('click', hiddenMenu)
document.getElementById('skills-list').scroll({left: 50})
window.setInterval(setMenuTimeOut, 20)
skillList.addEventListener('touchend', () => paused = !paused)
skillList.addEventListener('mouseover', () => { paused = true });
skillList.addEventListener('mouseout', () => { paused = false });
document.getElementById('project-previous').style.opacity = '30%';
document.getElementById('project-previous').addEventListener('click', () => projectCursor(PREVIOUS));
document.getElementById('project-next').addEventListener('click', () => projectCursor(NEXT))
document.getElementById('project-div').addEventListener('touchstart', () => project_paused = true);
document.addEventListener('touchend', () => project_paused = false);

const project_interval = window.setInterval(() => projectCursor(), 5000)
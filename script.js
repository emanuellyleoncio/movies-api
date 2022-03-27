const moviesContainer = document.querySelector('.movies');
const btnPrev = document.querySelector('.btn-prev');
const btnNext = document.querySelector('.btn-next');
const input = document.querySelector('.input');

const video = document.querySelector('.highlight__video');
const h3Title = document.querySelector('.highlight__title');
const spanTitle = document.querySelector('.highlight__rating');
const genero = document.querySelector('.highlight__genres');
const launch = document.querySelector('.highlight__launch');
const descricao = document.querySelector('.highlight__description');
const linkVideo = document.querySelector('.highlight__video-link')

const botaoTema = document.querySelector('.btn-theme');
const body = document.querySelector('body');

const modal = document.querySelector('.modal');
const tituloModal = document.querySelector('.modal__title');
const imagemModal = document.querySelector('.modal__img');
const descricaoModal = document.querySelector('.modal__description');
const votoModal = document.querySelector('.modal__average');
const generosModal = document.querySelector('.modal__genres');
const fecharModal = document.querySelector('.modal__close');

let currentPage = 0;
let curretMovies = [];

input.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter') {
        return;
    };

    currentPage = 0;

    if (input.value) {
        searchMovie(input.value)
    } else {
        loadMovies();
    };

    input.value = '';
})

btnPrev.addEventListener('click', () => {
    if (currentPage === 0) {
        currentPage = 3
    } else {
        currentPage--;
    };

    carroselMovies();
});

btnNext.addEventListener('click', () => {
    if (currentPage === 3) {
        currentPage = 0
    } else {
        currentPage++;
    };

    carroselMovies();
});

fecharModal.addEventListener('click', () => {
    modal.classList.add('hidden');
});

modal.addEventListener('click', () => {
    modal.classList.add('hidden');
});


botaoTema.addEventListener('click', () => {

    if (botaoTema.getAttribute('src') === './assets/light-mode.svg') {
        botaoTema.setAttribute('src', './assets/dark-mode.svg');
    } else {
        botaoTema.setAttribute('src', './assets/light-mode.svg');
    };

    if (btnPrev.getAttribute('src') === './assets/seta-esquerda-preta.svg') {
        btnPrev.setAttribute('src', './assets/seta-esquerda-branca.svg');
        btnNext.setAttribute('src', './assets/seta-direita-branca.svg');
    } else {
        btnPrev.setAttribute('src', './assets/seta-esquerda-preta.svg');
        btnNext.setAttribute('src', './assets/seta-direita-preta.svg');
    };

    const novaCorDeFundo = body.style.getPropertyValue('--background-color') === '#242424' ? '#FFF' : '#242424';
    body.style.setProperty('--background-color', novaCorDeFundo);

    const novaCorInput = body.style.getPropertyValue('--input-border-color') === '#FFFFFF' ? '#979797' : '#FFFFFF';
    body.style.setProperty('--input-border-color', novaCorInput);

    const novaCorTitulo = body.style.getPropertyValue('--color') === '#FFFFFF' ? '#000' : '#FFFFFF';
    body.style.setProperty('--color', novaCorTitulo);  

    const novaCorSombra= body.style.getPropertyValue('--shadow-color') === 'rgba(255, 255, 255, 0.15)' ? 'rgba(0, 0, 0, 0.15)' : 'rgba(255, 255, 255, 0.15)';
    body.style.setProperty('--shadow-color', novaCorSombra);

    const novaCorBackHighlight= body.style.getPropertyValue('--highlight-background') === '#454545' ? '#FFF' : '#454545';
    body.style.setProperty('--highlight-background', novaCorBackHighlight);

    const novaCorDescriptionHighlight = body.style.getPropertyValue('--highlight-description') === '#FFFFFF' ? '#000' : '#FFFFFF';
    body.style.setProperty('--highlight-description', novaCorDescriptionHighlight);

    const novaCorHighlightColor = body.style.getPropertyValue('--highlight-color') === 'rgba(255, 255, 255, 0.7)' ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.7)';
    body.style.setProperty('--highlight-color', novaCorHighlightColor);  
    
});

fetch('https://tmdb-proxy.cubos-academy.workers.dev/3/movie/436969?language=pt-BR').then((resposta) => {
    const promiseBody = resposta.json();
    promiseBody.then((body) => {
        let lista =[];
        const procurar = body.genres.map((item) => {
            return lista.push(item.name);
        });

        const option = {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        };
        const data = (new Date (body.release_date).toLocaleDateString('pt-br', option)).toUpperCase();

        video.style.backgroundImage = `url(${body.backdrop_path})`;
        h3Title.textContent = body.title;
        spanTitle.textContent = body.vote_average;
        genero.textContent = lista.join(', ');
        launch.textContent = data;
        descricao.textContent = body.overview;
    });
});

fetch('https://tmdb-proxy.cubos-academy.workers.dev/3/movie/436969/videos?language=pt-BR').then((resposta) => {
    const promiseBody = resposta.json();
    promiseBody.then((body) => {
        linkVideo.href = `https://www.youtube.com/watch?v=${body.results[0].key}`;
    });
});


function carroselMovies() {
    moviesContainer.textContent = '';

    for (let i = (currentPage * 5); i < ((currentPage + 1) * 5); i++) {
        const movie = curretMovies[i];

        const movieContainer = document.createElement('div');
        movieContainer.classList.add('movie');
        movieContainer.style.backgroundImage = `url(${movie.poster_path})`;

        movieContainer.addEventListener('click', () => {
            loadMovie(movie.id)
        });

        const movieInfo = document.createElement('div');
        movieInfo.classList.add('movie__info');

        const movieTitle = document.createElement('span');
        movieTitle.classList.add('movie__title');
        movieTitle.textContent = movie.title;

        const movieRating = document.createElement('span');
        movieRating.classList.add('movie__rating');

        const star = document.createElement('img');
        star.src = "./assets/estrela.svg";
        star.alt = "Estrela";

        movieRating.append(star, movie.vote_average);
        movieInfo.append(movieTitle, movieRating);
        movieContainer.append(movieInfo);
        moviesContainer.append(movieContainer);
    };
};



function searchMovie(search) {

    const responsePromise = fetch(`https://tmdb-proxy.cubos-academy.workers.dev/3/search/movie?language=pt-BR&include_adult=false&query=${search}`);

    responsePromise.then(function(response) {
        const bodyPromise = response.json();

        bodyPromise.then(function(body) {
            curretMovies = body.results;
            carroselMovies();

        });
    });
};

function loadMovies() {

    const responsePromise = fetch('https://tmdb-proxy.cubos-academy.workers.dev/3/discover/movie?language=pt-BR&include_adult=false');

    responsePromise.then(function(response) {
        const bodyPromise = response.json();

        bodyPromise.then(function(body) {
            curretMovies = body.results;
            carroselMovies();

        });
    });
};

function loadMovie(id) {

    modal.classList.remove('hidden');
    body.style.overflow = 'none';
    modal.style.overflowY = 'scroll';

    const responsePromise = fetch(`https://tmdb-proxy.cubos-academy.workers.dev/3/movie/${id}?language=pt-BR`);

    responsePromise.then(function(response) {
        const bodyPromise = response.json();

        bodyPromise.then(function(body) {
            imagemModal.alt = body.title;
            tituloModal.textContent = body.title;
            imagemModal.src = body.backdrop_path;
            descricaoModal.textContent = body.overview;
            votoModal.textContent = body.vote_average;

            generosModal.innerHTML = '';
            body.genres.forEach((item) => {
                const generoModal = document.createElement('div');
                generoModal.classList.add('modal__genre');
                generoModal.textContent = item.name;

                generosModal.append(generoModal);
            });
        });
    });
};

loadMovies();
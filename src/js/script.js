const sliderGroup= document.getElementById('sliderGroups');
const token = localStorage.getItem('token');

if(token == null) {
    window.location.href="loggin.html";
}

var sliderItem;
var sliderTranslate = 0;

function showCategories(categoria) {
    sliderGroup.innerHTML = '';
        const categoriaDiv = document.createElement('div');
        categoriaDiv.classList.add('rowSlider');
        categoriaDiv.innerHTML = `
        <h2 class="rowHeader">
            <a class="rowTitle" href="${categoria.name}">
                <div class="rowHeaderTitle">${categoria.name}</div>
            </a>
        </h2>
        <div class="rowContainer">
            <div class="rowContent">
                <div class="slider">
                    <div class="sliderMask"  id="${categoria.name}"></div>                   
                    <span class="handle" role="button" id="next" aria-label="Ver mas titulos">
                        <span class="material-symbols-outlined btn-slider">
                            arrow_forward_ios
                        </span>
                    </span>
                    <span class="handle" role="button" id="after" aria-label="Ver mas titulos">
                        <span class="material-symbols-outlined btn-slider">
                            arrow_back_ios
                        </span>
                    </span> 
                </div> 
            </div>
        </div>
        `
        sliderGroup.appendChild(categoriaDiv);

        sliderItem = document.getElementById(categoria.name);
        categoria.film.forEach( (pelicula) => {
            const items = document.createElement('div');
            items.classList.add('sliderItem');
            items.setAttribute("id","sliderItem");
            items.setAttribute("data",pelicula._id);
            items.innerHTML = `
                    <div class="titleCardContainer">
                        <div class="titleCard">
                                <div class="box-size box-rounded">
                                    <img class="box-img" src="${pelicula.poster}" alt="${pelicula.titulo}">
                                    <div class="fallback-text-container">
                                        <p class="fallback-text">${pelicula.titulo}</p>
                                    </div>
                                </div>
                            </a>
                        </div>
                    </div>
            `

            sliderItem.appendChild(items);
        });    
    btn_function()
}

function nextSlider(){
    if(sliderTranslate == -300) {
        sliderTranslate = 0;
        sliderItem.style.transform = "translate3d("+sliderTranslate+"%,0,0)";
    }else {
        sliderTranslate -= 100; 
        sliderItem.style.transform = "translate3d("+sliderTranslate+"%,0,0)";
    }
}

function afterSlider() {
    if(sliderTranslate == 0) {
        sliderTranslate = -300;
        sliderItem.style.transform = "translate3d("+sliderTranslate+"%,0,0)";
    }else {
        sliderTranslate += 100; 
        sliderItem.style.transform = "translate3d("+sliderTranslate+"%,0,0)";
    }
}

function btn_function() {
    const btn_next = document.getElementById('next');
    btn_next.addEventListener("click",nextSlider,false);

    const btn_after = document.getElementById('after');
    btn_after.addEventListener("click",afterSlider,false);

    const btn_Sliderplay = document.querySelectorAll('#sliderItem');
    btn_Sliderplay.forEach( (boton)=> {
        const id = boton.getAttribute("data");
        boton.addEventListener("click",() => {
            getMovieId(id);
        });
    });
}

async function getMovies() {
    var init = {
        method: 'GET',
        headers: {
            'Content-Type':'application/json',
            'Authorization':`Bearer ${token}`
        }
    }
    
    try {
        let data = [{name:'Accion'},{name:'Aventuras'},{name:'Fantasia'}];
        await data.forEach( async (gender)=> {
            console.log(gender)
            const response = await fetch(`http://localhost:3001/api/peliculas/genero/${gender.name}`,init);
            if(response.ok) {
                const jsonResponse = await response.json();
                gender['film'] = jsonResponse.data;
                showCategories(gender);
            }else {
                //localStorage.clear();
                //window.location.href="loggin.html";
            }
        });
            }catch(err) {
        console.log(err);
    }
}

async function getMovieId(id) {
    var init = {
        method: 'GET',
        headers: {
            'Content-Type':'application/json',
            'Authorization':`Bearer ${token}`
        }
    }
    
    try {
        const response = await fetch(`http://localhost:3001/api/peliculas/${id}`,init);
            if(response.ok) {
                const jsonResponse = await response.json();
                popUpPlay(jsonResponse.data[0]);
            }else {
                console.log('error')
            }
        
    }catch(err) {
        console.log(err);
    }
}

async function getMoreData(gender) {
    var init = {
        method: 'GET',
        headers: {
            'Content-Type':'application/json',
            'Authorization':`Bearer ${token}`
        }
    }
    
    try {
        const response = await fetch(`http://localhost:3001/api/peliculas/genero/${gender}`,init);
            if(response.ok) {
                const jsonResponse = await response.json();
                contentFilm(jsonResponse.data)
            }else {
                //localStorage.clear();    
            }
        
    }catch(err) {
        console.log(err);
    }
}

async function getPortada() {

    var init = {
        method: 'GET',
        headers: {
            'Content-Type':'application/json',
            'Authorization':`Bearer ${token}`
        }
    }
    
    try {
        const response = await fetch('http://localhost:3001/api/peliculas/portada',init);
            if(response.ok) {
                const jsonResponse = await response.json();
                let portada = jsonResponse.data[0]
                document.getElementById('image-layer').src = portada.backposter;
                document.getElementById('custom-title').src = portada.logo;
                document.getElementById('argument').innerText = portada.argumento;
                //Agregar url boton portada
            }else {
                localStorage.clear();    
            }
        
    }catch(err) {
        console.log(err);
    }
}

function popUpPlay(popUp_film) {
        const popUp = document.createElement('div');
        popUp.classList.add('popUp');
        popUp.setAttribute("id","popUp");
        popUp.innerHTML = `
            <div role="dialog" class="popUp-container">
                <div class="preview-player">
                    <div class="preview-player-container">
                        <img class="preview-backposter" src="${popUp_film.backposter}">
                        <div class="preview-player-controls">
                            <div class="player-controls">
                                <img class="control-logo" src="${popUp_film.logo}">
                                <div class="control-buttons">
                                    <button class="btn control-btn" id="popUpPlay">
                                        <span class="material-symbols-outlined icon">
                                            play_arrow
                                        </span>
                                        <span class="btn-font">
                                            Reproducir
                                        </span>
                                    </button>
                                </div>    
                            </div>
                        </div>
                    </div>
                </div>
                <div class="preview-close" id="btn_close">
                    <span class="material-symbols-outlined close-icon">
                        close
                    </span>
                </div>
                <div class="preview-info">
                    <div class="preview-info-detail">
                        <div class="ptrack-container">
                            <div class="preview-detail-container">
                                <div class="preview-detail-container-left">
                                    <div class="detail-title">
                                        <h2>${popUp_film.titulo}</h2>
                                    </div>
                                    <div class="detail-argument">
                                        <p>${popUp_film.argumento}</p>
                                    </div>                   
                                </div>
                                <div class="preview-detail-container-right">
                                    <div class="preview-detail-tag">
                                        <!-- Esto se haria desde otro javascript -->
                                        <span class="label-tag">Generos : </span>
                                        <span class="item-tag">Accion, </span>
                                        <span class="item-tag">Ficcion</span>
                                    </div>
                                    <div class="preview-detail-tag">
                                        <span class="label-tag">Reparto : </span>
                                        <span class="item-tag">spiderman, </span>
                                        <span class="item-tag">misterio</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="ptrack-container">
                            <h3 class="content-title"> Similares </h3>
                            <div class="more-content-popUp" id="moreContentPopUp">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `


    const main = document.getElementById('main');
    main.appendChild(popUp);

    const btn_close = document.getElementById('btn_close');
    btn_close.addEventListener("click", () => {
        document.getElementById('popUp').remove();
    });

    const btn_popUpPlay = document.getElementById("popUpPlay");
    btn_popUpPlay.addEventListener("click", () => {
        window.location.href= popUp_film.pelicula.url
    })

    if(!popUp_film){
        contentSeries()
    }else {
        let i = Math.floor(Math.random() * (popUp_film.genero.length));
        getMoreData(popUp_film.genero[i]);
    }
}

function contentFilm(content) {
    const moreContentPopUp = document.getElementById("moreContentPopUp");
    content.forEach( (film) => {
        const moreTracks = document.createElement('div')
        moreTracks.classList.add('more-content-popUp-item');
        moreTracks.innerHTML = `
            <div class="titleCard-image">
                <div class="ptrack-content">
                    <img class="ptrack-img" src="${film.poster}" alt="${film.titulo}">
                </div>
            </div>
            <div class="titleCard-metadata" id="${film._id}">
                <div class="metadata-play">
                    <button class="btn-metadata" id="metadataBtnPlay">
                        <span class="material-symbols-outlined" >
                            play_arrow
                        </span>
                    </button>
                </div>
                <div class="metadata-container">
                    <div class="metadata-title">${film.titulo}</div>
                    <div class="metadata-description">${film.argumento}</div>
                </div>
            </div>
        `
        moreContentPopUp.appendChild(moreTracks);

        moreTracks.addEventListener("mouseover", () => {
            const hover = document.getElementById(film._id);
            hover.style.display = "block"
        });

        //getMovieId(id)

        moreTracks.addEventListener("mouseout", () => {
            const hover = document.getElementById(film._id);
            hover.style.display = "none"
        });

        moreTracks.addEventListener("click", () => {
            const backPop = document.getElementById('popUp');
            backPop.remove();
            getMovieId(film._id);
        });

    });

}

getPortada();
getMovies();

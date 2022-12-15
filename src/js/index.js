const formulario = document.getElementById('form');
const inputs = document.querySelectorAll('#form input');

const expresiones = {
    email: /^(([^<>()\[\]\\.,;:\s@”]+(\.[^<>()\[\]\\.,;:\s@”]+)*)|(“.+”))@((\[[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}])|(([a-zA-Z\-0–9]+\.)+[a-zA-Z]{2,}))$/,
    password: /^.{8,25}$/
}

const campos = {
    user: false,
    psw: false
}

const validarFormulario = (e) => { 
    if(e.target.name == 'user') {
        validarCampo(expresiones.email, e.target, 'user');
    }else if(e.target.name == 'psw'){
        validarCampo(expresiones.password, e.target, 'psw');
    }
}

const validarCampo = (expresion, input, campo) => {
    if(expresion.test(input.value)) {
        document.getElementById(`${campo}_group`).classList.remove('form_input-incorrect');
        document.querySelector(`#${campo}_group .form_input-error`).classList.remove('form_input-error-activo')
        campos[campo] = true;
    }else {
        document.getElementById(`${campo}_group`).classList.add('form_input-incorrect')
        document.querySelector(`#${campo}_group .form_input-error`).classList.add('form_input-error-activo')
        campos[campo] = false;
    }
}

inputs.forEach((input) => {
    input.addEventListener('keyup',validarFormulario);
    input.addEventListener('blur',validarFormulario);
});

formulario.addEventListener('submit', (e) => {
    e.preventDefault();
    if(campos.user && campos.psw) {
        const email = document.querySelector('#user').value;
        const password = document.querySelector('#psw').value;

        var data = {
            email : email,
            password : password
        }

        login(data);
    }
});

const login = async (data) => {
    var init = {
        method: 'POST',
        headers: {
            'Content-Type':'application/json'
        },
        body: JSON.stringify(data)
    }
    
    try {
        const response = await fetch('http://localhost:3001/api/auth/login',init);
            if(response.ok) {
                document.getElementById('form_msg').classList.remove('form_msg-activo');
                document.querySelector(`#form_msg .form_msg-error`).classList.remove('form_msg-error-activo')
                
                const jsonResponse = await response.json();
                const token = jsonResponse.data.token;
                const user = jsonResponse.data.user;
                localStorage.setItem("token",token);
                localStorage.setItem("user",JSON.stringify(user));
                window.location.href="index.html";
            }else {
                document.getElementById('form_msg').classList.add('form_msg-activo');
                document.querySelector(`#form_msg .form_msg-error`).classList.add('form_msg-error-activo')
            }
        
    }catch(err) {
        console.log(err);
    }
}

// PARTE DE LLAMAR PELICULAS

























































const container = document.getElementById('container');
const RegisterBtn = document.getElementById('register');
const loginBtn = document.getElementById('login');

RegisterBtn.addEventListener('click', () => {
    container.classList.add("active");
})

loginBtn.addEventListener('click', () => {
    container.classList.remove("active");
})

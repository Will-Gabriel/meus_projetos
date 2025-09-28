// Classe responsável pela validação do formulário de login
class LoginValidator {
    constructor() {
        // Seleciona os elementos do formulário
        this.form = document.getElementById('form-inputs');
        this.emailInput = document.getElementById('user-email');
        this.passwordInput = document.getElementById('user-password');
        this.submitBtn = document.getElementById('login-btn');
        this.alert = document.getElementById('alert');

        // Inicializa os eventos
        this.init();
    }

    // Método para adicionar os listeners de eventos
    init() {
        // Ao enviar o formulário
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));

        // Ao sair do campo email, validar
        this.emailInput.addEventListener('blur', () => this.validateEmail());

        // Ao sair do campo senha, validar
        this.passwordInput.addEventListener('blur', () => this.validatePassword());

        // Ao digitar no email, limpar erro
        this.emailInput.addEventListener('input', () => this.clearErrors('email'));

        // Ao digitar na senha, limpar erro
        this.passwordInput.addEventListener('input', () => this.clearErrors('password'));
    }

    // Validação do campo de email
    validateEmail() {
        const email = this.emailInput.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Expressão regular para validar email

        if (!email) {
            this.showFieldError('email', 'Email é obrigatório');
            return false;
        }

        if (!emailRegex.test(email)) {
            this.showFieldError('email', 'Email deve ter um formato válido');
            return false;
        }

        this.showFieldSuccess('email');
        return true;
    }

    // Validação do campo de senha
    validatePassword() {
        const password = this.passwordInput.value;

        if (!password) {
            this.showFieldError('password', 'Senha é obrigatória');
            return false;
        }

        if (password.length < 5) {
            this.showFieldError('password', 'Senha deve ter pelo menos 5 caracteres');
            return false;
        }

        this.showFieldSuccess('password');
        return true;
    }

    // Exibe mensagem de erro no campo indicado
    showFieldError(field, message) {
        const input = document.getElementById(`user-${field}`);
        const errorDiv = document.getElementById(`${field}-error`);

        input.classList.add('error');
        input.classList.remove('success');
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
    }

    // Exibe que o campo foi preenchido com sucesso
    showFieldSuccess(field) {
        const input = document.getElementById(`user-${field}`);
        const errorDiv = document.getElementById(`${field}-error`);

        input.classList.remove('error');
        input.classList.add('success');
        errorDiv.style.display = 'none';
    }

    // Limpa os erros visuais de um campo
    clearErrors(field) {
        const input = document.getElementById(`user-${field}`);
        const errorDiv = document.getElementById(`${field}-error`);

        input.classList.remove('error');
        errorDiv.style.display = 'none';
    }

    // Exibe um alerta geral na tela
    showAlert(message, type) {
        this.alert.textContent = message;
        this.alert.className = `alert ${type}`;
        this.alert.style.display = 'block';

        // Oculta o alerta automaticamente após 5 segundos
        setTimeout(() => {
            this.alert.style.display = 'none';
        }, 5000);
    }

    // Define o estado de carregamento do botão
    setLoading(loading) {
        if (loading) {
            this.submitBtn.innerHTML = '<span class="loading"></span>Entrando...';
            this.submitBtn.disabled = true;
        } else {
            this.submitBtn.innerHTML = 'Entrar';
            this.submitBtn.disabled = false;
        }
    }

    // Lida com o envio do formulário
    async handleSubmit(e) {
        e.preventDefault(); // Previne o comportamento padrão de envio

        // Realiza as validações
        const isEmailValid = this.validateEmail();
        const isPasswordValid = this.validatePassword();

        // Se houver erro, exibe alerta e não prossegue
        if (!isEmailValid || !isPasswordValid) {
            this.showAlert('Por favor, corrija os erros antes de continuar', 'error');
            return;
        }

        // Prepara os dados do login
        const loginData = {
            email: this.emailInput.value.trim(),
            password: this.passwordInput.value
        };

        // Mostra loading
        this.setLoading(true);

        try {
            // Simula a requisição para o backend
            const response = await this.submitLogin(loginData);

            if (response.success) {
                // this.showAlert('Login realizado com sucesso!', 'success');

                // Redireciona após 150ms
                setTimeout(() => {
                    window.location.href = response.redirectUrl || '/PageWeb/app/static/marschoco.html';
                }, 150);
            } else {
                this.showAlert(response.message || 'Credenciais inválidas', 'error');
            }
        } catch (error) {
            // Caso haja erro de comunicação
            this.showAlert('Erro ao conectar com o servidor. Tente novamente.', 'error');
            console.error('Erro no login:', error);
        } finally {
            // Finaliza o loading
            this.setLoading(false);
        }
    }

    // Simula o envio de dados de login ao backend
    async submitLogin(loginData) {
        return new Promise((resolve) => {
            setTimeout(() => {
                // Simula um login bem-sucedido se as credenciais forem as esperadas
                if (loginData.email === 'admin@mars.com' && loginData.password === '12345') {
                    resolve({
                        success: true,
                        // message: 'Login realizado com sucesso!',
                        redirectUrl: '/PageWeb/app/static/marschoco.html',
                        user: {
                            id: 1,
                            email: loginData.email,
                            name: 'Administrador'
                        }
                    });
                } else {
                    // Caso contrário, falha no login
                    resolve({
                        success: false,
                        message: 'Email ou senha incorretos!!!'
                    });
                }
            }, 150); // Simula um pequeno delay de rede
        });

        /*
        // Exemplo real de requisição ao backend com fetch:

        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(loginData)
        });

        if (!response.ok) {
            throw new Error('Erro na requisição');
        }

        return await response.json();
        */
    }
}

// Inicializa a validação quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    new LoginValidator();
});

// Credenciais de teste para facilitar a demonstração
console.log('Credenciais de teste:');
console.log('Email: admin@mars.com');
console.log('Senha: 12345');
import os   # Importa módulo para interagir com o SO
import streamlit as st  # Importa a biblioteca Streamlit para criar a interface web
from groq import Groq   # Importa a classe Groq para se conectar à API da plataforma Groq e acessar o LLM


# configura a página do Streamlit com Título, icone, layout e estado inicial da sidebar
st.set_page_config (
    page_title = "WG AI Coder",
    page_icon = "🤖",
    layout = "wide",
    initial_sidebar_state = "expanded"
)

# Define um prompt de sistema que descreve as regras e comportamento do Assistente de IA
CUSTOM_PROMPT = """
Você é o "WG Ai Coder", um assistente de IA especialista em programação, com foco principal em Python. Sua missão é ajudar desenvolvedore com iniciantes com dúvidas de programação de forma clara, precisa e útil.

REGRAS DE OPERAÇÃO:
1. **Foco em Programação**: Responda apenas as perguntas relacionadas a programação, algoritmos, estruturas de dados, bibliotecas e frameworks. Se o usuário perguntar sobre outro assunto, responda educadamente que seu foco é exclusivo à programação.
2. **Estrutura da Resposta**: Sempre formate suas respostas da seguinte maneira:
    * **Explicação Clara**: Comece com uma explicação conceitual sobre o tópico perguntado, Seja direto e didático.
    * **Exemplo de Código**: Forneça um ou mais blocos de código em Python com a sintaxe correta. O código deve ser bem comentado para explicar as partes importantes.
    * **Detalhes do Código**: Após o bloco de código, descreva em detalhes o que cada parte do código faz, explicando a lógica e as funções utilizadas.
    * **Documentação de Referência**: Ao final, inclua uma seção chamada "📚 Documentação de Referência" com o link direto e relevante para a documentação oficial da Linguagem Python (docs.python.org) ou da biblioteca em questão.
3. **Clareza e Precisão**: Use uma linguagem clara. Evite jargões desnecessários. Suas respostas devem ser tecnicamente precisas.
"""

# Cria o conteúdo da barra lateral no Streamlit
with st.sidebar:
    # Define o título da barra lateral
    st.title("🤖 WG AI Coder")

    # Mostra um texto explicativo sobre o assistente
    st.markdown("Assistente de IA focado em programação Python!")

    # Campo para inserir a chave de API da Groq
    groq_api_key = st.text_input (
        "Insira sua API Key Groq",
        type = "password",
        help = "Caso ainda não possua sua chave de API, basta criar em https://console.groq.com/keys"
    )

    # Adcionar linha divisória e explicações extras na barra lateral
    st.markdown("---")
    st.markdown("Desenvolvi essa IA Coder para me auxiliar e também auxiliar outros estudantes, ajudando em suas dúvidas de programação com Linguagem Python. Lembre-se que, a IA pode cometer erros. Sempre verifique e teste suas respostas!")

    st.markdown("---")
    st.markdown("Acesse meu Linkedin e conecte-se comigo!")
    st.markdown("[Linkedin - Wilian Gabriel](https://www.linkedin.com/in/will-gabriel/)", unsafe_allow_html=True)
    # st.markdown('<a href="https://www.linkedin.com/in/will-gabriel/" target="_blank">Acesse meu LinkedIn e conecte-se comigo.</a>', unsafe_allow_html=True)

# Título da Página Principal
st.title("🤖 WG AI Coder")

# Subtitulo adicional
st.title("Assistente pessoal de Programação Python 🐍")

# Texto auxiliar abaixo do título
st.caption("Faça sua pergunta sobre a linguagem Python e obtenha código, explicações e referências.")

# Inicializa o histórico de mensagens na sessão, caso ainda não exista
if "messages" not in st.session_state:
    st.session_state.messages = []

# Exibe todas as mensagens anteriores armazenadas no estado da sessão
for message in st.session_state.messages:
    with st.chat_message(message["role"]):
        st.markdown(message["content"])

# Inicializa a variável do cliente Groq como None
client = None

# Verifica se o usuário forneceu a chave de API da Groq
if groq_api_key:
    try:
        # Cria o cliente Groq com a chave de API fornecida
        client = Groq(api_key = groq_api_key)
    except Exception as error:
        # Exibe erro caso ocorra problema ao inicializar o cliente
        st.sidebar.error(f"Erro ao inicializar o cliente groq: {error}")
        st.stop()

# Caso não tenha chave, mas já existam mensagens, mostra o aviso
elif st.session_state.messages:
    st.warning("Por favor, insira sua API Key da Groq na barra lateral para continuar.")

# Captura a entrada do usuário no chat
if prompt := st.chat_input("Qual é a sua dúvida sobre Python?"):
    # Se naõ ouver cliente válido, mostra o aviso e para a execução
    if not client:
        st.warning("Por favor, insira sua API Key da Groq na barra lateral para continuar.")
        st.stop()

    # Armazena a mensagem do usuário no estado da sessão
    st.session_state.messages.append({"role": "user", "content": prompt})

    # Exibe a mensagem do usuário no chat
    with st.chat_message("user"):
        st.markdown(prompt)
    
    # Prepara as mensagens para enviar à API, incluindo prompt de sistema
    messages_for_api = [{"role": "system", "content": CUSTOM_PROMPT}]
    for msg in st.session_state.messages:
        messages_for_api.append(msg)

    # Cria a resposta do assistente no chat
    with st.chat_message("assistant"):
        with st.spinner("Analisando sua pergunta..."):
            try:
                # Chama a API da Groq para gerar a resposta do assistente
                chat_completion = client.chat.completions.create(
                    messages = messages_for_api,
                    model = "openai/gpt-oss-20b",
                    temperature = 1.0,
                    max_tokens = 2048,
                )
            
                # Extrai a resposta gerada pela API
                wg_ai_response = chat_completion.choices[0].message.content

                # Exibe a resposta no Streamlit
                st.markdown(wg_ai_response)

                # Armazena a resposta do assitente no estado da sessão
                st.session_state.messages.append({"role": "assistant", "content": wg_ai_response})

            # Caso ocorra erro na comunicação com a API, exibe uma mensagem de erro
            except Exception as error:
                st.error(f"Ocorreu um erro ao se comunicar com a API da Groq: {error}")
            
st.markdown(
    """
    <div style="text-align: center; color: gray;">
        <hr>
        <p>WG Ai Coder - Desenvolvido por Wilian Gabriel para fins de estudo pessoal!</p>
    </div>
    """,
    unsafe_allow_html=True
)

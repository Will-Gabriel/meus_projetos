const express = require('express');
const app = express();
const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: '',
  database: '',
  password: '',
  port: 5432,
});
pool.connect()
  .then(() => console.log('Conectado ao PostgreSQL!'))
  .catch(err => console.error('Erro de conexão:', err));
  
app.post('/login', async (req, res) => {
  const { email, senha } = req.body;

  try {
    const result = await pool.query("select cd_empresa as Emp, cd_representante as Codigo, ds_representante as Nome, ds_email as email from trs.representante where x_ativo ='SIM' and ds_email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' and cd_representante <= 2000", [email]);

    if (result.rows.length === 0) {
      return res.status(401).json({ mensagem: 'Usuário não encontrado' });
    }

    const user = result.rows[0];
    const parteLocal = user.email.split('@')[0];

    if (senha === parteLocal) {
      return res.status(200).json({
        mensagem: 'Login bem-sucedido',
        codigo: user.codigo_usuario,
        nome: user.nome
      });
    } else {
      return res.status(401).json({ mensagem: 'Senha incorreta' });
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ mensagem: 'Erro no servidor' });
  }
});


app.listen(3000, () => {
  console.log('Servidor rodando em http://localhost:3000');
});

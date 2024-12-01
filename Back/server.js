const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(express.json()); // Para processar JSON no body das requisições
app.use(cors()); // Permite requisições de origens diferentes (CORS)

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'postgres',
    port: 5432,
});

// Testa a conexão com o banco de dados
pool.connect((err, client, release) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err.stack);
        process.exit(1); // Encerra o servidor se não conseguir conectar
    }
    console.log('Conexão com o banco de dados bem-sucedida!');
    release();
});

// Rotas CRUD

// **GET**: Listar todas as bebidas
app.get('/bebidas', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM bebidas ORDER BY id');
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Erro ao buscar bebidas:', err);
        res.status(500).json({ error: 'Erro ao buscar bebidas' });
    }
});

// **POST**: Criar uma nova bebida
app.post('/bebidas', async (req, res) => {
    const { nome, tipo, preco, estoque } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO bebidas (nome, tipo, preco, estoque) VALUES ($1, $2, $3, $4) RETURNING *',
            [nome, tipo, preco, estoque]
        );
        res.status(201).json({
            message: 'Bebida criada com sucesso!',
            bebida: result.rows[0],
        });
    } catch (err) {
        console.error('Erro ao criar bebida:', err);
        res.status(500).json({ error: 'Erro ao criar bebida' });
    }
});

// **PUT**: Atualizar uma bebida pelo ID
app.put('/bebidas/:id', async (req, res) => {
    const { id } = req.params;
    const { nome, tipo, preco, estoque } = req.body;
    try {
        const result = await pool.query(
            'UPDATE bebidas SET nome = $1, tipo = $2, preco = $3, estoque = $4, atualizado_em = CURRENT_TIMESTAMP WHERE id = $5 RETURNING *',
            [nome, tipo, preco, estoque, id]
        );
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Bebida não encontrada' });
        }
        res.status(200).json({
            message: 'Bebida atualizada com sucesso!',
            bebida: result.rows[0],
        });
    } catch (err) {
        console.error('Erro ao atualizar bebida:', err);
        res.status(500).json({ error: 'Erro ao atualizar bebida' });
    }
});

// **DELETE**: Remover uma bebida pelo ID
app.delete('/bebidas/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM bebidas WHERE id = $1 RETURNING *', [id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Bebida não encontrada' });
        }
        res.status(200).json({
            message: 'Bebida deletada com sucesso!',
            bebida: result.rows[0],
        });
    } catch (err) {
        console.error('Erro ao deletar bebida:', err);
        res.status(500).json({ error: 'Erro ao deletar bebida' });
    }
});

// Inicia o servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});

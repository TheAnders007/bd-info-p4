const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = 3000;

// Middleware para analisar o corpo das solicitações como JSON
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Conecte-se ao banco de dados SQLite
const db = new sqlite3.Database('SCA.db', (err) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log('Conectado ao banco de dados SQLite.');
    }
});

// Crie a tabela TB_ALUNOS, se ainda não existir
db.run(
    'CREATE TABLE IF NOT EXISTS TB_CLIENTES (id INTEGER PRIMARY KEY AUTOINCREMENT, nome TEXT)',
    (err) => {
        if (err) {
            console.error('Erro ao criar tabela TB_CLIENTES:', err.message);
        } else {
            console.log('Tabela TB_CLIENTES criada com sucesso.');
        }
    }
);

db.run(
    'CREATE TABLE IF NOT EXISTS TB_VENDEDORES (id INTEGER PRIMARY KEY AUTOINCREMENT, nome TEXT)',
    (err) => {
        if (err) {
            console.error('Erro ao criar tabela TB_VENDEDORES:', err.message);
        } else {
            console.log('Tabela TB_VENDEDORES criada com sucesso.');
        }
    }
);

db.run(
    'CREATE TABLE IF NOT EXISTS TB_PRODUTOS (id INTEGER PRIMARY KEY AUTOINCREMENT, descricao TEXT, preco_unitario REAL)',
    (err) => {
        if (err) {
            console.error('Erro ao criar tabela TB_PRODUTOS:', err.message);
        } else {
            console.log('Tabela TB_PRODUTOS criada com sucesso.');
        }
    }
);

db.run(
    'CREATE TABLE IF NOT EXISTS TB_NOTAS_FISCAIS (id INTEGER PRIMARY KEY AUTOINCREMENT, valor REAL, cliente_id INT, vendedor_id INT, FOREIGN KEY(cliente_id) REFERENCES TB_CLIENTES(id), FOREIGN KEY(vendedor_id) REFERENCES TB_VENDEDORES(id))',
    (err) => {
        if (err) {
            console.error('Erro ao criar tabela TB_NOTAS_FISCAIS:', err.message);
        } else {
            console.log('Tabela TB_NOTAS_FISCAIS criada com sucesso.');
        }
    }
);

db.run(
    'CREATE TABLE IF NOT EXISTS TB_ITENS_NOTAS_FISCAIS (id INTEGER PRIMARY KEY AUTOINCREMENT, notafiscal_id INT, quantidade REAL, produto_id INT, unidade INT, FOREIGN KEY(notafiscal_id) REFERENCES TB_NOTAS_FISCAIS(id), FOREIGN KEY(produto_id) REFERENCES TB_PRODUTOS(id))',
    (err) => {
        if (err) {
            console.error('Erro ao criar tabela TB_ITENS_NOTAS_FISCAIS:', err.message);
        } else {
            console.log('Tabela TB_ITENS_NOTAS_FISCAIS criada com sucesso.');
        }
    }
);







// Rotas para operações CRUD

// Criar um aluno
app.post('/clientes', (req, res) => {
    const { nome } = req.body;
    db.run('INSERT INTO TB_CLIENTES (nome) VALUES (?)', [nome], (err) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.status(201).json({ message: 'Cliente criado com sucesso' });
    });
});

//Criar um vendedor
app.post('/vendedores', (req, res) => {
    const { nome } = req.body;
    db.run('INSERT INTO TB_VENDEDORES (nome) VALUES (?)', [nome], (err) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.status(201).json({ message: 'Vendedor criado com sucesso' });
    });
});

//Criar um  produto
app.post('/produtos', (req, res) => {
    const { descricao, preco_unitario } = req.body;
    db.run('INSERT INTO TB_PRODUTOS (descricao, preco_unitario) VALUES (?, ?)', [descricao, preco_unitario], (err) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.status(201).json({ message: 'Produto criado com sucesso' });
    });
});

//Criar uma Nota_Fiscal
app.post('/notasFiscais', (req, res) => {
    const { valor, cliente_id, vendedor_id } = req.body;
    db.run('INSERT INTO TB_NOTAS_FISCAIS (valor, cliente_id, vendedor_id) VALUES (?, ?, ?)', [valor, cliente_id, vendedor_id], (err) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.status(201).json({ message: 'Nota Fiscal criada com sucesso' });
    });
});

//Criar um Item de Nota Fiscal
app.post('/itensNotaFiscal', (req, res) => {
    const { notafiscal_id, quantidade, produto_id, unidade } = req.body;
    db.run('INSERT INTO TB_ITENS_NOTAS_FISCAIS (notafiscal_id, quantidade, produto_id, unidade) VALUES (?, ?, ?, ?)', [notafiscal_id, quantidade, produto_id, unidade], (err) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.status(201).json({ message: 'Item de Nota Fiscal criado com sucesso' });
    });
});







// Obter todos os clientes
app.get('/clientes', (req, res) => {
    db.all('SELECT * FROM TB_CLIENTES', (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ clientes: rows });
    });
});

//Obter todos os vendedores
app.get('/vendedores', (req, res) => {
    db.all('SELECT * FROM TB_VENDEDORES', (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ vendedores: rows });
    });
});

//Obter todos os itens de nota fiscal
app.get('/itensNotaFiscal', (req, res) => {
    db.all('SELECT * FROM TB_ITENS_NOTAS_FISCAIS', (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ vendedores: rows });
    });
});

//Obter todos os produtos
app.get('/produtos', (req, res) => {
    db.all('SELECT * FROM TB_PRODUTOS', (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ produtos: rows });
    });
});

//Obter todas as notas fiscais
app.get('/notasFiscais', (req, res) => {
    db.all('SELECT * FROM TB_NOTAS_FISCAIS', (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ notasFiscais: rows });
    });
});

// Obter um aluno por ID
app.get('/clientes/:COD_CLI', (req, res) => {
    const { id } = req.params;
    db.get('SELECT * FROM TB_CLIENTES WHERE COD_CLI = ?', [COD_CLI], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (!row) {
            res.status(404).json({ message: 'Cliente não encontrado' });
            return;
        }
        res.json({ cliente: row });
    });
});

// Atualizar um aluno por ID
app.put('/clientes/:COD_CLI', (req, res) => {
    const { COD_CLI } = req.params;
    const { NOME_CLI, END_CLI } = req.body;
    db.run('UPDATE TB_CLIENTES SET NOME_CLI = ?, END_CLI = ? WHERE COD_CLI = ?', [NOME_CLI, END_CLI, COD_CLI], (err) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: 'Cliente atualizado com sucesso' });
    });
});

// Excluir um aluno por ID
app.delete('/clientes/:COD_CLI', (req, res) => {
    const { id } = req.params;
    db.run('DELETE FROM TB_CLIENTES WHERE COD_CLI = ?', [COD_CLI], (err) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: 'Cliente excluído com sucesso' });
    });
});

// Inicie o servidor
app.listen(port, () => {
    console.log(`Servidor está ouvindo na porta ${port}`);
});


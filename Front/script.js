const apiUrl = 'http://localhost:3000/bebidas';

// Função para carregar bebidas
async function carregarBebidas() {
    try {
        const response = await fetch(apiUrl);
        const bebidas = await response.json();

        const tbody = document.querySelector('#bebidasTable tbody');
        tbody.innerHTML = '';

        bebidas.forEach(bebida => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${bebida.id}</td>
                <td>${bebida.nome}</td>
                <td>${bebida.tipo}</td>
                <td>R$ ${bebida.preco}</td>
                <td>${bebida.estoque}</td>
                <td>
                    <button onclick="editarBebida(${bebida.id}, '${bebida.nome}', '${bebida.tipo}', ${bebida.preco}, ${bebida.estoque})">Editar</button>
                    <button onclick="excluirBebida(${bebida.id})">Excluir</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        mostrarMensagem('Erro ao carregar bebidas.', 'erro');
    }
}

// Função para adicionar/editar bebida
document.querySelector('#bebidaForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const id = e.target.dataset.id;
    const nome = document.querySelector('#nome').value;
    const tipo = document.querySelector('#tipo').value;
    const preco = parseFloat(document.querySelector('#preco').value);
    const estoque = parseInt(document.querySelector('#estoque').value);

    const bebida = { nome, tipo, preco, estoque };

    try {
        if (id) {
            // Editar
            await fetch(`${apiUrl}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bebida),
            });
            delete e.target.dataset.id;
            document.querySelector('#cancelarEdicao').style.display = 'none';
        } else {
            // Criar
            await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bebida),
            });
        }

        e.target.reset();
        mostrarMensagem('Bebida salva com sucesso!', 'sucesso');
        carregarBebidas();
    } catch (error) {
        mostrarMensagem('Erro ao salvar bebida.', 'erro');
    }
});

// Função para editar bebida
function editarBebida(id, nome, tipo, preco, estoque) {
    document.querySelector('#nome').value = nome;
    document.querySelector('#tipo').value = tipo;
    document.querySelector('#preco').value = preco;
    document.querySelector('#estoque').value = estoque;

    const form = document.querySelector('#bebidaForm');
    form.dataset.id = id;

    document.querySelector('#cancelarEdicao').style.display = 'inline-block';
}

// Cancelar edição
document.querySelector('#cancelarEdicao').addEventListener('click', (e) => {
    const form = document.querySelector('#bebidaForm');
    form.reset();
    delete form.dataset.id;
    e.target.style.display = 'none';
});

// Função para excluir bebida
async function excluirBebida(id) {
    try {
        await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });
        mostrarMensagem('Bebida excluída com sucesso!', 'sucesso');
        carregarBebidas();
    } catch (error) {
        mostrarMensagem('Erro ao excluir bebida.', 'erro');
    }
}

// Função para exibir mensagens
function mostrarMensagem(msg, tipo) {
    const mensagemDiv = document.querySelector('#mensagem');
    mensagemDiv.textContent = msg;
    mensagemDiv.className = tipo;
    setTimeout(() => {
        mensagemDiv.textContent = '';
        mensagemDiv.className = '';
    }, 3000);
}

// Carregar bebidas ao iniciar
carregarBebidas();

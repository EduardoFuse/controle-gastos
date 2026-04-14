const formGasto = document.getElementById("formGasto");
const descricao = document.getElementById("descricao");
const valor = document.getElementById("valor");
const categoria = document.getElementById("categoria");
const corpoTabela = document.getElementById("corpoTabela");
const totalGeral = document.getElementById("totalGeral");
const quantidadeGastos = document.getElementById("quantidadeGastos");
const botaoPrincipal = document.getElementById("botaoPrincipal");

let gastos = [];
let indiceEditando = -1;

function formatarMoeda(numero) {
    return numero.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

function atualizarResumo() {
    let soma = 0;

    for (let i = 0; i < gastos.length; i++) {
        soma += gastos[i].valor;
    }

    totalGeral.textContent = formatarMoeda(soma);
    quantidadeGastos.textContent = gastos.length;
}

function limparCampos() {
    descricao.value = "";
    valor.value = "";
    categoria.value = "";
    indiceEditando = -1;
    botaoPrincipal.textContent = "Adicionar Gasto";
}

function renderizarTabela() {
    corpoTabela.innerHTML = "";

    if (gastos.length === 0) {
        corpoTabela.innerHTML = `
            <tr>
                <td colspan="5" class="sem-gastos">Nenhum gasto cadastrado.</td>
            </tr>
        `;
        atualizarResumo();
        return;
    }

    for (let i = 0; i < gastos.length; i++) {
        const gasto = gastos[i];
        const linha = document.createElement("tr");

        let status = "Normal";
        let classeStatus = "status-normal";
        let classeValor = "";
        let classeLinha = "";

        if (gasto.valor > 100) {
            status = "Alerta";
            classeStatus = "status-alerta";
            classeValor = "valor-alto";
            classeLinha = "linha-alerta";
        }

        linha.className = classeLinha;

        linha.innerHTML = `
            <td>${gasto.descricao}</td>
            <td>${gasto.categoria}</td>
            <td class="${classeValor}">${formatarMoeda(gasto.valor)}</td>
            <td class="${classeStatus}">${status}</td>
            <td>
                <button class="btn-editar" onclick="editarGasto(${i})">Editar</button>
                <button class="btn-excluir" onclick="excluirGasto(${i})">Excluir</button>
            </td>
        `;

        corpoTabela.appendChild(linha);
    }

    atualizarResumo();
}

function editarGasto(indice) {
    descricao.value = gastos[indice].descricao;
    valor.value = gastos[indice].valor;
    categoria.value = gastos[indice].categoria;

    indiceEditando = indice;
    botaoPrincipal.textContent = "Salvar Alterações";
}

function excluirGasto(indice) {
    const confirmar = confirm("Deseja excluir este gasto?");
    if (!confirmar) {
        return;
    }

    gastos.splice(indice, 1);

    if (indiceEditando === indice) {
        limparCampos();
    }

    renderizarTabela();
}

formGasto.addEventListener("submit", function (event) {
    event.preventDefault();

    const novoGasto = {
        descricao: descricao.value.trim(),
        valor: parseFloat(valor.value),
        categoria: categoria.value
    };

    if (novoGasto.descricao === "" || isNaN(novoGasto.valor) || novoGasto.categoria === "") {
        alert("Preencha todos os campos corretamente.");
        return;
    }

    if (novoGasto.valor <= 0) {
        alert("O valor precisa ser maior que zero.");
        return;
    }

    if (indiceEditando === -1) {
        gastos.push(novoGasto);
    } else {
        gastos[indiceEditando] = novoGasto;
    }

    renderizarTabela();
    limparCampos();
});

renderizarTabela();
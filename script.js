// Nosso "Banco de Dados" temporário de tarefas
const minhasTarefas = [
    { nome: "Responder e-mails", tempoNecessario: 15 },
    { nome: "Ler um artigo", tempoNecessario: 20 },
    { nome: "Fazer um alongamento", tempoNecessario: 10 },
    { nome: "Assistir vídeo de tutorial", tempoNecessario: 45 }
];

const botaoTerminei = document.getElementById('btn-terminei');
const areaSugestoes = document.getElementById('area-sugestoes');
const listaTarefas = document.getElementById('lista-tarefas');
const spanTempo = document.getElementById('tempo-disponivel');

botaoTerminei.addEventListener('click', function() {
    // Simulando que faltam 25 minutos para o próximo compromisso
    // No futuro, isso será calculado com base no Google Agenda!
    const tempoLivreSimulado = 25; 
    
    // Limpa a lista anterior
    listaTarefas.innerHTML = '';
    
    // Filtra as tarefas que cabem no tempo livre
    const tarefasPossiveis = minhasTarefas.filter(tarefa => tarefa.tempoNecessario <= tempoLivreSimulado);
    
    // Atualiza a tela
    spanTempo.textContent = tempoLivreSimulado;
    areaSugestoes.classList.remove('escondido');
    
    // Adiciona as tarefas na tela
    if (tarefasPossiveis.length > 0) {
        tarefasPossiveis.forEach(tarefa => {
            const li = document.createElement('li');
            li.textContent = `${tarefa.nome} (${tarefa.tempoNecessario} min)`;
            listaTarefas.appendChild(li);
        });
    } else {
        listaTarefas.innerHTML = "<li>Aproveite para descansar! Nenhuma tarefa cabe nesse tempo.</li>";
    }
});

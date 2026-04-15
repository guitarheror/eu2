let tarefas = [];
let calendario; // Variável global para acessar o calendário

// Inicializa o calendário quando a página carrega
document.addEventListener('DOMContentLoaded', function() {
    const calendarEl = document.getElementById('calendar');
    
    calendario = new FullCalendar.Calendar(calendarEl, {
        initialView: 'timeGridDay', // Começa na visão de um dia (com horários)
        locale: 'pt-br', // Em português
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'timeGridDay,timeGridWeek' // Botões para ver dia ou semana
        },
        slotMinTime: '06:00:00', // A agenda começa às 6h da manhã
        allDaySlot: false, // Esconde a barra de "dia inteiro"
        events: [] // Os compromissos vão entrar aqui
    });
    
    calendario.render();
});

// Adicionar um Compromisso na Grade
function adicionarCompromisso() {
    const nome = document.getElementById('nome-compromisso').value;
    const hora = document.getElementById('hora-compromisso').value;

    if (!nome || !hora) {
        alert("Preencha o nome e a hora!");
        return;
    }

    // Pega a data de hoje para colocar no calendário
    const hoje = new Date().toISOString().split('T')[0]; 
    const inicio = `${hoje}T${hora}:00`;

    // Adiciona o evento visualmente no calendário (assume 1 hora de duração padrão)
    calendario.addEvent({
        title: nome,
        start: inicio,
        backgroundColor: '#1a73e8', // Corzinha azul do Google
        borderColor: '#1a73e8'
    });

    document.getElementById('nome-compromisso').value = '';
    document.getElementById('hora-compromisso').value = '';
}

// Adicionar uma Tarefa na Lista Flexível
function adicionarTarefa() {
    const nome = document.getElementById('nome-tarefa').value;
    const tempo = parseInt(document.getElementById('tempo-tarefa').value);

    if (!nome || isNaN(tempo)) { return; }

    tarefas.push({ nome, tempo });
    
    const lista = document.getElementById('lista-tarefas-cadastradas');
    lista.innerHTML += `<li>${nome} (${tempo} min)</li>`;

    document.getElementById('nome-tarefa').value = '';
    document.getElementById('tempo-tarefa').value = '';
}

// Lógica de calcular o tempo livre
document.getElementById('btn-terminei').addEventListener('click', function() {
    const todosEventos = calendario.getEvents();
    
    if (todosEventos.length === 0) {
        alert("Sua agenda está vazia!");
        return;
    }

    const agora = new Date();
    let proximoEvento = null;

    // Procura o primeiro evento que vai acontecer DEPOIS de agora
    // Como o FullCalendar não garante ordem, nós ordenamos primeiro
    const eventosOrdenados = todosEventos.sort((a, b) => a.start - b.start);
    
    for (let evento of eventosOrdenados) {
        if (evento.start > agora) {
            proximoEvento = evento;
            break;
        }
    }

    if (!proximoEvento) {
        alert("Você não tem mais compromissos hoje! Livre!");
        return;
    }

    // Calcula a diferença em minutos
    const diferencaMilissegundos = proximoEvento.start - agora;
    const tempoLivreMinutos = Math.floor(diferencaMilissegundos / (1000 * 60));

    // Exibe os resultados
    document.getElementById('tempo-disponivel').innerText = tempoLivreMinutos;
    const areaSugestoes = document.getElementById('area-sugestoes');
    const listaSugestoes = document.getElementById('lista-tarefas-sugeridas');
    
    listaSugestoes.innerHTML = '';
    
    const tarefasPossiveis = tarefas.filter(tar => tar.tempo <= tempoLivreMinutos);

    if (tarefasPossiveis.length > 0) {
        tarefasPossiveis.forEach(tar => {
            listaSugestoes.innerHTML += `<li>${tar.nome} (${tar.tempo} min)</li>`;
        });
    } else {
        listaSugestoes.innerHTML = "<li>Nenhuma tarefa cabe. Descanse!</li>";
    }

    areaSugestoes.classList.remove('escondido');
});

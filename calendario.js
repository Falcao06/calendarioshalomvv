
    // Carregar eventos do Local Storage
    const loadEvents = () => {
        const savedEvents = localStorage.getItem('events');
        return savedEvents ? JSON.parse(savedEvents) : {};
    };

    // Armazenar eventos no Local Storage
    const saveEvents = (events) => {
        localStorage.setItem('events', JSON.stringify(events));
    };

    // Eventos fixos (não removíveis)
    const fixedEvents = {
'2024-10-27': 'Mini-GE',
'2024-11-09': 'Missa 8º ano',
'2024-11-10': 'Reunião EC',
'2024-11-17': 'Reunião Oração',
'2024-11-24': 'Leituras (Missa em Grupo)',
'2024-11-30': 'Banco Alimentar',
'2024-12-01': 'Banco Alimentar',
'2024-12-07': '6º ano (Cantar missa)',
'2024-12-08': 'Festividades na Paróquia',
'2024-12-15': 'Jantar de Natal, Convívio',
'2024-12-25': 'Missa de Natal',
'2024-12-27': 'Aniversário da Comunidade',
'2025-01-05': 'Reunião Tema',
'2025-01-12': 'Reunião Oração',
'2025-01-19': 'Reunião Convívio',
'2025-01-25': 'Aniversário do SP',
'2025-02-02': 'Reunião Tema',
'2025-02-09': 'EC (Avaliação dos Grupos de Reunião)',
'2025-02-08': '9º ano (Cantar missa)',
'2025-02-12': 'Aniversário do Movimento',
'2025-04-05': 'CN (Conferência Nacional)',
'2025-04-06': 'CN (Conferência Nacional)',
'2025-05-10': '8º ano (Cantar missa)',
'2025-06-15': 'Festa de Verão',
'2025-09-01': 'Retiro (Reunião)',
'2025-09-15': 'Reunião Geral'
};

    

    let events = loadEvents();

    // Função para atualizar o calendário
    function updateCalendar() {
        const year = document.getElementById('year').value;
        const month = document.getElementById('month').value;
        loadCalendar(year, month);
    }

    // Função para carregar o calendário
    function loadCalendar(year, month) {
        const calendar = document.getElementById('calendar');
        calendar.innerHTML = ''; // Limpar o calendário existente

        const daysInMonth = new Date(year, month, 0).getDate();
        const firstDay = new Date(year, month - 1, 1).getDay();

        // Adicionar cabeçalho dos dias da semana
        const daysOfWeek = [, 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom'];
        daysOfWeek.forEach(day => {
            const dayElement = document.createElement('div');
            dayElement.className = 'day header';
            dayElement.innerText = day;
            calendar.appendChild(dayElement);
        });

        // Adicionar células em branco para o início do mês
        const adjustedFirstDay = (firstDay + 6) % 7; // Ajustar para que domingo fique por último
        for (let i = 0; i < adjustedFirstDay; i++) {
            const emptyCell = document.createElement('div');
            calendar.appendChild(emptyCell);
        }

        // Adicionar dias do mês
        for (let day = 1; day <= daysInMonth; day++) {
            const eventDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const dayElement = document.createElement('div');
            dayElement.className = 'day';
            dayElement.innerText = day;

            // Marcar dias com eventos
            if (events[eventDate]) {
                dayElement.classList.add('event');
                dayElement.innerText += ` (${events[eventDate].map(e => e.title).join(', ')})`;

                // Permitir clicar no evento para ver os detalhes
                dayElement.addEventListener('click', (e) => showEventDetails(eventDate, e));
            } else if (fixedEvents[eventDate]) {
                dayElement.classList.add('event');
                dayElement.innerText += `: ${fixedEvents[eventDate]}`;
            }

            calendar.appendChild(dayElement);
        }

        // Adicionar células em branco para o fim do mês (se necessário)
        const lastDay = new Date(year, month - 1, daysInMonth).getDay();
        const adjustedLastDay = (lastDay + 1) % 7;
        for (let i = adjustedLastDay; i < 6; i++) {
            const emptyCell = document.createElement('div');
            calendar.appendChild(emptyCell);
        }
    }

    // Exibir detalhes do evento
    function showEventDetails(eventDate, event) {
        const eventDetailsModal = document.createElement('div');
        eventDetailsModal.className = 'event-details-modal';

        const eventDetailsContent = document.createElement('div');
        eventDetailsContent.className = 'event-details-content';

        const eventData = events[eventDate];
        if (eventData) {
            eventData.forEach(event => {
                const title = document.createElement('h4');
                title.innerText = `Título: ${event.title}`;

                const time = document.createElement('p');
                time.innerText = `Hora: ${event.time}`;

                const removeButton = document.createElement('button');
                removeButton.innerText = 'Remover Evento';
                // Adicionar a classe de estilo ao botão
                removeButton.classList.add('botao-adicionar');
                removeButton.onclick = () => {
                    removeEvent(eventDate, event);
                    eventDetailsModal.remove(); // Fechar o modal ao remover o evento
                };

                eventDetailsContent.appendChild(title);
                eventDetailsContent.appendChild(time);
                eventDetailsContent.appendChild(removeButton);
            });

            // Adicionar o conteúdo ao modal
            eventDetailsModal.appendChild(eventDetailsContent);
            document.body.appendChild(eventDetailsModal);

            // Mostrar modal
            eventDetailsModal.style.display = 'flex';

            // Fechar pop-up ao clicar fora
            document.addEventListener('click', (e) => {
                if (!eventDetailsContent.contains(e.target) && e.target !== event.target) {
                    eventDetailsModal.remove();
                }
            });
        }
    }

    // Remover evento
    function removeEvent(eventDate, eventToRemove) {
        const filteredEvents = events[eventDate].filter(event => event.title !== eventToRemove.title);
        if (filteredEvents.length > 0) {
            events[eventDate] = filteredEvents;
        } else {
            delete events[eventDate];
        }

        saveEvents(events);
        updateCalendar();
        alert('Evento removido com sucesso!');
    }

    // Mostrar modal para adicionar evento
    function showAddEventModal() {
        const modal = document.getElementById('addEventModal');
        modal.style.display = 'flex';
    }

    // Fechar modal
    function closeModal() {
        const modal = document.getElementById('addEventModal');
        modal.style.display = 'none';
    }

    // Adiciona um evento ao calendário
    function addEvent() {
        const year = document.getElementById('event-year').value;
        const month = document.getElementById('event-month').value;
        const day = document.getElementById('event-day').value;
        const title = document.getElementById('event-title').value;
        const time = document.getElementById('event-time').value;

        // Validação de dados
        if (!year || !month || !day || !title || !time) {
            alert('Preencha todos os campos!');
            return;
        }

        const eventDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const newEvent = { title, time };

        if (!events[eventDate]) {
            events[eventDate] = [];
        }
        events[eventDate].push(newEvent);

        saveEvents(events);
        updateCalendar();

        // Fechar modal após adicionar evento
        closeModal();
        alert('Evento adicionado com sucesso!');
    }

    // Retornar para a data atual
    function goToToday() {
        const today = new Date();
        document.getElementById('year').value = today.getFullYear();
        document.getElementById('month').value = today.getMonth() + 1;
        updateCalendar();
    }

    // Carregar o calendário atual na inicialização
    document.addEventListener('DOMContentLoaded', () => {
        const today = new Date();
        document.getElementById('year').value = today.getFullYear();
        document.getElementById('month').value = today.getMonth() + 1;
        updateCalendar();
    });

    // Função para criar o calendário
    function criarCalendario(mesAtual) {
        const calendario = document.getElementById('calendario');

        // Limpa o calendário antes de adicionar novos dias
        calendario.innerHTML = '';

        // Adiciona dias do mês (ajuste conforme o mês)
        const diasNoMes = new Date(2024, mesAtual, 0).getDate(); // Mês é zero-indexed
        for (let dia = 1; dia <= diasNoMes; dia++) {
            const divDia = document.createElement('div');
            divDia.textContent = dia;
            divDia.classList.add('dia');

            // Verificar se o dia é um feriado
            const feriado = feriados.find(f => f.dia === dia && f.mes === mesAtual);
            if (feriado) {
                divDia.classList.add('feriado'); // Adiciona classe 'feriado'

                // Criar tooltip com o nome do feriado
                const tooltip = document.createElement('span');
                tooltip.classList.add('tooltip');
                tooltip.textContent = feriado.nome; // Nome do feriado
                divDia.appendChild(tooltip);
            }

            // Adiciona o dia ao calendário
            calendario.appendChild(divDia);
        }
    }

    // Criar calendário para o mês de Janeiro (1)
    criarCalendario(1); // O mês é 1-indexado
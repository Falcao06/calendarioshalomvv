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
    '2024-11-03': 'Reunião Oração',
    '2024-11-09': '8º ano (Cantar missa)',
    '2024-11-10': 'Reunião Convívio',
    '2024-11-17': 'Reunião Tema',
    '2024-11-24': 'Leituras (Missa em Grupo)',
    '2024-11-30': 'Banco Alimentar',
    '2024-12-01': 'Banco Alimentar',
    '2024-12-07': '6º ano (Cantar missa)',
    '2024-12-08': 'Feriado Santo (Festividades na Paróquia)',
    '2024-12-15': 'Jantar de Natal (Avaliação de Grupos de Reuniões)',
    '2024-12-25': 'Missa de Natal',
    '2024-12-27': 'Aniversário da Comunidade',
    '2025-01-25': 'Missa de Aniversário',
    '2025-02-08': '9º ano (Cantar missa)',
    '2025-02-12': 'Aniversário do Movimento',
    '2025-04-05': 'CN (Convivio Nacional)',
    '2025-04-06': 'CN (Convivio Nacional)',
    '2025-04-13': 'Leituras Missa',
    '2025-04-17': 'Cantar APCB',
    '2025-05-10': '8º ano (Cantar missa) / Bodas de Ouro',
    '2025-05-31': 'Banco Alimentar',
    '2025-06-01': 'Banco Alimentar',
    '2025-08-10': 'GE',
    '2025-08-11': 'GE',
    '2025-08-12': 'GE',
    '2025-08-13': 'GE',
    '2025-08-14': 'GE',
    '2025-08-15': 'GE',
    '2025-08-16': 'GE',
};

let events = loadEvents();

// Função para adicionar reuniões semanais em domingos livres
function addWeeklyMeetings() {
    const startDate = new Date('2024-10-27');
    const endDate = new Date('2025-09-30');

    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        if (d.getDay() === 0) { // Domingo
            const saturday = new Date(d);
            saturday.setDate(d.getDate() - 1);

            const sundayStr = d.toISOString().split('T')[0];
            const saturdayStr = saturday.toISOString().split('T')[0];

            const hasSaturdayEvent = fixedEvents[saturdayStr] || events[saturdayStr];
            const hasSundayEvent = fixedEvents[sundayStr] || events[sundayStr];

            if (!hasSaturdayEvent && !hasSundayEvent) {
                events[sundayStr] = 'Reunião Semanal';
            }
        }
    }

    saveEvents(events);
}

// Função para atualizar o calendário
function updateCalendar() {
    const year = document.getElementById('year').value;
    const month = document.getElementById('month').value;
    loadCalendar(year, month);
}

// Função para carregar o calendário
function loadCalendar(year, month) {
    const calendar = document.getElementById('calendar');
    calendar.innerHTML = '';

    const daysInMonth = new Date(year, month, 0).getDate();
    const firstDay = new Date(year, month - 1, 1).getDay();

    // Cabeçalho com os dias da semana (domingo à direita)
    const daysOfWeek = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom'];
    daysOfWeek.forEach(day => {
        const dayElement = document.createElement('div');
        dayElement.className = 'day header';
        dayElement.innerText = day;
        calendar.appendChild(dayElement);
    });

    // Células em branco no início do mês
    const adjustedFirstDay = (firstDay + 6) % 7;
    for (let i = 0; i < adjustedFirstDay; i++) {
        const emptyCell = document.createElement('div');
        calendar.appendChild(emptyCell);
    }

    // Dias do mês
    for (let day = 1; day <= daysInMonth; day++) {
        const eventDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const dayElement = document.createElement('div');
        dayElement.className = 'day';
        dayElement.innerText = day;

        if (events[eventDate]) {
            dayElement.classList.add('event');
            dayElement.innerText += `: ${events[eventDate]}`;
        } else if (fixedEvents[eventDate]) {
            dayElement.classList.add('event');
            dayElement.innerText += `: ${fixedEvents[eventDate]}`;
        }

        calendar.appendChild(dayElement);
    }

    // Células em branco no fim do mês
    const lastDay = new Date(year, month - 1, daysInMonth).getDay();
    const adjustedLastDay = (lastDay + 1) % 7;
    for (let i = adjustedLastDay; i < 6; i++) {
        const emptyCell = document.createElement('div');
        calendar.appendChild(emptyCell);
    }
}

// Adiciona um evento ao calendário
function addEvent() {
    const year = document.getElementById('event-year').value;
    const month = document.getElementById('event-month').value;
    const day = document.getElementById('event-day').value;
    const title = document.getElementById('event-title').value;
    const time = document.getElementById('event-time').value;

    if (!year || !month || !day || !title) {
        alert('Preencha todos os campos!');
        return;
    }

    const eventDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const fullTitle = time ? `${title} (${time})` : title;

    events[eventDate] = fullTitle;
    saveEvents(events);
    updateCalendar();
    closeModal();
    alert('Evento adicionado com sucesso!');
}

// Remove um evento do calendário
function removeEvent() {
    const year = document.getElementById('remove-event-year').value;
    const month = document.getElementById('remove-event-month').value;
    const day = document.getElementById('remove-event-day').value;

    if (!year || !month || !day) {
        alert('Preencha todos os campos!');
        return;
    }

    const eventDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

    if (events[eventDate] && !fixedEvents[eventDate]) {
        delete events[eventDate];
        saveEvents(events);
        updateCalendar();
        alert('Evento removido com sucesso!');
    } else if (fixedEvents[eventDate]) {
        alert('Este evento não pode ser removido!');
    } else {
        alert('Não existe nenhum evento nesta data!');
    }
}

// Ir para a data de hoje
function goToToday() {
    const today = new Date();
    document.getElementById('year').value = today.getFullYear();
    document.getElementById('month').value = today.getMonth() + 1;
    loadCalendar(today.getFullYear(), today.getMonth() + 1);
}

// Mostrar o modal de adicionar evento
function showAddEventModal() {
    document.getElementById('addEventModal').style.display = 'block';
}

// Fechar o modal
function closeModal() {
    document.getElementById('addEventModal').style.display = 'none';
}

// Inicializar calendário ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    const today = new Date();
    document.getElementById('year').value = today.getFullYear();
    document.getElementById('month').value = today.getMonth() + 1;
    addWeeklyMeetings(); // garantir domingos livres
    updateCalendar();
});

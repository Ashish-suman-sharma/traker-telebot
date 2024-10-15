document.addEventListener('DOMContentLoaded', () => {
    const addHabitButton = document.querySelector('.menu-item:nth-child(1)');
    const addTargetButton = document.querySelector('.menu-item:nth-child(2)');
    const addScheduleButton = document.querySelector('.menu-item:nth-child(3)');
    const container = document.querySelector('.container');

    addHabitButton.addEventListener('click', () => {
        openHabitForm();
    });

    addTargetButton.addEventListener('click', () => {
        openTargetForm();
    });

    addScheduleButton.addEventListener('click', () => {
        openScheduleForm();
    });

    function openHabitForm() {
        const formHtml = `
            <div class="habit-form-overlay">
                <div class="habit-form">
                    <span class="close-form">&times;</span>
                    <h2>Add New Habit</h2>
                    <input type="text" id="habit-name" placeholder="Habit Name" autocomplete="off">
                    <button id="add-habit">OK</button>
                </div>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', formHtml);

        document.querySelector('.close-form').addEventListener('click', closeHabitForm);
        document.querySelector('#add-habit').addEventListener('click', addHabit);
    }

    function openTargetForm() {
        const formHtml = `
            <div class="habit-form-overlay">
                <div class="habit-form">
                    <span class="close-form">&times;</span>
                    <h2>Add New Target</h2>
                    <input type="text" id="target-name" placeholder="Target Name" autocomplete="off">
                    <input type="number" id="target-days" placeholder="Number of Days" autocomplete="off">
                    <button id="add-target">OK</button>
                </div>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', formHtml);

        document.querySelector('.close-form').addEventListener('click', closeHabitForm);
        document.querySelector('#add-target').addEventListener('click', addTarget);
    }

    function openScheduleForm() {
        const formHtml = `
            <div class="habit-form-overlay">
                <div class="habit-form">
                    <span class="close-form">&times;</span>
                    <h2>Add New Schedule</h2>
                    <input type="text" id="event-name" placeholder="Event Name" autocomplete="off">
                    <input type="date" id="event-date" placeholder="Event Date" autocomplete="off">
                    <input type="time" id="event-time" placeholder="Event Time" autocomplete="off">
                    <button id="add-schedule">OK</button>
                </div>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', formHtml);

        document.querySelector('.close-form').addEventListener('click', closeHabitForm);
        document.querySelector('#add-schedule').addEventListener('click', addSchedule);
    }

    function closeHabitForm() {
        document.querySelector('.habit-form-overlay').remove();
    }

    function addHabit() {
        const habitName = document.querySelector('#habit-name').value;
        if (habitName.trim() === '') {
            alert('Please enter a habit name');
            return;
        }

        const newHabitHtml = `
            <div class="habit-info">
                <div class="habit">${habitName}</div>
                <div class="streak-info">
                    <span>Streak: +1</span> | <span>Overall 100%</span>
                </div>
                <div class="week-progress">
                    <div class="day" data-day="0">Mo</div>
                    <div class="day" data-day="1">Tu</div>
                    <div class="day" data-day="2">We</div>
                    <div class="day" data-day="3">Th</div>
                    <div class="day" data-day="4">Fr</div>
                    <div class="day" data-day="5">Sa</div>
                    <div class="day" data-day="6">Su</div>
                </div>
                <i class="fas fa-trash-alt delete-habit"></i>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', newHabitHtml);
        saveHabitToLocalStorage(habitName, 'habit');
        highlightToday();
        closeHabitForm();
        addDeleteEventListeners();
    }

    function addTarget() {
        const targetName = document.querySelector('#target-name').value;
        const targetDays = parseInt(document.querySelector('#target-days').value);
        if (targetName.trim() === '' || isNaN(targetDays) || targetDays <= 0) {
            alert('Please enter a valid target name and number of days');
            return;
        }

        let daysHtml = '';
        for (let i = 1; i <= 7; i++) {
            daysHtml += `<div class="day" data-day="${i}">${i}</div>`;
        }

        const newTargetHtml = `
            <div class="habit-info">
                <div class="habit">${targetName}</div>
                <div class="streak-info">
                    <span>Days: ${targetDays}</span>
                </div>
                <div class="week-progress">
                    ${daysHtml}
                </div>
                <i class="fas fa-trash-alt delete-habit"></i>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', newTargetHtml);
        saveHabitToLocalStorage({ name: targetName, days: targetDays }, 'target');
        highlightToday();
        closeHabitForm();
        addDeleteEventListeners();
    }

    function addSchedule() {
        const eventName = document.querySelector('#event-name').value;
        const eventDate = document.querySelector('#event-date').value;
        const eventTime = document.querySelector('#event-time').value;

        if (eventName.trim() === '' || eventDate.trim() === '' || eventTime.trim() === '') {
            alert('Please enter a valid event name, date, and time');
            return;
        }

        const eventDateTime = new Date(`${eventDate}T${eventTime}`);
        const newScheduleHtml = `
            <div class="habit-info">
                <div class="habit">${eventName}</div>
                <div class="streak-info countdown" data-datetime="${eventDateTime}">
                    <span>Time Remaining: </span><span class="time-remaining"></span>
                </div>
                <i class="fas fa-trash-alt delete-habit"></i>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', newScheduleHtml);
        saveHabitToLocalStorage({ name: eventName, datetime: eventDateTime }, 'schedule');
        closeHabitForm();
        addDeleteEventListeners();
        updateCountdowns();
    }

    function saveHabitToLocalStorage(item, type) {
        let items = JSON.parse(localStorage.getItem(type)) || [];
        items.push(item);
        localStorage.setItem(type, JSON.stringify(items));
        saveDataToFile();
    }

    function saveDataToFile() {
        const habits = JSON.parse(localStorage.getItem('habit')) || [];
        const targets = JSON.parse(localStorage.getItem('target')) || [];
        const schedules = JSON.parse(localStorage.getItem('schedule')) || [];
        const chatId = 'YOUR_CHAT_ID'; // Replace with actual chat ID logic

        const data = {
            [chatId]: {
                habits,
                targets,
                schedules
            }
        };

        fetch('/save-data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
    }

    function loadHabitsFromLocalStorage() {
        let habits = JSON.parse(localStorage.getItem('habit')) || [];
        habits.forEach(habitName => {
            const habitHtml = `
                <div class="habit-info">
                    <div class="habit">${habitName}</div>
                    <div class="streak-info">
                        <span>Streak: +1</span> | <span>Overall 100%</span>
                    </div>
                    <div class="week-progress">
                        <div class="day" data-day="0">Mo</div>
                        <div class="day" data-day="1">Tu</div>
                        <div class="day" data-day="2">We</div>
                        <div class="day" data-day="3">Th</div>
                        <div class="day" data-day="4">Fr</div>
                        <div class="day" data-day="5">Sa</div>
                        <div class="day" data-day="6">Su</div>
                    </div>
                    <i class="fas fa-trash-alt delete-habit"></i>
                </div>
            `;
            container.insertAdjacentHTML('beforeend', habitHtml);
        });

        let targets = JSON.parse(localStorage.getItem('target')) || [];
        targets.forEach(target => {
            let daysHtml = '';
            for (let i = 1; i <= 7; i++) {
                daysHtml += `<div class="day" data-day="${i}">${i}</div>`;
            }

            const targetHtml = `
                <div class="habit-info">
                    <div class="habit">${target.name}</div>
                    <div class="streak-info">
                        <span>Days: ${target.days}</span>
                    </div>
                    <div class="week-progress">
                        ${daysHtml}
                    </div>
                    <i class="fas fa-trash-alt delete-habit"></i>
                </div>
            `;
            container.insertAdjacentHTML('beforeend', targetHtml);
        });

        let schedules = JSON.parse(localStorage.getItem('schedule')) || [];
        schedules.forEach(schedule => {
            const scheduleHtml = `
                <div class="habit-info">
                    <div class="habit">${schedule.name}</div>
                    <div class="streak-info countdown" data-datetime="${schedule.datetime}">
                        <span>Time Remaining: </span><span class="time-remaining"></span>
                    </div>
                    <i class="fas fa-trash-alt delete-habit"></i>
                </div>
            `;
            container.insertAdjacentHTML('beforeend', scheduleHtml);
        });

        highlightToday();
        addDeleteEventListeners();
        updateCountdowns();
    }

    function highlightToday() {
        const days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
        const todayIndex = new Date().getDay();
        const todayDay = days[todayIndex];

        document.querySelectorAll('.day').forEach(dayElement => {
            if (dayElement.textContent === todayDay) {
                dayElement.classList.add('today');
            }
        });
    }

    function addDeleteEventListeners() {
        document.querySelectorAll('.delete-habit').forEach(deleteIcon => {
            deleteIcon.addEventListener('click', (event) => {
                const habitCard = event.target.closest('.habit-info');
                const habitName = habitCard.querySelector('.habit').textContent;
                const type = habitCard.querySelector('.countdown') ? 'schedule' : habitCard.querySelector('.streak-info span').textContent.includes('Days') ? 'target' : 'habit';
                const password = prompt('Enter password to delete habit:');
                if (password === '915566') {
                    habitCard.remove();
                    deleteHabitFromLocalStorage(habitName, type);
                } else {
                    alert('Incorrect password');
                }
            });
        });
    }

    function deleteHabitFromLocalStorage(habitName, type) {
        let items = JSON.parse(localStorage.getItem(type)) || [];
        items = items.filter(item => item.name !== habitName && item !== habitName);
        localStorage.setItem(type, JSON.stringify(items));
    }

    function updateCountdowns() {
        const countdownElements = document.querySelectorAll('.countdown');
        countdownElements.forEach(element => {
            const eventDateTime = new Date(element.getAttribute('data-datetime'));
            const { timeRemaining, hasPassed } = calculateTimeRemaining(eventDateTime);
            if (hasPassed) {
                const habitCard = element.closest('.habit-info');
                const habitName = habitCard.querySelector('.habit').textContent;
                habitCard.remove();
                deleteHabitFromLocalStorage(habitName, 'schedule');
            } else {
                element.querySelector('.time-remaining').textContent = timeRemaining;
            }
        });
    }

    function calculateTimeRemaining(eventDateTime) {
        const now = new Date();
        const timeDiff = eventDateTime - now;

        if (timeDiff <= 0) {
            return { timeRemaining: 'Event has passed', hasPassed: true };
        }

        const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

        return { timeRemaining: `${days}d ${hours}h ${minutes}m ${seconds}s`, hasPassed: false };
    }

    setInterval(updateCountdowns, 1000);

    loadHabitsFromLocalStorage();
    highlightToday();
});
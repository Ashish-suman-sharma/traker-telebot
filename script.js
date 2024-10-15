document.addEventListener('DOMContentLoaded', () => {
    const addHabitButton = document.querySelector('.menu-item:nth-child(1)');
    const addTargetButton = document.querySelector('.menu-item:nth-child(2)');
    const container = document.querySelector('.container');

    addHabitButton.addEventListener('click', () => {
        openHabitForm();
    });

    addTargetButton.addEventListener('click', () => {
        openTargetForm();
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

    function saveHabitToLocalStorage(item, type) {
        let items = JSON.parse(localStorage.getItem(type)) || [];
        items.push(item);
        localStorage.setItem(type, JSON.stringify(items));
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

        highlightToday();
        addDeleteEventListeners();
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
                const password = prompt('Enter password to delete habit:');
                if (password === '915566') {
                    habitCard.remove();
                    deleteHabitFromLocalStorage(habitName);
                } else {
                    alert('Incorrect password');
                }
            });
        });
    }
    

    function deleteHabitFromLocalStorage(habitName) {
        let habits = JSON.parse(localStorage.getItem('habit')) || [];
        habits = habits.filter(habit => habit !== habitName);
        localStorage.setItem('habit', JSON.stringify(habits));

        let targets = JSON.parse(localStorage.getItem('target')) || [];
        targets = targets.filter(target => target.name !== habitName);
        localStorage.setItem('target', JSON.stringify(targets));
    }

    loadHabitsFromLocalStorage(); // Load habits from local storage on page load
    highlightToday(); // Call this function to highlight the current day on page load
});
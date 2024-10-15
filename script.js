document.addEventListener('DOMContentLoaded', () => {
    const addHabitButton = document.querySelector('.menu-item:nth-child(1)');
    const container = document.querySelector('.container');

    addHabitButton.addEventListener('click', () => {
        openHabitForm();
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
            </div>
        `;
        container.insertAdjacentHTML('beforeend', newHabitHtml);
        saveHabitToLocalStorage(habitName);
        highlightToday();
        closeHabitForm();
    }

    function saveHabitToLocalStorage(habitName) {
        let habits = JSON.parse(localStorage.getItem('habits')) || [];
        habits.push(habitName);
        localStorage.setItem('habits', JSON.stringify(habits));
    }

    function loadHabitsFromLocalStorage() {
        let habits = JSON.parse(localStorage.getItem('habits')) || [];
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
                </div>
            `;
            container.insertAdjacentHTML('beforeend', habitHtml);
        });
        highlightToday();
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

    loadHabitsFromLocalStorage(); // Load habits from local storage on page load
    highlightToday(); // Call this function to highlight the current day on page load
});
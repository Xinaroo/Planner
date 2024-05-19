document.addEventListener('DOMContentLoaded', function() {
    let currentDate = new Date();
    let formattedDate = `${currentDate.getMonth() + 1}월 ${currentDate.getDate()}일`;
    document.getElementById('currentDate').textContent = formattedDate;
    loadTasks();
});

function addTask(taskName, detail, completed = false) {
    if (!detail) {
        alert('상세 내용을 입력해주세요.');
        return;
    }

    let taskList = document.getElementById('taskList');
    let li = document.createElement('li');

    // 동그란 버튼 생성
    let button = document.createElement('div');
    button.className = 'task-button';
    button.onclick = function() {
        button.classList.toggle('completed');
        label.classList.toggle('completed'); // 완료 상태에 따라 취소선 토글
        updateProgress();
        saveTasks();
    };
    if (completed) {
        button.classList.add('completed');
    }

    // 라벨 생성
    let label = document.createElement('label');
    label.textContent = taskName + ': ' + detail;
    if (completed) {
        label.classList.add('completed'); // 완료 상태에 따라 취소선 추가
    }
    
    // 삭제 버튼 생성
    let deleteButton = document.createElement('button');
    deleteButton.textContent = 'X';
    deleteButton.className = 'delete-button';
    deleteButton.onclick = function() { removeTask(li); };
    
    // li 요소에 버튼, 라벨, 삭제 버튼 추가
    li.appendChild(button);
    li.appendChild(label);
    li.appendChild(deleteButton);
    taskList.appendChild(li);

    // 진행 상황 업데이트 및 저장
    updateProgress();
    saveTasks();

    // 입력 필드 초기화
    if (taskName === '공부') {
        document.getElementById('studyDetail').value = '';
    } else if (taskName === '운동') {
        document.getElementById('exerciseDetail').value = '';
    } else if (taskName === '휴식') {
        document.getElementById('restDetail').value = '';
    }
}

function updateProgress() {
    let total = document.querySelectorAll('#taskList li').length;
    let completed = document.querySelectorAll('.task-button.completed').length;
    let progress = 0;
    if (total > 0) {
        progress = Math.round((completed / total) * 100);
    }
    let progressPercentage = document.getElementById('progressPercentage');
    progressPercentage.textContent = progress + '%';
}

function removeTask(taskItem) {
    taskItem.remove();
    updateProgress();
    saveTasks();
}

function clearAllTasks() {
    let taskList = document.getElementById('taskList');
    taskList.innerHTML = '';
    updateProgress();
    saveTasks();
}

function saveTasks() {
    let tasks = [];
    document.querySelectorAll('#taskList li').forEach(li => {
        let button = li.querySelector('.task-button');
        let task = {
            name: li.querySelector('label').textContent.split(': ')[0],
            detail: li.querySelector('label').textContent.split(': ')[1],
            completed: button.classList.contains('completed')
        };
        tasks.push(task);
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    let storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
        let tasks = JSON.parse(storedTasks);
        tasks.forEach(task => {
            addTask(task.name, task.detail, task.completed);
        });
    }
    updateProgress(); // 로드 후 진행 상황 업데이트
}
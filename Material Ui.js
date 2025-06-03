document.addEventListener('DOMContentLoaded', function() {
      const addTaskBtn = document.getElementById('addTaskBtn');
      const addTaskForm = document.getElementById('addTaskForm');
      const cancelBtn = document.getElementById('cancelBtn');
      const taskForm = document.getElementById('taskForm');
      const tasksGrid = document.getElementById('tasksGrid');
      const taskCount = document.getElementById('taskCount');

      // Show/Hide Add Task Form
      addTaskBtn.addEventListener('click', function() {
        addTaskForm.style.display = addTaskForm.style.display === 'none' ? 'block' : 'none';
        if (addTaskForm.style.display === 'block') {
          addTaskForm.scrollIntoView({ behavior: 'smooth' });
        }
      });

      cancelBtn.addEventListener('click', function() {
        addTaskForm.style.display = 'none';
        taskForm.reset();
      });

      // Handle form submission
      taskForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const title = document.getElementById('taskTitle').value;
        const description = document.getElementById('taskDescription').value;
        const startDate = document.getElementById('startDate').value;
        const endDate = document.getElementById('endDate').value;
        const status = document.getElementById('taskStatus').value;
        const priority = document.getElementById('taskPriority').value;

        // Validate dates
        if (new Date(startDate) > new Date(endDate)) {
          alert('Start date cannot be after end date');
          return;
        }

        // Create new task card
        const taskCard = createTaskCard(title, description, startDate, endDate, status, priority);
        tasksGrid.appendChild(taskCard);

        // Reset form and hide
        taskForm.reset();
        addTaskForm.style.display = 'none';
        
        updateTaskCount();
      });

      // Create task card function
      function createTaskCard(title, description, startDate, endDate, status, priority) {
        const taskCard = document.createElement('div');
        taskCard.className = 'task-card';
        taskCard.setAttribute('data-status', status);
        taskCard.setAttribute('data-priority', priority);

        const statusClass = getStatusClass(status, priority);
        const statusText = getStatusText(status, priority);

        taskCard.innerHTML = `
          <h3 class="task-title">${title}</h3>
          <p class="task-description">${description}</p>
          <div class="task-dates">
            <div class="task-date">
              <span class="task-date-label">Start Date</span>
              <span class="task-date-value">${formatDate(startDate)}</span>
            </div>
            <div class="task-date">
              <span class="task-date-label">End Date</span>
              <span class="task-date-value">${formatDate(endDate)}</span>
            </div>
          </div>
          <span class="task-status ${statusClass}">${statusText}</span>
          <div class="task-actions">
            <button class="icon-btn material-icons" onclick="editTask(this)">edit</button>
            <button class="icon-btn material-icons" onclick="deleteTask(this)">delete</button>
            <button class="icon-btn material-icons">more_vert</button>
          </div>
        `;

        return taskCard;
      }

      // Helper functions
      function getStatusClass(status, priority) {
        if (priority === 'high') return 'status-priority';
        const statusMap = {
          'pending': 'status-pending',
          'progress': 'status-progress',
          'completed': 'status-completed',
          'deployed': 'status-deployed',
          'deferred': 'status-deferred'
        };
        return statusMap[status] || 'status-pending';
      }

      function getStatusText(status, priority) {
        if (priority === 'high') return 'PRIORITY';
        if (status === 'progress') return 'IN PROGRESS';
        return status.toUpperCase();
      }

      function formatDate(dateString) {
        const date = new Date(dateString);
        return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
      }

      function updateTaskCount() {
        const count = document.querySelectorAll('.task-card').length;
        taskCount.textContent = count;
      }

      // Category filtering
      document.querySelectorAll('.task-categories li').forEach(category => {
        category.addEventListener('click', function() {
          document.querySelectorAll('.task-categories li').forEach(c => c.classList.remove('active'));
          this.classList.add('active');
          
          const categoryType = this.getAttribute('data-category');
          filterTasksByCategory(categoryType);
        });
      });

      function filterTasksByCategory(category) {
        const taskCards = document.querySelectorAll('.task-card');
        
        taskCards.forEach(card => {
          if (category === 'all') {
            card.style.display = 'block';
          } else {
            const status = card.getAttribute('data-status');
            const shouldShow = status === category || 
                              (category === 'priority' && card.getAttribute('data-priority') === 'high');
            card.style.display = shouldShow ? 'block' : 'none';
          }
        });
      }

      // Initialize task count
      updateTaskCount();
    });

    // Global functions for task actions
    function editTask(button) {
      alert('Edit functionality would be implemented here');
    }

    function deleteTask(button) {
      if (confirm('Are you sure you want to delete this task?')) {
        const taskCard = button.closest('.task-card');
        taskCard.remove();
        
        const count = document.querySelectorAll('.task-card').length;
        document.getElementById('taskCount').textContent = count;
      }
    }

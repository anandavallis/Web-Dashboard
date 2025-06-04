 let taskCounter = 4;
        let draggedTask = null;

        // Modal functions
        function openModal() {
            document.getElementById('taskModal').style.display = 'block';
        }

        function closeModal() {
            document.getElementById('taskModal').style.display = 'none';
            document.getElementById('taskForm').reset();
        }

        // Close modal when clicking outside
        window.onclick = function(event) {
            const modal = document.getElementById('taskModal');
            if (event.target === modal) {
                closeModal();
            }
        }

        // Add new task
        function addTask() {
            const title = document.getElementById('taskTitle').value;
            const description = document.getElementById('taskDescription').value;
            const startDate = document.getElementById('startDate').value;
            const endDate = document.getElementById('endDate').value;
            const status = document.getElementById('taskStatus').value;
            const priority = document.getElementById('taskPriority').value;

            if (!title || !startDate || !endDate) {
                alert('Please fill in all required fields');
                return;
            }

            taskCounter++;
            
            const taskCard = document.createElement('div');
            taskCard.className = 'task-card';
            taskCard.draggable = true;
            taskCard.setAttribute('data-task', taskCounter);
            
            // Add color based on priority
            if (priority === 'High') {
                taskCard.classList.add('yellow');
            } else if (priority === 'Medium') {
                taskCard.classList.add('blue');
            }

            const statusClass = status === 'IN PROGRESS' ? 'in-progress' : '';
            
            taskCard.innerHTML = `
                <div class="task-title">${title}</div>
                <div class="task-description">${description}</div>
                <div class="task-meta">
                    <div>
                        <div>Start Date: ${formatDate(startDate)}</div>
                        <div>End Date: ${formatDate(endDate)}</div>
                    </div>
                    <div class="task-status ${statusClass}">${status.toUpperCase()}</div>
                </div>
            `;

            // Add to first board that has tasks or the first empty board
            const boards = document.querySelectorAll('.task-board');
            let targetBoard = boards[1]; // Default to second board
            
            // Find first board with tasks or use first board if none have tasks
            for (let board of boards) {
                const content = board.querySelector('.board-content');
                if (content.querySelector('.task-card')) {
                    targetBoard = board;
                    break;
                }
            }

            const boardContent = targetBoard.querySelector('.board-content');
            const emptyBoard = boardContent.querySelector('.empty-board');
            
            if (emptyBoard) {
                emptyBoard.remove();
            }

            boardContent.appendChild(taskCard);
            
            // Update board task count
            updateBoardCount(targetBoard);
            
            // Add drag event listeners
            addDragListeners(taskCard);
            
            closeModal();
        }

        function formatDate(dateString) {
            const date = new Date(dateString);
            return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
        }

        function updateBoardCount(board) {
            const taskCount = board.querySelectorAll('.task-card').length;
            const subtitle = board.querySelector('.board-subtitle');
            subtitle.textContent = `All Task (${taskCount})`;
        }

        // Drag and drop functionality
        function addDragListeners(taskCard) {
            taskCard.addEventListener('dragstart', handleDragStart);
            taskCard.addEventListener('dragend', handleDragEnd);
        }

        function handleDragStart(e) {
            draggedTask = this;
            this.classList.add('dragging');
            e.dataTransfer.effectAllowed = 'move';
        }

        function handleDragEnd(e) {
            this.classList.remove('dragging');
            draggedTask = null;
        }

        // Add drag listeners to existing tasks
        document.querySelectorAll('.task-card').forEach(addDragListeners);

        // Add drop zone listeners to all boards
        document.querySelectorAll('.task-board .board-content').forEach(boardContent => {
            boardContent.addEventListener('dragover', handleDragOver);
            boardContent.addEventListener('drop', handleDrop);
            boardContent.addEventListener('dragenter', handleDragEnter);
            boardContent.addEventListener('dragleave', handleDragLeave);
        });

        function handleDragOver(e) {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
        }

        function handleDragEnter(e) {
            e.preventDefault();
            this.classList.add('drag-over');
        }

        function handleDragLeave(e) {
            if (!this.contains(e.relatedTarget)) {
                this.classList.remove('drag-over');
            }
        }

        function handleDrop(e) {
            e.preventDefault();
            this.classList.remove('drag-over');
            
            if (draggedTask && this !== draggedTask.parentNode) {
                // Remove empty board message if exists
                const emptyBoard = this.querySelector('.empty-board');
                if (emptyBoard) {
                    emptyBoard.remove();
                }
                
                // Move the task
                const oldBoard = draggedTask.closest('.task-board');
                this.appendChild(draggedTask);
                const newBoard = draggedTask.closest('.task-board');
                
                // Update board counts
                updateBoardCount(oldBoard);
                updateBoardCount(newBoard);
                
                // Add empty message if board is now empty
                const oldBoardContent = oldBoard.querySelector('.board-content');
                if (!oldBoardContent.querySelector('.task-card')) {
                    const emptyDiv = document.createElement('div');
                    emptyDiv.className = 'empty-board';
                    emptyDiv.innerHTML = `
                        <div class="empty-board-text">No task found.</div>
                        <a href="#" class="add-task-link" onclick="openModal()">Add a new task</a>
                    `;
                    oldBoardContent.appendChild(emptyDiv);
                }
            }
        }

        // Filter button functionality
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const parentFilters = this.parentNode;
                parentFilters.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
            });
        });

        // Set default dates
        document.addEventListener('DOMContentLoaded', function() {
            const today = new Date().toISOString().split('T')[0];
            document.getElementById('startDate').value = today;
            
            const nextWeek = new Date();
            nextWeek.setDate(nextWeek.getDate() + 7);
            document.getElementById('endDate').value = nextWeek.toISOString().split('T')[0];
        });


console.log("To-do.js connected successfully!");

// Get HTML elements
const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskDate = document.getElementById("taskDate");
const taskPriority = document.getElementById("taskPriority");
const taskList = document.getElementById("taskList");
const emptyState = document.getElementById("emptyState");

const totalTasks = document.getElementById("totalTasks");
const pendingTasks = document.getElementById("pendingTasks");
const completedTasks = document.getElementById("completedTasks");

const filterButtons = document.querySelectorAll(".filter-btn");

// Store tasks temporarily
let tasks = [];
let currentFilter = "all";

// Add a new task
taskForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const title = taskInput.value.trim();

    if (title === "") {
        alert("Please enter a task!");
        return;
    }

    const task = {
        id: Date.now(),
        title: title,
        date: taskDate.value,
        priority: taskPriority.value,
        completed: false
    };

    tasks.push(task);

    console.log("Task added:", task);

    taskForm.reset();
    taskPriority.value = "medium";

    renderTasks();
});

// Display tasks
function renderTasks() {
    // Remove previously displayed task items
    taskList.querySelectorAll(".task-item").forEach(item => {
        item.remove();
    });

    // Apply the selected filter
    const filteredTasks = tasks.filter(task => {
        if (currentFilter === "pending") {
            return !task.completed;
        }

        if (currentFilter === "completed") {
            return task.completed;
        }

        return true;
    });

    // Show or hide the empty-state message
    emptyState.style.display =
        filteredTasks.length === 0 ? "block" : "none";

    // Display each task
    filteredTasks.forEach(task => {
        const li = document.createElement("li");
        li.className = "task-item";

        if (task.completed) {
            li.classList.add("completed");
        }

        // Checkbox
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.className = "task-checkbox";
        checkbox.checked = task.completed;
        checkbox.setAttribute(
            "aria-label",
            "Mark task as completed"
        );

        checkbox.addEventListener("change", function () {
            task.completed = checkbox.checked;
            renderTasks();
        });

        // Task details
        const details = document.createElement("div");
        details.className = "task-details";

        const title = document.createElement("p");
        title.className = "task-title";
        title.textContent = task.title;

        const meta = document.createElement("div");
        meta.className = "task-meta";

        // Priority
        const priority = document.createElement("span");
        priority.className = `task-priority ${task.priority}`;
        priority.textContent =
            task.priority.charAt(0).toUpperCase() +
            task.priority.slice(1) +
            " Priority";

        meta.appendChild(priority);

        // Due date
        if (task.date) {
            const date = document.createElement("span");
            date.innerHTML =
                '<i class="fa-regular fa-calendar"></i> ';

            date.appendChild(
                document.createTextNode(task.date)
            );

            meta.appendChild(date);
        }

        details.append(title, meta);

        // Task action buttons
        const actions = document.createElement("div");
        actions.className = "task-actions";

        // EDIT BUTTON
       
        // EDIT BUTTON
        const editButton = document.createElement("button");
        editButton.type = "button";
        editButton.className = "edit-btn";
        editButton.innerHTML = '<i class="fa-solid fa-pen"></i>';
        editButton.title = "Edit task";

        editButton.addEventListener("click", function () {
            console.log("Edit button clicked!");

            // Prevent opening multiple edit forms
            if (details.querySelector(".edit-task-input")) {
                return;
            }

            // Create task name input
            const editTitle = document.createElement("input");
            editTitle.type = "text";
            editTitle.value = task.title;
            editTitle.className = "edit-task-input";
            editTitle.placeholder = "Enter task name";

            // Create due date input
            const editDate = document.createElement("input");
            editDate.type = "date";
            editDate.value = task.date || "";

            // Create priority dropdown
            const editPriority = document.createElement("select");

            ["low", "medium", "high"].forEach(level => {
                const option = document.createElement("option");
                option.value = level;
                option.textContent =
                    level.charAt(0).toUpperCase() + level.slice(1);
                editPriority.appendChild(option);
            });

            editPriority.value = task.priority;

            // Create Save button
            const saveButton = document.createElement("button");
            saveButton.type = "button";
            saveButton.textContent = "Save";
            saveButton.className = "save-btn";

            // Create Cancel button
            const cancelButton = document.createElement("button");
            cancelButton.type = "button";
            cancelButton.textContent = "Cancel";

            // Put all editing fields on the page
            details.replaceChildren(
                editTitle,
                editDate,
                editPriority
            );

            // Hide Edit and show Save/Cancel
            editButton.hidden = true;
            actions.insertBefore(saveButton, deleteButton);
            actions.insertBefore(cancelButton, deleteButton);

            // Save all changes
            saveButton.addEventListener("click", function () {
                const updatedTitle = editTitle.value.trim();

                if (updatedTitle === "") {
                    alert("Task name cannot be empty!");
                    editTitle.focus();
                    return;
                }

                task.title = updatedTitle;
                task.date = editDate.value;
                task.priority = editPriority.value;

                console.log("Task updated:", task);

                renderTasks();
            });

            // Cancel editing without saving
            cancelButton.addEventListener("click", function () {
                renderTasks();
            });

            // Press Enter in the title field to save
            editTitle.addEventListener("keydown", function (event) {
                if (event.key === "Enter") {
                    saveButton.click();
                }

                if (event.key === "Escape") {
                    cancelButton.click();
                }
            });

            editTitle.focus();
        });

        
    
        // DELETE BUTTON
        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.className = "delete-btn";
        deleteButton.innerHTML =
            '<i class="fa-solid fa-trash"></i>';
        deleteButton.setAttribute("aria-label", "Delete task");
        deleteButton.title = "Delete task";

        deleteButton.addEventListener("click", function () {
            const confirmDelete = confirm(
                "Are you sure you want to delete this task?"
            );

            if (!confirmDelete) {
                return;
            }

            tasks = tasks.filter(item => item.id !== task.id);

            console.log("Task deleted:", task);

            renderTasks();
        });

        // Add buttons to the task
        actions.append(editButton, deleteButton);

        // Assemble the task item
        li.append(checkbox, details, actions);

        taskList.appendChild(li);
    });

    // Update task counts
    totalTasks.textContent = tasks.length;

    pendingTasks.textContent =
        tasks.filter(task => !task.completed).length;

    completedTasks.textContent =
        tasks.filter(task => task.completed).length;
}

// Filter tasks
filterButtons.forEach(button => {
    button.addEventListener("click", function () {
        currentFilter = button.dataset.filter;

        filterButtons.forEach(btn => {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        renderTasks();
    });
});

// Initial display
renderTasks();

package com.taskmanager.service;

import com.taskmanager.model.Task;
import com.taskmanager.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TaskService {

    @Autowired
    private TaskRepository taskRepository;

    // Retorna todas as tarefas
    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    // Busca tarefa por ID
    public Optional<Task> getTaskById(Long id) {
        return taskRepository.findById(id);
    }

    // Cria nova tarefa
    public Task createTask(Task task) {
        return taskRepository.save(task);
    }

    // Atualiza tarefa existente
    public Optional<Task> updateTask(Long id, Task taskDetails) {
        return taskRepository.findById(id).map(task -> {
            task.setTitle(taskDetails.getTitle());
            task.setDescription(taskDetails.getDescription());
            task.setPriority(taskDetails.getPriority());
            task.setCompleted(taskDetails.isCompleted());
            return taskRepository.save(task);
        });
    }

    // Marca/desmarca como concluída
    public Optional<Task> toggleComplete(Long id) {
        return taskRepository.findById(id).map(task -> {
            task.setCompleted(!task.isCompleted());
            return taskRepository.save(task);
        });
    }

    // Deleta tarefa
    public boolean deleteTask(Long id) {
        if (taskRepository.existsById(id)) {
            taskRepository.deleteById(id);
            return true;
        }
        return false;
    }

    // Busca por título
    public List<Task> searchByTitle(String title) {
        return taskRepository.findByTitleContainingIgnoreCase(title);
    }

    // Filtra por status
    public List<Task> getByCompleted(boolean completed) {
        return taskRepository.findByCompleted(completed);
    }
}

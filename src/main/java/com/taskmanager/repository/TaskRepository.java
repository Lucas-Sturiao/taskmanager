package com.taskmanager.repository;

import com.taskmanager.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

    // Busca tarefas por status de conclusão
    List<Task> findByCompleted(boolean completed);

    // Busca tarefas por prioridade
    List<Task> findByPriority(Task.Priority priority);

    // Busca tarefas cujo título contém uma palavra (ignora maiúsculas/minúsculas)
    List<Task> findByTitleContainingIgnoreCase(String title);
}

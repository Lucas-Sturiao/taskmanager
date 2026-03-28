# ✦ TaskFlow — Task Manager

Projeto de gerenciamento de tarefas desenvolvido com **Java + Spring Boot** no backend e **HTML, CSS e JavaScript** puro no frontend. Ideal para portfólio — demonstra uma API REST completa integrada a um frontend moderno.

---

## 🛠️ Tecnologias

| Camada      | Tecnologia              |
|-------------|-------------------------|
| Backend     | Java 17, Spring Boot 3  |
| API         | Spring Web (REST)       |
| Persistência| Spring Data JPA + H2    |
| Validação   | Jakarta Validation      |
| Frontend    | HTML5, CSS3, JavaScript |
| Build       | Maven                   |

---

## ✨ Funcionalidades

- ✅ Criar, editar e excluir tarefas
- ✅ Marcar tarefas como concluídas
- ✅ Definir prioridade (Baixa / Média / Alta)
- ✅ Filtrar por status (Todas / Pendentes / Concluídas)
- ✅ Busca por título em tempo real
- ✅ Dados de exemplo carregados na inicialização
- ✅ API REST documentada
- ✅ Banco H2 em memória (sem instalação necessária)

---

## 🏗️ Estrutura do Projeto

```
taskmanager/
├── src/
│   ├── main/
│   │   ├── java/com/taskmanager/
│   │   │   ├── TaskManagerApplication.java   # Ponto de entrada
│   │   │   ├── controller/
│   │   │   │   ├── TaskController.java        # Endpoints da API REST
│   │   │   │   └── HomeController.java        # Serve o index.html
│   │   │   ├── model/
│   │   │   │   └── Task.java                  # Entidade JPA
│   │   │   ├── repository/
│   │   │   │   └── TaskRepository.java        # Acesso ao banco
│   │   │   └── service/
│   │   │       └── TaskService.java           # Regras de negócio
│   │   └── resources/
│   │       ├── static/
│   │       │   ├── index.html                 # Frontend
│   │       │   ├── css/style.css
│   │       │   └── js/app.js
│   │       ├── application.properties         # Configurações
│   │       └── data.sql                       # Dados iniciais
│   └── test/
└── pom.xml
```

---

## 🚀 Como Executar

### Pré-requisitos
- Java 17+
- Maven (ou use o Maven Wrapper incluído no IntelliJ)

### Passos

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/taskmanager.git
cd taskmanager

# Execute
./mvnw spring-boot:run
```

Acesse: **http://localhost:8080**

---

## 📡 Endpoints da API

| Método | Endpoint                  | Descrição                      |
|--------|---------------------------|--------------------------------|
| GET    | `/api/tasks`              | Lista todas as tarefas         |
| GET    | `/api/tasks?search=texto` | Busca por título               |
| GET    | `/api/tasks?completed=true` | Filtra por status            |
| GET    | `/api/tasks/{id}`         | Busca por ID                   |
| POST   | `/api/tasks`              | Cria nova tarefa               |
| PUT    | `/api/tasks/{id}`         | Atualiza tarefa                |
| PATCH  | `/api/tasks/{id}/toggle`  | Alterna concluída/pendente     |
| DELETE | `/api/tasks/{id}`         | Exclui tarefa                  |

### Exemplo de payload (POST/PUT):
```json
{
  "title": "Minha tarefa",
  "description": "Descrição opcional",
  "priority": "ALTA"
}
```

---

## 🗄️ Console H2 (banco de dados)

Com a aplicação rodando, acesse:
- URL: `http://localhost:8080/h2-console`
- JDBC URL: `jdbc:h2:mem:taskdb`
- User: `sa` | Password: *(vazio)*

---

## 👨‍💻 Autor

Feito com ☕ e Java. Sinta-se livre para fazer fork e contribuir!

-- Dados iniciais para demonstração
INSERT INTO tasks (title, description, completed, priority, created_at, updated_at)
VALUES ('Estudar Spring Boot', 'Aprender controllers, services e repositories', false, 'ALTA', NOW(), NOW());

INSERT INTO tasks (title, description, completed, priority, created_at, updated_at)
VALUES ('Criar projeto no GitHub', 'Fazer o primeiro commit do Task Manager', false, 'ALTA', NOW(), NOW());

INSERT INTO tasks (title, description, completed, priority, created_at, updated_at)
VALUES ('Aprender HTML e CSS', 'Estudar flexbox e grid layout', true, 'MEDIA', NOW(), NOW());

INSERT INTO tasks (title, description, completed, priority, created_at, updated_at)
VALUES ('Praticar JavaScript', 'Aprender fetch API e manipulação do DOM', false, 'MEDIA', NOW(), NOW());

INSERT INTO tasks (title, description, completed, priority, created_at, updated_at)
VALUES ('Beber água', 'Manter a hidratação durante o dia', false, 'BAIXA', NOW(), NOW());

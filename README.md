# 📎 EasyLinks

Sistema desenvolvido em Angular para **armazenamento inteligente de links**, oferecendo uma solução prática e intuitiva para organizar conteúdos digitais de forma rápida, segura e acessível.

---

## 📘 Finalidade

O **EasyLinks** foi criado para simplificar e unificar o gerenciamento de informações digitais — como **links úteis**, **documentos importantes** e **arquivos pessoais** — em um único lugar, organizado, categorizado e fácil de acessar.

A plataforma é ideal para:

* Estudantes que desejam armazenar referências de estudo;
* Profissionais que organizam recursos de trabalho;
* Equipes que compartilham conteúdos de projetos;
* Qualquer pessoa que queira manter seus links e arquivos organizados na nuvem.

---

## ✅ Funcionalidades

* 📎 Cadastro e organização de **links e documentos**;
* 🗂️ Criação de **pastas e categorias personalizadas**;
* 🔍 Busca otimizada por **termos, descrições e tags**;
* 🌐 Captura automática de **metadados dos links** (título, favicon, descrição);
* 🖼️ Visualização com **thumbnails e prévias de documentos**;
* 📥 Upload de arquivos (PDF, DOCX, imagens, etc);
* 🧩 Marcação de favoritos;
* 👥 Suporte a múltiplos usuários;
* 📱 Interface totalmente **responsiva com Tailwind CSS**;
* 🐳 **Containerização com Docker** para fácil execução em qualquer ambiente.

---

## 🛠 Stack Utilizada

| Tecnologia         | Finalidade                                                                                                   |
| ------------------ | ------------------------------------------------------------------------------------------------------------ |
| **Angular**        | Framework frontend para construção da interface de usuário.                                                  |
| **TypeScript**     | Superset do JavaScript que adiciona tipagem estática, facilitando a manutenção e escalabilidade de projetos. |
| **Tailwind CSS**   | Estilização rápida, responsiva e moderna.                                                                    |
| **Docker**         | Containerização da aplicação.                                                                                |
| **Docker Compose** | Orquestração dos serviços.                                                                                   |

---

## ⚙️ Como Rodar o Projeto

Antes de iniciar, você precisa ter instalado:

* [Docker](https://www.docker.com/)
* [Docker Compose](https://docs.docker.com/compose/)

### 1. Clonar o Repositório

```bash
git clone https://github.com/bernardommedeiros/EasyLinks.git
cd src
```

### 2. Construção dos Containers
```bash
docker compose build
```

### 3. Chaves de ambiente
```bash
crie um arquivo .env
copie e cole o arquivo .env_example
```

### 3. Subir os serviços
```bash
docker compose up
```

---

## 🧭 Roadmap

Recursos em desenvolvimento:

* 🔐 Autenticação OAuth (Google, GitHub)
* 📊 Dashboard de uso e estatísticas
* 💾 Backup e exportação de dados
* 🔄 Sincronização com serviços externos (Google Drive, Dropbox)
* 🔔 Notificações de expiração/validação de links

---

## 🌟 Diferenciais

* ✅ Interface clean e intuitiva;
* 🔎 Busca inteligente por tags e termos;
* 🛠️ Arquitetura escalável e pronta para produção;
* 🧩 Modular: fácil de estender com novos tipos de dados ou integrações;

---

## 🤝 Contribuição

Contribuições são muito bem-vindas!

Se você deseja propor melhorias, sugerir novas funcionalidades ou corrigir algum problema, sinta-se à vontade para abrir uma issue ou enviar um pull request.

**Como contribuir:**

1. Fork este repositório;
2. Crie uma branch (`git checkout -b feature/nome-da-feature`);
3. Faça seus commits (`git commit -m 'feat: minha contribuição'`);
4. Push para a sua branch (`git push origin feature/nome-da-feature`);
5. Abra um Pull Request.

---

## 📝 Licença

Este projeto está licenciado sob a **MIT License**.
Consulte o arquivo [LICENSE](LICENSE) para mais detalhes.
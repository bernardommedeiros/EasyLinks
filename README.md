# Easy Links

Easy Links é uma aplicação web para gerenciamento colaborativo de tabelas e links, focada em organização, colaboração e notificações em tempo real. O projeto foi desenvolvido com uma arquitetura moderna, integrando frontend reativo, backend assíncrono e mensageria.

---

## 🎯 Objetivo do Projeto
O Easy Links foi desenvolvido como projeto prático para aplicar conceitos de:
- Desenvolvimento frontend
- Arquitetura distribuída
- Mensageria
- Integração entre frontend e backend
  
---

## 🚀 Funcionalidades

- Criação e gerenciamento de seções e tabelas com os links e suas informações
- Atualização colaborativa de dados
- Notificações automáticas a cada alteração nas tabelas
- Atualizações em tempo real para todos os usuários conectados
- Histórico de notificações persistido no banco de dados
- Processamento assíncrono de eventos para melhor desempenho

---

## 🛠️ Tecnologias Utilizadas

### Frontend
- **React**
- **TypeScript**
- **WebSocket**
- **Firebase Firestore**

### Backend
- **Node.js**
- **Express**
- **RabbitMQ**
- **WebSocket Server**
- **Firebase Admin SDK**

### Banco de Dados
- **Firebase Firestore (NoSQL)**

---

## 🧠 Arquitetura e Fluxo de Dados

1. O usuário realiza uma alteração em uma tabela no frontend.
2. O backend em Node.js recebe a atualização via REST.
3. A alteração é comparada (diff) para identificar o que mudou.
4. O evento é publicado no **RabbitMQ**, garantindo processamento assíncrono e confiável.
5. O backend consome a fila:
   - salva a notificação no Firestore
   - envia a atualização em tempo real via **WebSocket**
6. O React recebe a mensagem e atualiza a interface instantaneamente.

---

## 🔔 Sistema de Notificações

- Cada alteração (adição, edição ou remoção de linhas) gera uma notificação.
- As notificações são:
  - processadas de forma assíncrona pelo RabbitMQ
  - persistidas no Firestore
  - distribuídas em tempo real via WebSocket
- O frontend mantém um histórico e exibe alertas temporários aos usuários.

---


## 📦 Como executar o projeto (resumo)

### Pré-requisitos
- Node.js
- Firebase configurado
- RabbitMQ em execução

### Backend
```bash
npm i
node server.js
```
### Backend
```bash
npm i
pnpm dev
```



# 💬 Chat App — Backend (Node.js + Express + Prisma)

## 🧰 Tecnologias Utilizadas

- **Node.js** – Ambiente de execução JavaScript no servidor.
- **Express** – Framework minimalista para criação de APIs REST.
- **Prisma ORM** – ORM moderno para acesso a banco de dados (PostgreSQL, SQLite etc).
- **JWT (jsonwebtoken)** – Autenticação baseada em tokens.
- **Crypto** – Biblioteca nativa do Node.js usada para hash de senhas (SHA-256).
- **CORS** – Middleware para habilitar requisições entre domínios diferentes.
- **dotenv** – Gerenciamento de variáveis de ambiente.
- **random** – Geração de números aleatórios (ex: para nomes de imagens).

---

## 📁 Estrutura da Aplicação

```
/backend
├── prisma/
│   └── schema.prisma         # Definição do modelo do banco de dados
├── .env                      # Variáveis de ambiente (SECRET, DB)
├── index.js                  # Código principal da API
└── package.json              # Dependências e scripts
```

---

## ✅ Pré-requisitos

- [Node.js](https://nodejs.org/)
- [PostgreSQL](https://www.postgresql.org/) ou outro banco compatível
- [Prisma CLI](https://www.prisma.io/docs/getting-started)
- [Angular CLI](https://angular.io/cli) (se usar o frontend)

---

## ⚙️ Instalação e Execução

### 1. Clone o projeto

```bash
git clone https://github.com/seu-usuario/seu-repo.git
cd seu-repo/backend
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do backend:

```
DATABASE_URL="postgresql://usuario:senha@localhost:5432/seubanco"
TOKEN="sua_chave_secreta"
```

### 4. Configure o Prisma

```bash
npx prisma init
npx prisma migrate dev --name init
npx prisma generate
```

> Lembre-se de definir os modelos `User`, `Chat`, e `Message` no `schema.prisma`.

### 5. Inicie o servidor

```bash
npm start
```

O backend estará disponível em `http://localhost:3000`.

---

## 🔐 Principais Endpoints

### `POST /register`
Cria uma nova conta de usuário.

```json
{
  "username": "fulano",
  "email": "fulano@email.com",
  "password": "12345678"
}
```

### `POST /login`
Realiza login e retorna um token JWT.

### `POST /chat` _(com Auth)_
Retorna usuários e histórico de mensagens.

### `POST /message` _(com Auth)_
Envia uma nova mensagem no chat atual.

---

## 🧪 Scripts Recomendados no `package.json`

```json
"scripts": {
  "start": "node index.js",
  "dev": "nodemon index.js",
  "migrate": "prisma migrate dev",
  "generate": "prisma generate"
}
```

---

## 🌐 Frontend Angular

Caso esteja utilizando Angular para a interface web:

```bash
cd ../frontend
npm install
ng serve
```

O frontend será servido em `http://localhost:4200`.

---

## 📝 Observações

- Hash de senha com `crypto` e algoritmo `SHA-256`.
- Tokens JWT com validade de 1 hora.
- CORS liberado apenas para `http://localhost:4200`.
- A função `changeImg()` existe mas ainda não está integrada com upload de arquivos.
- Middleware `authToken` protege as rotas de mensagens e chat.

---

## 👨‍💻 Autor

Desenvolvido por luiz gustavo 👊  
Para dúvidas, sugestões ou melhorias, fique à vontade para contribuir!

import express from "express";
import cors from "cors";
import random from "random";
import { PrismaClient } from "@prisma/client";
import crypto from "crypto";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { connect } from "http2";

dotenv.config();

const App = express();
const prisma = new PrismaClient();
const SECRET = process.env.TOKEN;

var format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;

export function sha256(password) {
  return crypto.createHash("sha256").update(password).digest("hex");
}

function authToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

export function changeImg(img) {
  const searchImg = img.indexOf(".");

  const nameImg = img.substring(0, searchImg);
  const extend = img.substring(searchImg + 0);
  const typeImage = [".jpeg", ".jpg", ".png", ".webp"];

  console.log(extend);

  if (typeImage.includes(extend)) {
    // console.log(nameImg);
    // console.log(extend);
    console.log(random.int(50000, 700000) + nameImg + extend);
  } else {
    return false;
  }
}
App.use(
  cors({
    origin: "http://localhost:4200",
  })
);

App.use(express.json());

App.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const passwordHashed = sha256(password);

  const findUser = await prisma.user.findFirst({
    where: {
      email: email,
      password: passwordHashed,
    },
  });

  if (!findUser) {
    return res.status(400).json({
      message: "Credenciais não conferem!",
    });
  }

  const token = jwt.sign(
    { id: findUser.id, username: findUser.username },
    SECRET,
    { expiresIn: "1h" }
  );

  return res.status(200).json({
    message: "Login realizado com sucesso!",
    token: token,
  });
});

App.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  const imgAvatar = "user-avatar.jpg";
  const passwordHashed = sha256(password);

  if (!username || !email || !password) {
    return res.status(400).json({
      message: "Precisa preencher todos os campos",
    });
  }

  if (format.test(username)) {
    return res.status(400).json({
      message: "Possui caracteres especiais no seu nome.",
    });
  }

  if (password.length < 8) {
    return res.status(400).json({
      message: "Senha muito curta.",
    });
  }

  const findUser = await prisma.user.findFirst({
    where: {
      OR: [{ email: email }, { username: username }],
    },
  });

  if (findUser) {
    return res.status(400).json({
      message: "Ja existe uma conta com essas credenciais.",
    });
  }

  const createUser = await prisma.user.create({
    data: {
      username: username,
      email: email,
      password: passwordHashed,
      imgAvatar: imgAvatar,
    },
  });

  const token = jwt.sign(
    { id: createUser.id, username: createUser.username },
    SECRET,
    { expiresIn: "1h" }
  );

  if (createUser) {
    return res.status(200).json({
      message: "Criação de conta realizada com sucesso!",
      token: token,
    });
  }
});

App.post("/chat", authToken, async (req, res) => {
  const myName = req.user.username;
  const myId = req.user.id;
  const receiverId = req.body.receiverId;

  // Buscar outros usuários (exceto o atual)
  const findUser = await prisma.user.findMany({
    where: {
      NOT: { id: myId },
    },
  });

  // 🔁 Se NÃO veio receiverId, não abre chat ainda — apenas retorna os usuários
  if (!receiverId) {
    return res.status(200).json({
      users: findUser,
      myName,
      myId,
      chat: { messages: [] }, // ou null, se preferir
    });
  }

  // 🔁 Se veio receiverId, prosseguir com abertura/consulta de chat
  const [u1, u2] = myId < receiverId ? [myId, receiverId] : [receiverId, myId];

  let chat = await prisma.chat.findFirst({
    where: {
      SentChatId: u1,
      ReceivedChatId: u2,
    },
    include: {
      messages: {
        orderBy: { createdAt: 'asc' },
        include: {
          sender: {
            select: {
              id: true,
              username: true,
            },
          },
        },
      },
    },
  });

  if (!chat) {
    chat = await prisma.chat.create({
      data: {
        SentChat: { connect: { id: u1 } },
        ReceivedChat: { connect: { id: u2 } },
      },
    });
  }

  res.status(200).json({
    users: findUser,
    myName,
    myId,
    chat,
  });
});


App.post("/message", authToken, async (req, res) => {
  const myId = req.user.id;
  const { chatId, contentMessage } = req.body;

  const message = await prisma.message.create({
    data: {
      contentMessage,
      chat: { connect: { id: chatId } },
      sender: { connect: { id: myId } },
    },
    include: {
      sender: {
        select: {
          id: true,
          username: true, // 🔥 necessário!
        },
      },
    },
  });

  res.status(200).json(message);
});


App.listen(3000);

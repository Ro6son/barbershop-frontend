import express, { Application, NextFunction, Request, Response } from 'express';
import { UsersRoutes } from './routes/users.routes';
import { SchedulesRoutes } from './routes/schedules.routes';
import cors from 'cors';


// Inicialização do aplicativo Express:
const app: Application = express()

// a biblioteca CORS é essencial para lidar com as requisições HTTP que conectam o frontend e o backend, 
// permitindo que eles interajam de maneira segura e controlada
app.use(cors());

// Configuração do middleware:
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Criação das rotas de usuário:
const usersRoutes = new UsersRoutes().getRoutes();
const schedulesRoutes = new SchedulesRoutes().getRoutes();

// Aqui, as rotas de usuário definidas em usersRoutes são adicionadas à aplicação Express.
app.use('/users', usersRoutes);
app.use('/schedules', schedulesRoutes);

// Esse trecho de código define um middleware de tratamento de erros global para a aplicação
app.use((err: Error, request: Request, response: Response, next: NextFunction) => {
  if (err instanceof Error) {
    return response.status(400).json({
      message: err.message,
    });
  }
  return response.status(500).json({
    message: 'Internal Server Error',
  })
});

// O servidor é iniciado na porta 3000. Quando o servidor é iniciado, a mensagem 'Server is running' será exibida no console.
app.listen(3333, () => console.log('Server is running port: 3333'))



/*

brief:
 Esse código configura um servidor web usando o framework Express, define rotas relacionadas a usuários, 
 configura middlewares para lidar com parsing de dados e tratamento de erros, e inicia o servidor na porta 3000.

 */
import { NextFunction, Request, Response } from 'express';
import { UsersServices } from '../services/UsersServices';
import { s3 } from '../config/aws';

class UsersController {
    private usersServices: UsersServices;
    constructor() {
        // Cria uma instância do serviço UsersServices.
        this.usersServices = new UsersServices();
    }
    index() {
        //buscar todos
    }
    show() {
        //buscar somente um
    }
    // Lida com a criação de um novo usuário
    async store(request: Request, response: Response, next: NextFunction) {
        // Extrai os dados do corpo da requisição
        const { name, email, password } = request.body;

        try {
            // Chama o método 'create' do serviço 'UsersServices' para criar um novo usuário
            const result = await this.usersServices.create({ name, email, password });

            // Retorna uma resposta de status 201 (Created) com os detalhes do novo usuário
            return response.status(201).json(result);
        } catch (error) {
            // Caso ocorra um erro durante a criação do usuário, chama o próximo middleware de tratamento de erro dentro do server.ts
            next(error);
        }
    }
    // Lida com a autenticação do usuário e geração de tokens.
    async auth(request: Request, response: Response, next: NextFunction) {
        // Extrai o email e a senha do corpo da requisição.
        const { email, password } = request.body;

        try {
            // Chama o método 'auth' do serviço de usuários (UsersServices) para autenticação.
            const result = await this.usersServices.auth(email, password);

            // Retorna a resposta JSON com o resultado da autenticação (tokens e informações do usuário).
            return response.json(result);
        } catch (error) {
            // Se ocorrer um erro, repassa o erro para o próximo middleware de tratamento de erros.
            next(error);
        }
    }
    // Lida com a renovação do token de acesso usando o token de refresh.
    async refresh(request: Request, response: Response, next: NextFunction) {
        // Extrai o token de atualização (refresh token) do corpo da requisição.
        const { refresh_token } = request.body;

        try {
            // Chama o método 'refresh' do serviço de usuários (UsersServices) para renovar o token.
            const result = await this.usersServices.refresh(refresh_token);

            // Retorna a resposta JSON com o novo token gerado a partir do refresh token.
            return response.json(result);
        } catch (error) {
            // Se ocorrer um erro, repassa o erro para o próximo middleware de tratamento de erros.
            next(error);
        }
    }
    // Lida com a atualização das informações do usuário.
    async update(request: Request, response: Response, next: NextFunction) {
        
        // Extrai os campos relevantes do corpo da solicitação para serem usados na atualização das informações do usuário.
        // "name" representa o novo nome que o usuário deseja atribuir à sua conta.
        // "oldPassword" é a senha antiga do usuário, necessária para verificar a identidade durante a atualização da senha.
        // "newPassword" é a nova senha que o usuário deseja definir para sua conta.
        const { name, oldPassword, newPassword } = request.body;

        // Extrai o ID do usuário a partir do objeto de solicitação (request)
        const { user_id } = request;

        try {
            // Chama o método "update" do "usersServices" para atualizar as informações do usuário
            const result = await this.usersServices.update({
                name,
                oldPassword,
                newPassword,
                avatar_url: request.file,
                user_id,
            });

            // Retorna uma resposta de sucesso (código de status 200) com o resultado da atualização
            return response.status(200).json(result);
        } catch (error) {
            // Em caso de erro, chama a próxima função de middleware para lidar com o erro
            next(error);
        }
    }
}

export { UsersController };

/*
brief:

UsersController define métodos para lidar com requisições relacionadas a usuários, como buscar, criar, autenticar e atualizar.
UsersServices contém a lógica para criar um novo usuário, incluindo a verificação de duplicatas e criptografia de senha.
UsersRepository lida com as operações de banco de dados, como criar e buscar usuários, usando o Prisma ORM.

No geral, esse código é uma parte de uma aplicação que segue uma arquitetura MVC (Model-View-Controller), onde UsersController é 
o controlador, UsersServices é o serviço que contém a lógica de negócios e UsersRepository é o responsável pelas operações de 
banco de dados.

*/
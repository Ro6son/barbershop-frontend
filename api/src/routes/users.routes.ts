import { Router } from 'express';
import { UsersController } from '../controllers/UsersController';
import { upload } from '../config/multer';
import { AuthMiddleware } from '../middlewares/AuthMiddleware';

class UsersRoutes {
    // private: No geral essa abordagem segue princípios de design de software como a separação de responsabilidades, injeção de dependências e reutilização de código, o que contribui para um código mais organizado, legível, testável e manutenível
    private router: Router;
    private usersController: UsersController;
    private authMiddleware: AuthMiddleware;
    constructor() {
        // Cria uma instância do roteador do Express.
        this.router = Router();
        // Cria uma instância do controlador UsersController.
        this.usersController = new UsersController();
        // Cria uma instância do middleware de autenticação AuthMiddleware
        this.authMiddleware = new AuthMiddleware();
    }
    getRoutes() {
        // Define as rotas e associa os métodos dos controladores às ações das rotas.
        // Configura uma rota POST para a criação de um novo usuário. 
        this.router.post(
            '/',
            this.usersController.store.bind(this.usersController),
        );
        //  Configura uma rota PUT para a atualização de um usuário. 
        this.router.put(
            '/',
            upload.single('avatar_url'),
            this.authMiddleware.auth.bind(this.authMiddleware),
            this.usersController.update.bind(this.usersController),
        );
        // Configura uma rota POST para autenticar um usuário
        this.router.post(
            '/auth',
            this.usersController.auth.bind(this.usersController),
        );
        // Configura uma rota POST para atualizar os tokens de autenticação usando o token de refresh. 
        this.router.post(
            '/refresh',
            this.usersController.refresh.bind(this.usersController),
        );

        // Retorna o roteador configurado com as rotas.
        return this.router;
    }
}

export { UsersRoutes };

/*
brief:
O objetivo deste código é definir as rotas relacionadas aos usuários em um servidor Express em JavaScript. 

Em resumo, esse código cria um gerenciador de rotas para manipulação de usuários em uma aplicação Express. 
Ele utiliza a classe UsersController para definir ações relacionadas aos usuários, como o armazenamento (store) 
de novos usuários, configurando as rotas correspondentes
*/

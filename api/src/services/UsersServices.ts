import { compare, hash } from "bcrypt";
import { ICreate, IUpdate } from "../interfaces/UsersInterface";
import { UsersRepository } from "../repositories/UsersRepository"
import { s3 } from "../config/aws";
import { v4 as uuid } from "uuid";
import { sign, verify } from "jsonwebtoken";

class UsersServices {
    private usersRepository: UsersRepository;
    constructor() {
        // Cria uma instância do repositório UsersRepository.
        this.usersRepository = new UsersRepository();
    }
    // Lida com a criação de um novo usuário e a criptografia da senha.
    async create({ name, email, password }: ICreate) {

        // Verifica se já existe um usuário com o mesmo e-mail no banco de dados.
        const findUser = await this.usersRepository.findUserByEmail(email);
        if (findUser) {
            throw new Error('User exists');
        }

        // Gera um hash seguro da senha fornecida pela função de hash do"bcrypt".
        const hashPassoword = await hash(password, 10);

        // Chama o método de criação no repositório para adicionar o novo usuário ao banco de dados.
        const create = await this.usersRepository.create({
            name,
            email,
            password: hashPassoword,
        });

        // Retorna o resultado da criação, que geralmente é o objeto do usuário recém-criado no banco de dados.
        return create;
    }

    // Lida com a atualização das informações do usuário, incluindo senha e avatar. 
    // Verifica se o usuário existe no banco de dados com base no ID fornecido.
    async update({ name, oldPassword, newPassword, avatar_url, user_id }: IUpdate) {

        let password;

        // Verifica se as senhas antigas e novas foram fornecidas.
        if (oldPassword && newPassword) {
            // Busca o usuário pelo ID no banco de dados usando o método findUserById do repositório.
            const findUserById = await this.usersRepository.findUserById(user_id);

            // Verifica se o usuário foi encontrado.
            if (!findUserById) {
                throw new Error('User not found');
            }
            // Compara a senha antiga fornecida com a senha armazenada no banco de dados.
            const passwordMatch = compare(oldPassword, findUserById.password);

            // Verifica se a senha antiga fornecida é válida.
            if (!passwordMatch) {
                throw new Error('Password invalid.');
            }

            // Criptografa a nova senha fornecida usando a função hash.
            password = await hash(newPassword, 10);

            // Atualiza a senha do usuário no banco de dados usando o método updatePassword do repositório.
            await this.usersRepository.updatePassword(password, user_id);
        }
        // if (avatar_url) {
        //     //Verifica se foi fornecida uma nova imagem de avatar.
        //       const uploadImage = avatar_url?.buffer;

        //     //Faz o upload da imagem do avatar para um serviço de armazenamento em nuvem (S3)
        //   const uploadS3 = await s3
        //     .upload({
        //       Bucket: 'semana-heroi',
        //       Key: `${uuid()}-${avatar_url?.originalname}`,
        //       // ACL: 'public-read',
        //       Body: uploadImage,
        //     })
        //     .promise();  
        // // Atualiza o nome e a localização do avatar do usuário no banco de dados.     
        //   await this.usersRepository.update(name, uploadS3.Location, user_id);
        // }
        return {
            message: 'User updated successfully',
        };
    }
    // Lida com a autenticação do usuário, geração de tokens de acesso e refresh.
    async auth(email: string, password: string) {

        // Busca o usuário pelo email no banco de dados usando o método findUserByEmail do repositório.
        const findUser = await this.usersRepository.findUserByEmail(email);

        // Verifica se o usuário foi encontrado.
        if (!findUser) {
            throw new Error('User or password invalid.');
        }

        // Compara a senha fornecida com a senha armazenada no banco de dados.
        const passwordMatch = await compare(password, findUser.password);

        // Verifica se a senha fornecida é válida.
        if (!passwordMatch) {
            throw new Error('User or password invalid.');
        }

        // Obtém a chave secreta do token de acesso do ambiente.
        let secretKey: string | undefined = process.env.ACCESS_KEY_TOKEN;
        if (!secretKey) {
            throw new Error('There is no token key');
        }

        // Gera um token de acesso usando a biblioteca jsonwebtoken (JWT) com os detalhes do usuário.
        // O "subject" é o identificador único do token.
        // O token expirará após 60 segundos.
        const token = sign({ email }, secretKey, {
            subject: findUser.id,
            expiresIn: 60 * 15,
        });

        // Gera um token de refresh semelhante ao token de acesso, mas com um prazo de validade maior.
        const refreshToken = sign({ email }, secretKey, {
            subject: findUser.id,
            expiresIn: '7d',
        });

        // Retorna um objeto contendo o token de acesso, token de refresh e informações do usuário.
        return {
            token,
            refresh_token: refreshToken,
            user: {
                name: findUser.name,
                email: findUser.email,
                avatar_url: findUser.avatar_url,
            },
        };
    }
    // Lida com a renovação do token de acesso usando o token de refresh.
    async refresh(refresh_token: string) {
        // Verifica se o refresh token foi fornecido
        if (!refresh_token) {
            throw new Error('Refresh token missing');
        }
        // Obtém a chave secreta usada para assinar tokens a partir das variáveis de ambiente
        let secretKey: string | undefined = process.env.ACCESS_KEY_TOKEN;
        if (!secretKey) {
            throw new Error('There is no refresh token key');
        }

        // Verifica a validade do refresh token usando a chave secreta
        const verifyRefreshToken = verify(refresh_token, secretKey);

        // Extrai os dados do token verificado, que normalmente incluem informações do usuário
        const { sub } = verifyRefreshToken;

        // Gera um novo token de acesso válido com base nos dados extraídos do token verificado
        const newToken = sign({ sub }, secretKey, {
            expiresIn: '1h',
        });

        // Retorna o novo token de acesso
        return { newtoken: newToken, };
    }
}

export { UsersServices };

/*
brief:
UsersController define métodos para lidar com requisições relacionadas a usuários, como buscar, criar, autenticar e atualizar.
UsersServices contém a lógica para criar um novo usuário, incluindo a verificação de duplicatas e criptografia de senha.
UsersRepository lida com as operações de banco de dados, como criar e buscar usuários, usando o Prisma ORM.
A interface ICreate define a estrutura esperada dos dados para criar um usuário.

No geral, esse código é uma parte de uma aplicação que segue uma arquitetura MVC (Model-View-Controller), onde UsersController é 
o controlador, UsersServices é o serviço que contém a lógica de negócios e UsersRepository é o responsável pelas operações de 
banco de dados.

        const hashPassoword = await hash(password, 10);
        //Aqui, a senha fornecida é criptografada usando a função hash do pacote bcrypt. 
        //O segundo argumento 10 representa o número de saltos (ou rodadas) que a função de hash deve executar, aumentando a segurança da senha criptografada

Brief: Aqui é onde entra o conceito de "saltos" ou "rodadas". Para aumentar a segurança das senhas criptografadas, muitas funções de hash, incluindo a função bcrypt que você está usando, incorporam um processo iterativo de hash múltiplas vezes. Cada vez que a função de hash é aplicada, ela adiciona uma camada adicional de complexidade à saída.
No caso do bcrypt, o número de "saltos" ou "rodadas" (representado pelo argumento 10 em hash(password, 10)) controla quantas vezes a função de hash é aplicada à senha original. Quanto mais saltos ou rodadas, mais tempo levará para calcular a senha criptografada, tornando-a mais resistente a ataques de força bruta.
Por exemplo, se você usar bcrypt com 10 saltos, ele aplicará a função de hash 10 vezes à senha original, incorporando diferentes transformações a cada iteração. Isso torna a quebra da senha muito mais difícil e demorada para um atacante, mesmo que eles tenham acesso à senha criptografada e ao hash

*/
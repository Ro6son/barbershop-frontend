import { prisma } from "../database/prisma";
import { ICreate } from "../interfaces/UsersInterface";

class UsersRepository {

  // Função assíncrona que cria um novo usuário no banco de dados.
  async create({ name, email, password }: ICreate) {

    // Usa o método create do objeto prisma.users para adicionar um novo registro na tabela "users".
    const result = await prisma.users.create({
      data: {
        name,
        email,
        password,
      }
    });

    // Retorna o resultado da operação de criação.
    return result;
  }

  async findUserByEmail(email: string) {
    // Usa o objeto prisma.users para buscar um usuário único na tabela "users" do banco de dados.
    // Define o critério de busca: encontrar usuário com o email fornecido.
    const result = await prisma.users.findUnique({
      where: {
        email: email
      },
    });

    // Retorna o resultado da busca.
    return result;
  }

  async findUserById(id: string) {

    // Usa o objeto prisma.users para buscar um usuário único na tabela "users" do banco de dados.
    // Define o critério de busca: encontrar usuário com o ID fornecido.
    const result = await prisma.users.findUnique({
      where: {
        id,
      },
    });

    // Retorna o resultado da busca.
    return result;
  }

  async update(name: string, avatar_url: string, user_id: string) {

    // Usa o objeto prisma.users para atualizar um usuário na tabela "users" do banco de dados.
    // where: Define o critério de atualização: usuário com o ID fornecido.
    // data: Atualiza o campo "name" com o valor fornecido.
    const result = await prisma.users.update({
      where: {
        id: user_id,
      },
      data: {
        name,
        // avatar_url,
      },
    });

    // Retorna o resultado da atualização.
    return result;
  }

  async updatePassword(newPassword: string, user_id: string) {

    // Usa o objeto prisma.users para atualizar a senha de um usuário na tabela "users" do banco de dados.
    // where: Define o critério de atualização: usuário com o ID fornecido.
    // data: Atualiza o campo "password" com a nova senha fornecida.
    const result = await prisma.users.update({
      where: {
        id: user_id,
      },
      data: {
        password: newPassword,
      },
    });

    // Retorna o resultado da atualização.
    return result;
  }
}

export { UsersRepository };


/**
 * brief:
UsersController define métodos para lidar com requisições relacionadas a usuários, como buscar, criar, autenticar e atualizar.
UsersServices contém a lógica para criar um novo usuário, incluindo a verificação de duplicatas e criptografia de senha.
UsersRepository lida com as operações de banco de dados, como criar e buscar usuários, usando o Prisma ORM.
A interface ICreate define a estrutura esperada dos dados para criar um usuário.

No geral, esse código é uma parte de uma aplicação que segue uma arquitetura MVC (Model-View-Controller), onde UsersController é 
o controlador, UsersServices é o serviço que contém a lógica de negócios e UsersRepository é o responsável pelas operações de 
banco de dados.
 
 */
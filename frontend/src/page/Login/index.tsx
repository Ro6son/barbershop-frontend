import style from './Login.module.css';
import logo from '../../assets/logo.webp';
import { Input } from '../../components/Input';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button } from '../../components/Button';
import { Link  } from 'react-router-dom';
import { AiOutlineMail } from 'react-icons/ai';
import { BsKey } from 'react-icons/bs';
// import { api } from '../../server';
import { useAuth } from '../../hooks/auth';

// É definida a interface IFormValues para representar os valores do formulário (email e senha).
interface IFormValues {
  email: string;
  password: string;
}

// Componente de Login
export function Login() {

  // Obtém a função signIn do contexto de autenticação
  const { signIn } = useAuth();
  // const navigate = useNavigate();

  // Define um schema de validação usando a biblioteca Yup para validar o formulário. O schema define regras para o email e a senha.
  // yup.object().shape({}) do Yup. Dentro desse objeto, duas validações são definidas para os campos email e password.
  
  const schema = yup.object().shape({
    email: yup
      .string()
      .email('Digite um email válido')
      .required('Campo de email obrigatório'),
    password: yup.string().required('Campo de senha obrigatório'),
  });

  /* Detalhes de yup.object().shape({}) do Yup.
  Para o campo email, a função yup.string() é chamada para indicar que estamos validando uma string. Em seguida, a função email() 
  é usada para validar se o valor é um email válido. Caso contrário, a mensagem de erro "Digite um email válido" será mostrada caso 
  essa validação não passe. Além disso, a função required() é usada para indicar que o campo é obrigatório. Isso significa que se o
  campo estiver vazio, a mensagem de erro "Campo de email obrigatório" será mostrada.

  Para o campo password, apenas a função yup.string() é chamada para indicar que estamos validando uma string. Em seguida, a função
  required() é usada para indicar que o campo é obrigatório. Da mesma forma que no campo email, se o campo estiver vazio, a mensagem
  de erro "Campo de senha obrigatório" será mostrada.

  Dessa forma, o schema de validação usando o Yup estabelece as regras de validação para os campos de email e senha, garantindo que
  os valores inseridos no formulário atendam a essas regras antes de serem submetidos
  */


  


// Usa o hook useForm para gerenciar o estado do formulário e a validação
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormValues>({
    resolver: yupResolver(schema),
  });

  /*
Usamos o hook useForm para gerenciar o estado do formulário e suas validações.
register é usado para vincular campos do formulário a regras de validação.
handleSubmit é chamado quando o formulário é enviado, ativando a validação.
formState: { errors } guarda o estado do formulário, incluindo erros de validação.
O schema de validação schema, definido com Yup, é aplicado com resolver.
Dessa forma, o hook useForm gerencia a validação e submissão do formulário, com register associando regras de validação aos campos
e handleSubmit executando a lógica ao enviar. Erros de validação ficam em errors

O resultado do useForm é desestruturado para extrair três elementos essenciais:
  register
  handleSubmit
  format: {erros}

  Com isso, o useForm está configurado para usar o schema de validação schema definido anteriormente para validar os campos do formulário
  */



  // Função de submissão do formulário
  const submit = handleSubmit(async ({ email, password }) => {
    try {
      // Chama a função signIn para autenticar o usuário
      signIn({ email, password });
    } catch (error) {
      console.log('🚀 ~ file: index.tsx:41 ~ submit ~ error:', error);
    }
    // return submit;
    /*
     Finalmente, estamos retornando a própria função submit. Isso pode ser desnecessário aqui, pois submit já é uma função criada
      pelo handleSubmit. O retorno da função é usado quando você deseja controlar o comportamento padrão do formulário, como prevenir
      o recarregamento da página após a submissão. Nesse caso, não parece ter um propósito claro para o retorno.
    */
  });

  // Renderiza a interface do login
  return (
    <div className={style.background}>
      <div className={`container ${style.container}`}>
        <div className={style.wrapper}>
          <div>
            <img src={logo} alt="" />
          </div>
          <div className={style.card}>
            <h2>Olá, seja bem vindo!</h2>
            <form onSubmit={submit}>
              {/* Componente Input para o campo de email */}
              <Input
                placeholder="Email"
                type="text"
                {...register('email', { required: true })}
                error={errors.email && errors.email.message}
                icon={<AiOutlineMail size={20} />}
              />
              {/* Componente Input para o campo de senha */}
              <Input
                placeholder="Senha"
                type="password"
                {...register('password', { required: true })}
                error={errors.password && errors.password.message}
                icon={<BsKey size={20} />}
              />

              {/* Componente Button para o botão de entrar */}
              <Button text="Entrar" />
            </form>
            <div className={style.register}>
              <span>
                Ainda não tem conta? <Link to={'/register'}>Cadastre-se</Link>{' '}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/*
O objetivo deste código é criar um componente de login em uma aplicação React. O componente "Login" permite aos usuários inserir
suas credenciais (email e senha) para autenticação na aplicação. O código lida com a validação dos campos de entrada usando a biblioteca
Yup, realiza a autenticação do usuário chamando a função signIn do contexto de autenticação e fornece uma interface visual para o 
processo de login.

*/
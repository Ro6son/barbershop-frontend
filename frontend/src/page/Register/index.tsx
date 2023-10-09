import style from './Register.module.css';
import logo from '../../assets/logo.webp';
import { Input } from '../../components/Input';
import { Link } from 'react-router-dom';
import { Button } from '../../components/Button';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { BsPerson, BsKey } from 'react-icons/bs';
import { AiOutlineMail } from 'react-icons/ai';
import { api } from '../../server';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


// Interface para os valores do formulário de registro
interface IFormValues {
  name: string;
  email: string;
  password: string;
}

// Componente de registro
export function Register() {

  // Schema de validação usando Yup para validar o formulário
  const schema = yup.object().shape({
    name: yup.string().required('Campo de nome obrigatório'),
    email: yup
      .string()
      .email('Digite um email válido')
      .required('Campo de email obrigatório'),
    password: yup
      .string()
      .min(6, 'Mínimo de 6 caracteres')
      .required('Campo de senha obrigatório'),
  });

  // Gerenciamento do estado do formulário com o hook useForm
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormValues>({ resolver: yupResolver(schema) });


   // Função de submissão do formulário
  const submit = handleSubmit(async (data) => {
    try {
      // Faz uma requisição POST à API para cadastrar o usuário
      const result = await api.post('/users', {
        name: data.name,
        email: data.email,
        password: data.password,
      });
  
      // Exibe uma notificação de sucesso
      toast.success('Cadastro realizado com sucesso!', {
        position: 'top-right', // Posição da notificação
        autoClose: 3000, // Duração em milissegundos
      });
  
      console.log("🚀 ~ file: index.tsx:42 ~ submit ~ result:", result);
    } catch (error) {
      if (error instanceof Error) { // Verifica se 'error' é uma instância de 'Error'

        // Exibe uma notificação de erro com base na resposta da API
        toast.error(error.message, {
          position: 'top-right', // Posição da notificação
          autoClose: 3000, // Duração em milissegundos
        });
      } else {
        // Exibe uma notificação de erro genérica
        toast.error('Ocorreu um erro ao processar sua solicitação. Tente novamente mais tarde.', {
          position: 'top-right', // Posição da notificação
          autoClose: 3000, // Duração em milissegundos
        });
      }
    }
  });
  
  // Renderização do componente de registro
  return (
    <div className={style.background}>
      <div className="container">
        <p className={style.navigate}>
          <Link to={'/'}>Home</Link> {'>'} Área de Cadastro
        </p>
        <div className={style.wrapper}>
          {/* <div className={style.imageContainer}>
            <img src={logo} alt="" />
          </div> */}
          <div className={style.card}>
            <h2>Área de Cadastro</h2>
            <form onSubmit={submit}>
              <Input
                placeholder="Nome"
                type="text"
                {...register('name', { required: true })}
                error={errors.name && errors.name.message}
                icon={<BsPerson size={20} />}
              />
              <Input
                placeholder="Email"
                type="text"
                {...register('email', { required: true })}
                error={errors.email && errors.email.message}
                icon={<AiOutlineMail size={20} />}
              />
              <Input
                placeholder="Senha"
                type="password"
                {...register('password', { required: true })}
                error={errors.password && errors.password.message}
                icon={<BsKey size={20} />}
              />
              <Button text="Cadastrar" />
            </form>
            <div className={style.register}>
              <span>
                Já tem cadastro? <Link to={'/'}>Voltar à Página Inicial </Link>{' '}
              </span>
            </div>
          </div>
          <div className={style.imageContainer}>
            <img src={logo} alt="" />
          </div>
        </div>
      </div>
    </div>
  );
}

/*
O objetivo deste código é criar um componente de registro de usuário em uma aplicação React. O componente "Register" permite aos
usuários preencher informações como nome, email e senha para criar uma nova conta. Ele utiliza validação de formulário usando a
biblioteca Yup, faz requisições à API para cadastrar o usuário e fornece uma interface visual para o processo de registro.

*/
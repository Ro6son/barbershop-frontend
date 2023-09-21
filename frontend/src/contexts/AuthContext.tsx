import { ReactNode, createContext, useEffect, useState } from 'react';
import { api } from '../server';
import { isAxiosError } from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

// Interface é a tipagem usada para especificar as propriedades esperadas pelo componente AuthProvider
interface IAuthProvider {
  children: ReactNode;
}
// Define uma interface que especifica as propriedades esperadas pelo contexto de autenticação
interface IAuthContextData {
  signIn: ({ email, password }: ISignIn) => void;
  signOut: () => void;
  user: IUserData;
  availableSchedules: Array<string>;
  schedules: Array<ISchedule>;
  date: string;
  handleSetDate: (date: string) => void;
  isAuthenticated: boolean;
}
// Define uma interface para representar um agendamento
interface ISchedule {
  name: string;
  phone: string;
  date: Date;
  id: string;
}

// Define uma interface para os dados do usuário
interface IUserData {
  name: string;
  avatar_url: string;
  email: string;
}

// Define uma interface para os dados necessários ao efetuar login
interface ISignIn {
  email: string;
  password: string;
}

// Cria o contexto de autenticação com valor inicial vazio do tipo IAuthContextData
export const AuthContext = createContext({} as IAuthContextData);

// Componente AuthProvider que fornece o contexto de autenticação para os componentes filhos
export function AuthProvider({ children }: IAuthProvider) {

  // Gerenciamento do estado das agendas e da data
  const [schedules, setSchedules] = useState<Array<ISchedule>>([]);
  const [date, setDate] = useState('');

 // Horários disponíveis para agendamento
  const availableSchedules = [
    '09',
    '10',
    '11',
    '12',
    '13',
    '14',
    '15',
    '16',
    '17',
    '18',
    '19',
  ];

  // Gerenciamento do estado do usuário baseado no armazenamento local
  const [user, setUser] = useState(() => {
    const user = localStorage.getItem('user:semana-heroi');
    if (user) {
      return JSON.parse(user);
    }
    return {};
  });

  // Verificação se há um usuário autenticado
  const isAuthenticated = !!user && Object.keys(user).length !== 0;

  // Função de navegação
  const navigate = useNavigate();

  // Função para atualizar o estado da data
  const handleSetDate = (date: string) => {
    setDate(date);
  };

  // Efeito para buscar as agendas baseadas na data atual
  useEffect(() => {
    api
      .get('/schedules', {
        params: {
          date,
        },
      })
      .then((response) => {
        setSchedules(response.data);
      })
      .catch((error) => console.log(error));
  }, [date]);

  // Função assíncrona para realizar o processo de login
  async function signIn({ email, password }: ISignIn) {
    try {
      const { data } = await api.post('/users/auth', {
        email,
        password,
      });
      const { token, refresh_token, user } = data;
      const userData = {
        name: user.name,
        email: user.email,
        avatar_url: user.avatar_url,
      };
      localStorage.setItem('token:semana-heroi', token);
      localStorage.setItem('refresh_token:semana-heroi', refresh_token);
      localStorage.setItem('user:semana-heroi', JSON.stringify(userData));

      // Redireciona para o dashboard após o login e exibe uma notificação de sucesso
      navigate('/dashboard');
      toast.success(`Seja bem vindo(a), ${userData.name}`);
      setUser(userData);
      return data;

    } catch (error) {
      if (isAxiosError(error)) {

         // Exibe mensagem de erro se for um erro do Axios
        toast.error(error.response?.data.message);
      } else {

        // Exibe mensagem de erro genérica
        toast.error('Não conseguimos realizar o login. Tente mais tarde');
        
      }
    }
  }

   // Função para realizar logout
  function signOut() {

    // Remove informações de autenticação do armazenamento local e redireciona para a página de login
    localStorage.removeItem('token:semana-heroi');
    localStorage.removeItem('refresh_token:semana-heroi');
    localStorage.removeItem('user:semana-heroi');
    navigate('/');
  }

  // Fornecimento do contexto de autenticação para os componentes filhos
  return (
    <AuthContext.Provider
      value={{
        signIn,
        signOut,
        user,
        availableSchedules,
        schedules,
        date,
        handleSetDate,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/*
Em resumo, esse código cria um contexto de autenticação que fornece informações e funcionalidades de autenticação para os componentes
em um aplicativo React, permitindo o gerenciamento de dados de usuário, agendamentos e interações relacionadas à autenticação de forma
centralizada. Isso ajuda a manter um código mais organizado e reutilizável, evitando a duplicação de lógica em diferentes partes do
aplicativo.

*/

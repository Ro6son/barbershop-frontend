import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/auth';

// Define uma interface que especifica as propriedades esperadas pelo componente PrivateRoute
// children é um elemento do tipo ReactNode que representa o conteúdo a ser renderizado dentro do PrivateRoute
interface IPrivateRoute {
  children: ReactNode;
}

// Declaração do componente PrivateRoute como um componente funcional
const PrivateRoute: React.FC<IPrivateRoute> = ({ children }) => {

  // Utiliza o hook useAuth para acessar informações sobre autenticação
  const { isAuthenticated } = useAuth();

  // Verifica se o usuário está autenticado
  if (!isAuthenticated) {
    // Se não estiver autenticado, redireciona para a página de login
    return <Navigate to={'/'} />;
  }
  // Se o usuário estiver autenticado, renderiza o conteúdo passado como children
  return <>{children}</>;
};

// Exporta o componente PrivateRoute
export { PrivateRoute };

/*
O objetivo deste código é definir um componente chamado PrivateRoute, que serve para proteger rotas em uma aplicação
React utilizando o pacote react-router-dom garantindo que apenas usuários autenticados tenham acesso ao conteúdo dessas
rotas. Caso o usuário não esteja autenticado, ele é redirecionado para a página de login.
Esse componente permite controlar o acesso a determinadas rotas com base na autenticação do usuário.

*/



import { Route, Routes } from 'react-router-dom';
import { Login } from '../page/Login';
import { Register } from '../page/Register';
import { Dashboard } from '../page/Dashboard';
import { Schedules } from '../page/Schedules';
import { PrivateRoute } from './PrivateRoute';
import { EditProfile } from '../page/EditProfile';

export const RouteApp = () => {
  return (
    <Routes>
      {/* Define uma rota para o caminho "/" e renderiza o componente Login */}
      <Route path="/" element={<Login />} />

      {/* Define uma rota para o caminho "/register" e renderiza o componente Register */}
      <Route path="/register" element={<Register />} />

      {/* Define uma rota para o caminho "/dashboard" que é acessível apenas para usuários autenticados */}
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />

      {/* Define uma rota para o caminho "/schedules" que é acessível apenas para usuários autenticados */}
      <Route
        path="/schedules"
        element={
          <PrivateRoute>
            <Schedules />
          </PrivateRoute>
        }
      />

      {/* Define uma rota para o caminho "/edit-profile" que é acessível apenas para usuários autenticados */}
      <Route
        path="/edit-profile"
        element={
          <PrivateRoute>
            <EditProfile />
          </PrivateRoute>
        }
      />
    </Routes>
  );
};

/*
O objetivo deste código é definir as rotas da aplicação usando o pacote react-router-dom e estruturar a navegação
entre diferentes páginas. O componente RouteApp é uma configuração central de roteamento que define quais componentes
serão renderizados em diferentes caminhos (URLs).

Em resumo, o código configura a estrutura de rotas da aplicação, definindo quais componentes devem ser renderizados
em diferentes URLs. Além disso, algumas rotas são protegidas e só podem ser acessadas por usuários autenticados,
graças ao uso do componente PrivateRoute. Isso ajuda a criar uma experiência de navegação estruturada e segura 
dentro da aplicação.


*/
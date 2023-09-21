import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

// Função customizada useAuth
export function useAuth() {

  // Usa o hook useContext para acessar o contexto AuthContext
  const context = useContext(AuthContext);

  // Verifica se o contexto foi encontrado
  if (!context) {
    // Se o contexto não estiver disponível, lança um erro indicando que useAuth deve ser usado dentro de AuthProvider
    throw new Error('useAuth is not in AuthProvider');
  }

   // Retorna o contexto encontrado
  return context;
}

/*
Essencialmente, essa função useAuth oferece uma maneira fácil e padronizada de acessar informações de autenticação
 em diferentes partes da sua aplicação, sem a necessidade de passar explicitamente o contexto através das propriedades.

 */

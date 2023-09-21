import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from 'axios';

// Cria uma instância do Axios com a base URL definida como http://localhost:
const api: AxiosInstance = axios.create({
  baseURL: 'http://localhost:3333',
});

// Variável para controlar se uma atualização do token está em andamento
let isRefreshing = false;

// Array que armazenará as requisições que falharam durante a atualização do token
let failedRequest: Array<RequestConfig> = [];

// Interface que estende a configuração padrão do AxiosRequestConfig com opções adicionais
interface RequestConfig extends AxiosRequestConfig {
  onFailure?: (error: AxiosError) => void;
  onSuccess?: (response: AxiosResponse) => void;
}

// Intercepta as requisições antes de serem enviadas para adicionar o token de autorização ao cabeçalho
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token:semana-heroi');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Array para armazenar funções de callback que serão chamadas após a atualização do token
const refreshSubscribers: Array<(token: string) => void> = [];


// Intercepta as respostas de erro das requisições para lidar com tokens expirados
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError | unknown) => {
    const originalRequest = (error as AxiosError)?.config as RequestConfig;
    if (error instanceof AxiosError && error.response?.status === 401) {
      if (error.response?.data.code === 'token.expired') {
        try {
          // Obtém o token de atualização
          const refresh_token = localStorage.getItem(
            'refresh_token:semana-heroi',
          );

          // Faz uma requisição para renovar o token
          const response = await api.post('/users/refresh', {
            refresh_token,
          });
          console.log(
            '🚀 ~ file: index.ts:44 ~ response:',
            response.data.refresh_token,
          );

          // Atualiza os tokens no armazenamento local
          const { token, refresh_token: newToken } = response.data;
          localStorage.setItem('token:semana-heroi', token);
          localStorage.setItem('refresh_token:semana-heroi', newToken);

          //A variável isRefreshing é definida como false para indicar que a atualização foi concluída.
          isRefreshing = false;

          // Chama as funções de callback para processar as requisições pendentes
          //Chamamos a função onRefreshed(token) para notificar quaisquer subscribers que possam estar aguardando a atualização do token.
          onRefreshed(token);

          // Atualizamos o cabeçalho Authorization da requisição original com o novo token.
          if (originalRequest?.headers) {
            originalRequest.headers.Authorization = `Bearer ${token}`;
          }

          // Reenvia a requisição original com o novo token
          return axios(originalRequest);
        } catch (error) {
          // Chama as funções de callback para lidar com as requisições que falharam
          failedRequest.forEach((request) => {
            request.onFailure?.(error as AxiosError);
          });
          failedRequest = [];
        }

        // Retorna uma nova Promise para reenviar a requisição após a atualização do token
        return new Promise((resolve, reject) => {
          failedRequest.push({
            ...originalRequest,
            onSuccess: (response) => resolve(response),
            onFailure: (error) => reject(error),
          });
        });
      }
    } else {
      // Remove os tokens e informações do usuário do armazenamento local
      localStorage.removeItem('token:semana-heroi');
      localStorage.removeItem('refresh_token:semana-heroi');
      localStorage.removeItem('user:semana-heroi');
    }

    // Rejeita a Promise com o erro original
    return Promise.reject(error);
  },
);

// Função para chamar as funções de callback após a atualização do token
function onRefreshed(token: string) {
  refreshSubscribers.forEach((callback) => callback(token));
}

// Exporta a instância do Axios customizada
export { api };

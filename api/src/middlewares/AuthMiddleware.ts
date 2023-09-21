import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';

interface IPayload {
    sub: string;
}

class AuthMiddleware {

    // Middleware de autenticação para verificar e decodificar o token de acesso.
    auth(request: Request, response: Response, next: NextFunction) {

        // Obtém o valor do header "Authorization" da solicitação HTTP. Esse header é comumente usado para enviar o token de autenticação.
        const authHeader = request.headers.authorization;

        // Verifica se o header "Authorization" foi fornecido na solicitação.
        if (!authHeader) {
            // Se não foi fornecido, retorna uma resposta de status 401 (Unauthorized)
            return response.status(401).json({
                code: 'token.missing',
                message: 'Token missing',
            });
        }
        //Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFsZXhpYTJAdGVzdGUuY29tIiwiaWF0IjoxNjg0MzQ2MzIzLCJleHAiOjE2ODQzNDcyMjMsInN1YiI6IjgzNzM0MWQzLTFjOTEtNDQ5Zi04ZGM4LTNmMTJiNzdhMGNiOCJ9.NoyObZDSa0qonv7U5rKMGxNUXSTe7TROU3ENrv97PEs

        // Divide o valor do header "Authorization" em duas partes, usando o espaço como delimitador. O primeiro valor (antes do espaço)
        //  é descartado, e o segundo valor (após o espaço) é atribuído à variável token. Isso é feito para separar a palavra "Bearer" 
        // do token real.
        const [, token] = authHeader.split(' ');

        // Obtém a chave secreta usada para verificar o token a partir das variáveis de ambiente. Essa chave secreta é necessária para
        // verificar a assinatura do token e decodificar o seu conteúdo. Se a chave não estiver definida nas variáveis de ambiente, uma
        // exceção será lançada.
        let secretKey: string | undefined = process.env.ACCESS_KEY_TOKEN;

        // Verifica se a chave secreta está definida.
        if (!secretKey) {
            throw new Error('There is no token key');
        }
        try {
            // Utiliza a função verify da biblioteca jsonwebtoken para verificar a autenticidade e decodificar o token. A função verify 
            // recebe o token, a chave secreta e, opcionalmente, pode receber opções de verificação. O resultado é desestruturado para 
            // obter o campo sub (que normalmente representa o identificador único do usuário) do payload do token
            const { sub } = verify(token, secretKey) as IPayload;

            // Atribui o valor do campo sub (identificador do usuário) ao objeto request. Isso permite que outros middlewares e rotas
            // acessem o ID do usuário autenticado.
            request.user_id = sub;

            // Chama o próximo middleware ou rota na cadeia.
            return next();
        } catch (error) {

            // Retorna um erro 401 se o token estiver expirado ou inválido.
            return response.status(401).json({
                code: 'token.expired',
                message: 'Token expired.',
            });
        }
    }
}

export { AuthMiddleware };

/*

brief:
Esse código define um middleware de autenticação chamado AuthMiddleware que verifica a validade de um token JWT presente no cabeçalho
 de autorização da requisição, permitindo que rotas protegidas sejam acessadas somente por usuários autenticados. 
 Ele extrai o token, verifica sua autenticidade usando uma chave secreta, extrai o payload do token
  (contendo o campo 'sub' representando o identificador do usuário), atribui esse identificador à propriedade user_id do objeto request
  e permite que a requisição continue seu processamento normal se a autenticação for bem-sucedida. Caso contrário, responde com um erro 
  401 (Unauthorized) indicando que o token está ausente ou expirou.


*/
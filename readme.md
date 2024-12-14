## Oikos

- Criando os testes foi possivel identificar: 
  - Erros nas regras de negocio e na separação de responsabilidades entre as serviço de autenticação e o da ferramenta JWT.
  - Inclusão de validações em algumas partes, exemplo como validação de email e senha, isto era validado no controller em momento de requisição, mas não do serviço em si.

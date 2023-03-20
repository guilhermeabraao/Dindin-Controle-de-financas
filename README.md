# Dindin - Controle de finanças
***

## Instalação das dependências

Para realizar a instalação das dependências necessárias para rodar a aplicação, será necessário abrir o terminal nas pastas "Back-end" e "Front-end"

![image](https://user-images.githubusercontent.com/112726349/226431072-7d5c14cc-9868-47dc-86e9-9cfa95252406.png)

e executar o seguinte comando

>npm install or yarn install

***
## Configurações básicas do back-end

Necessário inserir as informações para conectar ao banco de dados no arquivo **conexao.js**.

![image](https://user-images.githubusercontent.com/112726349/226433814-56977741-e33e-46f0-bc60-63b654669181.png)

As querys para a criação do DB usado pela aplicação se encontram no arquivo **dump.sql**

Também será necessário inserir sua frase secreta no arquivo **secret.js** que será utilizado para a criptografia das senhas no banco de dados.

![image](https://user-images.githubusercontent.com/112726349/226434656-31d04fd5-b5b8-4ed0-b683-b4f1a6d833d3.png)

***

## Rodando a aplicação

Para executar a aplicação, execute o comando no terminal do back-end

> npm run dev

 e execute o comando no front-end
 
 > npm start
 >>em caso de conflito de portas, pode apertar Y para a aplicação rodar em uma diferente automaticamente

***

## Pagina inicial

Na página inicial você irá encontrar um botão que leva ao formulário de cadastro e os campos para efetuar o login caso já cadastrado.

![image](https://user-images.githubusercontent.com/112726349/226436284-7ecd3caa-2a91-4ca6-9f85-d78286817c79.png)
***

## Dashboard

Ao realizar o login, a aplicação exibirá uma dashboard onde você poderá gerenciar as suas finanças.
No primeiro acesso a dashboard aparecerá em branco pois não há transações registradas no momento.

![image](https://user-images.githubusercontent.com/112726349/226436781-364f9d0b-9375-4074-a0ed-a379a50e2bea.png)
***

## Adicionar registro

Abaixo do resumo das finanças, encontra-se o botão **Adicionar Registro**

![image](https://user-images.githubusercontent.com/112726349/226437192-439de292-eb38-4bdf-a9ff-3f203d0df7bc.png)

Ao clicar, será exibido o formulário com os campos necessários para adicionar um registro a sua conta

![image](https://user-images.githubusercontent.com/112726349/226437382-696394dc-afac-436e-adad-35ebba9c8e10.png)
***
## Editar ou excluir registro

Ao final de um registro exibido no dashboard, haverão 2 ícones

![image](https://user-images.githubusercontent.com/112726349/226438133-4b400703-0cca-4297-bd4d-a750ba39f274.png)

O primeiro, ao clicar, exibirá um formulário com as informações do registro a ser editado

![image](https://user-images.githubusercontent.com/112726349/226438351-b33d42cf-adcf-483b-89e6-f96ae04d173d.png)

e, ao clicar no segundo, exibirá uma mensagem para que seja confirmada a exclusão

![image](https://user-images.githubusercontent.com/112726349/226438823-cf939923-2f76-4781-97f7-901aefb09582.png)
***

## Filtro de categorias

A aplicação permita realizar o filtro de categorias, exibindo no dashboard apenas os registros que possuem a(s) categoria(s) selecionada.

![image](https://user-images.githubusercontent.com/112726349/226439129-a4d8d9fa-25be-494b-a926-a176455af4d2.png)
***

## Editar perfil do usuário

Caso necessário, também é possível editar o perfil do usuário

Um formulário com as informações do usuário logado irá aparecer ao clicar no ícone de perfil

![image](https://user-images.githubusercontent.com/112726349/226439441-a1d094b1-14c5-4711-b78e-b349d6a25078.png)

![image](https://user-images.githubusercontent.com/112726349/226439520-a8168037-3cb3-4026-965e-9ba9ebcf98fe.png)
***

## Logout

Para realizar o logout, basta clicar no ícone de logout e o usuário será redirecionado para a página inicial

![image](https://user-images.githubusercontent.com/112726349/226439805-d7198e61-b4ab-4b39-8e50-4bc246fe51e4.png)





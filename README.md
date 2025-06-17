## Teste in8 - Shopee Cart
Este projeto esta estrutura em duas pastas principais, cada uma contendo backend e frontend. Como rodar cada um dos projetos está descrito no readme de cada um dos projetos.

## Decisões técnicas
Lendo o arquivo conseguir destacar as primeiras coisas:

→ Os dados que serão usados no front para gerar os produtos já estao disponiveis na web, sendo não necessário persistir esses dados, apesar disso, irei utilizar o back para retornar os dados para front, por motivos de: segurança dos dados. Retornar via backend evita que o client envie os preços para o back, sera de responsabilidade do back calcular os pedidos. 

pesquisar, filtrar, selecionar produtos,
adicioná-los a um carrinho de compras e finalizar a compra.

→ Consultar os dados de terceiro: back

→ Filtrar por ordem, fornecedor, nome: back - optei pelo back pelo fato de que é ele quem terá acesso a todos os produtos, enquanto o front terá acesso apenas a uma pequena fatia dos dados

→ Adicioná-los a um carrinho de compras - temos duas alternativas para tal:

→ Persistir os dados dentro do storage do navegador

→ Salvar sessão dentro do backend para utilização em dados ou persistência entre dispositivos.

- Decisão: optei pela primeira opção pelo fato de não ser necessário construir login e somente uma sessão localstorage vai ser mais funcional.

→ Registrar pedidos realizados, garantindo a persistência das informações para futura consulta e controle: backend

Decisões técnicas:

→ Implementar paginação pela quantidade de dados da api

→ Utilizarei a biblioteca heroUI para componentes (https://www.heroui.com/docs/guide/introduction) - decisão puramente estética e de facilidade de uso

→ Utilizarei nestJS para backend 

→ Paginação: implementado via backend, fazendo requisições para a url de produtos, pois não estou persistindo os dados em base própria

→ “Emitir” um pedido (POST)

Apesar disso, temos outras funcionalidades do back:

→ Consultar itens

→ Retornar itens

→ Implementar paginação para o front

Para a base de dados:

Utilizarei o supabase por motivos de facilidade na hora de ser testado por terceiros o projeto, excluindo a necessidade de configurar database local ou em uma rede (AWS, Cloud, VPS etc)

→ buscar produtos pelo backend para poder pesquisar dentre TODOS os produtos

Observações importantes:

→ Por ser de caráter de teste, não implementei segurança quanto a base de dados.

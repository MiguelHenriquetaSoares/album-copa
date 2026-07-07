# Album da Copa

## Identificacao

Miguel 3° Info

## Descricao

Aplicativo mobile/web feito com Ionic Vue, Vue 3, TypeScript e Capacitor para gerenciar um album de figurinhas da Copa. O app funciona offline com banco local, possui login, cadastro, album, colecao, perfil e tela sobre.

## Funcionalidades

- Login com usuarios locais.
- Cadastro com e-mail unico.
- Persistencia de sessao salvando apenas o ID do usuario no LocalStorage.
- Album com contador, pesquisa e filtros por status e raridade.
- Alteracao de status da figurinha entre coletada e pendente.
- Colecao mostrando apenas figurinhas coletadas.
- Perfil com nome, e-mail, total coletado, porcentagem concluida e edicao de nome.
- Tela Sobre com versao, descricao, tecnologias, termos, politica de privacidade e desenvolvedor.

## Usuarios iniciais

O banco local cria automaticamente estes usuarios na primeira execucao:

- Miguel - `miguel@email.com` - senha `123`
- Joao - `joao@email.com` - senha `123`

## Tecnologias

- Ionic Vue
- Vue 3
- Composition API
- TypeScript
- Capacitor
- SQLite/local offline em TypeScript
- Vite

## Como rodar

Instale as dependencias:

```bash
npm install
```

Rode em modo desenvolvimento:

```bash
npm run dev
```

Ou, se estiver usando Ionic CLI:

```bash
ionic serve
```

Gere a build de producao:

```bash
npm run build
```

Verifique o lint:

```bash
npm run lint
```

## Observacoes

- O app nao utiliza PHP, XAMPP, MySQL, Supabase, Firebase ou API externa.
- Senhas nunca sao salvas no LocalStorage.
- O LocalStorage guarda apenas o ID do usuario logado e os dados locais usados para simular a persistencia offline no navegador.

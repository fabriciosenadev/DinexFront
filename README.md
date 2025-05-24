# DinexFront

Frontend para o sistema de gestão financeira e investimentos **Dinex**, desenvolvido com Angular 18 e Bootstrap 5.

## 🧱 Tecnologias principais

- [Angular 18](https://angular.dev/)
- [Bootstrap 5](https://getbootstrap.com/)
- RxJS, SCSS, Lazy Modules
- Integração com backend `.NET 8` via API REST
- Arquitetura modular (`core`, `shared`, `features`, `state`)
- Sem uso de Angular Material (por preferência de produtividade)

## 🚀 Como rodar localmente

1. Instale as dependências:

   ```bash
   npm install
   ```

2. Rode o servidor de desenvolvimento:

   ```bash
   ng serve
   ```

3. Acesse no navegador:

   ```
   http://localhost:4200/
   ```

> A aplicação recarrega automaticamente ao salvar qualquer alteração.

## 📁 Estrutura do projeto

```
src/
├── app/
│   ├── core/         # Serviços globais, interceptors, guards
│   ├── shared/       # Componentes e pipes reutilizáveis
│   ├── features/     # Módulos de domínio (wallets, assets, etc.)
│   ├── state/        # NgRx state (actions, reducers, effects)
│   ├── app.module.ts
│   └── app-routing.module.ts
```

## 📦 Scripts úteis

- `ng generate component <nome>` — Gera um novo componente
- `ng build` — Compila a aplicação para produção
- `ng test` — Executa testes unitários com Karma

## 🧪 Testes

Este projeto utiliza `Karma + Jasmine` para testes unitários.

> *(Opcional: poderá futuramente usar `Cypress` para testes E2E.)*

## 🛠️ Contribuindo

1. Faça um fork
2. Crie sua branch: `git checkout -b minha-feature`
3. Commit: `git commit -m 'feat: adiciona nova feature'`
4. Push: `git push origin minha-feature`
5. Abra um Pull Request 🚀

---

**Licença:** MIT  
**Autor:** Fabricio R. Sena

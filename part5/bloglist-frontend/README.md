# Bloglist Frontend (Parte 5)

Frontend de la aplicacion Bloglist con React, Vite y Bootstrap.

## Instalacion

```bash
npm install
```

## Ejecucion

```bash
npm run dev
```

El servidor de desarrollo iniciara en `http://localhost:5173`

## Tests

### Tests unitarios (frontend)

```bash
npm test
```

### Tests E2E

Los tests E2E se encuentran en la carpeta `../bloglist-e2e`. Para ejecutarlos:

```bash
cd ../bloglist-e2e
npx playwright test
```

Requisitos:
- Backend corriendo en test mode: `cd ../part4/bloglist && npm run dev:test`
- Frontend corriendo: `npm run dev` (en bloglist-frontend)

El test runner iniciara ambos servidores automaticamente gracias a la configuracion en `playwright.config.js`.

## Dependencies

- react
- react-dom
- react-bootstrap
- bootstrap
- axios
- @tanstack/react-query

## Notas

- Requiere que el backend de la Parte 4 este corriendo en `http://localhost:3003`
- Autologin habilitado para persistencia de sesion
- Bootstrap para estilos UI

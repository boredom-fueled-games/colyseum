# Colyseum

## Goals

### Game mechanics

- [ ] Finish MVP (still have to think of all the mechanics)

### Implement (code quality) testing libraries

- Add php tests (PhpSpec, Behat)
  - [ ] Behat
  - [ ] PhpSpec
- Add php code quality checks
  - [X] Php-CS-Fixer
  - [X] PhpStan
- [ ] Add js tests (Jest)
- [X] Add js code quality checks (eslint)
- [ ] Add front-end tests (Cypress)

### Implement automated tests using Google actions

- Add php tests (PhpSpec, Behat)
  - [X] Behat
  - [X] PhpSpec
- Add php code quality checks
  - [X] Php-CS-Fixer
  - [X] PhpStan
- [ ] Add js tests (Jest)
- [ ] Add js code quality checks (eslint)
- [ ] Add front-end tests (Cypress)

### Misc

- [ ] Separate code from frameworks/libraries using hexagonal architecture.
- [X] Implement the Mercure protocol in the backend to send push events every time specific entities are changed.
- [ ] Hook into the Mercure pushed events at the frontend to keep it up to date with database changes
- [ ] Change the frontend into a full-on progressive web app

## Installation

Download and build the latest versions of the images:
```bash
docker-compose build --pull --no-cache
```

Start Docker Compose (add `-d` to run in detached mode):
```bash
docker-compose up
```

## Endpoints

- https://localhost
  - Every call with the header `Accept: text/html` will give access to the next.js frontend
  - Calls without this header will give access to the Symfony/Api-platform api.
- https://localhost/docs
  - Api documentation generated by [`swagger-ui`](https://swagger.io/tools/swagger-ui/) 
- https://localhost/.well-known/mercure/ui/
  - Mercure Debugging Tools

## Production command examples

- Backup database: 
  ```bash
  docker-compose exec database pg_dumpall -c -U api | gzip > backup-$(date +"%Y-%m-%d_%H_%M_%S").sql.gz
  ```
  
- Restore database:
  ```bash
  cat {filename}.sql.gz | docker exec -i database psql -U postgres
  ```
  
- (Re)build docker images: 
  ```bash
  docker-compose -f docker-compose.yml -f docker-compose.prod.yml build
  ```
  
- Restart docker images: 
  ```bash
  docker-compose down && docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
  ```

- TIP: Combine commands for minimal downtime redeployment: 
  ```bash
  docker-compose -f docker-compose.yml -f docker-compose.prod.yml build && docker-compose down && docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
  ```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)

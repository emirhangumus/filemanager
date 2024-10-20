up:
	docker compose -f docker-compose.prod.yaml up -d

dev-up:
	docker compose -f docker-compose.dev.yaml up -d

down:
	docker compose -f docker-compose.prod.yaml down

dev-down:
	docker compose -f docker-compose.dev.yaml down

clean:
	docker compose -f docker-compose.prod.yaml down --rmi all --volumes --remove-orphans

clean-dev:
	docker compose -f docker-compose.dev.yaml down --rmi all --volumes --remove-orphans
# Web Application Docker Scaffold

A barebones Docker Compose setup for quickly bootstrapping full-stack web applications. This scaffold provides a complete development environment with a modern tech stack, ready to be customized for your specific project needs.

## Architecture

This scaffold consists of three containerized services:

- **API Service** - Node.js backend application
- **Web Service** - SvelteKit frontend application  
- **Proxy Service** - Nginx reverse proxy server

## Tech Stack

- **Backend**: Node.js
- **Frontend**: SvelteKit
- **Proxy**: Nginx
- **Containerization**: Docker & Docker Compose

## Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd <repository-name>
   ```

2. **Start the application**
   ```bash
   docker-compose up -d
   ```

3. **Access the application**
   - Frontend: `http://localhost` (proxied through Nginx)
   - API: `http://localhost/api` (proxied through Nginx)
   - Direct API access: `http://localhost:3000` (if exposed)

## Services Overview

### API Service (Backend)
- **Technology**: Node.js
- **Purpose**: Handles business logic, data processing, and API endpoints
- **Port**: 3000 (internal)
- **Directory**: `./api`

### Web Service (Frontend)
- **Technology**: SvelteKit
- **Purpose**: User interface and client-side functionality
- **Port**: 5173 (internal)
- **Directory**: `./web`

### Proxy Service (Nginx)
- **Technology**: Nginx
- **Purpose**: Reverse proxy, load balancing, and serving static assets
- **Port**: 80 (exposed)
- **Configuration**: `./nginx/nginx.conf`

## Development

### Prerequisites
- Docker
- Docker Compose

### Environment Setup
1. Copy environment template files (if any)
2. Modify configuration files as needed
3. Customize the services for your specific requirements

### Making Changes
- **API changes**: Edit files in `./api` directory
- **Frontend changes**: Edit files in `./web` directory
- **Proxy configuration**: Modify `./nginx/nginx.conf`

### Rebuilding Services
```bash
# Rebuild all services
docker-compose build

# Rebuild specific service
docker-compose build api
docker-compose build web
docker-compose build proxy
```

### Viewing Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f api
docker-compose logs -f web
docker-compose logs -f proxy
```

## Customization

This scaffold is designed to be easily customizable:

1. **Replace the Node.js API** with your preferred backend framework
2. **Swap SvelteKit** for React, Vue, or any other frontend framework
3. **Modify Nginx configuration** for your routing and proxy needs
4. **Add additional services** like databases, Redis, etc.

## Project Structure

```
.
├── api/                 # Node.js backend service
├── web/                 # SvelteKit frontend service
├── nginx/               # Nginx configuration
│   └── nginx.conf
├── docker-compose.yml   # Service orchestration
└── README.md           # This file
```

## Stopping the Application

```bash
# Stop services
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test the setup
5. Submit a pull request

## License

[Add your preferred license here]

---

**Note**: This is a development scaffold. For production deployment, additional considerations for security, performance, and monitoring should be implemented.
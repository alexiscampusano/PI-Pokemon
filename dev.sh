#!/bin/bash

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}"
cat << "EOF"
╔═══════════════════════════════════════╗
║   🐳 Pokemon App - Docker Dev 🐳     ║
╚═══════════════════════════════════════╝
EOF
echo -e "${NC}"

check_docker() {
    if ! docker info > /dev/null 2>&1; then
        echo -e "${RED}Docker is not running${NC}"
        echo "Please start Docker Desktop first"
        exit 1
    fi
}

setup_env() {
    if [ ! -f .env ]; then
        echo -e "${YELLOW}.env file not found${NC}"
        echo "Creating .env from .env.example..."
        cp .env.example .env
        echo -e "${GREEN}.env file created${NC}"
    fi
}

main() {
    check_docker
    setup_env

    case "${1:-start}" in
        start)
            echo -e "${GREEN}Starting all services...${NC}"
            docker-compose up
            ;;
        
        up)
            echo -e "${GREEN}Starting services in background...${NC}"
            docker-compose up -d
            echo ""
            echo -e "${GREEN}Services started:${NC}"
            echo "   - Frontend: http://localhost:5173"
            echo "   - Backend:  http://localhost:3001"
            echo "   - DB:       localhost:5432"
            echo ""
            echo "View logs: ./dev.sh logs"
            ;;
        
        down)
            echo -e "${YELLOW}Stopping services...${NC}"
            docker-compose down
            ;;
        
        restart)
            echo -e "${YELLOW}Restarting services...${NC}"
            docker-compose restart
            ;;
        
        logs)
            echo -e "${GREEN}Showing logs...${NC}"
            docker-compose logs -f "${2:-}"
            ;;
        
        build)
            echo -e "${GREEN}Rebuilding images...${NC}"
            docker-compose build --no-cache
            ;;
        
        clean)
            echo -e "${RED}Cleaning containers and volumes...${NC}"
            read -p "Are you sure? This will delete the database (y/N): " -n 1 -r
            echo
            if [[ $REPLY =~ ^[Yy]$ ]]; then
                docker-compose down -v
                echo -e "${GREEN}Cleanup completed${NC}"
            else
                echo "Operation cancelled"
            fi
            ;;
        
        psql)
            echo -e "${GREEN}Connecting to PostgreSQL...${NC}"
            docker-compose exec postgres psql -U postgres -d pokemon
            ;;
        
        api)
            echo -e "${GREEN}Accessing API container...${NC}"
            docker-compose exec api sh
            ;;
        
        client)
            echo -e "${GREEN}Accessing Client container...${NC}"
            docker-compose exec client sh
            ;;
        
        status)
            echo -e "${GREEN}Service status:${NC}"
            docker-compose ps
            ;;
        
        help|--help|-h)
            echo "Usage: ./dev.sh [command]"
            echo ""
            echo "Available commands:"
            echo "  start      Start services (with logs)"
            echo "  up         Start services in background"
            echo "  down       Stop services"
            echo "  restart    Restart services"
            echo "  logs       View logs (use 'logs api' for specific service)"
            echo "  build      Rebuild images"
            echo "  clean      Clean everything (including volumes)"
            echo "  psql       Connect to PostgreSQL"
            echo "  api        Access API container"
            echo "  client     Access Client container"
            echo "  status     View service status"
            echo "  help       Show this help"
            ;;
        
        *)
            echo -e "${RED}Unknown command: ${1}${NC}"
            echo "Use './dev.sh help' to see available commands"
            exit 1
            ;;
    esac
}

main "$@"

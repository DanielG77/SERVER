#!/bin/bash
echo "🚀 Iniciando Torneos Backend en modo PRODUCCIÓN"
export BUILD_TARGET=prod
export PROFILE=prod
docker-compose up --build -d
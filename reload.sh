docker-compose -f docker-compose.dev.yml down
sudo rm -r dbteste/
docker-compose -f docker-compose.dev.yml up -d
mvn spring-boot:run
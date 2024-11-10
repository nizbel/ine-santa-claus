# ine-santa-claus
A web app that allows Santa Claus to gather InE's letters

## How to run locally
Use the reload script with `./reload.sh` on the project root

## How to deploy
* Change the nginx configuration to match the current url.
* Run `./build.sh` to generate the new images
* Upload images 
* Run `terraform apply`

## How to remove server once usage is over
Just run `terraform destroy` to end the EC2 instance and the bucket

### Running the first time
After the project is running, hit the endpoint **/init** in order to start the admin user and set up the letters

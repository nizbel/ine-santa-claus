variable "instance_name" {
  description = "Value of the Name tag for the EC2 instance"
  type        = string
  default     = "InE Santa Claus"
}

variable "bucket_name" {
  description = "Value of the Name tag for the S3 bucket"
  type        = string
  default     = "InE Santa Claus Bucket"
}

variable "DOCKER_REGISTRY_USER" {}

variable "DOCKER_REGISTRY_PASS" {}

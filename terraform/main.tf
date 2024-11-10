terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.16"
    }
    cloudinit = {
      source  = "hashicorp/cloudinit"
      version = "2.3.2"
    }
  }

  required_version = ">= 1.2.0"
}

provider "aws" {
  region = "us-east-2"
}


resource "aws_instance" "app_server" {
  ami             = "ami-0d5d9d301c853a04a"
  instance_type   = "t2.micro"
  key_name        = "ine"
  security_groups = ["launch-wizard-4"]

  user_data                   = data.cloudinit_config.cloud_config.rendered
  user_data_replace_on_change = true

  tags = {
    Name = var.instance_name
  }
}

resource "aws_s3_bucket" "bucket" {
  bucket = "ine-santa-claus"
  tags = {
    Name = var.bucket_name
  }
}

resource "aws_s3_bucket_ownership_controls" "bucket" {
  bucket = aws_s3_bucket.bucket.id
  rule {
    object_ownership = "BucketOwnerPreferred"
  }
}

resource "aws_s3_bucket_public_access_block" "bucket" {
  bucket = aws_s3_bucket.bucket.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

resource "aws_s3_bucket_acl" "bucket" {
  depends_on = [
    aws_s3_bucket_ownership_controls.bucket,
    aws_s3_bucket_public_access_block.bucket,
  ]

  bucket = aws_s3_bucket.bucket.id
  acl    = "public-read"
}

data "cloudinit_config" "cloud_config" {
  gzip          = false
  base64_encode = false

  part {
    content_type = "text/cloud-config"
    filename     = "cloud.conf"
    content = yamlencode(
      {
        "write_files" : [
          {
            "path" : "/run/docker-compose.prod.yml",
            "content" : file("docker-compose.prod.yml"),
          },
        ],
      }
    )
  }

  part {
    content_type = "text/cloud-config"
    filename     = "cloud.conf"
    content = templatefile("${path.module}/cloud-init.yaml",
      {
        docker_user = var.DOCKER_REGISTRY_USER
        docker_pass = var.DOCKER_REGISTRY_PASS
    })
  }
}

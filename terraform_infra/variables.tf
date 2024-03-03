variable "aws_region" {
  description = "AWS region"
  default     = "eu-west-2"
}

variable "aws_availability_zone" {
  description = "AWS availability zone"
  default     = "eu-west-2a"
}

variable "aws_ami" {
  description = "AMI ID"
  default     = "ami-0d18e50ca22537278"
}

variable "aws_instance_type" {
  description = "EC2 instance type"
  default     = "t2.nano"
}
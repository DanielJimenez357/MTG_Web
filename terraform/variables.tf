variable "region" {
  description = "AWS region"
  default     = "us-east-1"
}

variable "ami" {
  description = "AMI ID"
  default     = "ami-064519b8c76274859"
}

variable "instance_type" {
  description = "EC2 instance type"
  default     = "t2.micro"
}

variable "key_name" {
  description = "value of the key pair" 
  default = "ClavesMTG_WEB"
}
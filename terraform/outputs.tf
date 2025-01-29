output "instance_id" {
  description = "The ID of the EC2 instance"
  value       = aws_instance.web.id
}

output "instance_public_ip" {
  description = "The public IP address of the EC2 instance"
  value       = aws_instance.web.public_ip
}

output "instance_public_key" {
  description = "The public key of the EC2 instance"
  value       = tls_private_key.example.public_key_openssh
}


output "deployer_private_key" {
  value = tls_private_key.example.private_key_pem
  sensitive = true 
}
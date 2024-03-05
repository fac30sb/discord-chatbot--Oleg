// This is a terraform template to launch the infrastructure and 
// deploy your bot to be available for 24/7 on your Discord chat
// Steps to deploy:
// 1. Install AWS CLI
// 2. Configure AWS (key, access key, region)
// 3. Terraform apply
// 4. SSH to the created instance
// 5. Clone the repository with your bot
// 6. Update config-example.json to use your secrets (OpenAPI key, Bot ID, Server ID)
// 7. Launch PM2 to run the bot at the background on your EC2 server (command `PM2 start`)

provider "aws" {
  profile = "default"
  region  = var.aws_region
}

resource "aws_vpc" "some_custom_vpc" {
  cidr_block = "10.0.0.0/16"

  tags = {
    Name = "Some Custom VPC"
  }
}

resource "aws_subnet" "some_public_subnet" {
  vpc_id            = aws_vpc.some_custom_vpc.id
  cidr_block        = "10.0.1.0/24"
  availability_zone = var.aws_availability_zone

  tags = {
    Name = "Some Public Subnet"
  }
}

resource "aws_internet_gateway" "some_ig" {
  vpc_id = aws_vpc.some_custom_vpc.id

  tags = {
    Name = "Some Internet Gateway"
  }
}

resource "aws_route_table" "public_rt" {
  vpc_id = aws_vpc.some_custom_vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.some_ig.id
  }

  route {
    ipv6_cidr_block = "::/0"
    gateway_id      = aws_internet_gateway.some_ig.id
  }

  tags = {
    Name = "Public Route Table"
  }
}

resource "aws_route_table_association" "public_1_rt_a" {
  subnet_id      = aws_subnet.some_public_subnet.id
  route_table_id = aws_route_table.public_rt.id
}

resource "aws_security_group" "web_sg" {
  name   = "HTTP and SSH"
  vpc_id = aws_vpc.some_custom_vpc.id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = -1
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_instance" "web_instance" {
  ami           = var.aws_ami
  instance_type = var.aws_instance_type
  key_name      = "aws_for_discord"

  subnet_id                   = aws_subnet.some_public_subnet.id
  vpc_security_group_ids      = [aws_security_group.web_sg.id]
  associate_public_ip_address = true

  user_data = <<-EOF
    #!/bin/bash -ex

    # Install Node.js and npm
    sudo apt-get update && sudo apt-get install -y ca-certificates curl gnupg
    curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | sudo gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg
    NODE_MAJOR=20
    echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_$NODE_MAJOR.x nodistro main" | sudo tee /etc/apt/sources.list.d/nodesource.list
    sudo apt-get update && sudo apt-get install nodejs -y

    # Clone the repo
    sudo git clone https://github.com/fac30/discord-chatbot--Oleg-Loza.git /home/ubuntu/discord-chatbot--Oleg-Loza
    cd /home/ubuntu/discord-chatbot--Oleg-Loza

    # Install PM2
    sudo npm install -g pm2

    # Install other dependencies
    sudo npm install

    # Start your application using PM2
    #pm2 start ./discord-chatbot--Oleg-Loza

    # Save PM2 startup configuration
    #pm2 startup systemd -u ubuntu --hp /home/ubuntu

    # Save the current PM2 process list
    # pm2 save

    # Ensure PM2 restarts on system reboot
    sudo systemctl enable pm2-ubuntu

  EOF

  tags = {
    "Name" : "ec2_in_london_for_discord"
  }
}


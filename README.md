# Graduation Project

## Environment preparation
### VSCode
#### Download & Installation
https://code.visualstudio.com/docs/?dv=win64user

#### Install Necessary extensions
- Python
- ES7+ React/Redux/React-Native snippets
- Vim (Optional)

### Git & Github
#### Dowload & Installation
https://git-scm.com/download/win

#### Configuration
Open cmd
```bash
cd DoAn2024
git config user.name "HuyVu-BOT"
git config user.email "vuducuy6301@gmail.com"
```
### MySQL
#### Download & Install
MySQL Community Server
https://dev.mysql.com/downloads/mysql/

MySQL Workbench
https://dev.mysql.com/downloads/workbench/

#### Configuration
MySQL Configurator (MySQL Community Server)
- MySQL Root Password: abc@123
- User Account: huyvu/123456

#### Import schema using MySQL Workbench
Server -> Data import -> Import from Self-Contained file -> Choose `graduation_project.sql`

### Anaconda
#### Installation
https://docs.anaconda.com/free/miniconda/

#### Python environment
Open cmd
```bash
conda create -n doan python==3.8
conda activate doan
# conda install nvidia/label/cuda-11.5.0::cuda
cd DoAn2024/backend/app
pip install -r requirements.txt
python main.py
```
#### CUDA 
### NodeJS
#### Installation
https://nodejs.org/en/download/current


## Backend
Open cmd
```bash
conda activate doan
cd backend
pip3 install -r requirements.txt
```

Generate JWT token
```bash
openssl genpkey -algorithm RSA -out auth/jwtRS256_private.pem -pkeyopt rsa_keygen_bits:2048
openssl rsa -in auth/jwtRS256_private.pem -pubout -out auth/jwtRS256_public.pem
```
## Fronend
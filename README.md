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
Open Terminal
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
Open Terminal
```bash
conda create -n doan python==3.9
conda activate doan
conda install nvidia/label/cuda-11.5.0::cuda
cd DoAn2024/backend/app
pip install -r requirements.txt
```
#### CUDA 
### NodeJS
#### ReactJS
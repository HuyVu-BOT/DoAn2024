# Graduation Project

## Environment preparation
### VSCode
#### Download & Installation
https://code.visualstudio.com/docs/?dv=win64user

#### Install Necessary extensions
- Python
- Pylance
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
- MySQL Root Password: abcd@1234
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
cd DoAn2024/backend/app
python -m pip install -r requirements.txt
```

### NodeJS
#### Installation
https://nodejs.org/en/download/current

#### Install node packages
Open cmd/terminal
```bash
cd frontend
npm i
```

## Run
### Backend
Open cmd/terminal
```bash
conda activate doan
cd backend
python main.py
```

### Fronend
Open cmd/terminal
```bash
cd frontend
npm run dev
```


## References:

Face Recognition library: https://github.com/ageitgey/face_recognition
Sort tracking: https://github.com/abewley/sort

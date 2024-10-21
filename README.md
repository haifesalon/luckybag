# Haife Luckybag Project

## Run Backend

```console
$ cd backend
$ npm install #first
$ npm run start
```

```
http://localhost:3000/api
```

## Run Frontend

```console
$ cd frontend
$ npm install #first
$ npm run start
```

```
http://localhost:8081/draw/home?code=XXXXXXXXXXXXXXXX
```

## Server

- Engine: Azure VM
- OS: Ubuntu 22.04
- Size: Standard B2s (2 vcpu，4 GiB Ram)
- Location: Southeast Asia
- Host: haifesalon.southeastasia.cloudapp.azure.com
- User: haife

## Database

- Engine: Microsoft SQL Server 2022
- DB Name: Haife
- Host: haifesalon.southeastasia.cloudapp.azure.com
- Port: 1433

## Install and Setup Database

```console
$ curl -fsSL https://packages.microsoft.com/keys/microsoft.asc | sudo gpg --dearmor -o /usr/share/keyrings/microsoft-prod.gpg

$ curl -fsSL https://packages.microsoft.com/config/ubuntu/22.04/mssql-server-2022.list | sudo tee /etc/apt/sources.list.d/mssql-server-2022.list

$ sudo apt-get update

$ sudo apt-get install -y mssql-server

$ sudo /opt/mssql/bin/mssql-conf setup

$ systemctl status mssql-server --no-pager
```

## Automatically Generate Models (Sequelize-Auto)

```
$ cd backend
$ ./node_modules/.bin/sequelize-auto -o "./model" -d Haife -h localhost -u haifeadmin -p 1433 -x haifeP@ssW0rd -e mssql --cm c --cp c --cf l -v -l es6 --useDefine es6 -T database_firewall_rules

Options:
    -o, What directory to place the models.
    -d, Database name.
    -h, IP/Hostname for the database.
    -u, Username for database.
    -p, Port number for database.
    -x, Password for database.
    -e, The dialect/engine that you're using: postgres, mysql, sqlite, mssql
    -v, Include database views in generated models.
    -l, Language for Model output: es5|es6|esm|ts
    --cf, Set case of file names: c|l|o|p|u|k
    --cp, Set case of property names: c|l|o|p|u
    --cm, Set case of model names: c|l|o|p|u
        c = camelCase
        l = lower_case
        o = original
        p = PascalCase
        u = UPPER_CASE
        k = kebab-case
```

## Open Source

Sensitive parameter information has been removed.
This project was fully developed by Samuel Chi.
Copyright (c) 2024 Haife Salon All rights reserved.

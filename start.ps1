# Define as variáveis de ambiente
# Solicitar ao usuário as informações do banco de dados
$_host = Read-Host -Prompt 'Insira o host do banco de dados'
$port = Read-Host -Prompt 'Insira a porta do banco de dados'
$user = Read-Host -Prompt 'Insira o nome de usuário do banco de dados'
$db = Read-Host -Prompt 'Insira o nome da Database'
$password = Read-Host -Prompt 'Insira a senha do banco de dados' -AsSecureString

# Converter a senha segura de volta para texto simples
$BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($password)
$password = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)

# Definir as variáveis de ambiente
$env:NODE_ENV = "development"
$env:DB_HOST = $_host
$env:DB_PORT = $port
$env:DB_USER = $user
$env:DB_PASSWORD = $password
$env:DB_DATABASE = $db

# Instala as dependencias
npm install

# Inicia o servidor
npx nodemon server.js

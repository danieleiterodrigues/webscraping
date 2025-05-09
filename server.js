const express = require('express');
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

app.use(express.json());

// Diretório para salvar os screenshots
const screenshotsDir = path.join(__dirname, 'prints');

// Cria a pasta se ela não existir
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir);
}

// Função que tira o print da página e salva em arquivo
async function printScreen() {
  try {
    const browser = await puppeteer.launch({ 
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']});
    const page = await browser.newPage();

    // Acessa a URL desejada
    await page.goto('https://www.netflix.com/login');
    console.log('Abriu o navegador e acessou a Netflix');

    // Define o caminho para salvar a imagem
    const timestamp = Date.now();
    const filePath = path.join(screenshotsDir, `screenshot-${timestamp}.png`);

    // Salva o screenshot no arquivo
    await page.screenshot({ path: filePath });
    console.log(`Screenshot salvo em: ${filePath}`);

    // Fecha o navegador
    await browser.close();

    return filePath;
  } catch (error) {
    console.error('Erro ao tirar o screenshot:', error);
    throw error;
  }
}

// Endpoint '/' Inicial
app.get('/', async (req, res) => {
  try {
    // Gera o screenshot e retorna o caminho do arquivo
    const fileName = await printScreen();

    // Retorna o arquivo como resposta
    const fileUrl = `{${req.protocol}}://${req.get('host')}/screenchots/${fileName}`;
    res.json({ url: fileUrl });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao gerar o screenshot' });
  }
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

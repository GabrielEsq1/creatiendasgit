const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
    const browser = await puppeteer.launch({
        headless: false,
        args: ['--start-maximized']
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });

    try {
        console.log('Navegando al builder...');
        await page.goto('http://localhost:3000/builder', { waitUntil: 'networkidle0' });

        console.log('Llenando formulario de tienda...');

        // Llenar nombre de tienda
        await page.waitForSelector('input[value="Mi Nueva Tienda"]');
        await page.click('input[value="Mi Nueva Tienda"]');
        await page.keyboard.press('Control');
        await page.keyboard.press('KeyA');
        await page.keyboard.release('Control');
        await page.type('input[value="Mi Nueva Tienda"]', 'Tienda Demo QR Test', { delay: 50 });

        // Llenar WhatsApp
        const whatsappInputs = await page.$$('input');
        for (let input of whatsappInputs) {
            const placeholder = await input.evaluate(el => el.previousElementSibling?.textContent);
            if (placeholder && placeholder.includes('WhatsApp')) {
                await input.click();
                await input.type('573001234567', { delay: 50 });
                break;
            }
        }

        // Scroll down para ver el botón de productos
        await page.evaluate(() => window.scrollBy(0, 500));
        await page.waitForTimeout(500);

        console.log('Guardando la tienda...');

        // Click en el botón de guardar
        const buttons = await page.$$('button');
        for (let button of buttons) {
            const text = await button.evaluate(el => el.textContent);
            if (text.includes('Validar') || text.includes('Crear Tienda')) {
                await button.click();
                break;
            }
        }

        console.log('Esperando que aparezca el QR...');

        // Esperar a que aparezca el mensaje de éxito
        await page.waitForFunction(() => {
            return document.body.textContent.includes('¡Tu tienda está lista!');
        }, { timeout: 15000 });

        await page.waitForTimeout(2000);

        // Scroll para ver todo el QR
        await page.evaluate(() => {
            const successBox = document.querySelector('.public-url-box');
            if (successBox) {
                successBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        });

        await page.waitForTimeout(1000);

        console.log('Capturando screenshot del QR...');

        const screenshotPath = path.join('C:', 'Users', 'ASUS', '.gemini', 'antigravity', 'brain', '03a6a509-83bc-4cb0-ae50-eaa9875f7bb9', 'qr_validation.png');

        // Capturar solo la sección de éxito con el QR
        const successBox = await page.$('.public-url-box');
        if (successBox) {
            await successBox.screenshot({ path: screenshotPath });
            console.log('Screenshot guardado en:', screenshotPath);
        } else {
            // Si no encuentra el box específico, captura toda la página
            await page.screenshot({ path: screenshotPath, fullPage: true });
            console.log('Screenshot completo guardado en:', screenshotPath);
        }

    } catch (error) {
        console.error('Error:', error.message);

        // Captura screenshot del error
        const errorPath = path.join('C:', 'Users', 'ASUS', '.gemini', 'antigravity', 'brain', '03a6a509-83bc-4cb0-ae50-eaa9875f7bb9', 'error_screenshot.png');
        await page.screenshot({ path: errorPath, fullPage: true });
        console.log('Screenshot de error guardado en:', errorPath);
    }

    console.log('Cerrando navegador en 3 segundos...');
    await page.waitForTimeout(3000);
    await browser.close();
})();

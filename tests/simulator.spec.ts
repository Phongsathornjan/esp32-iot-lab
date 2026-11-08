import { expect, test } from '@playwright/test'

test('complete simulator workflow stays synchronized and error free', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()) })

  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'EXPLORE THE WORLD OF IoT' })).toBeVisible()
  await expect(page.getByText('Initializing virtual laboratory')).toHaveCount(0, { timeout: 60000 })
  await page.screenshot({ path: 'artifacts/desktop-hero.png' })

  await page.getByRole('button', { name: 'Connection diagram', exact: true }).click()
  await expect(page.getByRole('img', { name: 'ESP32 circuit connection schematic' })).toBeVisible()
  await page.getByRole('button', { name: 'GPIO mapping', exact: true }).click()
  await expect(page.getByText('Pin map & live logic')).toBeVisible()
  await page.getByRole('button', { name: 'Physical wiring', exact: true }).click()
  await expect(page.getByRole('button', { name: 'Reset camera' })).toBeVisible()

  const ledTab = page.getByRole('tab', { name: 'LED Control' })
  const relayTab = page.getByRole('tab', { name: '5V Relay' })
  const dashboardTab = page.getByRole('tab', { name: 'Live Dashboard' })
  const networkTab = page.getByRole('tab', { name: 'Wi-Fi Network' })
  const red = page.getByRole('switch', { name: 'red LED', exact: true })
  await expect(red).toBeVisible()
  await expect(red).toHaveAttribute('aria-checked', 'false')
  await red.click()
  await expect(red).toHaveAttribute('aria-checked', 'true')

  await relayTab.click()
  const relay = page.getByRole('switch', { name: 'Relay power' })
  await relay.click()
  await expect(relay).toHaveAttribute('aria-checked', 'true')
  await expect(page.getByText('Coil energized', { exact: true })).toBeVisible()
  await expect(networkTab).toBeVisible()

  await dashboardTab.click()
  await expect(page.getByLabel('Target temperature')).toBeVisible()
  await expect(page.getByText('SHT31 live telemetry')).toBeVisible()

  await networkTab.click()
  await page.getByRole('button', { name: 'Disconnect', exact: true }).click()
  await expect(page.getByText('Remote link unavailable')).toBeVisible()
  await expect(page.getByText('Remote controls locked. Open the Wi-Fi Network tab to reconnect.')).toBeVisible()
  await ledTab.click()
  await expect(red).toBeDisabled()
  await networkTab.click()
  await page.getByRole('button', { name: 'Connect to ESP32-IOT', exact: true }).click()
  await expect(page.getByRole('button', { name: 'Disconnect', exact: true })).toBeVisible({ timeout: 5000 })
  await ledTab.click()
  await expect(red).toBeEnabled()

  await page.getByRole('button', { name: 'Start sequence', exact: true }).click()
  await expect(red).toHaveAttribute('aria-checked', 'true')
  await page.getByLabel('red duration in seconds').fill('1')
  await expect(page.getByRole('switch', { name: 'yellow LED', exact: true })).toHaveAttribute('aria-checked', 'true', { timeout: 4000 })
  await page.getByRole('button', { name: 'Stop sequence', exact: true }).click()

  await page.getByRole('button', { name: 'Run scenario', exact: true }).click()
  await expect(page.getByText('Transmitting…')).toBeVisible()
  await expect(page.getByText('Run scenario', { exact: true })).toBeVisible({ timeout: 10000 })

  await page.getByRole('button', { name: /03 How LEDs Work/ }).click()
  await page.getByRole('button', { name: 'Switch the LEDs', exact: true }).click()
  await expect(page.getByText(/Red LED is now/)).toBeVisible()
  await page.getByRole('button', { name: 'Mark complete', exact: false }).click()
  await expect(page.getByRole('heading', { name: 'What is a Relay?' })).toBeVisible()

  await page.locator('#quiz').scrollIntoViewIfNeeded()
  const correctAnswers = ['GPIO 25', 'I2C', '192.168.4.1', '3.3 V', 'To switch a separate electrical circuit using a control signal', 'Yes, because the browser and ESP32 communicate directly on the local network']
  for (let index = 0; index < correctAnswers.length; index++) {
    await page.getByRole('button', { name: new RegExp(`^[A-C] ${correctAnswers[index].replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`) }).click()
    await expect(page.getByText('Correct — well done.')).toBeVisible()
    await page.getByRole('button', { name: index === correctAnswers.length - 1 ? 'View final score' : 'Next question' }).click()
  }
  await expect(page.getByText('Perfect circuit knowledge.')).toBeVisible()
  await expect(page.locator('#quiz').getByText('100%', { exact: true })).toBeVisible()
  expect(errors).toEqual([])
})

test('mobile navigation and controls remain usable', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')
  await expect(page.getByText('Initializing virtual laboratory')).toHaveCount(0, { timeout: 60000 })
  await page.screenshot({ path: 'artifacts/mobile-hero.png' })
  await page.getByRole('button', { name: 'Toggle menu' }).click()
  await page.getByRole('banner').getByRole('button', { name: 'Dashboard', exact: true }).click()
  await expect(page.getByText('Live IoT Dashboard', { exact: true })).toBeVisible()
  await page.getByRole('tab', { name: 'LED Control' }).click()
  const green = page.getByRole('switch', { name: 'green LED', exact: true })
  await expect(green).toBeVisible()
  await green.click()
  await expect(green).toHaveAttribute('aria-checked', 'false')
  await page.waitForTimeout(900)
  await page.screenshot({ path: 'artifacts/mobile-control-deck.png' })
})

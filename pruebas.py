import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.alert import Alert
driver = webdriver.Chrome()
driver.get("http://localhost:4200/login")
time.sleep(2)
username = driver.find_element(By.NAME, "email")
username.send_keys("admin@seguros.com")
time.sleep(2)
password = driver.find_element(By.CLASS_NAME, "password")
password.send_keys("0810")
time.sleep(2)
btnIniciar = driver.find_element(By.CLASS_NAME, "login-button")
btnIniciar.click()
time.sleep(2)
menu_item = driver.find_element(By.LINK_TEXT, "Usuarios")
menu_item.click()
time.sleep(2)

time.sleep(2)
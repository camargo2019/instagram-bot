"""
    Gabriel CMR - Desenvolvimentos
     Bot de Instagram de Contas
"""


import os
import json
from time import sleep
from selenium import webdriver
from selenium.webdriver.common.proxy import *
from includes.names import *
import random
from datetime import date
from fake_useragent import UserAgent
from selenium.webdriver.firefox.firefox_binary import FirefoxBinary

def start_browser(myProxy=None, System=None):
    if myProxy:
        webdriver.DesiredCapabilities.FIREFOX['proxy'] = {
            "httpProxy": myProxy,
            "sslProxy": myProxy,
            "proxyType": "MANUAL"
        }
    webdriver.DesiredCapabilities.FIREFOX['marionette'] = False
    useragent = UserAgent().random
    profile = webdriver.FirefoxProfile()
    profile.set_preference("general.useragent.override", useragent)
    profile.set_preference("browser.tabs.remote.autostart", False)
    profile.set_preference("browser.tabs.remote.autostart.1", False)
    profile.set_preference("browser.tabs.remote.autostart.2", False)
    options = webdriver.FirefoxOptions()
    options.add_argument('--headless')
    options.add_argument('--no-sandbox')
    options.add_argument("--start-maximized")
    options.add_argument("--disable-infobars")
    options.add_argument("--disable-extensions")
    dir_path = os.path.dirname(os.path.realpath(__file__))
    if System == "Linux":
        os.environ["webdriver.firefox.driver"] = dir_path+"/drivers/geckodriver"
        binary = FirefoxBinary(dir_path+"/firefox/firefox")
        browser = webdriver.Firefox(firefox_binary=binary, firefox_profile=profile, options=options, executable_path=dir_path+"/drivers/geckodriver")
    else:
        binary = FirefoxBinary(dir_path+"/firefox/exe/firefox.exe")
        browser = webdriver.Firefox(firefox_binary=binary, firefox_profile=profile, options=options, executable_path=dir_path+"/drivers/geckodriver.exe")
    browser.implicitly_wait(1)
    browser.execute_script('window.open("https://google.com.br", "_blank");')
    #browser.install_addon(dir_path+"/includes/buster_captcha_solver_for_humans-1.2.2-an+fx.xpi", temporary=True)
    return browser

def stop_browser(browser):
    browser.quit()

def configs():
    dir_path = os.path.dirname(os.path.realpath(__file__))
    with open(dir_path+"/includes/config.json", "r") as data:
        output_config = json.load(data)
    return output_config

def save_config(email, name, username, password):
    dir_path = os.path.dirname(os.path.realpath(__file__))
    timestamp = str(date.today())
    with open(dir_path+'/output/'+timestamp+'.txt', 'a+') as file:
        file.write('E-mail: '+str(email)+' | Name: '+str(name)+' | Username: '+str(username)+' | Senha: '+str(password)+'\n')

def proxy_eleatorio():
    dir_path = os.path.dirname(os.path.realpath(__file__))
    addLinha = 0
    atualLine = 1
    with open(dir_path+'/includes/proxy.txt', 'r') as file:
        for line in file:
            addLinha = int(addLinha+1)
    rangeline = random.randint(1,addLinha)
    outputstring = False
    with open(dir_path+'/includes/proxy.txt', 'r') as file:
        for line in file:
            atualLine = int(atualLine+1)
            if(atualLine == rangeline):
                outputstring = line

    return outputstring
try:
    system = str(input("Qual seu Sistema Operacional? (Windows/Linux) "))
    contasCriar = int(input("Quantas contas você quer criar? "))
except:
    pass
if True:
    for i in range(contasCriar):
        if True:
            config = configs()
            proxy = proxy_eleatorio()
            browser = start_browser(proxy, system)
            browser.switch_to.window(browser.window_handles[0])
            browser.get(config["url_cpanel"])
            sleep(0.5)
            for value in config["login_cpanel"]:
                browser.find_element_by_xpath('//input[@id="user"]').send_keys(value)
                sleep(0.1)

            for value in config["senha_cpanel"]:
                browser.find_element_by_xpath('//input[@id="pass"]').send_keys(value)
                sleep(0.1)

            browser.find_element_by_xpath('//button[@id="login_submit"]').click()
            sleep(1)
            browser.find_element_by_xpath('//a[@id="item_email_accounts"]').click()
            sleep(1)
            browser.find_element_by_xpath('//button[@id="btnCreateEmailAccount"]').click()
            sleep(0.5)
            result_username = username()
            result_password = generatePassword()

            for value in result_username:
                browser.find_element_by_xpath('//input[@id="txtUserName"]').send_keys(value)
                sleep(0.1)

            for value in result_password:
                browser.find_element_by_xpath('//input[@id="txtEmailPassword"]').send_keys(value)
                sleep(0.1)

            browser.find_element_by_xpath('//input[@id="stay"]').click()
            sleep(0.3)
            browser.find_element_by_xpath('//button[@id="btnCreateEmailAccount"]').click()
            sleep(0.3)

            browser.switch_to.window(browser.window_handles[1])

            browser.get("https://www.instagram.com/")
            sleep(1)
            browser.find_element_by_xpath('//a[@href="/accounts/emailsignup/"]').click()

            result_email = str(result_username)+"@"+config["domain_cpanel"]
            result_name = generatingName()

            result_username2 = str(result_username)+"_"+str(random.randint(1990,2999))+"_"+str(random.randint(1,30))
            sleep(0.3)
            for value in result_email:
                browser.find_element_by_xpath('//input[@name="emailOrPhone"]').send_keys(value)
                sleep(0.2)

            for value in result_name:
                browser.find_element_by_xpath('//input[@name="fullName"]').send_keys(value)
                sleep(0.2)

            for value in result_username2:
                browser.find_element_by_xpath('//input[@name="username"]').send_keys(value)
                sleep(0.2)

            for value in result_password:
                browser.find_element_by_xpath('//input[@name="password"]').send_keys(value)
                sleep(0.2)
            sleep(1)
            browser.find_element_by_xpath('//button[@type="submit"]').click()
            sleep(1)
            year = list(range(1973, 2003))
            month = list(range(1,12))
            day = list(range(1,28))
            try:
                browser.find_element_by_xpath('//select[@title="Mês:"]').click()
            except:
                browser.find_element_by_xpath('//select[@title="Month:"]').click()
            sleep(0.3)
            browser.find_element_by_xpath('//option[@value="'+str(random.choice(month))+'"]').click()
            sleep(0.1)
            try:
                browser.find_element_by_xpath('//select[@title="Dia:"]').click()
            except:
                browser.find_element_by_xpath('//select[@title="Day:"]').click()
            sleep(0.3)
            browser.find_element_by_xpath('//option[@value="'+str(random.choice(day))+'"]').click()
            sleep(0.1)
            try:
                browser.find_element_by_xpath('//select[@title="Ano:"]').click()
            except:
                browser.find_element_by_xpath('//select[@title="Year:"]').click()            
            sleep(0.3)
            browser.find_element_by_xpath('//option[@value="'+str(random.choice(year))+'"]').click()
            sleep(0.5)
            try:
                browser.find_element_by_xpath('//button[contains(text(),"Avançar")]').click()
            except:
                browser.find_element_by_xpath('//button[contains(text(),"Next")]').click()
            browser.switch_to.window(browser.window_handles[0])
            browser.get(config["url_webmail"])

            for value in result_email:
                browser.find_element_by_xpath('//input[@id="user"]').send_keys(value)
                sleep(0.1)

            for value in result_password:
                browser.find_element_by_xpath('//input[@id="pass"]').send_keys(value)
                sleep(0.1)

            browser.find_element_by_xpath('//button[@id="login_submit"]').click()
            sleep(0.1)
            try:
                browser.find_element_by_xpath('//button[@id="launchActiveButton"]').click()
            except:
                pass
            sleep(1)
            while True:
                try:
                    browser.find_element_by_xpath('//span[@title="no-reply@mail.instagram.com"]').click()
                    break
                except:
                    browser.execute_script("location.reload();")
                    sleep(5)
            sleep(1)
            while True:
                try:
                    codigo = browser.find_element_by_xpath('//a[@onclick="return rcube_event.keyboard_only(event)"]').text
                    break
                except:
                    sleep(0.2)

            browser.switch_to.window(browser.window_handles[1])
            sleep(0.5)
            codigo2 = codigo[0:6]
            for value in str(codigo2):
                browser.find_element_by_xpath('//input[@name="email_confirmation_code"]').send_keys(value)
                sleep(0.1)
            sleep(0.5)
            try:
                browser.find_element_by_xpath('//button[contains(text(),"Avançar")]').click()
            except:

                browser.find_element_by_xpath('//button[contains(text(),"Next")]').click()
            save_config(result_email, result_name, result_username2, result_password)
            sleep(1)
            print("Conta criada com sucesso!")
        else:
            print("Erro em criar uma conta! || Proxy Error ||")
        sleep(5)
else:
    print("Coloque todas as informações! | Não force o fechamento!")
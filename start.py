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

def UserAgent():
    dir_path = os.path.dirname(os.path.realpath(__file__))
    addLinha = 0
    atualLine = 1
    with open(dir_path+'/includes/useragent.txt', 'r') as file:
        for line in file:
            addLinha = int(addLinha+1)
    rangeline = random.randint(1,addLinha)
    outputstring = False
    with open(dir_path+'/includes/useragent.txt', 'r') as file:
        for line in file:
            atualLine = int(atualLine+1)
            if(atualLine == rangeline):
                outputstring = line

    return outputstring

def start_browser(myProxy=None, System=None):
    useragent = UserAgent()
    dir_path = os.path.dirname(os.path.realpath(__file__))
    path = dir_path+"/includes/extension/"
    options = webdriver.ChromeOptions()
    #options.add_argument('--headless')
    #options.add_argument('--no-sandbox')
    #options.add_argument(--start-maximized")
    options.add_argument(f'user-agent={useragent}')
    #options.add_argument('--disable-notifications')
    options.add_argument('--window-size=900,768')
    options.add_argument(f"--load-extension={path}")
    #options.add_argument('--blink-settings=imagesEnabled=false')
    #options.add_argument("--mute-audio")
    #options.add_argument("--disable-extensions")
    #options.add_argument("--log-level=3")
    if myProxy:
        options.add_argument('--proxy-server=%s' % myProxy)
    
    if System == "Linux":
        #options.binary_location = dir_path+"/chrome/linux/chrome"
        #options.add_argument('--disable-dev-shm-usage')
        browser = webdriver.Chrome(options=options)
    else:
        options.binary_location = dir_path+"\\chrome\\chrome.exe"
        options.add_argument("--log-level=3")
        browser = webdriver.Chrome(executable_path=dir_path+'\\drivers\\chromedriver.exe', options=options)
    browser.implicitly_wait(10)
    #browser.install_addon(dir_path+"/includes/buster_captcha_solver_for_humans-1.2.2-an+fx.xpi",return
    return browser

def stop_browser(browser):
    browser.quit()

def configs():
    dir_path = os.path.dirname(os.path.realpath(__file__))
    with open(dir_path+"/includes/config.json", "r") as data:
        output_config = json.load(data)
    return output_config

def save_config(email, password):
    dir_path = os.path.dirname(os.path.realpath(__file__))
    timestamp = str(date.today())
    with open(dir_path+'/output/'+timestamp+'.txt', 'a+') as file:
        #file.write('E-mail: '+str(email.strip())+' | Name: '+str(name.strip())+' | Username: '+str(username.strip())+' | Senha: '+str(password.strip())+'\n')
        file.write(''+str(email.strip())+'|'+str(password.strip())+'\n')

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

def criar_email(system):
    config = configs()
    print("\33[32m => Iniciando browser limpo, para criar o e-mail!")
    browser = start_browser('', system)
    browser.switch_to.window(browser.window_handles[0])
    while True:
        try:
            browser.get(config["url_cpanel"])
            break
        except:
            print("\33[32m Erro em conectar com o site!")
    sleep(0.5)

    while True:
        try:
            for value in config["login_cpanel"]:
                browser.find_element_by_xpath('//input[@id="user"]').send_keys(value)
                sleep(0.1)
            break
        except:
            print("\33[32m Erro em digitar o usuário do cpanel!")
    
    while True:
        try:
            for value in config["senha_cpanel"]:
                browser.find_element_by_xpath('//input[@id="pass"]').send_keys(value)
                sleep(0.1)
            break
        except:
            print("\33[31m Erro em digitar a senha do cpanel!")

    while True:
        try:
            browser.find_element_by_xpath('//button[@id="login_submit"]').click()
            sleep(5)
            break
        except:
            print("\33[31m Erro em logar no cpanel!")
    
    while True:
        try:
            browser.execute_script("location.replace('email_accounts/index.html')")
            sleep(3)
            break
        except:
            print("\33[31m Erro em acesssar a url do e-mail!")
    
    while True:
        try:
            browser.find_element_by_xpath('//button[@id="btnCreateEmailAccount"]').click()
            sleep(5)
            break
        except:
            print("\33[31m Erro em clicar em criar conta!")
    
    result_username = username()
    result_password = generatePassword()

    while True:
        try:
            for value in result_username:
                browser.find_element_by_xpath('//input[@id="txtUserName"]').send_keys(value)
                sleep(0.1)
            break
        except:
            print("\33[31m Erro em digitar o usuário do e-mail!")

    while True:
        try:
            for value in result_password:
                browser.find_element_by_xpath('//input[@id="txtEmailPassword"]').send_keys(value)
                sleep(0.1)
            break
        except:
            print("\33[31m Erro em digitar a senha do e-mail!")

    while True:
        try:
            browser.find_element_by_xpath('//input[@id="stay"]').click()
            break
        except:
            print("\33[31m Erro em clicar em criar conta!")
    
    sleep(0.5)

    while True:
        try:
            browser.find_element_by_xpath('//button[@id="btnCreateEmailAccount"]').click()
            break
        except:
            print('\33[31m Erro em clicar no botão de confirmar!')
    sleep(5)
    print('\33[32m => Conta de e-mail criada!')
    # Finalizar Browser
    stop_browser(browser)
    
    dados = []
    dados.append(str(result_username))
    dados.append(str(result_password))

    return dados

def confirmar_email(system, email, senha):
    config = configs()
    print("\33[27m")
    print("\33[32m => Iniciando browser limpo, para confirmar o e-mail!")
    browser = start_browser('', system)
    browser.switch_to.window(browser.window_handles[0])
    while True:
        try:
            browser.get(config["url_webmail"])
            break
        except:
            print("\33[32m Erro em conectar com o site!")
    sleep(0.5)
    
    while True:
        try:
            for value in email:
                browser.find_element_by_xpath('//input[@id="user"]').send_keys(value)
                sleep(0.1)
            break
        except:
            print("\33[32m Erro em digitar o usuário!")
        
    while True:
        try:
            for value in senha:
                browser.find_element_by_xpath('//input[@id="pass"]').send_keys(value)
                sleep(0.1)
            break
        except:
            print("\33[31m Erro em digitar a senha!")
        
    while True:
        try:
            browser.find_element_by_xpath('//button[@id="login_submit"]').click()
            sleep(5)
            break
        except:
            print("\33[31m Erro em clicar em logar!")
    
    while True:
        try:
            try:
                browser.find_element_by_xpath('//button[contains(text(),"Open")]').click()
            except:
                browser.find_element_by_xpath('//button[contains(text(),"Abrir")]').click()
            break
        except:
            print("\33[31m Erro em clicar em Open!")
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
    sleep(2)

    #finaliza o browser
    stop_browser(browser)

    return codigo[0:6]


try:
    #system = str(input("Qual seu Sistema Operacional? (Windows/Linux) "))
    system = str("Linux")
    contasCriar = int(input("Quantas contas você quer criar? "))
except:
    pass


print("\33[27m")
print("\33[90m ===============================================================")
print("\33[27m")

try:
    for i in range(contasCriar):
        try:
            # Carregar informações
            config = configs()
            proxy = proxy_eleatorio()

            # Criar o e-mail
            dados_email = criar_email(system)
            result_username = dados_email[0]
            result_password = dados_email[1]

            # Instagram Criar Conta

            browser = start_browser(proxy, system)
            browser.switch_to.window(browser.window_handles[0])

            print("\33[27m")
            print("\33[32m => Começando criar conta no instagram!")

            while True:
                try:
                    browser.get("https://www.instagram.com/")
                    break
                except:
                    print("\33[31m Erro em tentar conectar ao site!")
            sleep(0.1)

            # Caso tiver aceitação de Cookies
            try:
                browser.find_element_by_xpath('//button[contains(text(),"Accept All")]').click()
                sleep(1)
            except:
                try:
                    browser.find_element_by_xpath('//button[contains(text(),"Aceitar tudo")]').click()
                    sleep(1)
                except:
                    pass
            
            while True:
                try:
                    browser.find_element_by_xpath('//button[contains(text(), "Cadastre-se")]').click()
                    break
                except:
                    print("\33[31m Erro em carregar a pagina de cadastro!")
            sleep(1)

            result_email = str(result_username)+"@"+config["domain_cpanel"]
            result_name = generatingName()+" "+generatingSurName()
            result_username2 = str(result_username)+"_"+str(random.randint(1990,2999))+"_"+str(random.randint(1,30))
            sleep(0.3)
            

            while True:
                try:
                    browser.find_element_by_xpath('//span[contains(text(), "Email")]').click()
                    break
                except:
                    print("\33[31m Erro em clicar em e-mail!")

            while True:
                try:
                    for value in result_email:
                        browser.find_element_by_xpath('//input[@name="email"]').send_keys(value)
                        sleep(0.2)
                    break
                except:
                    print("\33[31m Erro em digitar o email!")
            
            try:
                try:
                    browser.find_element_by_xpath('//button[contains(text(),"Seguinte")]').click()
                except:
                    browser.find_element_by_xpath('//button[contains(text(),"Avançar")]').click()
            except:
                try:
                    browser.find_element_by_xpath('//button[contains(text(),"Next")]').click()
                except:
                    browser.find_element_by_xpath('//button[contains(text(),"Cadastre-se")]').click()

            codigo2 = confirmar_email(system, result_email, result_password)

            while True:
                try:
                    for value in str(codigo2):
                        browser.find_element_by_xpath('//input[@name="emailConfirmationCode"]').send_keys(value)
                        sleep(0.2)
                    break
                except:
                    print("\33[31m Erro em digitar o codigo!")

            sleep(2)
            try:
                try:
                    browser.find_element_by_xpath('//button[contains(text(),"Seguinte")]').click()
                except:
                    browser.find_element_by_xpath('//button[contains(text(),"Avançar")]').click()
            except:
                try:
                    browser.find_element_by_xpath('//button[contains(text(),"Next")]').click()
                except:
                    browser.find_element_by_xpath('//button[contains(text(),"Cadastre-se")]').click()

            sleep(10)

            while True:
                try:
                    for value in result_name:
                        browser.find_element_by_xpath('//input[@name="fullName"]').send_keys(value)
                        sleep(0.2)
                    break
                except:
                    print("\33[31m Erro em digitar o nome completo!")
            sleep(3)

            while True:
                try:
                    for value in result_password:
                        browser.find_element_by_xpath('//input[@name="password"]').send_keys(value)
                        sleep(0.2)
                    break
                except:
                    print("\33[31m Erro em digitar a senha")
            try:
                try:
                    browser.find_element_by_xpath('//button[contains(text(),"Seguinte")]').click()
                except:
                    browser.find_element_by_xpath('//button[contains(text(),"Avançar")]').click()
            except:
                try:
                    browser.find_element_by_xpath('//button[contains(text(),"Next")]').click()
                except:
                    browser.find_element_by_xpath('//button[contains(text(),"Cadastre-se")]').click()

            sleep(8)
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
            sleep(1)
            try:
                try:
                    browser.find_element_by_xpath('//button[contains(text(),"Seguinte")]').click()
                except:
                    browser.find_element_by_xpath('//button[contains(text(),"Avançar")]').click()
            except:
                browser.find_element_by_xpath('//button[contains(text(),"Next")]').click()

            sleep(5)

            try:
                try:
                    browser.find_element_by_xpath('//button[contains(text(),"Seguinte")]').click()
                except:
                    browser.find_element_by_xpath('//button[contains(text(),"Avançar")]').click()
            except:
                browser.find_element_by_xpath('//button[contains(text(),"Next")]').click()
            
            sleep(2)
            stop_browser(browser)
            
            save_config(result_email, result_password)
            sleep(1)
            print("\33[27m")
            print("\33[32m => Conta criada com sucesso!")
            print("\33[90m ===============================================================")
            print("\33[27m")
        except:
            print("\33[27m")
            print("\33[31m => Erro em criar uma conta! || Proxy Error ||")
        sleep(5)
except:
    print("\33[27m")
    print("\33[31m =>Coloque todas as informações! | Não force o fechamento!")
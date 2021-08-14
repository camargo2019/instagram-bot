"""
    Gabriel CMR - Desenvolvimentos
     Bot de Instagram de Contas
"""
import os
import string
import random
import re

def generatingName():
    dir_path = os.path.dirname(os.path.realpath(__file__))
    addLinha = 0
    atualLine = 1
    with open(dir_path+'/names.txt', 'r') as file:
        for line in file:
            addLinha = int(addLinha+1)
    rangeline = random.randint(1,addLinha)
    outputstring = False
    with open(dir_path+'/names.txt', 'r') as file:
        for line in file:
            atualLine = int(atualLine+1)
            if(atualLine == rangeline):
                outputstring = line
    firstName = outputstring
    return firstName

def generatingSurName():
    dir_path = os.path.dirname(os.path.realpath(__file__))
    addLinha = 0
    atualLine = 1
    with open(dir_path+'/sobrenome.txt', 'r') as file:
        for line in file:
            addLinha = int(addLinha+1)
    rangeline = random.randint(1,addLinha)
    outputstring = False
    with open(dir_path+'/sobrenome.txt', 'r') as file:
        for line in file:
            atualLine = int(atualLine+1)
            if(atualLine == rangeline):
                outputstring = line
    surName = outputstring
    return surName


def username(size=16, chars=string.ascii_lowercase + '.'):
    dir_path = os.path.dirname(os.path.realpath(__file__))
    word_list = []
    with open(dir_path+'/sobrenome.txt', 'r') as file:
        for line in file:
            word_list.append(str(line))

    word_list += chars

    result_username = 'x' * 100
    while len(result_username) < size or len(result_username) >= 30:
        n_word = random.randint(1,2)
        target_word_list = list(map(lambda x: x.lower(), random.choices(word_list , k=n_word)))

        for word_i, target_word in enumerate(target_word_list):
            if random.random() < 0.03:
                target_word = target_word[::-1] 
            target_word_list[word_i] = target_word

        for word_i, target_word in enumerate(target_word_list):
            for ch_i in range(len(target_word)):
                if random.random() < 0.03:
                    target_char = random.choice(['x', 'y']+list(map(str, range(10))))
                    target_word = target_word[:ch_i] + target_char + target_word[ch_i+1:] 
            target_word_list[word_i] = target_word

        for word_i, target_word in enumerate(target_word_list):
            if random.random() < 0.07:
                target_word += (target_word[-1]*random.randint(1,4)) 
            target_word_list[word_i] = target_word

        joining_char = '.'
        result_username = joining_char.join(target_word_list)

        if random.random() < 0.3:
            if random.random() < 0.6:
                result_username += joining_char
            additional_number_list = []
            number_list = list(map(str, range(10)))
            additional_number_list.append(random.choice(number_list))
            number_list += ['']*10
            additional_number_list += random.choices(number_list, k=5)
            result_username += ''.join(list(map(str, additional_number_list)))
    string_nova = re.sub(u'[^a-zA-Z0-9áéíóúÁÉÍÓÚâêîôÂÊÎÔãõÃÕçÇ: ]', '', result_username)
    return string_nova

def generatePassword(passwd=None):
    if passwd is None:
        password_characters = string.ascii_letters + string.digits
        return ''.join(random.choice(password_characters) for i in range(12))
    else:
        return passwd
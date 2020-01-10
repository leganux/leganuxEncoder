const leganuxTokenizr = function (key) {
    if (!key || key == '') {
        this.key = 'leganux';
    } else {
        this.key = key;
    }
    this.characterMap = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
        this.arrCharacterMap = this.characterMap.split(''),
        this.arrCharacterMap = [null].concat(this.arrCharacterMap),
        this.CharacterMapLength = this.arrCharacterMap.length - 1,
        this.keyNumber = 0,
        this.mathEncoder = function (arr, valAnt) {
            let el = this;
            let result = [];
            // inicia el recorrido del arreglo
            arr.map((item, i) => {
                let cabida = 0;
                if (el.arrCharacterMap.includes(item)) { // verifica que sea un dato de mapa de caracteres existente
                    let posAct = el.arrCharacterMap.indexOf(item); // busca  la posision del elemento
                    let sumaVal = posAct + valAnt; // suma el anterior con la posicion del elemento
                    // calcula la nueva posicion 
                    if (sumaVal > el.CharacterMapLength) {
                        cabida = Math.floor(sumaVal / el.CharacterMapLength);
                        let multiplication = (el.CharacterMapLength * cabida);
                        let valorNuevo = sumaVal - multiplication;
                        let left = el.arrCharacterMap[cabida];
                        let rigth = el.arrCharacterMap[valorNuevo];
                        result.push(left + rigth)
                        valAnt = valorNuevo
                    } else {
                        cabida = 0;
                        let valorNuevo = sumaVal
                        let left = el.arrCharacterMap[cabida];
                        let rigth = el.arrCharacterMap[valorNuevo];
                        result.push('?' + rigth)
                        valAnt = valorNuevo
                    }
                } else {
                    //cuando no esta en el arreglo
                    result.push('[' + item + ']')
                }
            })
            return result

        },
        this.mathDecoder = function (arr, valAnt) {
            arr = arr.reverse()
            let el = this;
            let result = [];
            arr.map((item, i) => {
                //sacar el total del primer elemento 
                if (item.includes('?')) {
                    let itemArr = item.split('')
                    let rigth = itemArr[1]
                    let residuo = el.arrCharacterMap.indexOf(rigth);
                    let total = residuo;

                    let nextTick = 0;
                    if ((i + 1) < arr.length) {
                        let duo = arr[i + 1];
                        let letra = duo[1];
                        nextTick = el.arrCharacterMap.indexOf(letra);
                    } else {
                        nextTick = valAnt;
                    }
                    let desifra = total - nextTick;
                    result.push(el.arrCharacterMap[desifra])
                } else if (item.length > 2) {
                    //console.error('Pair too long at pos ' + i, item)
                    return false;
                } else {
                    let itemArr = item.split('')
                    let left = itemArr[0]
                    let rigth = itemArr[1]
                    let multiplicador = el.arrCharacterMap.indexOf(left);
                    let residuo = el.arrCharacterMap.indexOf(rigth);
                    let total = (multiplicador * el.CharacterMapLength) + residuo;
                    let nextTick = 0;
                    if ((i + 1) < arr.length) {
                        let duo = arr[i + 1];
                        let letra = duo[1];
                        nextTick = el.arrCharacterMap.indexOf(letra);

                    } else {
                        nextTick = valAnt;
                    }
                    let desifra = total - nextTick;
                    result.push(el.arrCharacterMap[desifra])
                }
            });
            result = result.reverse()
            // console.log(result);
            return result;
        },
        this.getCode = function name(word, key) {
            // Ejecuta la funcion  de verificacion de key y palabra
            if (!word || word == '') {
                return false;
            }
            let el = this;
            if (!key || key === '') {
                key = el.key;
            }
            // Ejecuta la funcion de calculo del key inicial
            let runKey = el.calculateKeyNumber(key)
            // transforma la palabra en base 64
            word = window.btoa(word);
            // se genera el root13 de la palabra
            word = el.root13(word)
            //se convierte en array
            let arrWord = word.split('')
            let code = el.mathEncoder(arrWord, runKey)
            // se convierte en cadena el array separado por $
            let res = code.join('$')
            // cadena se transforma en b64
            res = window.btoa(res)
            // se aplica root13
            res = el.root13(res)
            //concatena key en b64
            res = res + '_' + window.btoa(runKey);
            //pasa al ultimo por b64
            res = window.btoa(res)
            // regresa el codigo
            return res;

        },
        this.getData = function name(code, key) {

            // Ejecuta la funcion  de verificacion de key y palabra
            if (!code || code == '') {
                return false;
            }
            let el = this;
            if (!key || key === '') {
                key = el.key;
            }

            try {
                // Ejecuta la funcion de calculo del key inicial
                let runKey = el.calculateKeyNumber(key)
                //remueve base 64
                code = window.atob(code)
                //remueve el key en b64
                code = code.split('_')[0]
                //ejecuta root13
                code = el.root13(code);
                //se extrae el b64
                code = window.atob(code);
                // se separa el array por $
                arrCode = code.split('$');
                // se extrae la palabra
                let arrWord = el.mathDecoder(arrCode, runKey)
                //se genera la palabra
                let word = arrWord.join('')
                // se aplica root13
                word = el.root13(word)
                // se retira b64
                word = window.atob(word)
                return word;
            } catch (err) {
                //  console.error(err)
                return false;
            }
        },
        this.root13 = function (str) {
            let input = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890';
            let output = 'NOPQRSTUVWXYZABCDEFGHIJKLMnopqrstuvwxyzabcdefghijklm0987654321';
            let arrInput = input.split('');
            let arrOutput = output.split('');
            let arr = str.split('');
            let Result = new Array();
            arr.map((item, i) => {
                if (arrInput.includes(item)) {
                    let pos = arrInput.indexOf(item);
                    Result.push(arrOutput[pos]);
                } else {
                    Result.push(item)
                }
            });
            return Result.join('');
        },
        this.calculateKeyNumber = function (key) {
            let el = this;
            key = window.btoa(key);
            key = key.replace(/[^\w\s]/gi, '');
            key = key.replace(/\s/g, '');
            key = window.btoa(key) + el.root13(key);
            let sum = 0;
            let charArray = key.split('')
            charArray.map((item, i) => {
                sum = sum + el.arrCharacterMap.indexOf(item)
            });
            el.keyNumber = sum;
            return sum
        };
}

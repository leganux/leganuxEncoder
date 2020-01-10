/*
 *
 * Plugin de Codificacion y decodificacion  de VU
 * Desarrollado Por Angel Erick Cruz Olivera para la SCT
 * V 1.0.3 Marzo. 2018
 *
 * *************************************************************  */

const arrLt = [null, 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', ' ', ',', '-', '_', '+', '*', '/', '=', '.', '"', '!', '?', '(', ')', '$', '%', '&', '|', '{', '}', '[', ']', '<', '>', ':', ';'];
const tamArrLt = (arrLt.length - 1 );
const  leganuxTokenizr = function (key) {
    this.key = key,
        this.GetCode = function (word, key) {
            if (!key || key === '') {
                key = this.key;
            }
            word = window.btoa(word);
            key = key.replace(/[^\w\s]/gi, '');
            key = key.replace(/\s/g, '');
            /*Se agrega */

            var original = key;
            key = window.btoa(key);
            key = window.btoa(key + original + key);
            /*Fin se agrego */

            var ArrKey = splitter(key);
            var ArrWord = splitter(word);
            var sumPass = 0;
            for (var i = 0; i < ArrKey.length; i++) {
                sumPass = Number(sumPass) + Number(busq(arrLt, ArrKey[i]));
            }
            while (Number(sumPass) > 9) {
                cadena = sumPass.toString();
                sumPass = 0;
                for (var i = 0; i < cadena.length; i++) {
                    sumPass = Number(sumPass) + Number(cadena.charAt(i));
                }
            }

            var valAnt = sumPass;
            for (var i = 0; i < ArrWord.length; i++) {
                var valAct = busq(arrLt, ArrWord[i]);
                var newPos = Number(valAct + valAnt);
                if (newPos > tamArrLt) {
                    newPos = newPos - tamArrLt;
                }
                if (valAct !== -1) {
                    ArrWord[i] = arrLt[newPos];
                }
                valAnt = valAct;
            }
            
            ArrWord.push(arrLt[valAnt + sumPass]);
            ArrWord = root13(ArrWord);
            var r = unsplitter(ArrWord);
            return window.btoa(r);
        },
        this.GetData = function (word, key) {
            if (!key || key === '') {
                key = this.key;
            }

            try {
                word = window.atob(word);
            } catch (err) {
                return false;
            }
            var Arrdec = new Array();
            key = key.replace(/[^\w\s]/gi, '');
            key = key.replace(/\s/g, '');

            /*Se agrega */
            var original = key;
            key = window.btoa(key);
            key = window.btoa(key + original + key);


            var ArrKey = splitter(key);
            var ArrWord = splitter(word);
            ArrWord = root13(ArrWord);
            var sumPass = 0;
            for (var i = 0; i < ArrKey.length; i++) {
                sumPass = Number(sumPass) + Number(busq(arrLt, ArrKey[i]));
            }
            while (Number(sumPass) > 9) {
                cadena = sumPass.toString();
                sumPass = 0;
                for (var i = 0; i < cadena.length; i++) {
                    sumPass = Number(sumPass) + Number(cadena.charAt(i));
                }
            }
            ArrWord = ArrWord.reverse();
            var valAnt = 0 - sumPass;
            for (var i = 0; i < ArrWord.length; i++) {
                var valAct = busq(arrLt, ArrWord[i]);
                var charc = 0;
                if (valAct == -1) {
                    Arrdec.push(ArrWord[i]);
                } else {
                    if (i + 1 < ArrWord.length) {
                        charc = valAct + valAnt;
                        if (charc < 1) {
                            charc = charc + tamArrLt;
                        }
                        valAnt = 0 - charc;
                        Arrdec.push(arrLt[charc]);
                    }
                }
            }
            Arrdec = Arrdec.reverse();

            try {
                return window.atob(unsplitter(Arrdec));
            } catch (err) {
                return false;
            }


        }
};

const splitter = function (word) {
    var Arr = new Array();
    for (i = 0; i < word.length; i++) {
        Arr.push(word.charAt(i));
    }
    return Arr;
}
/* Metodo que permite unir los elemntos de un arreglo en una cadena*/
const unsplitter = function (word) {
    var Arr = '';
    for (i = 0; i < word.length; i++) {
        Arr = Arr + word[i];
    }
    return Arr;
}
/* Metodo que permite buscar un elemento en un arreglo*/
const busq = function (arr, tofind) {
    var pos = -1;
    for (i = 0; i < arr.length; i++) {
        if (arr[i] === tofind) {
            pos = i;
        }
    }
    return pos;
}
/* Metodo de  codificacion root13 */
const root13 = function (arr) {
    var input = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    var output = 'NOPQRSTUVWXYZABCDEFGHIJKLMnopqrstuvwxyzabcdefghijklm';
    var arrInput = splitter(input);
    var arrOutput = splitter(output);
    var Result = new Array();
    for (var i = 0; i < arr.length; i++) {
        var actual = busq(arrInput, arr[i]);
        if (actual == -1) {
            Result.push(arr[i])
        } else {
            Result.push(arrOutput[actual])
        }
    }
    return Result;
}

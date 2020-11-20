sap.ui.define([], function () {
	"use strict";

	return {
		/**
		 * Rounds the currency value to 2 digits
		 *
		 * @public
		 * @param {string} sValue value to be formatted
		 * @returns {string} formatted currency value with 2 digits
		 */
		backColor: function (sValue) {
			debugger;
			if (sValue === '') {
				return ".yellow";
			}
		},
		// da formato  a los campos de moneda
		formatoMonedaChilena: function (inputp) {
			//var num = inputp.getSource().getValue().replace(/\./g, '');
			var num = inputp.replace(/\./g, '');
			//elimina el 0 delante 

			if (!isNaN(num)) {
				//elimina el 0 delante 
				if (num.length === 1 && num === "0") {
					num = num.replace(/^[\'0']/, '');
				} else {

					num = num.toString().split('').reverse().join('').replace(/(?=\d*\.?)(\d{3})/g, '$1.');
					num = num.split('').reverse().join('').replace(/^[\.]/, '');
					//inputp.value = num;

				}
				//inputp.getSource().setValue(num);
				return num;

			}
		},

		onFormat: function (input) {
			var num = input.getSource().getValue().replace(/\./g, '');
			//elimina el 0 delante 
			if (!isNaN(num)) {
				//elimina el 0 delante 
				if (num.length === 1 && num === "0") {
					num = num.replace(/^[\'0']/, '');
				} else {
					num = num.toString().split('').reverse().join('').replace(/(?=\d*\.?)(\d{3})/g, '$1.');
					num = num.split('').reverse().join('').replace(/^[\.]/, '');
				}
			}
			input.getSource().setValue(num);
		},
		
		/**
		 * Funcion que recive la respuesta del odata y levanta un simple messageBox, tambien detiene el busy
		 * @public
		 * @param {object} oError - objecto error que entrega el odata
		 * */
		showODataError: function (oError) {
			var sMessage;
			try {
				sMessage = JSON.parse(oError.responseText).error.message.value;
			} catch (ex) {
				sMessage = $(oError.responseText).next().text();
			}
			sap.m.MessageBox.error(sMessage);
		}
	};

});
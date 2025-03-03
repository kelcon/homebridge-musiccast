var Service, Characteristic;
const request = require('request');
const url = require('url');

module.exports = function(homebridge) {
	Service = homebridge.hap.Service;
	Characteristic = homebridge.hap.Characteristic;
	homebridge.registerAccessory("homebridge-musiccast-tv", "MusicCastTV", MusicCastTV);
};

function MusicCastTV(log, config) {
	this.log = log;
	this.name = config["name"];
	this.ip = config["ip"];
	this.zone = config["zone"] || "main";
	this.volumeFan = config["volumeFan"] || 0 ;
	this.volumeName = config["volumeName"] || this.name + " speaker";
	this.buttonBand = config["buttonBand"] || "fm";
	this.buttonNumber = config["buttonNumber"];
	this.buttonName = config["buttonName"] || this.name + " button";
	this.model = config["model"] || config["modell"] || "MusicCast TV";
	this.volume = config["volume"] || 0;
	this.maxVol = config["maxVol"];
	this.ActiveIdentifier = config["identifier"] || 1;
	this.serial = config["serialNo"] || "123-456-789";
	this.category = 34;
	that = this;
	request({
		method: 'GET',
		url: 'http://' + this.ip + '/YamahaExtendedControl/v1/' + this.zone + '/getStatus',
		headers: {
			'X-AppName': 'MusicCast/1.0',
			'X-AppPort': '41100',
		},
	}, 
	function (error, response, body) {
		if (error) {
			that.log.error(error.message);
		}
		that.log.debug("body: " + body);
		if(body) {
			var att=JSON.parse(body);
			that.volume = config["volume"] || att.volume;
			that.maxVol = config["maxVol"] || att.max_volume;
			that.log("volume: " + that.volume + " maxVol: " + that.maxVol);
			var tmpInput = that.getInputFromString(att.input);
			that.log("Input: " + tmpInput);
			if(tmpInput != "") {
				if(tmpInput=="tuner") {
					that.getBand();
				} else{
					that.ActiveIdentifier = config["identifier"] || that.info[tmpInput]["Identifier"];
				}
			}
		}
	});
	this.inputs =  config["inputs"] || {"airplay": "1. 'inputs' missing", "bluetooth": "2. in config.json", "spotify": "3. please modify"};
	this.active = config["active"] || 0;
	this.powerOnInput = config["powerOnInput"];
	this.powerOnVolume = config["powerOnVolume"];
	this.mute = 1;
	//this.brightness = config["brightness"] || 100;
	this.updateInterval = config["updateInterval"] || 1000;
	this.version = require("./package.json").version;
	this.features = {};
	this.info = {"airplay": {"Identifier": 1, "CurrentVisibilityState": 0, "TargetVisibilityState": 0, "Command": "airplay"}, 
		"line_cd": {"Identifier": 2, "CurrentVisibilityState": 0, "TargetVisibilityState": 0, "Command": "line_cd"}, 
		"fm": {"Identifier": 3, "CurrentVisibilityState": 0, "TargetVisibilityState": 0, "Command": "fm"}, 
		"am": {"Identifier": 4, "CurrentVisibilityState": 0, "TargetVisibilityState": 0, "Command": "am"}, 
		"dab": {"Identifier": 5, "CurrentVisibilityState": 0, "TargetVisibilityState": 0, "Command": "dab"}, 
		"server": {"Identifier": 6, "CurrentVisibilityState": 0, "TargetVisibilityState": 0, "Command": "server"}, 
		"phono": {"Identifier": 7, "CurrentVisibilityState": 0, "TargetVisibilityState": 0, "Command": "phono"}, 
		"usb": {"Identifier": 8, "CurrentVisibilityState": 0, "TargetVisibilityState": 0, "Command": "usb"}, 
		"usb_dac": {"Identifier": 9, "CurrentVisibilityState": 0, "TargetVisibilityState": 0, "Command": "usb_dac"}, 
		"bluetooth": {"Identifier": 10, "CurrentVisibilityState": 0, "TargetVisibilityState": 0, "Command": "bluetooth"}, 
		"net_radio": {"Identifier": 11, "CurrentVisibilityState": 0, "TargetVisibilityState": 0, "Command": "net_radio"}, 
		"line1": {"Identifier": 12, "CurrentVisibilityState": 0, "TargetVisibilityState": 0, "Command": "line1"}, 
		"line2": {"Identifier": 13, "CurrentVisibilityState": 0, "TargetVisibilityState": 0, "Command": "line2"}, 
		"line3": {"Identifier": 14, "CurrentVisibilityState": 0, "TargetVisibilityState": 0, "Command": "line3"}, 
		"optical": {"Identifier": 15, "CurrentVisibilityState": 0, "TargetVisibilityState": 0, "Command": "optical"}, 
		"optical1": {"Identifier": 16, "CurrentVisibilityState": 0, "TargetVisibilityState": 0, "Command": "optical1"}, 
		"optical2": {"Identifier": 17, "CurrentVisibilityState": 0, "TargetVisibilityState": 0, "Command": "optical2"}, 
		"coaxial": {"Identifier": 18, "CurrentVisibilityState": 0, "TargetVisibilityState": 0, "Command": "coaxial"}, 
		"coaxial1": {"Identifier": 19, "CurrentVisibilityState": 0, "TargetVisibilityState": 0, "Command": "coaxial1"}, 
		"coaxial2": {"Identifier": 20, "CurrentVisibilityState": 0, "TargetVisibilityState": 0, "Command": "coaxial2"}, 
		"hdmi": {"Identifier": 21, "CurrentVisibilityState": 0, "TargetVisibilityState": 0, "Command": "hdmi"}, 
		"hdmi1": {"Identifier": 22, "CurrentVisibilityState": 0, "TargetVisibilityState": 0, "Command": "hdmi1"}, 
		"hdmi2": {"Identifier": 23, "CurrentVisibilityState": 0, "TargetVisibilityState": 0, "Command": "hdmi2"}, 
		"hdmi3": {"Identifier": 24, "CurrentVisibilityState": 0, "TargetVisibilityState": 0, "Command": "hdmi3"}, 
		"hdmi4": {"Identifier": 25, "CurrentVisibilityState": 0, "TargetVisibilityState": 0, "Command": "hdmi4"}, 
		"hdmi5": {"Identifier": 26, "CurrentVisibilityState": 0, "TargetVisibilityState": 0, "Command": "hdmi5"}, 
		"hdmi6": {"Identifier": 27, "CurrentVisibilityState": 0, "TargetVisibilityState": 0, "Command": "hdmi6"}, 
		"hdmi7": {"Identifier": 28, "CurrentVisibilityState": 0, "TargetVisibilityState": 0, "Command": "hdmi7"}, 
		"hdmi8": {"Identifier": 29, "CurrentVisibilityState": 0, "TargetVisibilityState": 0, "Command": "hdmi8"}, 
		"aux": {"Identifier": 30, "CurrentVisibilityState": 0, "TargetVisibilityState": 0, "Command": "aux"}, 
		"aux1": {"Identifier": 31, "CurrentVisibilityState": 0, "TargetVisibilityState": 0, "Command": "aux1"}, 
		"aux2": {"Identifier": 32, "CurrentVisibilityState": 0, "TargetVisibilityState": 0, "Command": "aux2"}, 
		"v_aux": {"Identifier": 33, "CurrentVisibilityState": 0, "TargetVisibilityState": 0, "Command": "v_aux"}, 
		"av1": {"Identifier": 34, "CurrentVisibilityState": 0, "TargetVisibilityState": 0, "Command": "av1"}, 
		"av2": {"Identifier": 35, "CurrentVisibilityState": 0, "TargetVisibilityState": 0, "Command": "av2"}, 
		"av3": {"Identifier": 36, "CurrentVisibilityState": 0, "TargetVisibilityState": 0, "Command": "av3"}, 
		"av4": {"Identifier": 37, "CurrentVisibilityState": 0, "TargetVisibilityState": 0, "Command": "av4"}, 
		"av5": {"Identifier": 38, "CurrentVisibilityState": 0, "TargetVisibilityState": 0, "Command": "av5"}, 
		"av6": {"Identifier": 39, "CurrentVisibilityState": 0, "TargetVisibilityState": 0, "Command": "av6"}, 
		"av7": {"Identifier": 40, "CurrentVisibilityState": 0, "TargetVisibilityState": 0, "Command": "av7"}, 
		"cd": {"Identifier": 41, "CurrentVisibilityState": 0, "TargetVisibilityState": 0, "Command": "cd"}, 
		"tv": {"Identifier": 42, "CurrentVisibilityState": 0, "TargetVisibilityState": 0, "Command": "tv"}, 
		"analog": {"Identifier": 43, "CurrentVisibilityState": 0, "TargetVisibilityState": 0, "Command": "analog"}, 
		"multi_ch": {"Identifier": 44, "CurrentVisibilityState": 0, "TargetVisibilityState": 0, "Command": "multi_ch"}, 
		"audio": {"Identifier": 45, "CurrentVisibilityState": 0, "TargetVisibilityState": 0, "Command": "audio"}, 
		"audio1": {"Identifier": 46, "CurrentVisibilityState": 0, "TargetVisibilityState": 0, "Command": "audio1"}, 
		"audio2": {"Identifier": 47, "CurrentVisibilityState": 0, "TargetVisibilityState": 0, "Command": "audio2"}, 
		"audio3": {"Identifier": 48, "CurrentVisibilityState": 0, "TargetVisibilityState": 0, "Command": "audio3"}, 
		"audio4": {"Identifier": 49, "CurrentVisibilityState": 0, "TargetVisibilityState": 0, "Command": "audio4"}, 
		"audio_cd": {"Identifier": 50, "CurrentVisibilityState": 0, "TargetVisibilityState": 0, "Command": "audio_cd"}, 
		"digital": {"Identifier": 51, "CurrentVisibilityState": 0, "TargetVisibilityState": 0, "Command": "digital"}, 
		"digital1": {"Identifier": 52, "CurrentVisibilityState": 0, "TargetVisibilityState": 0, "Command": "digital1"}, 
		"digital2": {"Identifier": 53, "CurrentVisibilityState": 0, "TargetVisibilityState": 0, "Command": "digital2"}, 
		"bd_dvd": {"Identifier": 54, "CurrentVisibilityState": 0, "TargetVisibilityState": 0, "Command": "bd_dvd"}, 
		//"": {"Identifier": 55, "CurrentVisibilityState": 0, "TargetVisibilityState": 0, "Command": ""}, 
		"mc_link": {"Identifier": 56, "CurrentVisibilityState": 0, "TargetVisibilityState": 0, "Command": "mc_link"}, 
		"main_sync": {"Identifier": 57, "CurrentVisibilityState": 0, "TargetVisibilityState": 0, "Command": ""}, 
		"spotify": {"Identifier": 58, "CurrentVisibilityState": 0, "TargetVisibilityState": 0, "Command": "spotify"}, 
		"amazon_music": {"Identifier": 59, "CurrentVisibilityState": 0, "TargetVisibilityState": 0, "Command": "amazon_music"}, 
		"deezer": {"Identifier": 60, "CurrentVisibilityState": 0, "TargetVisibilityState": 0, "Command": "deezer"}, 
		"napster": {"Identifier": 61, "CurrentVisibilityState": 0, "TargetVisibilityState": 0, "Command": "napster"}, 
		"qobuz": {"Identifier": 62, "CurrentVisibilityState": 0, "TargetVisibilityState": 0, "Command": "qobuz"}, 
		"juke": {"Identifier": 63, "CurrentVisibilityState": 0, "TargetVisibilityState": 0, "Command": "juke"}, 
		"tidal": {"Identifier": 64, "CurrentVisibilityState": 0, "TargetVisibilityState": 0, "Command": "tidal"}, 
		"pandora": {"Identifier": 65, "CurrentVisibilityState": 0, "TargetVisibilityState": 0, "Command": "pandora"}, 
		"siriusxm": {"Identifier": 66, "CurrentVisibilityState": 0, "TargetVisibilityState": 0, "Command": "siriusxm"}, 
		"radiko": {"Identifier": 67, "CurrentVisibilityState": 0, "TargetVisibilityState": 0, "Command": "radiko"}, 
		"alexa": {"Identifier": 68, "CurrentVisibilityState": 0, "TargetVisibilityState": 0, "Command": "alexa"}};
	this.log.debug(config);
	for(var key in this.inputs) {
		this.log.debug("updating name for " + key);
		var tmpInput = this.getInputFromString(key);
		if(tmpInput != "") {
			if(tmpInput == "tuner") {
				this.log.error("tuner is not a valid Input, please select \"am\", \"fm\" or \"dab\" for valid tuner types");
			} else{
				this.info[tmpInput]["ConfiguredName"] = this.inputs[key];
			}
		}
	}
	this.log("Initialized '" + this.name + "'");
}

MusicCastTV.prototype = {
	identify: function(callback) {
		this.log("Identify MusicCast TV '" + this.name + "'");
		callback();
	},
	getInputFromString: function(name) {
		switch(name) {
			case "tuner":
				return "tuner";
			case "airplay":
			case "AirPlay":
				return "airplay";
			case "phono":
			case "Phono":
				return "phono";
			case "line_cd":
			case "LineCD":
				return "line_cd";
			case "line1":
			case "Line1":
				return "line1";
			case "line2":
			case "Line2":
				return "line2";
			case "line3":
			case "Line3":
				return "line3";
			case "fm":
			case "FM":
				return "fm";
			case "am":
			case "AM":
				return "am";
			case "dab":
			case "DAB":
				return "dab";
			case "net_radio":
			case "NetRadio":
				return "net_radio";
			case "server":
			case "Server":
				return "server";
			case "bluetooth":
			case "Bluetooth":
				return "bluetooth";
			case "usb":
			case "USB":
				return "usb";
			case "usb_dac":
			case "USB_DAC":
			case "USBDAC":
				return "usb_dac";
			case "optical":
			case "Optical":
				return "optical";
			case "optical1":
			case "Optical1":
				return "optical1";
			case "optical2":
			case "Optical2":
				return "optical2";
			case "coaxial":
			case "Coaxial":
				return "coaxial";
			case "coaxial1":
			case "Coaxial1":
				return "coaxial1";
			case "coaxial2":
			case "Coaxial2":
				return "coaxial2";
			case "hdmi":
			case "HDMI":
				return "hdmi";
			case "hdmi1":
			case "HDMI1":
				return "hdmi1";
			case "hdmi2":
			case "HDMI2":
				return "hdmi2";
			case "hdmi3":
			case "HDMI3":
				return "hdmi3";
			case "hdmi4":
			case "HDMI4":
				return "hdmi4";
			case "hdmi5":
			case "HDMI5":
				return "hdmi5";
			case "hdmi6":
			case "HDMI6":
				return "hdmi6";
			case "hdmi7":
			case "HDMI7":
				return "hdmi7";
			case "hdmi8":
			case "HDMI8":
				return "hdmi8";
			case "aux":
			case "AUX":
				return "aux";
			case "aux1":
			case "AUX1":
				return "aux1";
			case "aux2":
			case "AUX2":
				return "aux2";
			case "v_aux":
			case "V_AUX":
				return "v_aux";
			case "av1":
			case "AV1":
				return "av1";
			case "av2":
			case "AV2":
				return "av2";
			case "av3":
			case "AV3":
				return "av3";
			case "av4":
			case "AV4":
				return "av4";
			case "av5":
			case "AV5":
				return "av5";
			case "av6":
			case "AV6":
				return "av6";
			case "av7":
			case "AV7":
				return "av7";
			case "cd":
			case "CD":
				return "cd";
			case "tv":
			case "TV":
				return "tv";
			case "analog":
			case "Analog":
				return "analog";
			case "multi_ch":
			case "MultiCh":
				return "multi_ch";
			case "audio":
				return "audio";
			case "audio1":
				return "audio1";
			case "audio2":
				return "audio2";
			case "audio3":
				return "audio3";
			case "audio4":
				return "audio4";
			case "audio_cd":
			case "audiocd":
				return "audio_cd";
			case "digital":
				return "digital";
			case "digital1":
				return "digital1";
			case "digital2":
				return "digital2";
			case "bd_dvd":
			case "bddvd":
				return "bd_dvd";
			case "mc_link":
				return "mc_link";
			case "main_sync":
			case "sync":
				return "main_sync";
			case "spotify":
			case "Spotify":
				return "spotify";
			case "amazon_music":
			case "Amazon":
				return "amazon_music";
			case "deezer":
			case "Deezer":
				return "deezer";
			case "napster":
			case "Napster":
				return "napster";
			case "qobuz":
			case "Qobuz":
				return "qobuz";
			case "juke":
			case "Juke":
				return "juke";
			case "tidal":
			case "Tidal":
				return "tidal";
			case "pandora":
			case "Pandora":
				return "pandora";
			case "siriusxm":
			case "Siriusxm":
			case "SiriusXM":
				return "siriusxm";
			case "radiko":
				return "radiko";
			case "alexa":
			case "Alexa":
				return "alexa";
			default:
				this.log("input " + name + " not found");
				return "";
		}
	},
	getInputService: function(name) {
		var tmpInputService = new Service.InputSource(name, name);
		tmpInputService.setCharacteristic(Characteristic.Identifier, this.info[name]["Identifier"]);
		tmpInputService.setCharacteristic(Characteristic.ConfiguredName, this.info[name]["ConfiguredName"]);
		tmpInputService.setCharacteristic(Characteristic.IsConfigured, Characteristic.IsConfigured.CONFIGURED);
		tmpInputService.setCharacteristic(Characteristic.CurrentVisibilityState, 0);
		tmpInputService.getCharacteristic(Characteristic.CurrentVisibilityState).on('get', (callback) => {
			this.log.debug("get CurrentVisibilityState of " + name + ": " + this.info[name]['CurrentVisibilityState']);
			callback(null, this.info[name]['CurrentVisibilityState']);
		}); //0=SHOWN;1=HIDDEN
		tmpInputService.getCharacteristic(Characteristic.TargetVisibilityState).on('get', (callback) => {
			this.log.debug('get TargetVisibilityState of ' + name + ": " + this.info[name]['TargetVisibilityState']);
			callback(null, this.info[name]['TargetVisibilityState']);
		});
		tmpInputService.getCharacteristic(Characteristic.TargetVisibilityState).on('set', (value, callback) => {
			this.info[name]['TargetVisibilityState'] = value;
			this.log('Target Visibility State to ' + value + " " + this.info[name]['ConfiguredName']);
			this.info[name]['CurrentVisibilityState'] = value;
			callback();
		});
		return tmpInputService;
	},
	getBand: function() {
		that = this;
		request({
			method: 'GET',
			url: 'http://' + this.ip + '/YamahaExtendedControl/v1/tuner/getPlayInfo',
			headers: {
				'X-AppName': 'MusicCast/1.0',
				'X-AppPort': '41100',
			},
		}, 
		function (error, response, body) {
			if (error) {
				that.log.debug('getBand error: ' + error.message);
				return error;
			} else if(body) {
				that.log.debug("getBand body: " + body)
				var att = JSON.parse(body);
				var tmpInput = that.getInputFromString(att.band);
				that.log.debug("Input: " + tmpInput);
				if(tmpInput != "") {
					that.ActiveIdentifier = that.info[tmpInput]["Identifier"];
					that.TelevisionService.getCharacteristic(Characteristic.ActiveIdentifier)
						.updateValue(that.ActiveIdentifier);
				}
			}
		});
	},
	getHttpInput: function() {
		this.tmp="";
		that = this;
		request({
			method: 'GET',
			url: 'http://' + this.ip + '/YamahaExtendedControl/v1/' + this.zone + '/getStatus',
			headers: {
				'X-AppName': 'MusicCast/1.0',
				'X-AppPort': '41100',
			},
		}, 
		function (error, response, body) {
			if (error) {
				that.log.debug('getHttpInput error: ' + error.message);
				that.tmp = "error";
				return error;
			} else if(body) {
				//that.log.debug("HttpInput body: " + body)
				var att = JSON.parse(body);
				that.active = (att.power=='on');
				that.volume = att.volume;
				that.maxVol = att.max_volume;
				//that.log.debug("volume: " + that.volume + " maxVol: " + that.maxVol);
				var tmpInput = that.getInputFromString(att.input);
				if(tmpInput != "") {
					if(tmpInput=="tuner") {
						that.getBand();
					} else{
						//that.log.debug("Input: " + tmpInput);
						that.ActiveIdentifier = that.info[tmpInput]["Identifier"];
						that.TelevisionService.getCharacteristic(Characteristic.Active)
							.updateValue(that.active);
						that.TelevisionService.getCharacteristic(Characteristic.ActiveIdentifier)
							.updateValue(that.ActiveIdentifier);
					}
				}
				that.tmp = "updated";
			} else{
				that.log(error + "; body: " + body);
			}
		});
	},
	getActive: function(callback) {
		this.tmp = "";
		const that = this;
		this.log.debug("get Active of " + this.name + ": " + this.active);
		request({
			method: 'GET',
			url: 'http://' + this.ip + '/YamahaExtendedControl/v1/' + this.zone + '/getStatus',
			headers: {
				'X-AppName': 'MusicCast/1.0',
				'X-AppPort': '41100',
			},
		}, 
		function (error, response, body) {
			if (error) {
				that.log.error('getActive error: ' + error.message);
				that.tmp = "error";
				//return callback(error);
				that.active=0;
				that.TelevisionService
					.getCharacteristic(Characteristic.Active)
					.updateValue(0);
			} else{
				var att=JSON.parse(body);
				that.log.debug('HTTP getStatus result: ' + att.power);
				that.active = (att.power=='on');
				that.TelevisionService.getCharacteristic(Characteristic.Active)
					.updateValue((att.power=='on'));
				that.tmp = "success";
				that.TelevisionService
					.getCharacteristic(Characteristic.Active)
					.updateValue(that.active);
				//return callback(null, (att.power=='on'));
			}
		});
		callback(null, this.active);
	},
	setActive: function(value, callback) {
		const that = this;
		this.active = value;
		request({
			url: 'http://' + this.ip + '/YamahaExtendedControl/v1/' + this.zone + '/setPower?power=' + (value ? 'on' : 'standby'),
			method: 'GET',
			body: ""
		},
		function (error, response) {
			if (error) {
				that.log.debug('http://' + this.ip + '/YamahaExtendedControl/v1/' + this.zone + '/setPower?power=' + (value ? 'on' : 'standby'));
				that.log.error('setActive error: ' + error.message);
				return error;
			}
		});
		this.log("Active to " + value);
		if(value&&(this.powerOnInput||this.powerOnVolume)) { // missing: filter for state change
			if(this.powerOnInput&&this.powerOnVolume) {
				var tmpInput = this.getInputFromString(this.powerOnInput);
				this.log("powerOnInput: " + tmpInput + "; powerOnVolume: " + this.powerOnVolume);
				this.setActiveIdentifier(this.info[tmpInput]["Identifier"], function() {}); //turn on powerOnInput with fake callback
				that.TelevisionService
					.getCharacteristic(Characteristic.ActiveIdentifier)
					.updateValue(this.info[tmpInput]["Identifier"]);
				this.setVolume(this.powerOnVolume, callback);
				//turn on both, one callback
			}else if(this.powerOnInput) {
				var tmpInput = this.getInputFromString(this.powerOnInput);
				this.log("powerOnInput: " + tmpInput);
				this.setActiveIdentifier(this.info[tmpInput]["Identifier"], callback); //turn on powerOnInput
				that.TelevisionService
					.getCharacteristic(Characteristic.ActiveIdentifier)
					.updateValue(this.info[tmpInput]["Identifier"]);
			}else if(this.powerOnVolume) {
				this.log("powerOnVolume: " + this.powerOnVolume);
				this.setVolume(this.powerOnVolume, callback);
			}
		} else{
			callback();
		}
	},
	getActiveIdentifier: function(callback) {
		this.getHttpInput();
		setTimeout(() => {
			this.TelevisionService
				.getCharacteristic(Characteristic.ActiveIdentifier)
				.updateValue(this.ActiveIdentifier);
		}, this.updateInterval);
		this.log("get Active Identifier: " + this.ActiveIdentifier);
		callback(null, this.ActiveIdentifier);
	},
	setActiveIdentifier: function(value, callback) {
		const that = this;
		for(var key in this.info) {
			if (this.info[key]["Identifier"] == value) {
				var newInput = this.info[key]["Command"];
				var tmpInput = newInput;
				this.log("Switch to " + value + ": " + newInput);
			}
		}
		if (tmpInput=="am" || tmpInput=="fm" || tmpInput=="dab") {
			newInput = "tuner";
		}
		this.log.debug("ActiveIdentifier to " + value);
		request({
			url: 'http://' + this.ip + '/YamahaExtendedControl/v1/' + this.zone + '/setInput?input=' + newInput,
			method: 'GET',
			body: ""
		},
		function (error, response) {
			if (error) {
				that.log.debug('http://' + this.ip + '/YamahaExtendedControl/v1/' + this.zone + '/setInput?input=' + newInput);
				that.log.error(error.message);
				return callback(error);
			}
		});
		if (tmpInput=="am" || tmpInput=="fm" || tmpInput=="dab") {
			request({
				url: 'http://' + this.ip + '/YamahaExtendedControl/v1/tuner/setBand?band=' + tmpInput,
				method: 'GET',
				body: ""
			},
			function (error, response) {
				if (error) {
					that.log.debug('http://' + this.ip + '/YamahaExtendedControl/v1/tuner/setBand?band=' + tmpInput);
					that.log.error(error.message);
					return callback(error);
				}
			});
		}
		this.ActiveIdentifier = value;
		callback();
	},
	getButton: function(callback) {
		this.log.debug("get Button: always 0");
		callback(null, 0);
	},
	setButton: function(value, callback) {
		this.log("Button: band " + this.buttonBand + " to " + this.buttonNumber);
		request({
			url: 'http://' + this.ip + '/YamahaExtendedControl/v1/netusb/recallPreset?zone=' + this.zone + '&band=' + this.buttonBand + '&num=' + this.buttonNumber,
			method: 'GET',
			body: ""
		},
		function (error, response) {
			if (error) {
				that.log.debug('http://' + that.ip + '/YamahaExtendedControl/v1/tuner/recallPreset');
				that.log.error(error.message);
		//		return callback(error);
			} else{
				that.log.debug('button activated');
			}
		});
		callback();
	},
	getMute: function(callback) {
		this.log.debug("get Mute: " + this.mute);
		callback(null, this.mute);
	},
	setMute: function(value, callback) {
		this.mute = value;
		this.log("Mute to " + value);
		callback();
	},
	remoteKeyPress: function(value, callback) {
		switch (value) {
			case 4:
				this.log("remoteKeyPress UP");
				this.setVolumeSelector(0, callback);
				break;
			case 5:
				this.log("remoteKeyPress DOWN");
				this.setVolumeSelector(1, callback);
				break;
			case 6:
				this.log("remoteKeyPress LEFT");
				return callback();
			case 7:
				this.log("remoteKeyPress RIGHT");
				return callback();
			case 8:
				this.log("remoteKeyPress OK");
				return callback();
			case 9:
				this.log("remoteKeyPress BACK");
				return callback();
			case 11:
				this.log("remoteKeyPress Play/Pause");
				//CurrentMediaState und TargetMediaState verändern
				//0=PLAY;1=PAUSE;2=STOP
				/*if (this.CurrentMediaState == 0) {
					this.setTargetMediaState(1, callback);
					//this.TargetMediaState = 1;
				}
				if (this.CurrentMediaState == 1) {
					this.setTargetMediaState(0, callback);
					//this.TargetMediaState = 0;
				}*/
				return callback();
			case 15:
				this.log("remoteKeyPress i");
				return callback();
			default:
				this.log("remoteKeyPress " + value);
				return callback();
		}
	},
	getFakeVolume: function(callback) {
		tmp = this.getHttpInput();
		var volume = ((this.volume*100)/this.maxVol); //turns a range between 0 and maxVolume into 0-100
		if(isNaN(volume)) {
			volume = 0;//filter NaN
		}
		this.log.debug("get FakeVolume: " + volume + " real: " + this.volume);
		callback(null, volume);
	},
	setFakeVolume: function(value, callback) {
		var volume = ((value*this.maxVol)/100); //turns value between 0 and 100 into value between 0 and maxVolume
		this.log.debug("set FakeVolume: " + value + " real: " + volume);
		this.setVolume(volume, callback);
	},
	getVolume: function(callback) {
		tmp = this.getHttpInput();
		this.log.debug("get Volume: " + this.volume);
		callback(null, this.volume);
	},
	setVolume: function(value, callback) {
		const that = this;
		value = Math.trunc(value); //cast to integer
		if (value<0 || this.maxVol<value) {
			this.log("Volume must be between 0 and " + this.maxVol + " requested: " + value);
			callback();
			return;
		}
		request({
			url: 'http://' + this.ip + '/YamahaExtendedControl/v1/' + this.zone + '/setVolume?volume=' + value,
			method: 'GET',
			body: ""
		},
		function (error, response) {
			if (error) {
				that.log.debug('http://' + this.ip + '/YamahaExtendedControl/v1/' + this.zone + '/setVolume?volume=' + value);
				that.log.error('setVolume error: ' + error.message);
				return error;
			}
		});
		this.volume = value;
		this.log("set Volume: " + value);
		if (value == 0) {
			this.mute = 1;
		} else {
			this.mute = 0;
		}
		callback();
	},
	setVolumeSelector: function(value, callback) {
		//this.getHttpInput();
		this.log.debug("VolumeSelector: " + value + ", current Volume: " + this.volume);
		if (value == 0) {
			this.setVolume(this.volume+1, callback);
			//setTimeout(this.setVolume, 1000, this.volume+1, callback);
		}else if (value == 1){
			this.setVolume(this.volume-1, callback);
		}
	},
	
	getServices: function() {
		let informationService = new Service.AccessoryInformation();
		informationService
			.setCharacteristic(Characteristic.Manufacturer, "homebridge-musiccast-tv")
			.setCharacteristic(Characteristic.Model, this.model)
			.setCharacteristic(Characteristic.SerialNumber, this.serial)
			.setCharacteristic(Characteristic.FirmwareRevision, this.version);
		this.informationService = informationService;
		
		var ServiceList = [];
		ServiceList.push(informationService);
		
		const that = this;
		request({
			url: 'http://' + this.ip + '/YamahaExtendedControl/v1/system/getFeatures',
		        method: 'GET',
			headers: {
				'X-AppName': 'MusicCast/1.0',
				'X-AppPort': '41100',
			}
		},
		function (error, response, body) {
			if (error) {
        			that.log.error('getServices error: ' + error.message);
			} else {
				that.features=JSON.parse(body);
				that.log.debug("func_list: " + JSON.stringify(that.features.system.func_list) + 
					", zone_num: " + JSON.stringify(that.features.system.zone_num));
				that.log.debug("zone: " + JSON.stringify(that.features.zone));
			}
		});
		
		let TelevisionService = new Service.Television(this.name);
		TelevisionService
			.setCharacteristic(Characteristic.ConfiguredName, this.name);
		TelevisionService
			.setCharacteristic(Characteristic.SleepDiscoveryMode, 1);
		TelevisionService
			.getCharacteristic(Characteristic.Active)
				.on('get', this.getActive.bind(this))
				.on('set', this.setActive.bind(this));
		TelevisionService
			.getCharacteristic(Characteristic.ActiveIdentifier)
				.on('get', this.getActiveIdentifier.bind(this))
				.on('set', this.setActiveIdentifier.bind(this));
		TelevisionService
			.getCharacteristic(Characteristic.RemoteKey)
				.on('set', this.remoteKeyPress.bind(this));
		setInterval(() => {
			this.getHttpInput();
			TelevisionService.getCharacteristic(Characteristic.Active)
				.updateValue(this.active);
			TelevisionService.getCharacteristic(Characteristic.ActiveIdentifier)
				.updateValue(this.ActiveIdentifier);
		}, this.updateInterval);
		/*TelevisionService
			.getCharacteristic(Characteristic.PowerModeSelection)//used to send a command that opens setting on TV
				.on('set', this.setPowerModeSelection.bind(this));//0=Show Menu
		TelevisionService
			.getCharacteristic(Characteristic.CurrentMediaState)
				.on('get', this.getCurrentMediaState.bind(this));
		TelevisionService
			.getCharacteristic(Characteristic.TargetMediaState)
				.on('get', this.getTargetMediaState.bind(this))
				.on('set', this.setTargetMediaState.bind(this));
		setInterval(() => {
			TelevisionService.getCharacteristic(Characteristic.CurrentMediaState)
				.updateValue(this.CurrentMediaState);
		}, this.updateInterval);*/
		//TelevisionService.category=this.category;
		this.TelevisionService = TelevisionService;
		ServiceList.push(TelevisionService);
		
		let TelevisionSpeakerService = new Service.TelevisionSpeaker(this.name + 'SpeakerService');
		TelevisionSpeakerService
			.setCharacteristic(Characteristic.Active, Characteristic.Active.ACTIVE)
			.setCharacteristic(Characteristic.VolumeControlType, 3);
			//0 NONE; 1 RELATIVE; 2 RELATIVE_WITH_CURRENT; 3 ABSOLUTE;
		TelevisionSpeakerService
			.getCharacteristic(Characteristic.VolumeSelector)//0 INCREMENT; 1 DECREMENT
				.on('set', this.setVolumeSelector.bind(this));
		TelevisionSpeakerService
			.getCharacteristic(Characteristic.Mute) //not triggered via home app
				.on('get', this.getMute.bind(this))
				.on('set', this.setMute.bind(this));
		TelevisionSpeakerService
			.getCharacteristic(Characteristic.Volume) //not triggered via home app
				.on('get', this.getFakeVolume.bind(this))
				.on('set', this.setFakeVolume.bind(this));
		TelevisionService.addLinkedService(TelevisionSpeakerService);
		this.TelevisionSpeakerService = TelevisionSpeakerService;
		ServiceList.push(TelevisionSpeakerService);
		
		if(this.volumeFan) {
			let TelevisionFanService = new Service.SmartSpeaker(this.volumeName);
//			TelevisionFanService
//				.getCharacteristic(Characteristic.On)
//					.on('get', this.getActive.bind(this));
			TelevisionFanService
				.getCharacteristic(Characteristic.Volume)
					.on('get', this.getFakeVolume.bind(this))
					.on('set', this.setFakeVolume.bind(this));
			TelevisionService.addLinkedService(TelevisionFanService);
			this.TelevisionFanService = TelevisionFanService;
			ServiceList.push(TelevisionFanService);
		}
		
		if(this.buttonNumber) {
			let TelevisionButtonService = new Service.Switch(this.buttonName);
			TelevisionButtonService
				.getCharacteristic(Characteristic.On)
					.on('get', this.getButton.bind(this))
					.on('set', this.setButton.bind(this));
			TelevisionService.addLinkedService(TelevisionButtonService);
			this.TelevisionButtonService = TelevisionButtonService;
			ServiceList.push(TelevisionButtonService);
		}
		
		for(var key in this.inputs) {
			this.log.debug("processing input " + key);
			var tmpInput = this.getInputFromString(key);
			
			switch (tmpInput) {
				case "airplay":
					this.airplayService = this.getInputService("airplay");
					TelevisionService.addLinkedService(this.airplayService);
					ServiceList.push(this.airplayService);
					break;
				case "phono":
					this.phonoService = this.getInputService("phono");
					TelevisionService.addLinkedService(this.phonoService);
					ServiceList.push(this.phonoService);
					break;
				case "line_cd":
					this.line_cdService = this.getInputService("line_cd");
					TelevisionService.addLinkedService(this.line_cdService);
					ServiceList.push(this.line_cdService);
					break;
				case "line1":
					this.line1Service = this.getInputService("line1");
					TelevisionService.addLinkedService(this.line1Service);
					ServiceList.push(this.line1Service);
					break;
				case "line2":
					this.line2Service = this.getInputService("line2");
					TelevisionService.addLinkedService(this.line2Service);
					ServiceList.push(this.line2Service);
					break;
				case "line3":
					this.line3Service = this.getInputService("line3");
					TelevisionService.addLinkedService(this.line3Service);
					ServiceList.push(this.line3Service);
					break;
				case "fm":
					this.fmService = this.getInputService("fm");
					TelevisionService.addLinkedService(this.fmService);
					ServiceList.push(this.fmService);
					break;
				case "am":
					this.amService = this.getInputService("am");
					TelevisionService.addLinkedService(this.amService);
					ServiceList.push(this.amService);
					break;
				case "dab":
					this.dabService = this.getInputService("dab");
					TelevisionService.addLinkedService(this.dabService);
					ServiceList.push(this.dabService);
					break;
				case "net_radio":
					this.net_radioService = this.getInputService("net_radio");
					TelevisionService.addLinkedService(this.net_radioService);
					ServiceList.push(this.net_radioService);
					break;
				case "server":
					this.serverService = this.getInputService("server");
					TelevisionService.addLinkedService(this.serverService);
					ServiceList.push(this.serverService);
					break;
				case "bluetooth":
					this.bluetoothService = this.getInputService("bluetooth");
					TelevisionService.addLinkedService(this.bluetoothService);
					ServiceList.push(this.bluetoothService);
					break;
				case "usb":
					this.usbService = this.getInputService("usb");
					TelevisionService.addLinkedService(this.usbService);
					ServiceList.push(this.usbService);
					break;
				case "usb_dac":
					this.usb_dacService = this.getInputService("usb_dac");
					TelevisionService.addLinkedService(this.usb_dacService);
					ServiceList.push(this.usb_dacService);
					break;
				case "optical":
					this.opticalService = this.getInputService("optical");
					TelevisionService.addLinkedService(this.opticalService);
					ServiceList.push(this.opticalService);
					break;
				case "optical1":
					this.optical1Service = this.getInputService("optical1");
					TelevisionService.addLinkedService(this.optical1Service);
					ServiceList.push(this.optical1Service);
					break;
				case "optical2":
					this.optical2Service = this.getInputService("optical2");
					TelevisionService.addLinkedService(this.optical2Service);
					ServiceList.push(this.optical2Service);
					break;
				case "coaxial":
					this.coaxialService = this.getInputService("coaxial");
					TelevisionService.addLinkedService(this.coaxialService);
					ServiceList.push(this.coaxialService);
					break;
				case "coaxial1":
					this.coaxial1Service = this.getInputService("coaxial1");
					TelevisionService.addLinkedService(this.coaxial1Service);
					ServiceList.push(this.coaxial1Service);
					break;
				case "coaxial2":
					this.coaxial2Service = this.getInputService("coaxial2");
					TelevisionService.addLinkedService(this.coaxial2Service);
					ServiceList.push(this.coaxial2Service);
					break;
				case "hdmi":
					this.hdmiService = this.getInputService("hdmi");
					TelevisionService.addLinkedService(this.hdmiService);
					ServiceList.push(this.hdmiService);
					break;
				case "hdmi1":
					this.hdmi1Service = this.getInputService("hdmi1");
					TelevisionService.addLinkedService(this.hdmi1Service);
					ServiceList.push(this.hdmi1Service);
					break;
				case "hdmi2":
					this.hdmi2Service = this.getInputService("hdmi2");
					TelevisionService.addLinkedService(this.hdmi2Service);
					ServiceList.push(this.hdmi2Service);
					break;
				case "hdmi3":
					this.hdmi3Service = this.getInputService("hdmi3");
					TelevisionService.addLinkedService(this.hdmi3Service);
					ServiceList.push(this.hdmi3Service);
					break;
				case "hdmi4":
					this.hdmi4Service = this.getInputService("hdmi4");
					TelevisionService.addLinkedService(this.hdmi4Service);
					ServiceList.push(this.hdmi4Service);
					break;
				case "hdmi5":
					this.hdmi5Service = this.getInputService("hdmi5");
					TelevisionService.addLinkedService(this.hdmi5Service);
					ServiceList.push(this.hdmi5Service);
					break;
				case "hdmi6":
					this.hdmi6Service = this.getInputService("hdmi6");
					TelevisionService.addLinkedService(this.hdmi6Service);
					ServiceList.push(this.hdmi6Service);
					break;
				case "hdmi7":
					this.hdmi7Service = this.getInputService("hdmi7");
					TelevisionService.addLinkedService(this.hdmi7Service);
					ServiceList.push(this.hdmi7Service);
					break;
				case "hdmi8":
					this.hdmi8Service = this.getInputService("hdmi8");
					TelevisionService.addLinkedService(this.hdmi8Service);
					ServiceList.push(this.hdmi8Service);
					break;
				case "aux":
					this.auxService = this.getInputService("aux");
					TelevisionService.addLinkedService(this.auxService);
					ServiceList.push(this.auxService);
					break;
				case "aux1":
					this.aux1Service = this.getInputService("aux1");
					TelevisionService.addLinkedService(this.aux1Service);
					ServiceList.push(this.aux1Service);
					break;
				case "aux2":
					this.aux2Service = this.getInputService("aux2");
					TelevisionService.addLinkedService(this.aux2Service);
					ServiceList.push(this.aux2Service);
					break;
				case "v_aux":
					this.v_auxService = this.getInputService("v_aux");
					TelevisionService.addLinkedService(this.v_auxService);
					ServiceList.push(this.v_auxService);
					break;
				case "av1":
					this.av1Service = this.getInputService("av1");
					TelevisionService.addLinkedService(this.av1Service);
					ServiceList.push(this.av1Service);
					break;
				case "av2":
					this.av2Service = this.getInputService("av2");
					TelevisionService.addLinkedService(this.av2Service);
					ServiceList.push(this.av2Service);
					break;
				case "av3":
					this.av3Service = this.getInputService("av3");
					TelevisionService.addLinkedService(this.av3Service);
					ServiceList.push(this.av3Service);
					break;
				case "av4":
					this.av4Service = this.getInputService("av4");
					TelevisionService.addLinkedService(this.av4Service);
					ServiceList.push(this.av4Service);
					break;
				case "av5":
					this.av5Service = this.getInputService("av5");
					TelevisionService.addLinkedService(this.av5Service);
					ServiceList.push(this.av5Service);
					break;
				case "av6":
					this.av6Service = this.getInputService("av6");
					TelevisionService.addLinkedService(this.av6Service);
					ServiceList.push(this.av6Service);
					break;
				case "av7":
					this.av7Service = this.getInputService("av7");
					TelevisionService.addLinkedService(this.av7Service);
					ServiceList.push(this.av7Service);
					break;
				case "cd":
					this.cdService = this.getInputService("cd");
					TelevisionService.addLinkedService(this.cdService);
					ServiceList.push(this.cdService);
					break;
				case "tv":
					this.tvService = this.getInputService("tv");
					TelevisionService.addLinkedService(this.tvService);
					ServiceList.push(this.tvService);
					break;
				case "analog":
					this.analogService = this.getInputService("analog");
					TelevisionService.addLinkedService(this.analogService);
					ServiceList.push(this.analogService);
					break;
				case "multi_ch":
					this.multi_chService = this.getInputService("multi_ch");
					TelevisionService.addLinkedService(this.multi_chService);
					ServiceList.push(this.multi_chService);
					break;
				case "audio":
					this.audioService = this.getInputService("audio");
					TelevisionService.addLinkedService(this.audioService);
					ServiceList.push(this.audioService);
					break;
				case "audio1":
					this.audio1Service = this.getInputService("audio1");
					TelevisionService.addLinkedService(this.audio1Service);
					ServiceList.push(this.audio1Service);
					break;
				case "audio2":
					this.audio2Service = this.getInputService("audio2");
					TelevisionService.addLinkedService(this.audio2Service);
					ServiceList.push(this.audio2Service);
					break;
				case "audio3":
					this.audio3Service = this.getInputService("audio3");
					TelevisionService.addLinkedService(this.audio3Service);
					ServiceList.push(this.audio3Service);
					break;
				case "audio4":
					this.audio4Service = this.getInputService("audio4");
					TelevisionService.addLinkedService(this.audio4Service);
					ServiceList.push(this.audio4Service);
					break;
				case "audio_cd":
					this.audio_cdService = this.getInputService("audio_cd");
					TelevisionService.addLinkedService(this.audio_cdService);
					ServiceList.push(this.audio_cdService);
					break;
				case "digital":
					this.digitalService = this.getInputService("digital");
					TelevisionService.addLinkedService(this.digitalService);
					ServiceList.push(this.digitalService);
					break;
				case "digital1":
					this.digital1Service = this.getInputService("digital1");
					TelevisionService.addLinkedService(this.digital1Service);
					ServiceList.push(this.digital1Service);
					break;
				case "digital2":
					this.digital2Service = this.getInputService("digital2");
					TelevisionService.addLinkedService(this.digital2Service);
					ServiceList.push(this.digital2Service);
					break;
				case "bd_dvd":
					this.bd_dvdService = this.getInputService("bd_dvd");
					TelevisionService.addLinkedService(this.bd_dvdService);
					ServiceList.push(this.bd_dvdService);
					break;
				case "mc_link":
					this.mc_linkService = this.getInputService("mc_link");
					TelevisionService.addLinkedService(this.mc_linkService);
					ServiceList.push(this.mc_linkService);
					break;
				/*case "main_sync":
					this.main_syncService = this.getInputService("main_sync");
					TelevisionService.addLinkedService(this.main_syncService);
					ServiceList.push(this.main_syncService);
					break;*/
				case "spotify":
					this.spotifyService = this.getInputService("spotify");
					TelevisionService.addLinkedService(this.spotifyService);
					ServiceList.push(this.spotifyService);
					break;
				case "amazon_music":
					this.amazon_musicService = this.getInputService("amazon_music");
					TelevisionService.addLinkedService(this.amazon_musicService);
					ServiceList.push(this.amazon_musicService);
					break;
				case "deezer":
					this.deezerService = this.getInputService("deezer");
					TelevisionService.addLinkedService(this.deezerService);
					ServiceList.push(this.deezerService);
					break;
				case "napster":
					this.napsterService = this.getInputService("napster");
					TelevisionService.addLinkedService(this.napsterService);
					ServiceList.push(this.napsterService);
					break;
				case "qobuz":
					this.qobuzService = this.getInputService("qobuz");
					TelevisionService.addLinkedService(this.qobuzService);
					ServiceList.push(this.qobuzService);
					break;
				case "juke":
					this.jukeService = this.getInputService("juke");
					TelevisionService.addLinkedService(this.jukeService);
					ServiceList.push(this.jukeService);
					break;
				case "tidal":
					this.tidalService = this.getInputService("tidal");
					TelevisionService.addLinkedService(this.tidalService);
					ServiceList.push(this.tidalService);
					break;
				case "pandora":
					this.pandoraService = this.getInputService("pandora");
					TelevisionService.addLinkedService(this.pandoraService);
					ServiceList.push(this.pandoraService);
					break;
				case "sirusxm":
					this.siriusxmService = this.getInputService("siriusxm");
					TelevisionService.addLinkedService(this.siriusxmService);
					ServiceList.push(this.siriusxmService);
					break;
				case "radiko":
					this.radikoService = this.getInputService("radiko");
					TelevisionService.addLinkedService(this.radikoService);
					ServiceList.push(this.radikoService);
					break;
				case "alexa":
					this.alexaService = this.getInputService("alexa");
					TelevisionService.addLinkedService(this.alexaService);
					ServiceList.push(this.alexaService);
					break;
				default:
					this.log.error("input " + key + " not found");
					this.log("please file a feature request and include this log");
					this.log("zone features: " + this.features.zone);
			}
		}
		/*eval("InputService" + i + ".setCharacteristic(Characteristic.InputSourceType, this.inputs[key]['InputSourceType'])");
			//0=OTHER;1=HOME_SCREEN;2=TUNER;3=HDMI; 4=COMPOSITE_VIDEO;5=S_VIDEO;
			//6=COMPONENT_VIDEO;7=DVI;8=AIRPLAY;9=USB;10=APPLICATION;
		eval("InputService" + i + ".setCharacteristic(Characteristic.InputDeviceType, this.inputs[key]['InputDeviceType'])");
			//0=OTHER;1=TV;2=RECORDING;3=TUNER;4=PLAYBACK;5=AUDIO_SYSTEM;
		};*/
		
		return ServiceList;
	}
}

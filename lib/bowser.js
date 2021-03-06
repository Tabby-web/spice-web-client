/*
    Copyright (c) 2016 eyeOS

    This file is part of Open365.

    Open365 is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as
    published by the Free Software Foundation, either version 3 of the
    License, or (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program. If not, see <http://www.gnu.org/licenses/>.
*/

// Source: https://github.com/ded/bowser

/**
 * README!!!!
 * To solve the error "MISMATCHED ANONYMOUS DEFINE() MODULES ..." (http://requirejs.org/docs/errors.html)
 * It happens when requirejs is defined globally and this script is added
 * in the old fashioned way, i.e. with <script src="..."></script>
 * -> comment just the follow line if it happens!!
 *  else if (typeof define == 'function') define(definition)
 */

!function (name, definition) {
	if (typeof module != 'undefined' && module.exports) module.exports['browser'] = definition()
	/*
	 * problems including this library as classig <script src="..."> in a require
	 * environment, so commenting out the following line (as stated above) while
	 * we prepare a better fix involving requirejs shim.
	 * @kampde, 2014-10-02
	 */
	//else if (typeof define == 'function') define(definition)
	else this[name] = definition()
}('bowser', function () {
	/**
	 * See useragents.js for examples of navigator.userAgent
	 */

	var t = true

	function detect(ua) {

		function getFirstMatch(regex) {
			var match = ua.match(regex);
			return (match && match.length > 1 && match[1]) || '';
		}

		var iosdevice = getFirstMatch(/(ipod|iphone|ipad)/i).toLowerCase()
			, likeAndroid = /like android/i.test(ua)
			, android = !likeAndroid && /android/i.test(ua)
			, versionIdentifier = getFirstMatch(/version\/(\d+(\.\d+)?)/i)
			, tablet = /tablet/i.test(ua)
			, mobile = !tablet && /[^-]mobi/i.test(ua)
			, result

		if (/opera|opr/i.test(ua)) {
			result = {
				name: 'Opera'
				, opera: t
				, version: versionIdentifier || getFirstMatch(/(?:opera|opr)[\s\/](\d+(\.\d+)?)/i)
			}
		}
		else if (/windows phone/i.test(ua)) {
			result = {
				name: 'Windows Phone'
				, windowsphone: t
				, msie: t
				, version: getFirstMatch(/iemobile\/(\d+(\.\d+)?)/i)
			}
		}
		else if (/msie|trident/i.test(ua)) {
			result = {
				name: 'Internet Explorer'
				, msie: t
				, version: getFirstMatch(/(?:msie |rv:)(\d+(\.\d+)?)/i)
			}
		}
		else if (/chrome|crios|crmo/i.test(ua)) {
			result = {
				name: 'Chrome'
				, chrome: t
				, version: getFirstMatch(/(?:chrome|crios|crmo)\/(\d+(\.\d+)?)/i)
			}
		}
		else if (iosdevice) {
			result = {
				name : iosdevice == 'iphone' ? 'iPhone' : iosdevice == 'ipad' ? 'iPad' : 'iPod'
			}
			// WTF: version is not part of user agent in web apps
			if (versionIdentifier) {
				result.version = versionIdentifier
			}
		}
		else if (/sailfish/i.test(ua)) {
			result = {
				name: 'Sailfish'
				, sailfish: t
				, version: getFirstMatch(/sailfish\s?browser\/(\d+(\.\d+)?)/i)
			}
		}
		else if (/seamonkey\//i.test(ua)) {
			result = {
				name: 'SeaMonkey'
				, seamonkey: t
				, version: getFirstMatch(/seamonkey\/(\d+(\.\d+)?)/i)
			}
		}
		else if (/firefox|iceweasel/i.test(ua)) {
			result = {
				name: 'Firefox'
				, firefox: t
				, version: getFirstMatch(/(?:firefox|iceweasel)[ \/](\d+(\.\d+)?)/i)
			}
			if (/\((mobile|tablet);[^\)]*rv:[\d\.]+\)/i.test(ua)) {
				result.firefoxos = t
			}
		}
		else if (/silk/i.test(ua)) {
			result =  {
				name: 'Amazon Silk'
				, silk: t
				, version : getFirstMatch(/silk\/(\d+(\.\d+)?)/i)
			}
		}
		else if (android) {
			result = {
				name: 'Android'
				, version: versionIdentifier
			}
		}
		else if (/phantom/i.test(ua)) {
			result = {
				name: 'PhantomJS'
				, phantom: t
				, version: getFirstMatch(/phantomjs\/(\d+(\.\d+)?)/i)
			}
		}
		else if (/blackberry|\bbb\d+/i.test(ua) || /rim\stablet/i.test(ua)) {
			result = {
				name: 'BlackBerry'
				, blackberry: t
				, version: versionIdentifier || getFirstMatch(/blackberry[\d]+\/(\d+(\.\d+)?)/i)
			}
		}
		else if (/(web|hpw)os/i.test(ua)) {
			result = {
				name: 'WebOS'
				, webos: t
				, version: versionIdentifier || getFirstMatch(/w(?:eb)?osbrowser\/(\d+(\.\d+)?)/i)
			};
			/touchpad\//i.test(ua) && (result.touchpad = t)
		}
		else if (/bada/i.test(ua)) {
			result = {
				name: 'Bada'
				, bada: t
				, version: getFirstMatch(/dolfin\/(\d+(\.\d+)?)/i)
			};
		}
		else if (/tizen/i.test(ua)) {
			result = {
				name: 'Tizen'
				, tizen: t
				, version: getFirstMatch(/(?:tizen\s?)?browser\/(\d+(\.\d+)?)/i) || versionIdentifier
			};
		}
		else if (/safari/i.test(ua)) {
			result = {
				name: 'Safari'
				, safari: t
				, version: versionIdentifier
			}
		}
		else result = {}

		// set webkit or gecko flag for browsers based on these engines
		if (/(apple)?webkit/i.test(ua)) {
			result.name = result.name || "Webkit"
			result.webkit = t
			if (!result.version && versionIdentifier) {
				result.version = versionIdentifier
			}
		} else if (!result.opera && /gecko\//i.test(ua)) {
			result.name = result.name || "Gecko"
			result.gecko = t
			result.version = result.version || getFirstMatch(/gecko\/(\d+(\.\d+)?)/i)
		}

		// set OS flags for platforms that have multiple browsers
		if (android || result.silk) {
			result.android = t
		} else if (iosdevice) {
			result[iosdevice] = t
			result.ios = t
		}

		// OS version extraction
		var osVersion = '';
		if (iosdevice) {
			osVersion = getFirstMatch(/os (\d+([_\s]\d+)*) like mac os x/i);
			osVersion = osVersion.replace(/[_\s]/g, '.');
		} else if (android) {
			osVersion = getFirstMatch(/android[ \/-](\d+(\.\d+)*)/i);
		} else if (result.windowsphone) {
			osVersion = getFirstMatch(/windows phone (?:os)?\s?(\d+(\.\d+)*)/i);
		} else if (result.webos) {
			osVersion = getFirstMatch(/(?:web|hpw)os\/(\d+(\.\d+)*)/i);
		} else if (result.blackberry) {
			osVersion = getFirstMatch(/rim\stablet\sos\s(\d+(\.\d+)*)/i);
		} else if (result.bada) {
			osVersion = getFirstMatch(/bada\/(\d+(\.\d+)*)/i);
		} else if (result.tizen) {
			osVersion = getFirstMatch(/tizen[\/\s](\d+(\.\d+)*)/i);
		}
		if (osVersion) {
			result.osversion = osVersion;
		}

		// device type extraction
		var osMajorVersion = osVersion.split('.')[0];
		if (tablet || iosdevice == 'ipad' || (android && (osMajorVersion == 3 || (osMajorVersion == 4 && !mobile))) || result.silk) {
			result.tablet = t
		} else if (mobile || iosdevice == 'iphone' || iosdevice == 'ipod' || android || result.blackberry || result.webos || result.bada) {
			result.mobile = t
		}

		// Graded Browser Support
		// http://developer.yahoo.com/yui/articles/gbs
		if ((result.msie && result.version >= 9) ||
			(result.chrome && result.version >= 20) ||
			(result.firefox && result.version >= 10.0) ||
			(result.safari && result.version >= 5) ||
			(result.opera && result.version >= 10.0) ||
			(result.ios && result.osversion && result.osversion.split(".")[0] >= 6)
			) {
			result.a = t;
		}
		else if ((result.msie && result.version < 9) ||
			(result.chrome && result.version < 20) ||
			(result.firefox && result.version < 10.0) ||
			(result.safari && result.version < 5) ||
			(result.opera && result.version < 10.0) ||
			(result.ios && result.osversion && result.osversion.split(".")[0] < 6)
			) {
			result.c = t
		} else result.x = t

		return result
	}

	var bowser = detect(typeof navigator !== 'undefined' ? navigator.userAgent : '')


	/*
	 * Set our detect method to the main bowser object so we can
	 * reuse it to test other user agents.
	 * This is needed to implement future tests.
	 */
	bowser._detect = detect;

	/**
	 * README: all_compiled uses window["bowser]
	 */
	if (!window['bowser']) {
		window['bowser'] = bowser;
	}
	
	return bowser
});

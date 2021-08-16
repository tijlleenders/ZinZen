'use strict';

//_config vars provided by /config/config.js:

//Convert Payload from Base64-URL to JSON
const decodePayload = payload => {
    const cleanedPayload = payload.replace(/-/g, '+').replace(/_/g, '/');
    const decodedPayload = atob(cleanedPayload)
    const uriEncodedPayload = Array.from(decodedPayload).reduce((acc, char) => {
        const uriEncodedChar = ('00' + char.charCodeAt(0).toString(16)).slice(-2)
        return `${acc}%${uriEncodedChar}`
    }, '')
    const jsonPayload = decodeURIComponent(uriEncodedPayload);

    return JSON.parse(jsonPayload)
}

//Parse JWT Payload
const parseJWTPayload = token => {
    const [header, payload, signature] = token.split('.');
    const jsonPayload = decodePayload(payload)

    return jsonPayload
};

//Parse JWT Header
const parseJWTHeader = token => {
    const [header, payload, signature] = token.split('.');
    const jsonHeader = decodePayload(header)

    return jsonHeader
};

//Generate a Random String
const getRandomString = () => {
    const randomItems = new Uint32Array(28);
    crypto.getRandomValues(randomItems);
    const binaryStringItems = randomItems.map(dec => `0${dec.toString(16).substr(-2)}`)
    return binaryStringItems.reduce((acc, item) => `${acc}${item}`, '');
}

//Encrypt a String with SHA256
const encryptStringWithSHA256 = async str => {
    const PROTOCOL = 'SHA-256'
    const textEncoder = new TextEncoder();
    const encodedData = textEncoder.encode(str);
    return crypto.subtle.digest(PROTOCOL, encodedData);
}

//Convert Hash to Base64-URL
const hashToBase64url = arrayBuffer => {
    const items = new Uint8Array(arrayBuffer)
    const stringifiedArrayHash = items.reduce((acc, i) => `${acc}${String.fromCharCode(i)}`, '')
    const decodedHash = btoa(stringifiedArrayHash)

    const base64URL = decodedHash.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    return base64URL
}

function createSessionPKCEState() {
    sessionStorage.setItem("pkce_state", getRandomString());
}

function createSessionPKCECodeVerifier() {
    sessionStorage.setItem("code_verifier", getRandomString());
}

async function createSessionPKCECodeChallenge() {

    var arrayHash = await encryptStringWithSHA256(sessionStorage.getItem('code_verifier'));
    var code_challenge = hashToBase64url(arrayHash);
    sessionStorage.setItem("code_challenge", code_challenge)
}

function redirectToLoginPage() { //NOT used as redirectUserAgentToAuthorizeEndpoint using code + state is considered best practice
    location.href = "https://" + _config.domain + "/login?client_id=" + _config.appClientId + "&response_type=code&scope=email+openid&redirect_uri=" + _config.redirectURI
}

async function redirectUserAgentToAuthorizeEndpoint() {
    createSessionPKCEState()
    createSessionPKCECodeVerifier()
    createSessionPKCECodeChallenge()
        .then(result => {
            location.href = "https://" + _config.domain + "/oauth2/authorize?response_type=code&state=" + sessionStorage.getItem('pkce_state') + "&client_id=" + _config.appClientId + "&redirect_uri=" + _config.redirectURI + "&scope=openid&code_challenge_method=S256&code_challenge=" + sessionStorage.getItem('code_challenge');
        })
}

async function redirectUserAgentToLoginEndpoint() {
    createSessionPKCEState()
    createSessionPKCECodeVerifier()
    createSessionPKCECodeChallenge()
        .then(result => {
            location.href = "https://" + _config.domain + "/login?response_type=code&state=" + sessionStorage.getItem('pkce_state') + "&client_id=" + _config.appClientId + "&redirect_uri=" + _config.redirectURI + "&scope=openid&code_challenge_method=S256&code_challenge=" + sessionStorage.getItem('code_challenge');
        })
}

async function redirectUserAgentToSignupEndpoint() {
    createSessionPKCEState()
    createSessionPKCECodeVerifier()
    createSessionPKCECodeChallenge()
        .then(result => {
            location.href = "https://" + _config.domain + "/signup?response_type=code&state=" + sessionStorage.getItem('pkce_state') + "&client_id=" + _config.appClientId + "&redirect_uri=" + _config.redirectURI + "&scope=openid&code_challenge_method=S256&code_challenge=" + sessionStorage.getItem('code_challenge');
        })
}

async function requestToken(code) {
    try {
        console.log("requesting tokens with code:", code)
        if (code == null) throw "code is null"

        // Fetch OAuth2 tokens from Cognito
        //TODO: put in try/(catch and redirect to login)
        var sessionCodeVerifier = sessionStorage.getItem('code_verifier'); // Necessary extra step for PKCE
        var response = await fetch("https://" + _config.domain + "/oauth2/token?grant_type=authorization_code&client_id=" + _config.appClientId + "&code_verifier=" + sessionCodeVerifier + "&redirect_uri=" + _config.redirectURI + "&code=" + code, {
            method: 'post',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })

        console.log("HTTP response from Cognito:", response)
        if (response.status != 200) {
            throw "Did not get status 200 back for token fetch"
        }

        var tokens = await response.json()
        sessionStorage.setItem("id_token", tokens.id_token)
        sessionStorage.setItem("access_token", tokens.access_token)
        console.log("resolved stream from HTTP response Cognito:", tokens)

        // Fetch from /user_info
        // NOT needed at the moment - unneccessary call
        // fetch("https://" + _config.domain + "/oauth2/userInfo", {
        //     method: 'post',
        //     headers: {
        //         'authorization': 'Bearer ' + tokens.access_token
        //     }
        // })
        //     .then((response) => {
        //         return response.json();
        //     })
        //     .then((data) => {
        //         let userInfo = JSON.stringify(data, null, '\t')
        //     });

        return tokens.id_token

    } catch (err) {
        throw "error in requestToken:", err
    }
}
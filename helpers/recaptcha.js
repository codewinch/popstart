/* Google recaptcha.
 * Example:
 * <div
 *		submit=__.recaptcha,__.scrape,__.post,__.switch
 *		recaptcha-sitekey=6LeoAAAA-RUGAjNNg-l_
 *		recaptcha-action=signup
 * Replace 6LeoAAAA-RUGAjNNg-l_ with your reCAPTCHA key.
 * Don't forget:
 * <script src="https://www.google.com/recaptcha/api.js?render=6LeoAAAA-RUGAjNNg-l_"></script>
 *
 */

// __.recaptcha: process Google's recaptcha and write the token to __.data
__.recaptcha = function(sitekey,action,writedatapath,keyname){
		let t=this
		return grecaptcha.execute(sitekey,{action:action})
		.then(function(token){
			info("ReCAPTCHA received token",writedatapath, "TOKEN:",token)
			if(keyname===undefined)keyname="token"
			if(writedatapath)__.datawrite(writedatapath,keyname,token)
			info("ReCAPTCHA received token",token)
			__.append(t, `<input name=recaptchaToken value="${token}" style=display:none>`)
		})
}

/* Google recaptcha.
 * Example:
 * <div
 *		submit=__.recaptcha,__.scrape,__.post,__.switch
 *		recaptcha-sitekey=6LeojANnhXoAfMgAAAA-RUGAzcU4herTfjNNg-l_
 *		recaptcha-action=signup
 * Don't forget:
 * <script src="https://www.google.com/recaptcha/api.js?render=reCAPTCHA_site_key"></script>
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

app.init=function(){
	app.cart.init();
	app.get('#profileInfo').click();
	app.initProfile(app.state.auth);
	let inTitle = app.get("#inTitle");
	let upTitle = app.get("#upTitle");
	inTitle.addEventListener('click', app.evts.mobileSignInStyle);
	upTitle.addEventListener('click', app.evts.mobileSignUpStyle);
	let logoutBtn = app.get('#logoutBtn');
	logoutBtn.addEventListener('click', app.evts.logout);
	let signUpBtn = app.get('#signUpBtn');
	signUpBtn.addEventListener('click', app.evts.signUp);
	let signInBtn = app.get('#signInBtn');
	signInBtn.addEventListener('click', app.evts.signIn);
	let fbLoginBtn= app.get('#fbLoginBtn');
	fbLoginBtn.addEventListener('click', app.fb.checkLoginState);
	let allOrderBtn = app.get('#orderAll');
	allOrderBtn.addEventListener('click', app.evts.getAllOrder);
};
app.initProfile=function(data){
	// 如果沒登入 → 登入註冊畫面
	if(app.state.provider===null){
		app.get("#signWrap").style.display = "flex";
		app.get("#view").style.display = "none";
	} else {
		// 有登入 → 個人資訊畫面
		app.get("#signWrap").style.display = "none";
		app.get("#view").style.display = "flex";
		app.showProfile(data.user);
	}
};
app.evts.logout=function(e){
	e.preventDefault();
	if(app.state.provider === 'facebook'){
		FB.api('/me/permissions', 'delete', function(response) {
			localStorage.removeItem('stylish_login');
			localStorage.removeItem('justOnce');
			alert('您已登出 Stylish'); // true for successful logout.
			window.location = "./";
		});
	}else if(app.state.provider === 'native') {
		localStorage.removeItem('stylish_login');
		alert('您已登出 Stylish');
		window.location = "./";
	}
}
app.evts.signIn=function(e){
	e.preventDefault();
	let inFormData = new FormData(app.get('#inForm'));
	let data={
		provider:'native',
		email: inFormData.get('signInEmail'),
		password: inFormData.get('signInPw')
	}
	app.ajax("post", app.cst.API_HOST+"/user/signin", data, {}, function(req){
		let result=JSON.parse(req.responseText);
		if(result.error){
			console.log("Stylish 登入 failed", result.error);
		}else{
			console.log("Stlish 登入成功", result);
			localStorage.setItem('stylish_login', JSON.stringify(result));
			window.location = './profile.html';
		}
	});
}
app.evts.signUp=function(e){
	e.preventDefault();
	let upFormData = new FormData(app.get('#upForm'));
	let data={
		name: upFormData.get('signUpName'),
		email: upFormData.get('signUpEmail'),
		password: upFormData.get('signUpPw')
	}
	app.ajax("post", app.cst.API_HOST+"/user/signup", data, {}, function(req){
		let result=JSON.parse(req.responseText);
		if(result.error){
			console.log("註冊 failed", result.error);
		}else{
			console.log("註冊成功", result);
			alert('請到email收取認證信，認證過後才算註冊成功喔！');
			window.location = './';
		}
	});
}
app.evts.mobileSignInStyle=function(){
	let inForm=app.get('#inForm');
		if(inForm.className === "signForm signFormGrow") {
			inForm.classList.remove('signFormGrow');
		} else {
			inForm.classList.add('signFormGrow');
		}
}
app.evts.mobileSignUpStyle=function(){
	let upForm=app.get('#upForm');
		if(upForm.className === "signForm signFormGrow") {
			upForm.classList.remove('signFormGrow');
		} else {
			upForm.classList.add('signFormGrow');
		}
}
app.evts.getAllOrder=function(){
	console.log(app.state.auth);
	let headers={};
	if(app.state.auth!==null){
		headers["Authorization"]="Bearer "+app.state.auth.access_token;
	}
	app.ajax("get", app.cst.API_HOST+"/order/search", "", headers, function(req){
		let result =JSON.parse(req.responseText);
		console.log(result);	
		app.showAllOrder(result);
	});
};
app.showAllOrder=function(data){

}
showPanel=function(panelIndex, colorCode) {
	let tabBtns=app.getAll('.settingsBtns button');
	let panels=app.getAll('.panel');
	tabBtns.forEach(tb => {
		tb.style.border='';
		tb.style.color='';
	});
	tabBtns[panelIndex].style.border='1px solid #3f3a3a';
	tabBtns[panelIndex].style.color="#8b572a";
	panels.forEach(pn => {
		pn.style.display = "none";
	});
	panels[panelIndex].style.display='block';
	panels[panelIndex].style.backgroundColor=colorCode;
}
app.showProfile=function(data){
	if (data.picture===null || data.picture===undefined) {
		app.get("#profile-picture").src="./imgs/default_icon.png";
	} else {
		app.get("#profile-picture").src=`${data.picture}`;
	}
	let details=app.get("#profile-details");
	app.createElement("div", {atrs:{
		className:"name", textContent:data.name
	}}, details);
	app.createElement("div", {atrs:{
		className:"email", textContent:data.email
	}}, details);
};
window.addEventListener("DOMContentLoaded", app.init);
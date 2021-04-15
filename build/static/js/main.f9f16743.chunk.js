(this["webpackJsonpportolio-front-end"]=this["webpackJsonpportolio-front-end"]||[]).push([[0],{29:function(e,t,n){},56:function(e,t,n){"use strict";n.r(t);var r=n(0),a=n(1),s=n.n(a),c=n(21),o=n.n(c),i=(n(29),n(2)),l=n(4),u=n(3),h=n(22);function d(e){return Object(r.jsx)("nav",{children:Object(r.jsxs)("div",{className:"wrapper",children:[Object(r.jsx)("button",{onClick:function(){return e.openPage("home")},className:"home-button",children:"PORTFOLIO OPTIMISER"}),Object(r.jsx)("div",{className:"right",children:e.user?Object(r.jsxs)(r.Fragment,{children:[Object(r.jsx)("button",{onClick:function(){return e.openPage("portfolio")},children:"My Portfolio"}),Object(r.jsx)("button",{onClick:function(){return e.openPage("optimise")},children:"Optimise"}),Object(r.jsx)("button",{onClick:function(){return e.logout()},children:"Logout"})]}):Object(r.jsx)("button",{onClick:function(){return e.openPage("account")},children:"Login"})})]})})}function p(e){var t=e.children,n=e.closeEarly;return Object(r.jsx)("div",{className:"wrapper",children:Object(r.jsxs)("div",{className:t.error?"pop-up red":"pop-up green",children:[t.message,Object(r.jsx)("button",{className:"close-button",onClick:function(){return n(t)},children:Object(r.jsx)("i",{className:"fa fa-times"})})]})})}var j=n.p+"static/media/visualisation.53cc120e.mp4";function m(e){var t=e.openPage;return Object(r.jsxs)("div",{className:"home wrapper",children:[Object(r.jsx)("h1",{children:"PORTFOLIO OPTIMISER"}),Object(r.jsxs)("h2",{children:["Helping you to invest only in the market's most",Object(r.jsx)("span",{className:"blue",children:" optimal"})," porfolios..."]}),Object(r.jsx)("video",{autoPlay:!0,loop:!0,muted:!0,children:Object(r.jsx)("source",{src:j,type:"video/mp4"})}),Object(r.jsx)("button",{onClick:function(){return t("account")},children:"Start Investing Now!"})]})}var b=n(8),f=n(5),O=n.n(f),g=function(e){Object(l.a)(n,e);var t=Object(u.a)(n);function n(e){var a;return Object(i.a)(this,n),(a=t.call(this,e)).handleChange=function(e){a.setState(Object(b.a)({},e.target.name,e.target.value))},a.loginUser=function(e){e.preventDefault();var t=a.props,n=t.openPage,r=t.login,s=t.popUp,c={email:a.state.email,password:a.state.password};O.a.post("".concat("https://gh0stmod.com","/user/login"),{user:c},{crossDomain:!1}).then((function(e){r(e.data.shortAccessToken,e.data.fullAccessToken),n("portfolio")})).catch((function(e){if(!e.response)return s("Failed to connect to server, please try again soon.",!0);var t=e.response.status;return s(404===t||401===t?"The account information you provided is incorrect.":412===t?"You must verify your email before logging in.":"Unknown Error, please contact alantollett@outlook.com.",!0)}))},a.render=function(){return Object(r.jsxs)("div",{className:"grid-item",children:[Object(r.jsx)("h1",{children:"Sign In"}),Object(r.jsxs)("form",{children:[Object(r.jsx)("label",{children:"Email"}),Object(r.jsx)("input",{type:"email",name:"email",onChange:a.handleChange}),Object(r.jsx)("label",{children:"Password"}),Object(r.jsx)("input",{type:"password",name:"password",onChange:a.handleChange}),Object(r.jsx)("button",{onClick:a.loginUser,children:"Sign In"})]})]})},a.state={email:null,password:null},a}return n}(s.a.Component),x=function(e){Object(l.a)(n,e);var t=Object(u.a)(n);function n(e){var a;return Object(i.a)(this,n),(a=t.call(this,e)).handleChange=function(e){a.setState(Object(b.a)({},e.target.name,e.target.value))},a.areInputsValid=function(){var e=a.state,t=e.email,n=e.email2,r=e.password,s=e.password2,c=a.props.popUp;return null==t||null==n||t!==n?(c("Please enter two matching emails.",!0),!1):null==r||null==s||r!==s?(c("Please enter two matching passwords.",!0),!1):!!new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})").test(r)||(c("Your password must contain at least one uppercase, lowercase, and numerical character, and be at least 8 characters long.",!0),!1)},a.registerUser=function(e){e.preventDefault();var t=a.props.popUp,n=a.state,r=n.email,s=n.password;if(a.areInputsValid()){var c={email:r,password:s};O.a.post("".concat("https://gh0stmod.com","/user/register"),{user:c},{crossDomain:!1}).then((function(e){t("Please check your email to verify your account.",!1)})).catch((function(e){if(!e.response)return t("Failed to connect to server, please try again soon.",!0);var n=e.response.status;return t(409===n?"An account with that email address already exists.":500===n?"Internal Server Error, please contact alantollett@outlook.com.":"Unknown Error, please contact alantollett@outlook.com.",!0)}))}},a.render=function(){return Object(r.jsxs)("div",{className:"grid-item",children:[Object(r.jsx)("h1",{children:"Sign Up"}),Object(r.jsxs)("form",{children:[Object(r.jsx)("label",{children:"Email"}),Object(r.jsx)("input",{type:"email",name:"email",onChange:a.handleChange}),Object(r.jsx)("label",{children:"Confirm Email"}),Object(r.jsx)("input",{type:"email2",name:"email2",onChange:a.handleChange}),Object(r.jsx)("label",{children:"Password"}),Object(r.jsx)("input",{type:"password",name:"password",onChange:a.handleChange}),Object(r.jsx)("label",{children:"Confirm Password"}),Object(r.jsx)("input",{type:"password",name:"password2",onChange:a.handleChange}),Object(r.jsx)("button",{onClick:a.registerUser,children:"Sign Up"})]})]})},a.state={email:null,email2:null,password:null,password2:null},a}return n}(s.a.Component);function v(e){var t=e.login,n=e.openPage,a=e.popUp;return Object(r.jsx)("div",{className:"account wrapper",children:Object(r.jsxs)("div",{className:"grid",children:[Object(r.jsx)(g,{login:t,openPage:n,popUp:a}),Object(r.jsx)(x,{popUp:a})]})})}var y=n(6),k=function(e){Object(l.a)(n,e);var t=Object(u.a)(n);function n(){return Object(i.a)(this,n),t.apply(this,arguments)}return Object(y.a)(n,[{key:"render",value:function(){var e=this.props,t=e.closeFunc,n=e.title,a=e.children;return Object(r.jsx)("div",{className:"modal-background",children:Object(r.jsxs)("div",{className:"modal",children:[Object(r.jsxs)("div",{className:"modal-header",children:[Object(r.jsx)("h1",{style:{color:"white",margin:"0"},children:n}),Object(r.jsx)("button",{onClick:t,className:"close-button",children:Object(r.jsx)("i",{className:"fa fa-times"})})]}),Object(r.jsx)("div",{className:"modal-body",children:a})]})})}}]),n}(s.a.Component),S=function(e){Object(l.a)(n,e);var t=Object(u.a)(n);function n(e){var a;return Object(i.a)(this,n),(a=t.call(this,e)).render=function(){var e=a.state,t=e.companies,n=e.error,s=a.props.handleChange;return n?Object(r.jsx)("div",{children:n.message}):Object(r.jsxs)(r.Fragment,{children:[Object(r.jsx)("label",{children:"Company"}),t?Object(r.jsxs)(r.Fragment,{children:[Object(r.jsx)("input",{name:"ticker",list:"companies",onChange:s}),Object(r.jsxs)("datalist",{id:"companies",children:[Object(r.jsx)("option",{value:"Select Ticker",children:"Select Company"}),t.map((function(e,t){return Object(r.jsx)("option",{value:e.Symbol,children:e.Name},t)}))]})]}):Object(r.jsx)("p",{children:"Loading Companies..."})]})},a.state={companies:null,error:null},a}return Object(y.a)(n,[{key:"componentDidMount",value:function(){var e=this;O.a.get("".concat("https://gh0stmod.com","/data/companies")).then((function(t){e.setState({companies:t.data})})).catch((function(t){e.setState({error:t})}))}}]),n}(s.a.Component),C=function(e){Object(l.a)(n,e);var t=Object(u.a)(n);function n(e){var r;return Object(i.a)(this,n),(r=t.call(this,e)).handleChange=function(e){return r.setState(Object(b.a)({},e.target.name,e.target.value))},r.buyShares=function(e){e.preventDefault();var t=r.state,n=t.numShares,a=t.ticker,s=r.props,c=s.closeFunc,o=s.user,i=s.popUp;if(!a||n<=0)return c(),void i("You must select a ticker and a positive number of shares.",!0);var l={ticker:r.state.ticker,numShares:r.state.numShares};O.a.post("".concat("https://gh0stmod.com","/user/investments"),{investment:l},{headers:{Authorization:"Bearer ".concat(o.token)}}).then((function(e){c(),i("Share(s) Purchased Successfully",!1)})).catch((function(e){console.log(e)}))},r.state={ticker:null,numShares:0},r}return Object(y.a)(n,[{key:"render",value:function(){var e=this.props.closeFunc;return Object(r.jsx)(k,{closeFunc:e,title:"Buy Share(s)",children:Object(r.jsxs)("form",{children:[Object(r.jsx)(S,{handleChange:this.handleChange}),Object(r.jsx)("label",{children:"Number of Shares"}),Object(r.jsx)("input",{type:"number",name:"numShares",min:"1",onChange:this.handleChange}),Object(r.jsxs)("button",{onClick:this.buyShares,children:["Buy ",this.state.numShares," Shares"]})]})})}}]),n}(s.a.Component),w=function(e){Object(l.a)(n,e);var t=Object(u.a)(n);function n(){var e;Object(i.a)(this,n);for(var a=arguments.length,s=new Array(a),c=0;c<a;c++)s[c]=arguments[c];return(e=t.call.apply(t,[this].concat(s))).sellShare=function(t){var n=e.props,r=n.user,a=n.popUp,s=n.updateInvestments,c={ticker:t,numShares:-1};O.a.post("".concat("https://gh0stmod.com","/user/investments"),{investment:c},{headers:{Authorization:"Bearer ".concat(r.token)}}).then((function(e){a("Share(s) Sold Successfully",!1),s()})).catch((function(e){console.log(e)}))},e.render=function(){var t=e.props.investments;return Object(r.jsxs)("table",{children:[Object(r.jsx)("thead",{children:Object(r.jsxs)("tr",{children:[Object(r.jsx)("th",{children:"Name"}),Object(r.jsx)("th",{children:"Ticker"}),Object(r.jsx)("th",{children:"Number of Shares"}),Object(r.jsx)("th",{children:"Price per Share"}),Object(r.jsx)("th",{children:"Current Value"}),Object(r.jsx)("th",{children:"Sell"})]})}),Object(r.jsx)("tbody",{children:t.map((function(t,n){return Object(r.jsxs)("tr",{children:[Object(r.jsx)("td",{children:t.name}),Object(r.jsx)("td",{children:t.ticker}),Object(r.jsx)("td",{children:t.numShares}),Object(r.jsxs)("td",{children:["$",t.sharePrice]}),Object(r.jsxs)("td",{children:["$",Number(t.sharePrice*t.numShares).toFixed(2)]}),Object(r.jsx)("td",{children:Object(r.jsx)("button",{onClick:function(){return e.sellShare(t.ticker)},children:"Sell A Share"})})]},n)}))})]})},e}return n}(s.a.Component),P=function(e){Object(l.a)(n,e);var t=Object(u.a)(n);function n(e){var a;return Object(i.a)(this,n),(a=t.call(this,e)).updateInvestments=function(){a.setState({investments:null}),O.a.get("".concat("https://gh0stmod.com","/user/investments"),{headers:{Authorization:"Bearer ".concat(a.props.user.token)}}).then((function(e){a.setState({investments:e.data})})).catch((function(e){a.setState({error:e})}))},a.openModal=function(){a.setState({modalVisible:!0})},a.closeModal=function(){a.setState({modalVisible:!1}),a.updateInvestments()},a.render=function(){var e=a.state,t=e.investments,n=e.error,s=e.modalVisible,c=a.props,o=c.user,i=c.popUp;return n?Object(r.jsx)("div",{children:n.message}):Object(r.jsxs)("div",{className:"investments",children:[Object(r.jsx)("h1",{children:"My Investments"}),s?Object(r.jsx)(C,{closeFunc:a.closeModal,user:o,popUp:i}):null,Object(r.jsx)("button",{className:"buy-button",onClick:function(){return a.openModal()},children:"Buy Share(s)"}),t?Object(r.jsx)(w,{investments:t,user:o,popUp:i,updateInvestments:a.updateInvestments}):Object(r.jsx)("div",{children:"Downloading Investments Data..."})]})},a.state={modalVisible:!1,error:null,investments:null},a}return Object(y.a)(n,[{key:"componentDidMount",value:function(){this.updateInvestments()}}]),n}(s.a.Component),N=n(9),U=n.n(N),D=function(e){Object(l.a)(n,e);var t=Object(u.a)(n);function n(e){var a;return Object(i.a)(this,n),(a=t.call(this,e)).getWorthsFiltered=function(){var e=a.state,t=e.worths,n=e.range,r=new Date;if(r.setHours(0),r.setMinutes(0),r.setSeconds(0),"w"===n){var s=r.getDay()-1;r.setDate(r.getDate()-s)}else if("m"===n){var c=r.getDate()-1;r.setDate(r.getDate()-c)}else"y"===n&&(r.setMonth(0),r.setDate(1));return"max"===n&&(r=new Date(t[0].date)),t.filter((function(e){var t=new Date(e.date);return 0!==t.getDay()&&6!==t.getDay()&&t>=r}))},a.changeRange=function(e){return a.setState({range:e})},a.render=function(){var e=a.state,t=e.error,n=e.range,s=e.worths;if(t)return Object(r.jsx)("div",{children:t.message});if(s){if(0===s.length)return Object(r.jsxs)(r.Fragment,{children:[Object(r.jsx)("h1",{children:"My Portfolio"}),Object(r.jsx)("h2",{children:"No data yet..."})]});var c=a.getWorthsFiltered(),o=c.map((function(e){return new Date(e.date)})),i=c.map((function(e){return e.amount})),l=i[0]>i[i.length-1]?"red":"green";return Object(r.jsxs)(r.Fragment,{children:[Object(r.jsx)("h1",{children:"My Portfolio"}),Object(r.jsxs)("h2",{children:["$",s[s.length-1].amount]}),Object(r.jsxs)("div",{className:"ranges",children:[Object(r.jsx)("button",{onClick:function(){return a.changeRange("d")},className:"d"===n?"active":null,children:"1D"}),Object(r.jsx)("button",{onClick:function(){return a.changeRange("w")},className:"w"===n?"active":null,children:"1W"}),Object(r.jsx)("button",{onClick:function(){return a.changeRange("m")},className:"m"===n?"active":null,children:"1M"}),Object(r.jsx)("button",{onClick:function(){return a.changeRange("y")},className:"y"===n?"active":null,children:"1Y"}),Object(r.jsx)("button",{onClick:function(){return a.changeRange("max")},className:"max"===n?"active":null,children:"MAX"})]}),Object(r.jsx)(U.a,{className:"graph",data:[{x:o,y:i,type:"scatter",mode:"markers&lines",line:{color:l},text:i,hovertemplate:"<b>%{x}<br>$%{y}</b><extra></extra>"}],layout:{hovermode:"closest",hoverlabel:{bgcolor:"#FFF"},margin:{l:50,r:50,b:50,t:10}},useResizeHandler:!0,config:{displayModeBar:!1},style:{width:"100%"}})]})}return Object(r.jsxs)(r.Fragment,{children:[Object(r.jsx)("h1",{children:"My Portfolio"}),Object(r.jsx)("h2",{children:"Loading..."})]})},a.state={error:null,worths:null,range:"max"},a}return Object(y.a)(n,[{key:"componentDidMount",value:function(){var e=this;O.a.get("".concat("https://gh0stmod.com","/user/worths"),{headers:{Authorization:"Bearer ".concat(this.props.user.token)}}).then((function(t){e.setState({worths:t.data})})).catch((function(t){e.setState({error:t})}))}}]),n}(s.a.Component);function F(e){var t=e.user,n=e.popUp;return Object(r.jsxs)("div",{className:"portfolio wrapper",children:[Object(r.jsx)(D,{user:t}),Object(r.jsx)(P,{user:t,popUp:n})]})}var z=n(11),I=n.n(z),M=n(23),R=n(12),A=function(e){Object(l.a)(n,e);var t=Object(u.a)(n);function n(e){var r;return Object(i.a)(this,n),(r=t.call(this,e)).loadRequiredInvestments=function(){var e=r.state.userInvestments,t=r.props.portfolio,n=t.tickers,a=t.weights,s=null;if(e){var c=a.map((function(e){return 100*e})),o=r.findGCD(c);s=(s=(c=c.map((function(e){return e/o}))).map((function(t,r){var a=n[r],s=t,c=e.filter((function(e){return e.ticker===a}));return c.length>0&&(s-=c[0].numShares),{ticker:n[r],numShares:s}}))).filter((function(e){return 0!==e.numShares}));var i,l=Object(R.a)(e);try{for(l.s();!(i=l.n()).done;){var u=i.value;n.includes(u.ticker)||s.push({ticker:u.ticker,numShares:-u.numShares})}}catch(h){l.e(h)}finally{l.f()}r.setState({investmentsRequired:s,toBuy:s.filter((function(e){return e.numShares>0})),toSell:s.filter((function(e){return e.numShares<0}))})}},r.obtainPortfolio=Object(M.a)(I.a.mark((function e(){var t,n,a,s,c,o,i,l;return I.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:t=r.props,n=t.closeFunc,a=t.popUp,s=t.user,c=r.state.investmentsRequired,o=Object(R.a)(c),e.prev=3,o.s();case 5:if((i=o.n()).done){e.next=11;break}return l=i.value,e.next=9,O.a.post("".concat("https://gh0stmod.com","/user/investments"),{investment:l},{headers:{Authorization:"Bearer ".concat(s.token)}}).catch((function(e){console.log(e)}));case 9:e.next=5;break;case 11:e.next=16;break;case 13:e.prev=13,e.t0=e.catch(3),o.e(e.t0);case 16:return e.prev=16,o.f(),e.finish(16);case 19:n(),a("Portfolio Obtained Successfully",!1);case 21:case"end":return e.stop()}}),e,null,[[3,13,16,19]])}))),r.state={userInvestments:null,investmentsRequired:null},r}return Object(y.a)(n,[{key:"componentDidMount",value:function(){var e=this;O.a.get("".concat("https://gh0stmod.com","/user/investments"),{headers:{Authorization:"Bearer ".concat(this.props.user.token)}}).then((function(t){e.setState({userInvestments:t.data}),e.loadRequiredInvestments()})).catch((function(t){e.setState({error:t})}))}},{key:"gcd",value:function(e,t){return 0===e?t:this.gcd(t%e,e)}},{key:"findGCD",value:function(e){for(var t=e[0],n=1;n<e.length;n++)if(1===(t=this.gcd(e[n],t)))return 1;return t}},{key:"render",value:function(){var e=this.state,t=e.toBuy,n=e.toSell,a=e.userInvestments,s=this.props.closeFunc;return Object(r.jsx)(k,{closeFunc:s,title:"Obtain Portfolio",children:a?Object(r.jsxs)(r.Fragment,{children:[Object(r.jsx)("h1",{children:"To obtain this portfolio you must..."}),t&&0!==t.length?Object(r.jsxs)(r.Fragment,{children:[Object(r.jsx)("h2",{children:"Buy..."}),Object(r.jsx)("ul",{children:t.map((function(e,t){return Object(r.jsxs)("li",{className:"green",children:[e.numShares," share(s) in ",e.ticker,"."]},t)}))})]}):Object(r.jsx)("h2",{children:"Buy Nothing!"}),n&&0!==n.length?Object(r.jsxs)(r.Fragment,{children:[Object(r.jsx)("h2",{children:"And Sell..."}),Object(r.jsx)("ul",{children:n.map((function(e,t){return Object(r.jsxs)("li",{className:"red",children:[Math.abs(e.numShares)," share(s) in ",e.ticker,"."]},t)}))})]}):Object(r.jsx)("h2",{children:"And Sell Nothing!"}),Object(r.jsx)("button",{onClick:this.obtainPortfolio,children:"Obtain Portfolio"})]}):Object(r.jsx)("div",{className:"loading",children:"Calculating..."})})}}]),n}(s.a.Component),B=function(e){Object(l.a)(n,e);var t=Object(u.a)(n);function n(e){var a;return Object(i.a)(this,n),(a=t.call(this,e)).getDatasets=function(){var e=a.props.settings,t=a.state.portfolios,n=t.filter((function(e){return e.efficient})).map((function(t){return t[e.x]})),r=t.filter((function(e){return e.efficient})).map((function(t){return t[e.y]})),s=t.filter((function(e){return e.efficient})).map((function(t){return t[e.z]})),c={customdata:t,x:n,y:r,z:s,text:t.map((function(e){return e.asString})),type:"scatter3d",mode:"markers",marker:{color:"gold",size:5},hovertemplate:"<b>".concat(e.z,": %{z}%</b><br>")+"<b>".concat(e.x,": %{x}%</b><br>")+"<b>".concat(e.y,": %{y}%</b><br>")+"%{text}<br><b>Click for more details.</b><extra></extra>"},o=[c];if(!e.optimalOnly){var i=t.filter((function(e){return!e.efficient})).map((function(t){return t[e.x]})),l=t.filter((function(e){return!e.efficient})).map((function(t){return t[e.y]})),u=t.filter((function(e){return!e.efficient})).map((function(t){return t[e.z]})),h=JSON.parse(JSON.stringify(c));h.x=i,h.y=l,h.z=u,h.marker={color:"blue",size:5},o.push(h)}return o},a.openPortfolio=function(e){a.setState({portfolio:e})},a.closePortfolio=function(){a.setState({portfolio:null})},a.render=function(){var e=a.props,t=e.settings,n=e.popUp,s=e.user,c=a.state,o=c.portfolios,i=c.error,l=c.portfolio;return i?Object(r.jsx)("div",{children:i.message}):o?Object(r.jsxs)(r.Fragment,{children:[l?Object(r.jsx)(A,{popUp:n,closeFunc:a.closePortfolio,portfolio:l,user:s}):null,Object(r.jsxs)("div",{className:"graph grid-item",children:[Object(r.jsx)("h1",{children:"Portfolios"}),Object(r.jsx)(U.a,{data:a.getDatasets(),layout:{scene:{xaxis:{title:t.x,autorange:"reversed"},yaxis:{title:t.y,autorange:"reversed"},zaxis:{title:t.z},camera:{center:{x:.05,y:0,z:-.15},eye:{x:1.3,y:1.3,z:.1}}},margin:{l:.1,r:.1,b:.1,t:.1},hovermode:"closest",hoverlabel:{bgcolor:"#FFF"},showlegend:!1},onClick:function(e){setTimeout((function(){a.openPortfolio(e.points[0].customdata)}),125)},useResizeHandler:!0,config:{displayModeBar:!1},style:{margin:"auto",width:"100%",maxWidth:"600px",height:"500px"}})]})]}):Object(r.jsx)("div",{className:"graph grid-item",children:Object(r.jsx)("h1",{children:"Loading Portfolios..."})})},a.state={error:null,portfolios:null,portfolio:null},a}return Object(y.a)(n,[{key:"componentDidMount",value:function(){var e=this,t=this.props,n=t.settings,r=t.user,a="";n.tickers.forEach((function(e){return a+=e+"-"})),a=a.substr(0,a.length-1);var s=new URLSearchParams;s.append("tickers",a),O.a.get("".concat("https://gh0stmod.com","/data/portfolios"),{headers:{Authorization:"Bearer ".concat(r.token)},params:s}).then((function(t){e.setState({portfolios:t.data})})).catch((function(t){e.setState({error:t})}))}}]),n}(s.a.Component),T=function(e){Object(l.a)(n,e);var t=Object(u.a)(n);function n(){var e;Object(i.a)(this,n);for(var a=arguments.length,s=new Array(a),c=0;c<a;c++)s[c]=arguments[c];return(e=t.call.apply(t,[this].concat(s))).render=function(){var t=e.props,n=t.tickers,a=t.handleChange,s=t.removeTicker;return Object(r.jsxs)("div",{className:"tickers",children:[Object(r.jsx)(S,{handleChange:a}),Array.from(n).map((function(e,t){return Object(r.jsxs)("span",{className:"ticker",children:[e,Object(r.jsx)("button",{className:"close-button",onClick:function(t){t.preventDefault(),s(e)},children:Object(r.jsx)("i",{className:"fa fa-times"})})]},t)}))]})},e}return n}(s.a.Component),E=function(e){Object(l.a)(n,e);var t=Object(u.a)(n);function n(e){var a;return Object(i.a)(this,n),(a=t.call(this,e)).render=function(){var e=a.state.axes,t=a.props,n=t.name,s=t.handleChange,c=t.selected;return Object(r.jsxs)("div",{className:"tickers",children:[Object(r.jsxs)("label",{children:[n.toUpperCase()," Axis"]}),Object(r.jsx)("select",{name:n,onChange:s,defaultValue:e[c][0],children:e.map((function(e,t){return Object(r.jsx)("option",{value:e[0],children:e[1]},t)}))})]})},a.state={axes:[["standardDeviation","Standard Deviation"],["expectedDividendYield","Expected Dividend Yield"],["expectedReturn","Expected Return"]]},a}return n}(s.a.Component),V=function(e){Object(l.a)(n,e);var t=Object(u.a)(n);function n(e){var a;return Object(i.a)(this,n),(a=t.call(this,e)).handleChange=function(e){if("ticker"===e.target.name){var t=a.state.tickers;5===t.size?a.props.popUp("You can only add ".concat(5," stocks to a portfolio."),!0):(t.add(e.target.value),a.setState({tickers:t}))}else"optimalOnly"===e.target.name?a.setState({optimalOnly:!e.target.checked}):a.setState(Object(b.a)({},e.target.name,e.target.value))},a.removeTicker=function(e){var t=a.state.tickers;t.delete(e),a.setState({tickers:t})},a.loadVisualisation=function(e){e.preventDefault(),a.props.updateSettings({tickers:a.state.tickers,x:a.state.x,y:a.state.y,z:a.state.z,optimalOnly:a.state.optimalOnly})},a.render=function(){var e=a.state.tickers;return Object(r.jsxs)("div",{className:"settings grid-item",children:[Object(r.jsx)("h1",{children:"Settings"}),Object(r.jsxs)("form",{children:[Object(r.jsx)(T,{tickers:e,handleChange:a.handleChange,removeTicker:a.removeTicker}),Object(r.jsx)(E,{name:"x",selected:0,handleChange:a.handleChange}),Object(r.jsx)(E,{name:"y",selected:1,handleChange:a.handleChange}),Object(r.jsx)(E,{name:"z",selected:2,handleChange:a.handleChange}),Object(r.jsx)("label",{style:{display:"inline",marginRight:"1em"},children:"Display Non-Optimal Portfolios"}),Object(r.jsx)("input",{style:{width:"fit-content",transform:"scale(1.5)"},type:"checkbox",name:"optimalOnly",onChange:a.handleChange}),Object(r.jsx)("button",{className:"optimise-button",onClick:a.loadVisualisation,children:"View Optimal Portfolios"})]})]})},a.state={tickers:new Set,x:"standardDeviation",y:"expectedDividendYield",z:"expectedReturn",optimalOnly:!0},a}return n}(s.a.Component),Y=function(e){Object(l.a)(n,e);var t=Object(u.a)(n);function n(e){var a;return Object(i.a)(this,n),(a=t.call(this,e)).updateSettings=function(e){0!==e.tickers.size&&e.x&&e.y&&e.z?(a.setState({settings:null}),setTimeout((function(){a.setState({settings:e})}),5)):a.props.popUp("You must select 1 or more tickers and a value for each axis.",!0)},a.render=function(){var e=a.props,t=e.user,n=e.popUp,s=a.state.settings;return Object(r.jsx)("div",{className:"optimise wrapper",children:Object(r.jsxs)("div",{className:"grid",children:[Object(r.jsx)(V,{updateSettings:a.updateSettings,popUp:n}),s?Object(r.jsx)(B,{user:t,settings:s,popUp:n}):null]})})},a.state={settings:null},a}return n}(s.a.Component),L=function(e){Object(l.a)(n,e);var t=Object(u.a)(n);function n(e){var a;return Object(i.a)(this,n),(a=t.call(this,e)).openPage=function(e){return a.setState({currentPage:e})},a.login=function(e,t){var n=Object(h.a)(t);n.token=e,a.setState({user:n})},a.logout=function(){return a.setState({user:null,currentPage:"home"})},a.addPopUp=function(e,t){var n={message:e,error:t},r=a.state.popUps;r.push(n),a.setState({popUps:r}),setTimeout((function(){a.removePopUp(n)}),4e3)},a.removePopUp=function(e){var t=a.state.popUps;t.includes(e)&&(t=t.filter((function(t){return t!==e})),a.setState({popUps:t}))},a.render=function(){var e=a.state,t=e.currentPage,n=e.popUps,s=e.user;return Object(r.jsxs)(r.Fragment,{children:[Object(r.jsx)(d,{user:s,openPage:a.openPage,page:t,logout:a.logout}),n?n.map((function(e,t){return Object(r.jsx)(p,{closeEarly:a.removePopUp,children:e},t)})):null,"home"===t?Object(r.jsx)(m,{openPage:a.openPage}):null,"account"===t?Object(r.jsx)(v,{login:a.login,popUp:a.addPopUp,openPage:a.openPage}):null,"portfolio"===t?Object(r.jsx)(F,{user:s,popUp:a.addPopUp}):null,"optimise"===t?Object(r.jsx)(Y,{user:s,popUp:a.addPopUp}):null]})},a.state={currentPage:"home",popUps:[],user:null},a}return n}(s.a.Component);o.a.render(Object(r.jsx)(s.a.StrictMode,{children:Object(r.jsx)(L,{})}),document.getElementById("root"))}},[[56,1,2]]]);
//# sourceMappingURL=main.f9f16743.chunk.js.map
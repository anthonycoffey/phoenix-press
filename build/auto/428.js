"use strict";(self.webpackChunkphoenix_press=self.webpackChunkphoenix_press||[]).push([[428],{4428:function(e,t,n){n.r(t),n.d(t,{default:function(){return ee}});var a=n(6087),r=n(6990),o=n(4977),l=n(7636),i=n(3899),c=n(7164),s=n(3650),u=n(7458),m=n(1609),d=n(4164),p=n(5659),g=n(1848),f=n(9077),h=n(5607),v=n(5003),E=n(790),A=(0,v.A)((0,E.jsx)("path",{d:"M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"}),"Person"),R=n(8413),y=n(3990);function b(e){return(0,y.Ay)("MuiAvatar",e)}(0,R.A)("MuiAvatar",["root","colorDefault","circular","rounded","square","img","fallback"]);var x=n(6025);const w=(0,g.Ay)("div",{name:"MuiAvatar",slot:"Root",overridesResolver:(e,t)=>{const{ownerState:n}=e;return[t.root,t[n.variant],n.colorDefault&&t.colorDefault]}})((0,f.A)((({theme:e})=>({position:"relative",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,width:40,height:40,fontFamily:e.typography.fontFamily,fontSize:e.typography.pxToRem(20),lineHeight:1,borderRadius:"50%",overflow:"hidden",userSelect:"none",variants:[{props:{variant:"rounded"},style:{borderRadius:(e.vars||e).shape.borderRadius}},{props:{variant:"square"},style:{borderRadius:0}},{props:{colorDefault:!0},style:{color:(e.vars||e).palette.background.default,...e.vars?{backgroundColor:e.vars.palette.Avatar.defaultBg}:{backgroundColor:e.palette.grey[400],...e.applyStyles("dark",{backgroundColor:e.palette.grey[600]})}}}]})))),C=(0,g.Ay)("img",{name:"MuiAvatar",slot:"Img",overridesResolver:(e,t)=>t.img})({width:"100%",height:"100%",textAlign:"center",objectFit:"cover",color:"transparent",textIndent:1e4}),S=(0,g.Ay)(A,{name:"MuiAvatar",slot:"Fallback",overridesResolver:(e,t)=>t.fallback})({width:"75%",height:"75%"});var k=m.forwardRef((function(e,t){const n=(0,h.b)({props:e,name:"MuiAvatar"}),{alt:a,children:r,className:o,component:l="div",slots:i={},slotProps:c={},imgProps:s,sizes:u,src:g,srcSet:f,variant:v="circular",...A}=n;let R=null;const y={...n,component:l,variant:v},k=function({crossOrigin:e,referrerPolicy:t,src:n,srcSet:a}){const[r,o]=m.useState(!1);return m.useEffect((()=>{if(!n&&!a)return;o(!1);let r=!0;const l=new Image;return l.onload=()=>{r&&o("loaded")},l.onerror=()=>{r&&o("error")},l.crossOrigin=e,l.referrerPolicy=t,l.src=n,a&&(l.srcset=a),()=>{r=!1}}),[e,t,n,a]),r}({...s,..."function"==typeof c.img?c.img(y):c.img,src:g,srcSet:f}),I=g||f,L=I&&"error"!==k;y.colorDefault=!L,delete y.ownerState;const _=(e=>{const{classes:t,variant:n,colorDefault:a}=e,r={root:["root",n,a&&"colorDefault"],img:["img"],fallback:["fallback"]};return(0,p.A)(r,b,t)})(y),[T,M]=(0,x.A)("img",{className:_.img,elementType:C,externalForwardedProps:{slots:i,slotProps:{img:{...s,...c.img}}},additionalProps:{alt:a,src:g,srcSet:f,sizes:u},ownerState:y});return R=L?(0,E.jsx)(T,{...M}):r||0===r?r:I&&a?a[0]:(0,E.jsx)(S,{ownerState:y,className:_.fallback}),(0,E.jsx)(w,{as:l,className:(0,d.A)(_.root,o),ref:t,...A,ownerState:y,children:R})})),I=n(900),L=n(8168),_=e=>React.createElement(l.A,(0,L.A)({sx:{backgroundColor:"#f0f0f0",borderRadius:"20px",padding:"10px 15px",position:"relative",maxWidth:"80%"}},e)),T=({question:e})=>{var t;const n=null!==(t=LOCALIZED?.ASSETS_URL)&&void 0!==t?t:"";return React.createElement(i.A,{direction:"row",spacing:2,alignItems:"flex-start"},React.createElement(k,{src:`${n}/avatar.jpg`,alt:"Technician Avatar"}),React.createElement(_,null,React.createElement("label",null,(0,I.Ay)(e.prompt))))},M=n(267),q=n(4389),D=n(8864),P=n(5737),O=n(8014),$=n(2687),N=n(8870),j=n(8429),z=n(1769),F=n(8292);const Z=e=>{const t={};if(!e)return t;const n=e.find((e=>e.types.includes("street_number")))?.long_name,a=e.find((e=>e.types.includes("route")))?.short_name;return t.address_1=n&&a?`${n} ${a}`:"",t.city=e.find((e=>e.types.includes("locality")))?.long_name||"",t.state=e.find((e=>e.types.includes("administrative_area_level_1")))?.short_name||"",t.country=e.find((e=>e.types.includes("country")))?.short_name||"",t.zipcode=e.find((e=>e.types.includes("postal_code")))?.long_name||"",t},U=["places"];function H({input:e}){const{questions:t,currentQuestionIndex:n,setQuestions:o,errors:l,setErrors:c}=(0,a.useContext)(F.q),[s,m]=(0,a.useState)(!1),d=(0,a.useRef)(null),{isLoaded:p,loadError:g}=(0,z.RH)({googleMapsApiKey:LOCALIZED?.GMAPS_API_KEY,libraries:U});(0,a.useEffect)((()=>{if(!d.current||!window.google)return;const e=new window.google.maps.places.Autocomplete(d.current);return e.addListener("place_changed",(()=>{try{const t=e.getPlace(),n=Z(t.address_components);f(n)}catch(e){console.error("Error handling place_changed event:",e)}})),()=>{window.google.maps.event.clearInstanceListeners(e)}}),[p]);const f=e=>{try{const a=[...t],r=a[n].inputs.find((e=>"location"===e.name));e.nativeEvent instanceof Event?r.value=e.target.value:(r.obj=e,r.value=`${e.address_1}, ${e.city}, ${e.state} ${e.zipcode}`),o(a);const i=h(r);c({...l,[r.name]:i})}catch(e){console.error("Error handling input change:",e)}},h=e=>{if(!e.optional)return e.value.trim()?"":"This field is required"};return g?(console.error("Error loading maps:",g),React.createElement("div",null,"Error loading maps")):p?React.createElement(a.Suspense,{fallback:React.createElement(u.A,null)},React.createElement(i.A,{spacing:2,direction:"column",sx:{marginTop:"1rem"}},React.createElement(M.A,{label:e.label,name:e.name,value:e.value,onChange:f,variant:"outlined",margin:"normal",fullWidth:!0,inputRef:d,InputProps:{endAdornment:s?React.createElement(u.A,null):null},required:!e.optional,error:!!l[e.name],helperText:l[e.name]}),React.createElement(r.A,{variant:"contained","aria-label":"Use my location",color:"primary",onClick:()=>{navigator.geolocation?(m(!0),navigator.geolocation.getCurrentPosition((e=>{const{latitude:t,longitude:n}=e.coords;(new window.google.maps.Geocoder).geocode({location:{lat:t,lng:n}},((e,t)=>{if(m(!1),"OK"===t&&e[0]){const t=Z(e[0].address_components);f(t)}else console.error("Geocoder failed due to:",t)}))}),(e=>{m(!1),console.error("Error in getting geolocation:",e)}))):console.error("Geolocation is not supported by your browser.")},disabled:s},s?React.createElement(u.A,null):React.createElement(j.A,null),"Use My Current Location"))):React.createElement(u.A,null)}var V=n(779),Q=n(5724),W=n(6347),G=n(9307);function B({input:e}){const{questions:t,currentQuestionIndex:n,setQuestions:r,services:o,errors:l,setErrors:i}=(0,a.useContext)(F.q),[s,u]=(0,a.useState)([]),m=e=>{const{value:t,checked:n}=e.target;u((e=>n?[...e,t]:e.filter((e=>e!==t))))};(0,a.useEffect)((()=>{const e=[...t],a=e[n].inputs.find((e=>"service_type"===e.name)),c=o.filter((e=>s.includes(e.value)));a.value=c.map((e=>({value:e.value,id:e.id}))),r(e);const u=d(a);i({...l,[a.name]:u})}),[s]);const d=e=>{if(!e.optional)return e.value.length<1?"This field is required":""};return React.createElement(V.A,{component:"fieldset",fullWidth:!0,margin:"dense",error:l.service_type},React.createElement(G.A,{component:"legend"},"Select desired service(s)"),React.createElement(Q.A,null,React.createElement(c.A,{sx:{display:"grid",gridTemplateColumns:"repeat(3, 1fr)",gap:0,padding:0}},o.map((e=>React.createElement(D.A,{sx:{margin:0,padding:0},control:React.createElement(q.A,{value:e.value,checked:s.includes(e.value),onChange:m,name:e.name,size:"small"}),label:e.text}))))),React.createElement(W.A,null,l.service_type))}function K({input:e,onChange:t}){const{errors:n,setErrors:r}=(0,a.useContext)(F.q),o=e=>10!==e.replace(/\D/g,"").length?"Valid phone number is required.":"";return(0,a.useEffect)((()=>{const t=o(e.value);r({...n,[e.name]:t})}),[e.value,r,n,e.name]),React.createElement(M.A,{label:e.label,name:e.name,value:e.value,onChange:a=>{const{value:l}=a.target,i=(e=>{const t=e.replace(/\D/g,"");return t.length<=3?t:t.length<=6?`(${t.slice(0,3)}) ${t.slice(3)}`:`(${t.slice(0,3)}) ${t.slice(3,6)}-${t.slice(6,10)}`})(l),c=o(i);r({...n,[e?.name]:c}),t({target:{name:"phone",value:i}})},fullWidth:!0,variant:"outlined",margin:"normal",type:"tel",required:!e.optional,error:!!n[e.name],helperText:n[e.name]})}var J=({question:e})=>{const{errors:t,setErrors:n}=(0,a.useContext)(F.q),{questions:r,setQuestions:o,currentQuestionIndex:l}=(0,a.useContext)(F.q),[c,s]=(0,a.useState)(new Date);(0,a.useEffect)((()=>{if(r){const e=[...r],t=e[l].inputs.find((e=>"service_time"===e.name));t&&(t.value=c,o(e))}}),[e,c]);const u=e=>{s(e)},m=e=>{const{name:a,value:i,type:c,checked:s}=e.target,u=[...r],m=u[l].inputs.find((e=>e.name===a));if(m.value="checkbox"===c?s:i,o(u),"text"===m.type||"checkbox"===m.type){const e=d(m);n({...t,[m.name]:e})}},d=e=>{if(!e.optional)switch(e.type){case"text":return e.value.trim()?"":"This field is required";case"checkbox":return e.value?"":"This field is required";default:return""}return""};return React.createElement(React.Fragment,null,e.inputs.map(((e,n)=>"tel"===e.type?React.createElement(K,{input:e,key:n,onChange:m}):"text"===e.type?React.createElement(M.A,{key:n,label:e.label,name:e.name,value:e.value,onChange:m,fullWidth:!0,variant:"outlined",margin:"normal",error:!!t[e.name],helperText:t[e.name],required:!e.optional}):"geo"===e.type?React.createElement(H,{input:e,key:n}):"select"===e.type?React.createElement(B,{input:e,key:n}):"textarea"===e.type?React.createElement(M.A,{key:n,label:e.label,name:e.name,value:e.value,onChange:m,fullWidth:!0,required:!e.optional,variant:"outlined",margin:"normal"}):"checkbox"===e.type?React.createElement(D.A,{sx:{marginBottom:"1rem"},key:n,control:React.createElement(q.A,{checked:e.value,onChange:m,name:e.name,required:!e.optional}),label:(0,I.Ay)(LOCALIZED.SMS_CONTENT_MESSAGE||e.label)}):"datetime"===e.type?React.createElement(P.$,{dateAdapter:N.h,key:n},React.createElement(i.A,{direction:"row",spacing:2,sx:{marginTop:"1rem"}},React.createElement(O.l,{label:"Select Date",value:c,onChange:u,disablePast:!0,fullWidth:!0}),React.createElement($.A,{label:"Select Time",value:c,onChange:u,fullWidth:!0}))):null)))},X=n(2590);function Y(){return React.createElement("svg",{style:{width:"2rem",height:"2rem",marginRight:"0.5rem",fill:"#cf2e2e"},className:"MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-1iirmgg",focusable:"false","aria-hidden":"true",viewBox:"0 0 24 24","data-testid":"CancelIcon"},React.createElement("path",{d:"M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2m5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12z"}))}var ee=()=>{const{questions:e,currentQuestionIndex:t,setCurrentQuestionIndex:n,submitted:m,setSubmitted:d,loading:p,setLoading:g,isFormVisible:f,setIsFormVisible:h,errors:v}=(0,a.useContext)(F.q),E=(0,a.useRef)(null),A=e[t],[R,y]=(0,a.useState)(!0),[b,x]=(0,a.useState)(null),[w,C]=(0,a.useState)(null);(0,a.useEffect)((()=>{const e=A.inputs.some((e=>v[e.name]));return y(e),()=>{y(!0)}}),[v]),(0,a.useEffect)((()=>{let e;return f&&window?.turnstile&&E.current&&(e=window.turnstile.render(E.current,{sitekey:LOCALIZED.TURNSTILE_SITE_KEY,callback:e=>{C(e)},"expired-callback":()=>{window.turnstile.reset(e)}})),()=>{e&&window.turnstile.remove(e)}}),[f]);const S=()=>{h(!f)};return React.createElement("section",null,!f&&React.createElement("button",{onClick:S,id:"phoenix-show-form-button","aria-label":"Show Lead Form",style:{background:LOCALIZED.CHAT_AVATAR?"none":"#4395ce"}},LOCALIZED.CHAT_AVATAR?React.createElement("img",{className:"phoenix-chat-avatar",src:LOCALIZED.CHAT_AVATAR,alt:"Phoenix Lead Form Chat Avatar"}):React.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",className:"e-font-icon-svg e-fas-comment-alt",viewBox:"0 0 512 512",width:"24",height:"24",fill:"#fff"},React.createElement("path",{d:"M448 0H64C28.7 0 0 28.7 0 64v288c0 35.3 28.7 64 64 64h96v84c0 9.8 11.2 15.5 19.1 9.7L304 416h144c35.3 0 64-28.7 64-64V64c0-35.3-28.7-64-64-64z"}))),f&&React.createElement(o.A,{className:"phoenix-form"},React.createElement(s.A,{id:"phoenix-chat-form-header",action:React.createElement(r.A,{onClick:S,"aria-label":"close"},React.createElement(Y,null))}),React.createElement(l.A,null,React.createElement(React.Fragment,null,m&&React.createElement(T,{question:{prompt:"Saving your submission, please wait..."}}),!m&&React.createElement(React.Fragment,null,React.createElement(i.A,{space:2},React.createElement(T,{question:A}),React.createElement(J,{question:A})),!p&&React.createElement(i.A,{direction:"row",spacing:2,sx:{width:"100%",display:"flex",my:"1rem",justifyContent:t>0?"space-between":"flex-end"}},t>0&&React.createElement(r.A,{variant:"contained",onClick:()=>n(t-1)},"Back"),React.createElement(r.A,{sx:{justifySelf:"end"},variant:"contained",color:"primary",onClick:()=>{(async()=>{if(p||!w)return!1;try{g(!0);const a=e.flatMap((e=>e.inputs.map((e=>{const{name:t,value:n,obj:a}=e;return a?{name:t,value:n,obj:a}:{name:t,value:n}})))),r={"Content-Type":"application/json","X-Turnstile-Token":w},o=window.location.origin.replace(/^https?:\/\//,"")+window.location.pathname.replace(/\/$/,"");if(t+1===e.length)return await(async(t,n)=>{try{if(g(!0),d(!0),!b)return!1;await fetch(`${LOCALIZED.API_URL}/submit-lead-form/${b}`,{method:"PUT",headers:{"Content-Type":"application/json","X-Turnstile-Token":w},body:JSON.stringify({submission:t,completed:!0,source:n})});const a=e.find((e=>"full_name"===e.name))?.inputs[0]?.value||"";window.location.assign(`/book-success?full_name=${encodeURIComponent(a)}`)}catch(e){console.error("There was an error",e)}})(a,o);if(n(t+1),b)await fetch(`${LOCALIZED.API_URL}/submit-lead-form/${b}`,{method:"PUT",headers:r,body:JSON.stringify({submission:a,source:o})});else{const e=await fetch(`${LOCALIZED.API_URL}/submit-lead-form`,{method:"POST",headers:r,body:JSON.stringify({submission:a,source:o})}),t=await e.json();t?.id&&x(t?.id)}}catch(e){console.error("There was an error",e)}finally{g(!1)}})()},disabled:R,loading:p||!w},t+1===e.length?"Submit":"Next")),React.createElement(X.A,{index:t})),React.createElement(c.A,{spacing:2,className:"phoenix-no-select",sx:{width:"100%",display:"flex",justifyContent:"center",alignItems:"center",minHeight:"10px"}},(p||!w)&&React.createElement(u.A,{sx:{width:"100%"}})))),React.createElement("div",{ref:E,id:"conversation-turnstile-widget",className:"cf-turnstile"})))}},2590:function(e,t,n){var a=n(9502),r=n(900);t.A=({index:e})=>0===e&&React.createElement(React.Fragment,null,LOCALIZED.DISCLAIMER_MESSAGE&&React.createElement(a.A,{severity:"info",sx:{padding:"1rem"}},(0,r.Ay)(LOCALIZED.DISCLAIMER_MESSAGE)))},8429:function(e,t,n){function a(){return React.createElement("svg",{style:{width:"20px",height:"20px",marginRight:"0.5rem",fill:"white"},className:"MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-1iirmgg",focusable:"false","aria-hidden":"true",viewBox:"0 0 24 24","data-testid":"MyLocationIcon"},React.createElement("path",{d:"M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4m8.94 3c-.46-4.17-3.77-7.48-7.94-7.94V1h-2v2.06C6.83 3.52 3.52 6.83 3.06 11H1v2h2.06c.46 4.17 3.77 7.48 7.94 7.94V23h2v-2.06c4.17-.46 7.48-3.77 7.94-7.94H23v-2zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7"}))}n.d(t,{A:function(){return a}})}}]);
"use strict";(self.webpackChunkphoenix_press=self.webpackChunkphoenix_press||[]).push([[441],{2590:function(e,t,a){var n=a(6087),l=a(9502),r=a(900);const i=(0,n.memo)((({index:e})=>0===e&&React.createElement(React.Fragment,null,LOCALIZED.DISCLAIMER_MESSAGE&&React.createElement(l.A,{severity:"info",sx:{padding:"1rem"}},(0,r.Ay)(LOCALIZED.DISCLAIMER_MESSAGE)))));t.A=i},5441:function(e,t,a){a.r(t),a.d(t,{default:function(){return Y}});var n=a(6087),l=a(7164),r=a(6990),i=a(4977),o=a(7636),c=a(1609),s=a(4164),u=a(5659),d=a(1848),m=a(5607),p=a(8413),v=a(3990);function h(e){return(0,v.Ay)("MuiCardActions",e)}(0,p.A)("MuiCardActions",["root","spacing"]);var g=a(790);const f=(0,d.Ay)("div",{name:"MuiCardActions",slot:"Root",overridesResolver:(e,t)=>{const{ownerState:a}=e;return[t.root,!a.disableSpacing&&t.spacing]}})({display:"flex",alignItems:"center",padding:8,variants:[{props:{disableSpacing:!1},style:{"& > :not(style) ~ :not(style)":{marginLeft:8}}}]});var E=c.forwardRef((function(e,t){const a=(0,m.b)({props:e,name:"MuiCardActions"}),{disableSpacing:n=!1,className:l,...r}=a,i={...a,disableSpacing:n},o=(e=>{const{classes:t,disableSpacing:a}=e,n={root:["root",!a&&"spacing"]};return(0,u.A)(n,h,t)})(i);return(0,g.jsx)(f,{className:(0,s.A)(o.root,l),ownerState:i,ref:t,...r})})),y=a(3899),A=a(3551),b=a(7458),R=a(3650),w=a(5737),S=a(8014),C=a(2687),_=a(8870),x=a(267),L=a(3357),k=a(8429),I=a(1769);const T=e=>{const t={};if(!e)return t;const a=e.find((e=>e.types.includes("street_number")))?.long_name,n=e.find((e=>e.types.includes("route")))?.short_name;return t.address_1=a&&n?`${a} ${n}`:"",t.city=e.find((e=>e.types.includes("locality")))?.long_name||"",t.state=e.find((e=>e.types.includes("administrative_area_level_1")))?.short_name||"",t.country=e.find((e=>e.types.includes("country")))?.short_name||"",t.zipcode=e.find((e=>e.types.includes("postal_code")))?.long_name||"",t},M=["places"];function D({input:e,handleBlur:t}){const[a,l]=(0,n.useState)(!1),[i,o]=(0,n.useState)({}),c=(0,n.useRef)(null),{isLoaded:s,loadError:u}=(0,I.RH)({googleMapsApiKey:LOCALIZED?.GMAPS_API_KEY,libraries:M});(0,n.useEffect)((()=>{if(!c.current||!window.google)return;const e=new window.google.maps.places.Autocomplete(c.current);return e.addListener("place_changed",(()=>{try{const t=e.getPlace(),a=T(t.address_components);d(a)}catch(e){console.error("Error handling place_changed event:",e)}})),()=>{window.google.maps.event.clearInstanceListeners(e)}}),[s]);const d=t=>{t.nativeEvent instanceof Event?e.value=t.target.value:(e.obj=t,e.value=`${t.address_1}, ${t.city}, ${t.state} ${t.zipcode}`);const a=m(e);o((t=>({...t,[e.name]:a})))},m=e=>{if(!e.optional)return e.value.trim()?"":"This field is required"};return u?(console.error("Error loading maps:",u),React.createElement("div",null,"Error loading maps")):s?React.createElement(y.A,{spacing:2,direction:"column",sx:{marginTop:"1rem",display:"flex",width:"100%"}},React.createElement(x.A,{label:e.label,name:e.name,value:e.value,onChange:d,onBlur:t,variant:"outlined",margin:"normal",fullWidth:!0,inputRef:c,InputProps:{endAdornment:a?React.createElement(L.A,{size:20}):null},required:!e.optional,error:!!i[e.name],helperText:i[e.name]}),React.createElement(r.A,{variant:"contained","aria-label":"Use my location",color:"primary",onClick:()=>{navigator.geolocation?(l(!0),navigator.geolocation.getCurrentPosition((e=>{const{latitude:a,longitude:n}=e.coords;(new window.google.maps.Geocoder).geocode({location:{lat:a,lng:n}},((e,a)=>{if(l(!1),"OK"===a&&e[0]){const a=T(e[0].address_components);d(a),t()}else console.error("Geocoder failed due to:",a)}))}),(e=>{l(!1),console.error("Error in getting geolocation:",e)}))):console.error("Geolocation is not supported by your browser.")},disabled:a},a?React.createElement(L.A,{size:20}):React.createElement(k.A,null),"Use My Current Location")):React.createElement(b.A,null)}function P({input:e,setValidPhoneNumber:t,handleBlur:a}){const[l,r]=(0,n.useState)({});return React.createElement(x.A,{label:e.label,name:e.name,value:e.value,onChange:a=>{const{value:n}=a.target,i=(e=>{const t=e.replace(/\D/g,"");return t.length<=3?t:t.length<=6?`(${t.slice(0,3)}) ${t.slice(3)}`:`(${t.slice(0,3)}) ${t.slice(3,6)}-${t.slice(6,10)}`})(n),o=(e=>{const a=10!==e.replace(/\D/g,"").length;return t(!0),a?"Valid phone number is required.":""})(i);r({...l,[e.name]:o}),e.value=i},onBlur:a,fullWidth:!0,variant:"outlined",margin:"normal",type:"tel",required:!e.optional,error:!!l[e.name],helperText:l[e.name]})}var $=a(779),O=a(8864),N=a(5724),B=a(7558),q=a(9307),V=a(4368);function Z({input:e,handleBlur:t}){const[a,r]=(0,n.useState)([]),i=e=>{const{value:a,checked:n}=e.target;r((e=>n?[...e,a]:e.filter((e=>e!==a)))),t()};return(0,n.useEffect)((()=>{if(V.A&&a.length>0){const t=V.A.filter((e=>a.includes(e.value)));e.value=t.map((e=>({value:e.value,id:e.id})))}}),[a]),React.createElement($.A,{component:"fieldset",fullWidth:!0,margin:"dense"},React.createElement(q.A,{component:"legend"},"Select desired service(s)"),React.createElement(N.A,null,React.createElement(l.A,{sx:{display:"grid",gridTemplateColumns:"repeat(2, 1fr)",gap:1,padding:0}},V.A&&V.A?.map((e=>React.createElement(O.A,{sx:{margin:0},control:React.createElement(B.A,{value:e.value,checked:a.includes(e.value),onChange:i,name:e.name,size:"small"}),label:e.text}))))))}var W=a(900),j=({input:e,handleTextChange:t,handleDateChange:a,handleConsentChange:l,selectedDate:r,setValidPhoneNumber:i,checked:o,handleBlur:c})=>{switch((0,n.useEffect)((()=>("datetime"===e.type&&a({input:e,event:r}),()=>{})),[e,r,a]),e.type){case"tel":return React.createElement(P,{input:e,setValidPhoneNumber:i,handleBlur:c});case"text":return React.createElement(x.A,{label:e.label,name:e.name,onChange:a=>t({input:e,event:a}),onBlur:c,fullWidth:!0,variant:"outlined",margin:"normal",required:!e.optional});case"email":return React.createElement(x.A,{label:e.label,name:e.name,onChange:a=>t({input:e,event:a}),onBlur:c,fullWidth:!0,autoCapitalize:"email",variant:"outlined",margin:"normal",required:!e.optional});case"geo":return React.createElement(D,{input:e,handleBlur:c});case"select":return React.createElement(Z,{input:e,handleBlur:c});case"checkbox":return React.createElement(O.A,{sx:{marginBottom:"1rem"},size:"small",control:React.createElement(B.A,{checked:o,onChange:t=>l({input:e,event:t}),onBlur:c,name:e.name,required:!e.optional}),label:(0,W.Ay)(LOCALIZED.SMS_CONSENT_MESSAGE||e.label||"")});case"datetime":return React.createElement(w.$,{dateAdapter:_.h},React.createElement(y.A,{direction:"row",spacing:4,sx:{marginTop:"1rem",justifyContent:"space-around",width:"100%"}},React.createElement(S.l,{label:"Select Date",value:r,onChange:t=>a({input:e,event:t}),onAccept:c,disablePast:!0,fullWidth:!0}),React.createElement(C.A,{label:"Select Time",value:r,onChange:t=>a({input:e,event:t}),onAccept:c,fullWidth:!0})));default:return null}},z=a(5131),U=a(2590),G=[{name:"full_name",type:"row",title:"Contact Information",label:"Please enter your contact information.",inputs:[{name:"full_name",type:"text",label:"Enter your name",value:"",optional:!0}]},{name:"phone",inputs:[{name:"phone",type:"tel",label:"Enter your phone number",value:"",optional:!1},{name:"sms_consent",type:"checkbox",label:"Yes, send me SMS updates and notifications to keep me informed about my roadside service request.",value:!1,optional:!0}]},{name:"email",inputs:[{name:"email",type:"email",label:"Enter your email address",value:"",optional:!0}]},{name:"service_time",type:"row",title:"When do you need service?",label:"Please verify service date and time.",inputs:[{value:"",type:"datetime",name:"service_time",selected:"",optional:!1}]},{name:"location",type:"row",title:"Where is the vehicle located?",label:"Please verify service location.",inputs:[{name:"location",type:"geo",label:"Search for your location",value:"",obj:{},optional:!0}]},{type:"row",title:"Vehicle Details",label:"Year, Make, Model, and Color",inputs:[{name:"car_year",type:"text",label:"Year",value:"",optional:!0},{name:"car_make",type:"text",label:"Make",value:"",optional:!0},{name:"car_model",type:"text",label:"Model",value:"",optional:!0},{name:"car_color",type:"text",label:"Color",value:"",optional:!0}]},{name:"service_type",inputs:[{value:[],valueId:null,type:"select",name:"service_type",optionsKey:"serviceOptions",options:[],optional:!1}]},{inputs:[{name:"notes",type:"text",label:"Additional Information",value:"",optional:!0}]}],F=a(991),K=a(9502);function Y(){const[e]=(0,n.useState)(G||!1),[t,a]=(0,n.useState)(!1),[c,s]=(0,n.useState)(!1),[u,d]=(0,n.useState)(!1),[m,p]=(0,n.useState)(null),[v,h]=(0,n.useState)(new Date),[g,f]=(0,n.useState)(!1),[w,S]=(0,n.useState)(null),[C,_]=(0,n.useState)(""),[x,L]=(0,n.useState)(""),[k,I]=(0,n.useState)(!1),T=(0,n.useRef)(null),M=(0,n.useRef)(null),D=(0,n.useRef)(!1);(0,n.useEffect)((()=>{let e;return window?.turnstile&&T.current&&(e=window.turnstile.render(T.current,{sitekey:LOCALIZED.TURNSTILE_SITE_KEY,callback:e=>{S(e),_("")},"expired-callback":()=>{window.turnstile.reset(e),_("Refreshing security token...")}}),_("Securing form, please wait...")),()=>{e&&window.turnstile.remove(e)}}),[]);const P=(0,n.useCallback)((async(a=!1)=>{if(!c){if(!w||!t)return d(!1),_(""),L("Please provide valid phone number."),!1;try{L(""),s(!0);const t=e.flatMap((e=>e.inputs.map((e=>{const{name:t,value:a,obj:n}=e;return n?{name:t,value:a,obj:n}:{name:t,value:a}})))),n={"Content-Type":"application/json","X-Turnstile-Token":w},l=window.location.origin.replace(/^https?:\/\//,"")+window.location.pathname.replace(/\/$/,""),r=(0,F.ix)(t,F.Vu);if(m)await fetch(`${LOCALIZED.API_URL}/submit-lead-form/${m}`,{method:"PUT",headers:n,body:JSON.stringify({submission:t,source:l,completed:r,submitted:a})});else{void 0!==window?.dataLayer&&window.dataLayer.push({event:"form_start"});const e=await fetch(`${LOCALIZED.API_URL}/submit-lead-form`,{method:"POST",headers:n,body:JSON.stringify({submission:t,source:l,completed:r,submitted:a})}),i=await e.json();i?.id&&p(i?.id)}const i=t.find((e=>"email"===e.name)),o=t.find((e=>"phone"===e.name)),c={};if(i?.value&&(c.email=i.value),o?.value){let e=o.value.replace(/[^0-9+]/g,"");10!==e.length||e.startsWith("+")||(e="+1"+e),c.phone_number=e}!D.current&&void 0!==window?.gtag&&c.email&&(window.gtag("set","user_data",c),D.current=!0),a&&void 0!==window?.dataLayer&&window.dataLayer.push({event:"form_submit"}),_("")}catch(e){console.error("There was an error",e),L("There was an error submitting the form. Please try again.")}finally{s(!1),x||I(!1)}}}),[c,w,t,e,m,x]),$=(0,n.useCallback)((()=>{M.current&&clearTimeout(M.current),M.current=setTimeout((()=>{k&&t&&w&&!u&&!c&&(_("Auto-saving..."),P(!1))}),2500)}),[k,t,w,u,c,P,_]),O=(0,n.useCallback)((({input:e,event:t})=>{const a=t?.target?.value;e.value!==a&&(e.value=a,I(!0),$())}),[$]),N=(0,n.useCallback)((({input:e,event:t})=>{e.value!==t&&(e.value=t,h(t),I(!0),$())}),[h,$]),B=(0,n.useCallback)((()=>{}),[]),q=(0,n.useCallback)((({input:e,event:t})=>{const a=t?.target?.checked;e.value!==a&&(e.value=a,f(a),I(!0),$())}),[f,$]),V=(0,n.useCallback)((()=>{_("Submitting your form, please wait..."),d(!0),P(!0)}),[_,d,P]);return React.createElement(i.A,{className:"phoenix-form"},LOCALIZED.FORM_TITLE&&React.createElement(R.A,{title:LOCALIZED.FORM_TITLE,subheader:LOCALIZED.FORM_SUBTITLE}),u?React.createElement(o.A,null,React.createElement(y.A,{space:2},React.createElement(z.A,{questionPrompt:LOCALIZED.SUBMISSION_MESSAGE}))):React.createElement("form",{"aria-label":"Booking Form",autoComplete:"on",noValidate:!0},React.createElement(o.A,null,React.createElement(y.A,{space:4},e?.map(((e,t)=>React.createElement(React.Fragment,{key:t},"row"===e.type?React.createElement(React.Fragment,null,React.createElement(A.A,{variant:"subtitle1",sx:{mt:"1rem"},color:"textSecondary"},e.title,React.createElement(A.A,{variant:"subtitle2",color:"textSecondary"},e.label)),React.createElement(l.A,{display:"flex",flexDirection:"row",sx:{width:"100%"},gap:2},e.inputs.map(((e,t)=>React.createElement(j,{key:t,input:e,handleTextChange:O,handleDateChange:N,handleConsentChange:q,selectedDate:v,setValidPhoneNumber:a,checked:g,setChecked:f,handleBlur:B}))))):e.inputs.map(((e,t)=>React.createElement(j,{key:t,input:e,handleTextChange:O,handleDateChange:N,handleConsentChange:q,selectedDate:v,setValidPhoneNumber:a,checked:g,setChecked:f,handleBlur:B}))))))),React.createElement(l.A,null,React.createElement(U.A,{index:0})),x&&React.createElement(l.A,{sx:{mt:2}},React.createElement(K.A,{severity:"warning"},x))),React.createElement(E,{sx:{justifyContent:"end"}},React.createElement(A.A,{variant:"body2",color:"textSecondary",sx:{mr:2}},C),React.createElement(r.A,{size:"large",variant:"contained",color:"primary",onClick:V,disabled:c||u||!w},"Submit")),c||!w&&React.createElement(b.A,null),React.createElement("div",{ref:T,id:"turnstile-widget",className:"cf-turnstile"})))}},8429:function(e,t,a){function n(){return React.createElement("svg",{style:{width:"20px",height:"20px",marginRight:"0.5rem",fill:"white"},className:"MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-1iirmgg",focusable:"false","aria-hidden":"true",viewBox:"0 0 24 24","data-testid":"MyLocationIcon"},React.createElement("path",{d:"M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4m8.94 3c-.46-4.17-3.77-7.48-7.94-7.94V1h-2v2.06C6.83 3.52 3.52 6.83 3.06 11H1v2h2.06c.46 4.17 3.77 7.48 7.94 7.94V23h2v-2.06c4.17-.46 7.48-3.77 7.94-7.94H23v-2zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7"}))}a.d(t,{A:function(){return n}})},5131:function(e,t,a){a.d(t,{A:function(){return s}});var n=a(1385),l=a(3899),r=a(900),i=a(8168),o=a(7636),c=e=>React.createElement(o.A,(0,i.A)({sx:{backgroundColor:"#f0f0f0",borderRadius:"20px",padding:"10px 15px",position:"relative",maxWidth:"80%"}},e)),s=({questionPrompt:e})=>{var t;const a=null!==(t=LOCALIZED?.ASSETS_URL)&&void 0!==t?t:"",i=e||"";return React.createElement(l.A,{direction:"row",spacing:2,alignItems:"flex-start"},React.createElement(n.A,{src:`${a}/avatar.jpg`,alt:"Technician Avatar"}),React.createElement(c,null,React.createElement("label",null,(0,r.Ay)(i))))}},991:function(e,t,a){a.d(t,{S5:function(){return r},Vu:function(){return n},ix:function(){return i},n4:function(){return o}});const n=["full_name","phone","service_time","location","service_type"],l={full_name:e=>""!==e.trim(),phone:e=>""!==e.trim(),service_time:e=>!isNaN(new Date(e).getTime()),location:e=>""!==e.trim(),service_type:e=>Array.isArray(e)&&e.length>0},r=e=>{if(!e)return"";if(!e.optional)switch(e.type){case"text":case"email":case"tel":case"textarea":if(!e.value||!String(e.value).trim())return"This field is required";break;case"checkbox":if(!e.value)return"This field is required";break;case"geo":return e.value&&e.value.address?"":"Location is required";case"select":return e.value?"":"Please select a service";case"datetime":return!e.value||isNaN(new Date(e.value).getTime())?"Please select a date and time":"";default:return e.value?"":"This field is required"}return"email"===e.type&&e.value&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.value)?"Invalid email format":"tel"===e.type&&e.value&&10!==String(e.value).length?"Valid 10-digit phone number is required.":""},i=(e,t)=>t.every((t=>((e,t)=>{const a=t.find((t=>t.name===e));return!a||!l[e]||l[e](a.value)})(t,e))),o=e=>{if(!e)return"";const t=e.replace(/\D/g,"");return t.length<=3?`(${t}`:t.length<=6?`(${t.slice(0,3)}) ${t.slice(3)}`:`(${t.slice(0,3)}) ${t.slice(3,6)}-${t.slice(6,10)}`}}}]);
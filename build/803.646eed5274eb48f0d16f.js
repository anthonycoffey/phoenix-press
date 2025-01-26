"use strict";(self.webpackChunkphoenix_press=self.webpackChunkphoenix_press||[]).push([[803],{4338:function(e,t,a){var n=a(1609),l=a(900);const r=MaterialUI.Alert;t.A=({index:e})=>0===e&&(0,n.createElement)(n.Fragment,null,LOCALIZED.DISCLAIMER_MESSAGE&&(0,n.createElement)(r,{severity:"info",sx:{padding:"1rem"}},(0,l.Ay)(LOCALIZED.DISCLAIMER_MESSAGE)))},4803:function(e,t,a){a.r(t),a.d(t,{default:function(){return H}});var n=a(1609),l=a(6087),r=[{name:"full_name",type:"row",title:"Contact Information",label:"Please enter your contact information.",inputs:[{name:"full_name",type:"text",label:"Enter your name",value:"",optional:!0}]},{name:"phone",inputs:[{name:"phone",type:"tel",label:"Enter your phone number",value:"",optional:!1},{name:"sms_consent",type:"checkbox",label:"Yes, send me SMS updates and notifications to keep me informed about my roadside service request.",value:!1,optional:!0}]},{name:"service_time",type:"row",title:"When do you need service?",label:"Please verify service date and time.",inputs:[{value:"",type:"datetime",name:"service_time",selected:"",optional:!1}]},{name:"location",type:"row",title:"Where is the vehicle located?",label:"Please verify service location.",inputs:[{name:"location",type:"geo",label:"Search for your location",value:"",obj:{},optional:!0}]},{type:"row",title:"Vehicle Details",label:"Year, Make, Model, and Color",inputs:[{name:"car_year",type:"text",label:"Year",value:"",optional:!0},{name:"car_make",type:"text",label:"Make",value:"",optional:!0},{name:"car_model",type:"text",label:"Model",value:"",optional:!0},{name:"car_color",type:"text",label:"Color",value:"",optional:!0}]},{name:"service_type",inputs:[{value:[],valueId:null,type:"select",name:"service_type",optionsKey:"serviceOptions",options:[],optional:!1}]},{inputs:[{name:"notes",type:"text",label:"Additional Information",value:"",optional:!0}]}];const o=["full_name","phone","service_time","location","service_type"],i=(e,t)=>t.every((t=>((e,t)=>{const a=t.find((t=>t.name===e));return a&&c[e](a.value)})(t,e))),c={full_name:e=>""!==e.trim(),phone:e=>""!==e.trim(),service_time:e=>!isNaN(new Date(e).getTime()),location:e=>""!==e.trim(),service_type:e=>Array.isArray(e)&&e.length>0};var s=a(3455),u=a(5737),d=a(8014),m=a(2687),p=a(8870),h=a(7289),v=a(1769);const g=MaterialUI.TextField,E=MaterialUI.Stack,f=MaterialUI.Button,y=MaterialUI.CircularProgress,b=MaterialUI.LinearProgress,C=e=>{const t={};if(!e)return t;const a=e.find((e=>e.types.includes("street_number")))?.long_name,n=e.find((e=>e.types.includes("route")))?.short_name;return t.address_1=a&&n?`${a} ${n}`:"",t.city=e.find((e=>e.types.includes("locality")))?.long_name||"",t.state=e.find((e=>e.types.includes("administrative_area_level_1")))?.short_name||"",t.country=e.find((e=>e.types.includes("country")))?.short_name||"",t.zipcode=e.find((e=>e.types.includes("postal_code")))?.long_name||"",t},I=["places"];function S({input:e,handleBlur:t}){const[a,r]=(0,l.useState)(!1),[o,i]=(0,l.useState)({}),c=(0,l.useRef)(null),{isLoaded:s,loadError:u}=(0,v.RH)({googleMapsApiKey:LOCALIZED?.GMAPS_API_KEY,libraries:I});(0,l.useEffect)((()=>{if(!c.current||!window.google)return;const e=new window.google.maps.places.Autocomplete(c.current);return e.addListener("place_changed",(()=>{try{const t=e.getPlace(),a=C(t.address_components);d(a)}catch(e){console.error("Error handling place_changed event:",e)}})),()=>{window.google.maps.event.clearInstanceListeners(e)}}),[s]);const d=t=>{t.nativeEvent instanceof Event?e.value=t.target.value:(e.obj=t,e.value=`${t.address_1}, ${t.city}, ${t.state} ${t.zipcode}`);const a=m(e);i((t=>({...t,[e.name]:a})))},m=e=>{if(!e.optional)return e.value.trim()?"":"This field is required"};return u?(console.error("Error loading maps:",u),(0,n.createElement)("div",null,"Error loading maps")):s?(0,n.createElement)(E,{spacing:2,direction:"column",sx:{marginTop:"1rem",display:"flex",width:"100%"}},(0,n.createElement)(g,{label:e.label,name:e.name,value:e.value,onChange:d,onBlur:t,variant:"outlined",margin:"normal",fullWidth:!0,inputRef:c,InputProps:{endAdornment:a?(0,n.createElement)(y,{size:20}):null},required:!e.optional,error:!!o[e.name],helperText:o[e.name]}),(0,n.createElement)(f,{variant:"contained","aria-label":"Use my location",color:"primary",onClick:()=>{navigator.geolocation?(r(!0),navigator.geolocation.getCurrentPosition((e=>{const{latitude:a,longitude:n}=e.coords;(new window.google.maps.Geocoder).geocode({location:{lat:a,lng:n}},((e,a)=>{if(r(!1),"OK"===a&&e[0]){const a=C(e[0].address_components);d(a),t()}else console.error("Geocoder failed due to:",a)}))}),(e=>{r(!1),console.error("Error in getting geolocation:",e)}))):console.error("Geolocation is not supported by your browser.")},disabled:a},a?(0,n.createElement)(y,{size:20}):(0,n.createElement)(h.A,null),"Use My Current Location")):(0,n.createElement)(b,null)}const M=MaterialUI.TextField;function _({input:e,setValidPhoneNumber:t,handleBlur:a}){const[r,o]=(0,l.useState)({});return(0,n.createElement)(M,{label:e.label,name:e.name,value:e.value,onChange:a=>{const{value:n}=a.target,l=(e=>{const t=e.replace(/\D/g,"");return t.length<=3?t:t.length<=6?`(${t.slice(0,3)}) ${t.slice(3)}`:`(${t.slice(0,3)}) ${t.slice(3,6)}-${t.slice(6,10)}`})(n),i=(e=>{const a=10!==e.replace(/\D/g,"").length;return t(!0),a?"Valid phone number is required.":""})(l);o({...r,[e.name]:i}),e.value=l},onBlur:a,fullWidth:!0,variant:"outlined",margin:"normal",type:"tel",required:!e.optional,error:!!r[e.name],helperText:r[e.name]})}var w=a(6892);const x=MaterialUI.FormControl,A=MaterialUI.FormControlLabel,L=MaterialUI.FormGroup,U=MaterialUI.Checkbox,k=MaterialUI.Box,T=MaterialUI.FormLabel;function D({input:e,handleBlur:t}){const[a,r]=(0,l.useState)([]),o=e=>{const{value:a,checked:n}=e.target;r((e=>n?[...e,a]:e.filter((e=>e!==a)))),t()};return(0,l.useEffect)((()=>{if(w.A&&a.length>0){const t=w.A.filter((e=>a.includes(e.value)));e.value=t.map((e=>({value:e.value,id:e.id})))}}),[a]),(0,n.createElement)(x,{component:"fieldset",fullWidth:!0,margin:"dense"},(0,n.createElement)(T,{component:"legend"},"Select desired service(s)"),(0,n.createElement)(L,null,(0,n.createElement)(k,{sx:{display:"grid",gridTemplateColumns:"repeat(2, 1fr)",gap:1,padding:0}},w.A&&w.A?.map((e=>(0,n.createElement)(A,{sx:{margin:0},control:(0,n.createElement)(U,{value:e.value,checked:a.includes(e.value),onChange:o,name:e.name,size:"small"}),label:e.text}))))))}var O=a(900);const B=MaterialUI.TextField,P=MaterialUI.FormControlLabel,N=MaterialUI.Checkbox,$=MaterialUI.Stack;var R=({input:e,handleTextChange:t,handleDateChange:a,handleConsentChange:r,selectedDate:o,setValidPhoneNumber:i,checked:c,handleBlur:s})=>{switch((0,l.useEffect)((()=>("datetime"===e.type&&a({input:e,event:o}),()=>{})),[e,o,a]),e.type){case"tel":return(0,n.createElement)(_,{input:e,setValidPhoneNumber:i,handleBlur:s});case"text":return(0,n.createElement)(B,{label:e.label,name:e.name,onChange:a=>t({input:e,event:a}),onBlur:s,fullWidth:!0,variant:"outlined",margin:"normal",required:!e.optional});case"geo":return(0,n.createElement)(S,{input:e,handleBlur:s});case"select":return(0,n.createElement)(D,{input:e,handleBlur:s});case"checkbox":return(0,n.createElement)(P,{sx:{marginBottom:"1rem"},control:(0,n.createElement)(N,{checked:c,onChange:t=>r({input:e,event:t}),onBlur:s,name:e.name,required:!e.optional}),label:(0,O.Ay)(LOCALIZED.SMS_CONSENT_MESSAGE||e.label)});case"datetime":return(0,n.createElement)(u.$,{dateAdapter:p.h},(0,n.createElement)($,{direction:"row",spacing:4,sx:{marginTop:"1rem",justifyContent:"space-around",width:"100%"}},(0,n.createElement)(d.l,{label:"Select Date",value:o,onChange:t=>a({input:e,event:t}),onAccept:s,disablePast:!0,fullWidth:!0}),(0,n.createElement)(m.A,{label:"Select Time",value:o,onChange:t=>a({input:e,event:t}),onAccept:s,fullWidth:!0})));default:return null}},F=a(4338);const Z=MaterialUI.Box,j=MaterialUI.Button,V=MaterialUI.Card,q=MaterialUI.CardContent,G=MaterialUI.CardActions,W=MaterialUI.Stack,z=MaterialUI.Typography,K=MaterialUI.LinearProgress,Y=MaterialUI.CardHeader;function H(){const[e]=(0,l.useState)(r||!1),[t,a]=(0,l.useState)(!1),[c,u]=(0,l.useState)(!1),[d,m]=(0,l.useState)(!1),[p,h]=(0,l.useState)(!1),[v,g]=(0,l.useState)(null),[E,f]=(0,l.useState)(new Date),[y,b]=(0,l.useState)(!1),[C,I]=(0,l.useState)(null);(0,l.useEffect)((()=>{let e;return window.turnstile&&(e=window.turnstile.render("#turnstile-widget",{sitekey:LOCALIZED.TURNSTILE_SITE_KEY,callback:e=>{I(e)},"expired-callback":()=>{window.turnstile.reset(e)}})),()=>{e&&window.turnstile.remove(e)}}),[]);const S=async()=>{if(u(!0),!C&&!t)return!1;try{const t=e.flatMap((e=>e.inputs.map((e=>{const{name:t,value:a,obj:n}=e;return n?{name:t,value:a,obj:n}:{name:t,value:a}})))),a={"Content-Type":"application/json","X-Turnstile-Token":C},n=window.location.origin.replace(/^https?:\/\//,"")+window.location.pathname.replace(/\/$/,""),l=i(t,o);if(v)await fetch(`${LOCALIZED.API_URL}/submit-lead-form/${v}`,{method:"PUT",headers:a,body:JSON.stringify({submission:t,source:n,completed:l})});else{p||(h(!0),window?.dataLayer&&window.dataLayer.push({event:"form_start"}));const e=await fetch(`${LOCALIZED.API_URL}/submit-lead-form`,{method:"POST",headers:a,body:JSON.stringify({submission:t,source:n,completed:l})}),r=await e.json();r?.id&&g(r?.id)}}catch(e){console.error("There was an error",e)}finally{u(!1)}},M=({input:e,event:t})=>{e.value=t?.target?.value},_=({input:e,event:t})=>{e.value=t,f(t)},w=()=>{t&&C&&S()},x=({input:e,event:t})=>{const{checked:a}=t?.target;e.value=a,b(a),w()};return(0,n.createElement)("section",null,(0,n.createElement)(l.Suspense,{fallback:(0,n.createElement)(K,null)},(0,n.createElement)(V,{className:"phoenix-form"},LOCALIZED.FORM_TITLE&&(0,n.createElement)(Y,{title:LOCALIZED.FORM_TITLE,subheader:LOCALIZED.FORM_SUBTITLE}),d?(0,n.createElement)(q,null,(0,n.createElement)(W,{space:2},(0,n.createElement)(s.A,{question:{prompt:LOCALIZED.SUBMISSION_MESSAGE}}))):(0,n.createElement)("form",{"aria-label":"Form Description",autoComplete:"on",noValidate:!0},(0,n.createElement)(q,null,(0,n.createElement)(W,{space:4},e?.map(((e,t)=>(0,n.createElement)(React.Fragment,{key:t},"row"===e.type?(0,n.createElement)(n.Fragment,null,(0,n.createElement)(z,{variant:"subtitle1",sx:{mt:"1rem"},color:"textSecondary"},e.title,(0,n.createElement)(z,{variant:"subtitle2",color:"textSecondary"},e.label)),(0,n.createElement)(Z,{display:"flex",flexDirection:"row",sx:{width:"100%"},gap:2},e.inputs.map(((e,t)=>(0,n.createElement)(R,{key:t,input:e,handleTextChange:M,handleDateChange:_,handleConsentChange:x,selectedDate:E,setValidPhoneNumber:a,checked:y,setChecked:b,handleBlur:w}))))):e.inputs.map(((e,t)=>(0,n.createElement)(R,{key:t,input:e,handleTextChange:M,handleDateChange:_,handleConsentChange:x,selectedDate:E,setValidPhoneNumber:a,checked:y,setChecked:b,handleBlur:w}))))))),(0,n.createElement)(Z,null,(0,n.createElement)(F.A,{index:0}))),(0,n.createElement)(G,{sx:{justifyContent:"end"}},(0,n.createElement)(j,{size:"large",variant:"contained",color:"primary",onClick:()=>{m(!0),S()},disabled:c||!t||!C},"Submit")),c||!C&&(0,n.createElement)(K,null),(0,n.createElement)("div",{id:"turnstile-widget",className:"cf-turnstile",style:{display:"flex",justifyContent:"center",margin:"1rem 0",padding:"1rem"},"data-sitekey":LOCALIZED.TURNSTILE_SITE_KEY})))))}},7289:function(e,t,a){a.d(t,{A:function(){return l}});var n=a(1609);function l(){return(0,n.createElement)("svg",{style:{width:"20px",height:"20px",marginRight:"0.5rem",fill:"white"},className:"MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-1iirmgg",focusable:"false","aria-hidden":"true",viewBox:"0 0 24 24","data-testid":"MyLocationIcon"},(0,n.createElement)("path",{d:"M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4m8.94 3c-.46-4.17-3.77-7.48-7.94-7.94V1h-2v2.06C6.83 3.52 3.52 6.83 3.06 11H1v2h2.06c.46 4.17 3.77 7.48 7.94 7.94V23h2v-2.06c4.17-.46 7.48-3.77 7.94-7.94H23v-2zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7"}))}},3455:function(e,t,a){a.d(t,{A:function(){return s}});var n=a(1609),l=a(900);const r=MaterialUI.CardContent;var o=e=>(0,n.createElement)(r,{sx:{backgroundColor:"#f0f0f0",borderRadius:"20px",padding:"10px 15px",position:"relative",maxWidth:"80%"},...e});const i=MaterialUI.Avatar,c=MaterialUI.Stack;var s=({question:e})=>{var t;const a=null!==(t=LOCALIZED?.ASSETS_URL)&&void 0!==t?t:"";return(0,n.createElement)(c,{direction:"row",spacing:2,alignItems:"flex-start"},(0,n.createElement)(i,{src:`${a}/avatar.jpg`,alt:"Technician Avatar"}),(0,n.createElement)(o,null,(0,n.createElement)("label",null,(0,l.Ay)(e.prompt))))}}}]);
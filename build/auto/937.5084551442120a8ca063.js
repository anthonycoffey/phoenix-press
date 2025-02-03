"use strict";(self.webpackChunkphoenix_press=self.webpackChunkphoenix_press||[]).push([[937],{937:function(e,t,n){n.r(t),n.d(t,{default:function(){return R}});var a=n(1609),r=n(6087),l=n(6990),i=n(4977),o=n(7636),s=n(5583),c=n(3313),u=n(3650),m=n(7458),d=n(3455),p=n(5694),f=n(4389),g=n(8864),E=n(5737),h=n(8014),v=n(2687),A=n(8870),y=n(7289),b=n(1769),x=n(4267);const C=e=>{const t={};if(!e)return t;const n=e.find((e=>e.types.includes("street_number")))?.long_name,a=e.find((e=>e.types.includes("route")))?.short_name;return t.address_1=n&&a?`${n} ${a}`:"",t.city=e.find((e=>e.types.includes("locality")))?.long_name||"",t.state=e.find((e=>e.types.includes("administrative_area_level_1")))?.short_name||"",t.country=e.find((e=>e.types.includes("country")))?.short_name||"",t.zipcode=e.find((e=>e.types.includes("postal_code")))?.long_name||"",t},w=["places"];function S({input:e}){const{questions:t,currentQuestionIndex:n,setQuestions:i,errors:o,setErrors:c}=(0,r.useContext)(x.q),[u,d]=(0,r.useState)(!1),f=(0,r.useRef)(null),{isLoaded:g,loadError:E}=(0,b.RH)({googleMapsApiKey:LOCALIZED?.GMAPS_API_KEY,libraries:w});(0,r.useEffect)((()=>{if(!f.current||!window.google)return;const e=new window.google.maps.places.Autocomplete(f.current);return e.addListener("place_changed",(()=>{try{const t=e.getPlace(),n=C(t.address_components);h(n)}catch(e){console.error("Error handling place_changed event:",e)}})),()=>{window.google.maps.event.clearInstanceListeners(e)}}),[g]);const h=e=>{try{const a=[...t],r=a[n].inputs.find((e=>"location"===e.name));e.nativeEvent instanceof Event?r.value=e.target.value:(r.obj=e,r.value=`${e.address_1}, ${e.city}, ${e.state} ${e.zipcode}`),i(a);const l=v(r);c({...o,[r.name]:l})}catch(e){console.error("Error handling input change:",e)}},v=e=>{if(!e.optional)return e.value.trim()?"":"This field is required"};return E?(console.error("Error loading maps:",E),(0,a.createElement)("div",null,"Error loading maps")):g?(0,a.createElement)(r.Suspense,{fallback:(0,a.createElement)(m.A,null)},(0,a.createElement)(s.A,{spacing:2,direction:"column",sx:{marginTop:"1rem"}},(0,a.createElement)(p.A,{label:e.label,name:e.name,value:e.value,onChange:h,variant:"outlined",margin:"normal",fullWidth:!0,inputRef:f,InputProps:{endAdornment:u?(0,a.createElement)(m.A,null):null},required:!e.optional,error:!!o[e.name],helperText:o[e.name]}),(0,a.createElement)(l.A,{variant:"contained","aria-label":"Use my location",color:"primary",onClick:()=>{navigator.geolocation?(d(!0),navigator.geolocation.getCurrentPosition((e=>{const{latitude:t,longitude:n}=e.coords;(new window.google.maps.Geocoder).geocode({location:{lat:t,lng:n}},((e,t)=>{if(d(!1),"OK"===t&&e[0]){const t=C(e[0].address_components);h(t)}else console.error("Geocoder failed due to:",t)}))}),(e=>{d(!1),console.error("Error in getting geolocation:",e)}))):console.error("Geolocation is not supported by your browser.")},disabled:u},u?(0,a.createElement)(m.A,null):(0,a.createElement)(y.A,null),"Use My Current Location"))):(0,a.createElement)(m.A,null)}var L=n(779),I=n(5724),_=n(6347),T=n(9307);function k({input:e}){const{questions:t,currentQuestionIndex:n,setQuestions:l,services:i,errors:o,setErrors:s}=(0,r.useContext)(x.q),[u,m]=(0,r.useState)([]),d=e=>{const{value:t,checked:n}=e.target;m((e=>n?[...e,t]:e.filter((e=>e!==t))))};(0,r.useEffect)((()=>{const e=[...t],a=e[n].inputs.find((e=>"service_type"===e.name)),r=i.filter((e=>u.includes(e.value)));a.value=r.map((e=>({value:e.value,id:e.id}))),l(e);const c=p(a);s({...o,[a.name]:c})}),[u]);const p=e=>{if(!e.optional)return e.value.length<1?"This field is required":""};return(0,a.createElement)(L.A,{component:"fieldset",fullWidth:!0,margin:"dense",error:o.service_type},(0,a.createElement)(T.A,{component:"legend"},"Select desired service(s)"),(0,a.createElement)(I.A,null,(0,a.createElement)(c.A,{sx:{display:"grid",gridTemplateColumns:"repeat(2, 1fr)",gap:1,padding:0}},i.map((e=>(0,a.createElement)(g.A,{sx:{margin:0},control:(0,a.createElement)(f.A,{value:e.value,checked:u.includes(e.value),onChange:d,name:e.name,size:"small"}),label:e.text}))))),(0,a.createElement)(_.A,null,o.service_type))}function q({input:e,onChange:t}){const{errors:n,setErrors:l}=(0,r.useContext)(x.q),i=e=>10!==e.replace(/\D/g,"").length?"Valid phone number is required.":"";return(0,r.useEffect)((()=>{const t=i(e.value);l({...n,[e.name]:t})}),[e.value,l,n,e.name]),(0,a.createElement)(p.A,{label:e.label,name:e.name,value:e.value,onChange:a=>{const{value:r}=a.target,o=(e=>{const t=e.replace(/\D/g,"");return t.length<=3?t:t.length<=6?`(${t.slice(0,3)}) ${t.slice(3)}`:`(${t.slice(0,3)}) ${t.slice(3,6)}-${t.slice(6,10)}`})(r),s=i(o);l({...n,[e?.name]:s}),t({target:{name:"phone",value:o}})},fullWidth:!0,variant:"outlined",margin:"normal",type:"tel",required:!e.optional,error:!!n[e.name],helperText:n[e.name]})}var M=n(900),O=({question:e})=>{const{errors:t,setErrors:n}=(0,r.useContext)(x.q),{questions:l,setQuestions:i,currentQuestionIndex:o}=(0,r.useContext)(x.q),[c,u]=(0,r.useState)(new Date);(0,r.useEffect)((()=>{if(l){const e=[...l],t=e[o].inputs.find((e=>"service_time"===e.name));t&&(t.value=c,i(e))}}),[e,c]);const m=e=>{u(e)},d=e=>{const{name:a,value:r,type:s,checked:c}=e.target,u=[...l],m=u[o].inputs.find((e=>e.name===a));if(m.value="checkbox"===s?c:r,i(u),"text"===m.type||"checkbox"===m.type){const e=y(m);n({...t,[m.name]:e})}},y=e=>{if(!e.optional)switch(e.type){case"text":return e.value.trim()?"":"This field is required";case"checkbox":return e.value?"":"This field is required";default:return""}return""};return(0,a.createElement)(a.Fragment,null,e.inputs.map(((e,n)=>"tel"===e.type?(0,a.createElement)(q,{input:e,key:n,onChange:d}):"text"===e.type?(0,a.createElement)(p.A,{key:n,label:e.label,name:e.name,value:e.value,onChange:d,fullWidth:!0,variant:"outlined",margin:"normal",error:!!t[e.name],helperText:t[e.name],required:!e.optional}):"geo"===e.type?(0,a.createElement)(S,{input:e,key:n}):"select"===e.type?(0,a.createElement)(k,{input:e,key:n}):"textarea"===e.type?(0,a.createElement)(p.A,{key:n,label:e.label,name:e.name,value:e.value,onChange:d,fullWidth:!0,required:!e.optional,variant:"outlined",margin:"normal"}):"checkbox"===e.type?(0,a.createElement)(g.A,{sx:{marginBottom:"1rem"},key:n,control:(0,a.createElement)(f.A,{checked:e.value,onChange:d,name:e.name,required:!e.optional}),label:(0,M.Ay)(LOCALIZED.SMS_CONTENT_MESSAGE||e.label)}):"datetime"===e.type?(0,a.createElement)(E.$,{dateAdapter:A.h,key:n},(0,a.createElement)(s.A,{direction:"row",spacing:2,sx:{marginTop:"1rem"}},(0,a.createElement)(h.l,{label:"Select Date",value:c,onChange:m,disablePast:!0,fullWidth:!0}),(0,a.createElement)(v.A,{label:"Select Time",value:c,onChange:m,fullWidth:!0}))):null)))},D=n(4338);function $(){return(0,a.createElement)("svg",{style:{width:"2rem",height:"2rem",marginRight:"0.5rem",fill:"#cf2e2e"},className:"MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-1iirmgg",focusable:"false","aria-hidden":"true",viewBox:"0 0 24 24","data-testid":"CancelIcon"},(0,a.createElement)("path",{d:"M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2m5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12z"}))}var R=()=>{const{questions:e,currentQuestionIndex:t,setCurrentQuestionIndex:n,loading:p,setLoading:f,submitted:g,setSubmitted:E,isFormVisible:h,setIsFormVisible:v,errors:A}=(0,r.useContext)(x.q),y=e[t],[b,C]=(0,r.useState)(!0),[w,S]=(0,r.useState)(null),[L,I]=(0,r.useState)(null);(0,r.useEffect)((()=>{const e=y.inputs.some((e=>A[e.name]));return C(e),()=>{C(!0)}}),[A]),(0,r.useEffect)((()=>{if(h&&window.turnstile){const e=window.turnstile.render("#conversation-turnstile-widget",{sitekey:LOCALIZED.TURNSTILE_SITE_KEY,callback:e=>{I(e)},"expired-callback":()=>{window.turnstile.reset(e)}})}}),[h]);const _=()=>{v(!h)};return(0,a.createElement)("section",null,!h&&(0,a.createElement)("button",{onClick:_,id:"phoenix-show-form-button","aria-label":"Show Lead Form",style:{background:LOCALIZED.CHAT_AVATAR?"none":"#4395ce"}},LOCALIZED.CHAT_AVATAR?(0,a.createElement)("img",{className:"phoenix-chat-avatar",src:LOCALIZED.CHAT_AVATAR,alt:"Phoenix Lead Form Chat Avatar"}):(0,a.createElement)("svg",{xmlns:"http://www.w3.org/2000/svg",className:"e-font-icon-svg e-fas-comment-alt",viewBox:"0 0 512 512",width:"24",height:"24",fill:"#fff"},(0,a.createElement)("path",{d:"M448 0H64C28.7 0 0 28.7 0 64v288c0 35.3 28.7 64 64 64h96v84c0 9.8 11.2 15.5 19.1 9.7L304 416h144c35.3 0 64-28.7 64-64V64c0-35.3-28.7-64-64-64z"}))),h&&(0,a.createElement)(i.A,{className:"phoenix-form"},(0,a.createElement)(u.A,{action:(0,a.createElement)(l.A,{onClick:_,"aria-label":"close"},(0,a.createElement)($,null))}),(0,a.createElement)(a.Fragment,null,g&&(0,a.createElement)(o.A,null,(0,a.createElement)(s.A,{space:2},(0,a.createElement)(d.A,{question:{prompt:LOCALIZED.SUBMISSION_MESSAGE}}))),!g&&(0,a.createElement)(a.Fragment,null,(0,a.createElement)(o.A,null,(0,a.createElement)(s.A,{space:2},(0,a.createElement)(d.A,{question:y}),(0,a.createElement)(O,{question:y})),!p&&(0,a.createElement)(s.A,{direction:"row",spacing:2,sx:{width:"100%",display:"flex",my:"1rem",justifyContent:t>0?"space-between":"flex-end"}},t>0&&(0,a.createElement)(l.A,{variant:"contained",onClick:()=>n(t-1)},"Back"),(0,a.createElement)(l.A,{sx:{justifySelf:"end"},variant:"contained",color:"primary",onClick:()=>{(async()=>{if(p||!L)return!1;try{f(!0);const a=e.flatMap((e=>e.inputs.map((e=>{const{name:t,value:n,obj:a}=e;return a?{name:t,value:n,obj:a}:{name:t,value:n}})))),r={"Content-Type":"application/json","X-Turnstile-Token":L},l=window.location.origin.replace(/^https?:\/\//,"")+window.location.pathname.replace(/\/$/,"");if(t+1===e.length)return await(async(t,n)=>{try{if(f(!0),!w)return!1;await fetch(`${LOCALIZED.API_URL}/submit-lead-form/${w}`,{method:"PUT",headers:{"Content-Type":"application/json","X-Turnstile-Token":L},body:JSON.stringify({submission:t,completed:!0,submitted:!0,source:n})}),E(!0)}catch(e){console.error("There was an error",e)}finally{f(!1);const t=e.find((e=>"full_name"===e.name))?.inputs[0]?.value||"";window.location.href=`/book-success?full_name=${encodeURIComponent(t)}`}})(a,l);if(n(t+1),w)await fetch(`${LOCALIZED.API_URL}/submit-lead-form/${w}`,{method:"PUT",headers:r,body:JSON.stringify({submission:a,source:l})});else{const e=await fetch(`${LOCALIZED.API_URL}/submit-lead-form`,{method:"POST",headers:r,body:JSON.stringify({submission:a,source:l})}),t=await e.json();t?.id&&S(t?.id)}}catch(e){console.error("There was an error",e)}finally{f(!1)}})()},disabled:b||!L},t+1===e.length?"Submit":"Next")),(0,a.createElement)(D.A,{index:t}),(0,a.createElement)(c.A,{spacing:2,className:"phoenix-no-select",sx:{width:"100%",display:"flex",my:"1rem",justifyContent:"center",alignItems:"center",minHeight:"1rem"}},(p||!L)&&(0,a.createElement)(m.A,{sx:{width:"100%"}}))))),(0,a.createElement)("div",{id:"conversation-turnstile-widget",className:"cf-turnstile",style:{display:"flex",justifyContent:"center",margin:"1rem 0",padding:"1rem"},"data-sitekey":LOCALIZED.TURNSTILE_SITE_KEY})))}},4338:function(e,t,n){var a=n(1609),r=n(9502),l=n(900);t.A=({index:e})=>0===e&&(0,a.createElement)(a.Fragment,null,LOCALIZED.DISCLAIMER_MESSAGE&&(0,a.createElement)(r.A,{severity:"info",sx:{padding:"1rem"}},(0,l.Ay)(LOCALIZED.DISCLAIMER_MESSAGE)))},7289:function(e,t,n){n.d(t,{A:function(){return r}});var a=n(1609);function r(){return(0,a.createElement)("svg",{style:{width:"20px",height:"20px",marginRight:"0.5rem",fill:"white"},className:"MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-1iirmgg",focusable:"false","aria-hidden":"true",viewBox:"0 0 24 24","data-testid":"MyLocationIcon"},(0,a.createElement)("path",{d:"M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4m8.94 3c-.46-4.17-3.77-7.48-7.94-7.94V1h-2v2.06C6.83 3.52 3.52 6.83 3.06 11H1v2h2.06c.46 4.17 3.77 7.48 7.94 7.94V23h2v-2.06c4.17-.46 7.48-3.77 7.94-7.94H23v-2zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7"}))}},3455:function(e,t,n){n.d(t,{A:function(){return c}});var a=n(1609),r=n(1385),l=n(5583),i=n(900),o=n(7636),s=e=>(0,a.createElement)(o.A,{sx:{backgroundColor:"#f0f0f0",borderRadius:"20px",padding:"10px 15px",position:"relative",maxWidth:"80%"},...e}),c=({question:e})=>{var t;const n=null!==(t=LOCALIZED?.ASSETS_URL)&&void 0!==t?t:"";return(0,a.createElement)(l.A,{direction:"row",spacing:2,alignItems:"flex-start"},(0,a.createElement)(r.A,{src:`${n}/avatar.jpg`,alt:"Technician Avatar"}),(0,a.createElement)(s,null,(0,a.createElement)("label",null,(0,i.Ay)(e.prompt))))}}}]);
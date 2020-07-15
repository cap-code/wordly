let totalcount=0;
const API_URL="http://localhost:3005/word";
const mainbutton=document.getElementById("main_buttons");
const addwordsubmit=document.getElementById("final_submit");
const loadingElement = document.querySelector('.loading');
const addwordform=document.querySelector('.addwordform');
const learnform=document.querySelector('.learnform');
const addbutton=document.getElementById("addbutton");
const search=document.getElementById("search");
const learnbutton=document.getElementById("learnbutton");
const easybutton=document.getElementById("easy");
const hardbutton=document.getElementById("hard");
const addwordaudio=document.getElementById("voice");
const addwordvoicebutton=document.getElementById("audio-nik");
loadingElement.style.display ='none';
addwordform.style.display="none";
learnform.style.display="none";
addbutton.addEventListener('click',(event)=>{
  mainbutton.style.display="none";
  addwordform.style.display="";
});
easybutton.addEventListener('click',(event)=>{
    event.preventDefault();
   totalcount=totalcount+3;
   document.getElementById('view_days').textContent=totalcount;

});
hardbutton.addEventListener('click',(event)=>{
    event.preventDefault();
   totalcount=totalcount+1;
   document.getElementById('view_days').textContent=totalcount;

});







let word,meaning,examples,pronounciation,audio;
search.addEventListener('click',async (event)=>{
  event.preventDefault();
  loadingElement.style.display ='';
  const formdata=new FormData(addwordform);
  word=formdata.get('addword');
  //const response = 
  await fetch('/test/'+ word).then(response=> response.json()).then(json=>{
  loadingElement.style.display ='none';
  console.log("data searched",json);
  const sm=json.m;
  const sp=json.p;
  const se=json.e;
  const sa=json.a;
  document.getElementById("meaning-nik").textContent=sm[0].text +','+ sm[1].text;
  document.getElementById("pro-nik").textContent=sp[0].raw;
  document.getElementById("examples-nik").textContent=se.examples[1].text;
  addwordaudio.src=sa[1].fileUrl;
  meaning=sm[0].text+','+sm[1].text;
  examples=se.examples[0].text+','+se.examples[1].text;
  pronounciation=sp[0].raw;
  audio=sa[1].fileUrl;
  });
});
addwordvoicebutton.addEventListener('click',event=>{
   event.preventDefault();
   addwordaudio.play();
});
//addword form------------------------------------------
addwordsubmit.addEventListener('click',(event)=>{
  event.preventDefault();
  const form1data=new FormData(addwordform);
    const description =form1data.get('addiscription');
    const worddata={
        word,meaning,pronounciation,examples,description,audio,totalcount
      
      };
  console.log(worddata);
  fetch(API_URL,{
      method:'POST',
      headers:{
          'content-Type':'application/json'
      },
      body:JSON.stringify(worddata),
  }).then(response =>response.json()).then(data =>{
     console.log(data);
     totalcount=0;
     addwordform.reset();
     word='';
     meaning='';
     examples='';
     pronounciation='';
     audio='';
       });
});
//add word ends-------------------------------------

//###############################################################
//learn word----------------------------------------
learnbutton.addEventListener('click',event=>{
    mainbutton.style.display="none";
    addwordform.style.display="none";
    learnform.style.display="";
    learnfunction();
    
});
 async function learnfunction(){
    const response= await fetch('/learn');
    const datas = await response.json();
    for(data of datas){
        let count=0;
        const div=document.createElement('div');
        const easylearnbutton=document.createElement('button');
        easylearnbutton.innerHTML="EASY(in 3 DAYS)";
        const hardlearnbutton=document.createElement('button');
        hardlearnbutton.innerHTML="HARD(in 1 DAY)";
        const viewmeaning=document.createElement('button');
        viewmeaning.innerHTML="VIEW";
        const takeout=document.createElement('button');
        takeout.innerHTML="TAKE OUT";
        const submitlearn=document.createElement('button');
        submitlearn.innerHTML="SUBMIT";
        const audioButton=document.createElement('button');
        const audiovoice=document.createElement('audio');
        //let audioicon='<i class="fas fa-volume-up"></i>';
        audioButton.innerHTML="&#128266";
        const word=document.createElement('h4');
        const pro=document.createElement('small');
        const para =document.createElement('h5');
        const exa=document.createElement('h6');
        const article=document.createElement('p');
        const date=new Date(data.date);
        date.setHours(0,0,0,0);
        console.log("saved",date);
        const currentdate=new Date();
        currentdate.setHours(0,0,0,0);
        console.log("current",currentdate);
        if(date>currentdate){
          console.log("future!!! we are there not yet");
        }else {
            console.log("this is working");
            para.style.display="none";
            article.style.display="none";
            pro.style.display="none";
            exa.style.display="none";
            word.textContent=data.word;
            para.textContent=data.meaning;
            exa.textContent=data.examples;
            pro.textContent=data.pronounciation;
            article.textContent=data.description;
            audiovoice.src=data.audio;
            viewmeaning.addEventListener('click',event=>{
                event.preventDefault();
                pro.style.display="";
                para.style.display="";
                exa.style.display="";
                article.style.display=""; 
                audioButton.addEventListener('click',event=>{
                  event.preventDefault();
                   audiovoice.play();
                });
            });
            easylearnbutton.addEventListener('click',event=>{
              event.preventDefault();
              count+=3;
            });
            hardlearnbutton.addEventListener('click',event=>{
              event.preventDefault();
              count+=1;
            });
            takeout.addEventListener('click',event=>{
             event.preventDefault();
             const del=data.word;
             fetch('/delete',{
               method:'POST',
               headers:{
                 'content-type':'application/json'
               },
               body:JSON.stringify(del),
             });
             
            });
            submitlearn.addEventListener('click',event=>{
              event.preventDefault();
              const w=data.word;
              const m=data.meaning;
              const d=data.description;
              const f=fg;
              const sent={w,m,d,count};
              fetch('/change',{
                  method:'POST',
                  headers:{
                      'content-type':'application/json'
                  },
                  body:JSON.stringify(sent),
              }).then(response=>response.json()).then(data=>{
                  console.log(data);
                  count=0;
              })
            });
            div.appendChild(word);
            div.appendChild(para);
            div.appendChild(article);
            div.appendChild(audioButton);
            div.appendChild(viewmeaning);
            div.appendChild(takeout);
            div.appendChild(easylearnbutton);
            div.appendChild(hardlearnbutton);
            div.appendChild(submitlearn);
            learnform.appendChild(div);
           
        
    }
  }
}
//ends here---------------------------------------------
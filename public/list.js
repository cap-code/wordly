const list=document.querySelector('.list');
async function listall(){
    const response= await fetch('/learn');
    const datas= await response.json();
    for(data of datas){
        const div=document.createElement('div');
        const header = document.createElement('h3');
        const para =document.createElement('h4');
        const article=document.createElement('p');
        const date=document.createElement('small');
        const created=document.createElement('p');
        header.textContent=data.word;
        para.textContent=data.meaning;
        article.textContent=data.description;
        date.textContent=data.date;
        created.textContent=data.created;
        div.appendChild(header);
        div.appendChild(para);
        div.appendChild(article);
        div.appendChild(date);
        div.appendChild(created);
        list.appendChild(div);
 
    } 

}
listall();
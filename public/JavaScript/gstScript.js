let taxbtn = document.querySelector('.tax-switch');
taxbtn.addEventListener('click',()=>{
    let gstar = document.getElementsByClassName('tax-info');
    // console.log(gstar);   
    for(g of gstar){
        // console.log(g);
        if(g.style.display != 'inline'){
        g.style.display = 'inline';
    }
    else {
        g.style.display = 'none';
    }
    }
})
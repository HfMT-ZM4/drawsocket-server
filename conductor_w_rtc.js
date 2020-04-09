
const ensembleName = document.getElementById('ensembleName');
const pieceMenu = document.getElementById('piecemenu');
const generateButton = document.getElementById('generateEnsemble');

const pingPeer = document.getElementById('pingPeer');

pingPeer.addEventListener('keydown', event => {
    if( event.key == 'Enter' ){
        drawsocket.send({
            key: 'signalPeer',
            url: pingPeer.value,
            val: `hello from ${drawsocket.url}!`
        })
    }
});





generateButton.addEventListener('click', (e) => {    
    drawsocket.send({
        event: {
            key: 'conductor',
            val: {
                select_score: pieceMenu.value,
                ensembleName: ensembleName.value
            }
        }
    })
});



function clearElement(el)
{
    while (el.firstChild) {
        el.firstChild.remove();
    }
}


function getPieces()
{
    drawsocket.send({
        event : {
            key: 'conductor',
            val: 'getPieces'
        }
    })
}


function makeMenuItem(text, classname)
{
    let newlink = document.createElement('option');
    newlink.textContent = text;
    newlink.setAttribute("value", text);
    newlink.classList.add(classname);
    return newlink;
}


function makeScoreLinks(scoreArr)
{
    if( !Array.isArray(scoreArr) )
    {
        scoreArr = [ scoreArr ];
    }

    let fragment = document.createDocumentFragment();
    fragment.appendChild( makeMenuItem("", 'scorelink') );

    scoreArr.forEach( score => {
        fragment.appendChild( makeMenuItem(score, 'scorelink') );
    });

    pieceMenu.appendChild(fragment);
}



function makeEnsembleLinks(objarr)
{
    if( !Array.isArray(objarr) )
    {
        objarr = [ objarr ];
    }
    
    console.log("makeEnsembleLinks", objarr);
        
    let ensembleLinks = document.getElementById('ensembleLinks');
    clearElement(ensembleLinks);

    let fragment = document.createDocumentFragment();
    
    let title = document.createElement('span');
    title.classList.add('title');
    title.innerText = "Generated Parts"

    fragment.appendChild(title);

    objarr.forEach( ob => {
        if( ob.hasOwnProperty('url') )
        {
            let p = document.createElement('p');
            let a = document.createElement('a');
            a.setAttribute('href', ob.url);
            a.innerHTML = ob.url;
            p.appendChild(a);
            fragment.appendChild(p);
        }
    });
    
    ensembleLinks.appendChild(fragment);
    
}

function inputListener(key, objarr, wasHandled)
{
   if( key == 'conductor' )
   {
       console.log('received', objarr);
       
        objarr.forEach(obj => {
            if( obj.hasOwnProperty("id") )
            {
                switch(obj.id)
                {
                    case "pieceList":
                        if( obj.hasOwnProperty('pieces') ){
                            makeScoreLinks(obj.pieces);
                        }
                    break;
                    case "ensembleList":
                        if( obj.hasOwnProperty('ensemble') ){
                            makeEnsembleLinks(obj.ensemble);
                        }
                    break;
                    default:
                    break;
                }
            }
        });
   }
   else if( key == 'clearform' )
   {
        clearElement( document.getElementById('forms') );
   }
   else if( key == 'signalPeer')
   {
        console.log('signalPeer', objarr);
        
   }
}


window.addEventListener("load", function(){
    drawsocket.setInputListener( inputListener );
    drawsocket.setConnectionCallback( () => getPieces() );
    
    ensembleName.value = drawsocket.url;
    console.log('cond load ');

});
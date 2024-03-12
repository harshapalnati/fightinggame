const canvas = document.querySelector('canvas');
const canvas_context = canvas.getContext('2d');

// defining height and widht of the canavs
canvas.width = 1024
canvas.height=576

canvas_context.fillRect(0,0,canvas.width,canvas.height);


const gravity =0.7
 

const background = new Sprite({
    position:{
        x:0,
        y:0
    },
    image_src: './img/background.png'
})

const shop = new Sprite({
        position:{
            x:600,
            y:160
        },image_src:'./img/shop.png',
        scale:2.5,
        frames_max:6
        
})

const player = new Fighter({
    position:
    {
    x:0,
    y:0
},velocity:{
    x:0,
    y:0
},offset :{
    x:0,
    y:0
},
image_src:'./img/samuraiMack/idle.png',
frames_max:8,
scale:2,
offset :{
    x:100,
    y:95
},
sprites :{
    idle:{
        image_src:'./img/samuraiMack/idle.png',
        frames_max:8
    },
    run:{
        image_src:'./img/samuraiMack/Run.png',
        frames_max:8
    },
    jump:{
        image_src:'./img/samuraiMack/Jump.png',
        frames_max:2
    },
    fall:{
        image_src:'./img/samuraiMack/Fall.png',
        frames_max:2
    },
    attack:{
        image_src:'./img/samuraiMack/Attack1.png',
        frames_max:6
    },
    takeHit:{
        image_src:'./img/samuraiMack/Take Hit - white silhouette.png',
        frames_max:4
    },
    death:{
        image_src :'./img/samuraiMack/Death.png',
        frames_max:6
    }


},
attackBox:{
    offset:{
        x:50,
        y:50
    },
    width:120,
    height:50
   
}
})


const enemy =new Fighter({
    position:{
    x:400,
    y:100
},velocity:{
    x:0,
    y:0
},
color: 'blue'
,offset:{
    x:-50,
    y:0
},image_src:'./img/Kenji/idle.png',
frames_max:4,
scale:2,
offset :{
    x:100,
    y:110
},
sprites :{
    idle:{
        image_src:'./img/Kenji/idle.png',
        frames_max:4
    },
    run:{
        image_src:'./img/Kenji/Run.png',
        frames_max:8
    },
    jump:{
        image_src:'./img/Kenji/Jump.png',
        frames_max:2
    },
    fall:{
        image_src:'./img/Kenji/Fall.png',
        frames_max:2
    },
    attack:{
        image_src:'./img/Kenji/Attack2.png',
        frames_max:4
    },
    takeHit:{
        image_src :'./img/Kenji/Take hit.png',
        frames_max:3
    },
    death:{
        image_src :'./img/Kenji/Death.png',
        frames_max:7
    }


},
attackBox:{
    offset:{
        x:-50,
        y:50
    },
    width:130,
    height:50
   
}

})


const keys ={
    a:{
        selected :false
    },
    d:{
        selected :false
    },
    w:{
        selected :false
    },
    ArrowRight:{
        selected :false
    },
    ArrowUp:{
        selected :false
    },
    ArrowLeft:{
        selected :false
    }

}

function rectanguarCollision(
    rectangle1,rectangle2
){
    return (
        rectangle1.attackBox.position.x +rectangle1.attackBox.width >= rectangle2.position.x
        && rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width &&
        rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y 
        && rectangle1.attackBox.position.y <= rectangle2.position.y +rectangle2.height 
    )
}
function determine_winner({player, enemy,timerId}){
    clearTimeout(timerId)
    document.querySelector('#result').style.display ='flex'
    if(player.health === enemy.health){
        document.querySelector('#result').innerHTML = 'Tie'
       
    }else if(player.health > enemy.health){
        document.querySelector('#result').innerHTML = 'PLayer1 won'
        
    }else if(player.health <enemy.health) {
        document.querySelector('#result').innerHTML = 'Player2 won'
        
    }
}

let timer =60
let timerId 
function decreaseTimer(){
   
 if(timer>0) {
    timerId = setTimeout(decreaseTimer ,1000)
    timer--
    document.querySelector('#timer').innerHTML = timer
 }if(timer === 0){
   
    determine_winner({player,enemy,timerId})
 }

   

}

decreaseTimer()
function animate(){
    window.requestAnimationFrame(animate)
    canvas_context.fillStyle ='black'
    canvas_context.fillRect(0,0,canvas.width,canvas.height)
    background.update()
    shop.update()
    player.update()
    enemy.update()

    player.velocity.x =0
    enemy.velocity.x=0

    //player movement
   
    if(keys.d.selected && player.lastKey === 'd'){
        player.velocity.x =5
        player.switchSprite('run')
    }else if(keys.a.selected && player.lastKey === 'a'){
        player.switchSprite('run')
        player.velocity.x=-5
    }else{
        player.switchSprite('idle')
    }

    if(player.velocity.y <0){
       player.switchSprite('jump')
    }else if(player.velocity.y>0){
        player.switchSprite('fall')
    }

    // enemy movement 

    if(keys.ArrowRight.selected && enemy.lastKey === 'ArrowRight'){
        enemy.velocity.x =5
        enemy.switchSprite('run')
    }else if(keys.ArrowLeft.selected && enemy.lastKey === 'ArrowLeft'){
        enemy.velocity.x=-5
        enemy.switchSprite('run')
    }else {
        enemy.switchSprite('idle')
    }   

    if(enemy.velocity.y <0){
        enemy.switchSprite('jump')
     }else if(enemy.velocity.y>0){
         enemy.switchSprite('fall')
     }

    // detect collsion 

    if(player.attackBox.position.x +player.attackBox.width >= enemy.position.x
        && player.attackBox.position.x <= enemy.position.x + enemy.width &&
        player.attackBox.position.y + player.attackBox.height >= enemy.position.y 
        && player.attackBox.position.y <= enemy.position.y +enemy.height &&
        player.isAttacking && player.frames_current === 4
        ){
            enemy.takeHit()
            player.isAttacking =false
            
        document.querySelector('#enemy_health').style.width = enemy.health + '%'
    }

    //player misses 
    if(player.isAttacking && player.frames_current === 4){
        player.isAttacking = false
    }

    // enemy atttack 
    if(enemy.attackBox.position.x +enemy.attackBox.width >= player.position.x
        && enemy.attackBox.position.x <= player.position.x + player.width &&
        enemy.attackBox.position.y + enemy.attackBox.height >= player.position.y 
        && enemy.attackBox.position.y <= player.position.y +player.height &&
        enemy.isAttacking && enemy.frames_current === 2
        ){
            enemy.isAttacking =false
            player.takeHit()
            document.querySelector('#player_health').style.width = player.health + '%'
    }

    if(enemy.isAttacking && enemy.frames_current ===3){
        enemy.isAttacking = false
    }

    //end game
    if(player.health <=0 || enemy.health <=0 ){
        determine_winner({player,enemy,timerId})
    }
}

animate()

window.addEventListener('keydown',(event)=>{
    if(!player.dead){
        switch(event.key){
            case 'd':
            keys.d.selected = true
            player.lastKey = 'd'
            break
            case 'a':
            keys.a.selected = true
            player.lastKey = 'a'
            break
            case 'w':
            player.velocity.y  = -20
            break
            case ' ':
                player.attack()
                break
    }
}
 
if(!enemy.dead){
switch(event.key){
        case 'ArrowRight':
        keys.ArrowRight.selected = true
        enemy.lastKey = 'ArrowRight'
        break
        case 'ArrowLeft':
        keys.ArrowLeft.selected = true
        enemy.lastKey='ArrowLeft'
        break
        case 'ArrowUp':
        enemy.velocity.y  = -20
        break
        case 'ArrowDown':
            enemy.attack()
            break
}
}
    
   
})


window.addEventListener('keyup',(event)=>{
    switch(event.key){
        case 'd':
        keys.d.selected = false
        break
        case 'a':
        keys.a.selected = false
        break
       

        case 'ArrowRight':
        keys.ArrowRight.selected = false
        break
        case 'ArrowLeft':
        keys.ArrowLeft.selected = false
        break
       
    }
   
})


